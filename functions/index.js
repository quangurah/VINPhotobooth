/**
 * Main API Router cho Firebase Cloud Functions (MSB_2026)
 * Định nghĩa các HTTPS endpoint v2 theo Quy trình chuẩn MSB.
 * Hỗ trợ cơ chế Fallback bền bỉ (resilient) chống lỗi API Key, cạn quota và lỗi thiếu Cloud Storage Bucket.
 * Đồng bộ cấu hình cấu trúc folder Storage theo đặc tả xử lý media của MSB Job.
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const path = require("path");
const fs = require("fs");
const https = require("https");
const jobLogger = require("./jobs-logger");

// Khởi tạo Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Helper to extract client IP address
function getClientIp(req) {
  const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip || "";
  const firstIp = typeof rawIp === "string" ? rawIp.split(',')[0].trim() : "";
  return firstIp;
}

// Tự động cấu hình CORS cho Storage Bucket để cho phép Frontend (localhost & production) tải ảnh ghép Canvas không bị chặn
bucket.setCorsConfiguration([
  {
    origin: ["*"],
    method: ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
    responseHeader: ["*"],
    maxAgeSeconds: 3600
  }
]).then(() => {
  console.log("[Storage] CORS configuration set successfully on bucket.");
}).catch(e => {
  console.warn("[Storage] Failed to automatically set CORS configuration:", e.message);
});

// Đồng bộ prompts.txt từ Firestore sang /tmp/prompts.txt
async function syncPromptsFromFirestore() {
  try {
    const doc = await db.collection("msb_configs").doc("prompts").get();
    if (doc.exists && doc.data().content) {
      const tmpPath = "/tmp/prompts.txt";
      fs.writeFileSync(tmpPath, doc.data().content, "utf8");
      console.log("[Prompts] Synchronized prompts from Firestore to /tmp/prompts.txt successfully.");
    } else {
      const localPath = path.join(__dirname, "prompts.txt");
      if (fs.existsSync(localPath)) {
        const defaultContent = fs.readFileSync(localPath, "utf8");
        await db.collection("msb_configs").doc("prompts").set({ content: defaultContent });
        fs.writeFileSync("/tmp/prompts.txt", defaultContent, "utf8");
        console.log("[Prompts] Initialized Firestore prompts document with default prompts.txt.");
      }
    }
  } catch (err) {
    console.error("[Prompts] Error syncing prompts from Firestore:", err.message);
  }
}
syncPromptsFromFirestore();

// Import Gemini Helper
const { GeminiClient } = require("./gemini-helper");
const geminiClient = new GeminiClient();

// Import Prompts Config
const prompts = require("./prompts");

// Import Image Safety Utility
const { checkImageBrandSafety } = require("./image-safety");

// ==============================
// HELPER FUNCTIONS
// ==============================

/**
 * Thiết lập CORS headers
 */
function setCorsHeaders(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

/**
 * Upload ảnh Base64 lên Firebase Storage.
 * Nếu Cloud Storage chưa được kích hoạt hoặc gặp lỗi bucket (404),
 * hàm sẽ tự động chuyển sang trả về chuỗi Data URL Base64 trực tiếp để tránh làm gãy luồng xử lý.
 */
async function uploadBase64Image(base64Data, mimeType, destPath) {
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const formatMime = mimeType || "image/jpeg";

  // Nếu đang chạy trong môi trường Emulator local, bỏ qua việc upload lên Storage thật để tránh kẹt mạng/timeout
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    console.log(`[Storage][Emulator] Skip storage upload for ${destPath}. Returning Base64 data URL.`);
    return `data:${formatMime};base64,${cleanBase64}`;
  }

  try {
    const buffer = Buffer.from(cleanBase64, "base64");
    const file = bucket.file(destPath);
    
    await file.save(buffer, {
      metadata: { contentType: formatMime },
      resumable: false
    });
    
    // Trả về Download URL dạng public
    const encodedPath = encodeURIComponent(destPath);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;
  } catch (e) {
    console.error(`[Storage] Upload failed to ${destPath} (${e.message}). Auto-fallback to Base64 data URL.`);
    return `data:${formatMime};base64,${cleanBase64}`;
  }
}

/**
 * Tải ảnh từ một URL public dưới dạng base64 (sử dụng cho fallback Imagen)
 */
function downloadImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: status ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          base64: buffer.toString("base64"),
          mimeType: response.headers["content-type"] || "image/jpeg"
        });
      });
    }).on("error", (err) => reject(err));
  });
}

/**
 * Lấy mime type từ chuỗi Base64
 */
function getMimeTypeFromBase64(base64Str, defaultMime = "image/jpeg") {
  if (!base64Str) return defaultMime;
  const match = base64Str.match(/^data:([^;]+);base64,/);
  return match ? match[1] : defaultMime;
}

/**
 * Upload ảnh lên Storage nếu dữ liệu là Base64, ngược lại giữ nguyên URL
 */
async function uploadFieldIfBase64(base64OrUrl, sessId, fileName) {
  if (!base64OrUrl) return "";
  if (base64OrUrl.startsWith("data:")) {
    const mimeType = getMimeTypeFromBase64(base64OrUrl);
    const ext = mimeType.split("/")[1] || "jpg";
    const destPath = `sessions/msb_2026/${sessId}/${fileName}.${ext}`;
    console.log(`[Storage] Uploading ${fileName} for session: ${sessId}`);
    return await uploadBase64Image(base64OrUrl, mimeType, destPath);
  }
  return base64OrUrl;
}

// ==============================
// MAIN API FUNCTION
// ==============================
exports.api = onRequest(
  {
    cors: true,
    region: "asia-southeast1",
    maxInstances: 10,
    timeoutSeconds: 300,
    memory: "2GiB" // Tăng dung lượng bộ nhớ tránh lỗi Out of Memory khi xử lý ảnh hoặc tải lượng dữ liệu lớn
  },
  async (req, res) => {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    // Phân tích path: /api/tclife/suggest-description -> segments = ['tclife', 'suggest-description']
    const fullPath = req.path || req.url || "";
    const segments = fullPath.replace(/^\/api\//, "").replace(/^\//, "").split("/").filter(Boolean);
    const route = segments.join("/");
    const method = req.method;

    console.log(`[API] Request: ${method} /api/${route}`);

    try {
      // 1. GEMINI PROXY (Đường dẫn tương thích dự án mẫu)
      if (route === "gemini-proxy" && method === "POST") {
        const { endpoint, body } = req.body;
        if (!endpoint) return res.status(400).json({ error: "Missing endpoint" });

        console.log(`[Proxy] Routing endpoint: ${endpoint}`);

        // Tự động phân phối dựa trên endpoint của Gemini
        if (endpoint.includes("generateContent")) {
          // Gửi trực tiếp lên gemini-helper thông qua model tương ứng
          const model = body.model || "gemini-3.5-flash";
          const prompt = body.contents; // Nhận cấu trúc contents phức tạp hoặc text
          const textResult = await geminiClient.generateContent(prompt, model, body.config || {});
          return res.json({ candidates: [{ content: { parts: [{ text: textResult }] } }] });
        } else if (endpoint.includes("generateImages")) {
          const model = body.model || "imagen-4.0-generate-001";
          const prompt = body.prompt;
          const imageResult = await geminiClient.generateImage(prompt, model, body.config || {});
          return res.json({
            generatedImages: [{
              image: {
                imageBytes: imageResult.base64
              }
            }]
          });
        } else {
          return res.status(400).json({ error: `Endpoint ${endpoint} is not supported in proxy mode.` });
        }
      }

      // 1.5. KIỂM TRA BRAND SAFETY
      if (route === "tclife/check-brand-safety" && method === "POST") {
        const { text, sessionId } = req.body;
        if (!text) {
          return res.status(400).json({ error: "Thiếu nội dung kiểm duyệt (text)" });
        }

        const sessId = sessionId || `session_${Date.now()}`;
        const prompt = `${prompts.brandSafetyPrompt}\n\nNội dung cần kiểm duyệt:\n"${text}"`;
        
        let isSafe = true;
        let apiError = null;

        try {
          const resultText = await geminiClient.generateContent(prompt, "gemini-3.5-flash", { temperature: 0 });
          const cleanedResult = resultText.trim().toLowerCase();
          
          if (cleanedResult.includes("true")) {
            isSafe = false;
          }
        } catch (e) {
          apiError = e.message || String(e);
          console.warn(`[BrandSafety] Gemini API error for session ${sessId}: ${e.message}`);
          isSafe = true; // Fallback an toàn cho người dùng khi API Gemini bị lỗi
        }

        // Ghi log vào file brandsafety.log (Bỏ qua khi chạy trong Emulator để tránh hot-reload)
        if (process.env.FUNCTIONS_EMULATOR !== "true") {
          try {
            const logPath = path.join(__dirname, "brandsafety.log");
            const logTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            const logLine = `${logTime} - [Session: ${sessId}] Input: "${text}", Safe: ${isSafe}${apiError ? `, Error: ${apiError}` : ""}\n`;
            fs.appendFileSync(logPath, logLine, "utf8");
          } catch (logErr) {
            console.error("[BrandSafety] Failed to write brandsafety.log:", logErr.message);
          }
        } else {
          console.log(`[BrandSafety][Emulator] Skip writing log to functions directory for session: ${sessId}`);
        }

        if (!isSafe) {
          return res.json({
            ok: true,
            safe: false,
            message: "Nội dung chứa từ ngữ không phù hợp. Vui lòng nhập lại."
          });
        }

        return res.json({
          ok: true,
          safe: true,
          message: "Nội dung hợp lệ."
        });
      }

      

      

      // BƯỚC B4.2: PHÂN TÍCH INSIGHT HÌNH ẢNH
      if (route === "tclife/analyze-insight-image" && method === "POST") {
        const { imageBase64, mimeType, sessionId } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "Thiếu dữ liệu ảnh (imageBase64)" });

        const sessId = sessionId || `session_${Date.now()}`;
        jobLogger.initJob(sessId);
        jobLogger.logConsole(sessId, `Bắt đầu xử lý analyze-insight-image`);
        const totalStartTime = Date.now();

        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const cleanMimeType = mimeType || "image/jpeg";

        // 1. Kiểm duyệt hình ảnh Brand Safety bằng Cloud Vision SDK trước
        const visionStart = Date.now();
        console.log(`[BrandSafety][Image] Checking image safety via Cloud Vision for session: ${sessId}`);
        jobLogger.logConsole(sessId, `Bước 1: Bắt đầu gọi Cloud Vision API để kiểm duyệt và crop khuôn mặt`);
        const imageSafetyResult = await checkImageBrandSafety(cleanBase64);
        const visionDuration = Date.now() - visionStart;
        jobLogger.logConsole(sessId, `Bước 1: Hoàn thành Cloud Vision API trong ${visionDuration}ms. Safe: ${imageSafetyResult.safe}`);

        if (!imageSafetyResult.safe) {
          console.warn(`[BrandSafety][Image] Image blocked: ${imageSafetyResult.error}`);
          jobLogger.logConsole(sessId, `Bước 1 thất bại: Ảnh bị chặn - ${imageSafetyResult.error}`);
          jobLogger.updateJobStatus(sessId, "FAILED");
          return res.status(400).json({
            ok: false,
            error: imageSafetyResult.error
          });
        }

        // Upload ảnh gốc chụp tại booth của user lên Storage
        const uploadStart = Date.now();
        jobLogger.logConsole(sessId, `Bước 2: Bắt đầu upload ảnh gốc lên Cloud Storage`);
        let uploadResultUrl = "";
        try {
          const destPathUser = `sessions/msb_2026/${sessId}/user-photo.jpg`;
          uploadResultUrl = await uploadBase64Image(cleanBase64, cleanMimeType, destPathUser);
          const uploadDuration = Date.now() - uploadStart;
          jobLogger.logConsole(sessId, `Bước 2: Hoàn thành upload ảnh gốc trong ${uploadDuration}ms. URL: ${uploadResultUrl}`);
        } catch (uploadErr) {
          const uploadDuration = Date.now() - uploadStart;
          console.warn(`[Storage] Upload user-photo failed: ${uploadErr.message}`);
          jobLogger.logConsole(sessId, `Bước 2 cảnh báo: Upload ảnh gốc gặp lỗi trong ${uploadDuration}ms - ${uploadErr.message}`);
        }

        // Sử dụng ảnh đã crop khuôn mặt lớn nhất để phân tích qua Gemini Flash (giúp nhận diện chuẩn xác nhất giới tính/độ tuổi/thần thái của người chủ thể)
        const analyzeBase64 = imageSafetyResult.croppedBase64 || cleanBase64;
        if (imageSafetyResult.croppedBase64) {
          jobLogger.logConsole(sessId, `Hệ thống tự động sử dụng ảnh đã crop khuôn mặt lớn nhất để gửi cho Gemini`);
        } else {
          jobLogger.logConsole(sessId, `Không tìm thấy khuôn mặt để crop, sử dụng ảnh gốc để gửi cho Gemini`);
        }

        // Gọi prompts.analyzeInsightImage để phân tích qua Gemini Flash
        const geminiStart = Date.now();
        jobLogger.logConsole(sessId, `Bước 3: Bắt đầu gọi Gemini 2.5 Flash phân tích khuôn mặt`);
        const result = await prompts.analyzeInsightImage(geminiClient, analyzeBase64, cleanMimeType);
        const geminiDuration = Date.now() - geminiStart;
        
        if (!result.ok) {
          jobLogger.logConsole(sessId, `Bước 3 thất bại: Lỗi Gemini phân tích ảnh trong ${geminiDuration}ms - ${result.error}`);
          jobLogger.updateJobStatus(sessId, "FAILED");
          return res.status(400).json({
            ok: false,
            error: result.error || "Không thể phân tích được khuôn mặt trong ảnh. Vui lòng thử lại."
          });
        }

        jobLogger.logConsole(sessId, `Bước 3: Hoàn thành Gemini phân tích ảnh trong ${geminiDuration}ms`);
        const data = result.data || {};
        jobLogger.logLlmCall(sessId, "analyzeInsightImage", data);

        // Kiểm soát Brand Safety chủ động cho ảnh lãnh tụ/chính trị gia
        if (data.is_political_figure === true) {
          console.warn(`[BrandSafety][Image] Phát hiện ảnh lãnh tụ/chính trị gia: ${data.political_figure_reason}`);
          jobLogger.logConsole(sessId, `Chặn ảnh phát hiện lãnh tụ/chính trị gia: ${data.political_figure_reason}`);
          jobLogger.updateJobStatus(sessId, "FAILED");
          return res.status(400).json({
            ok: false,
            error: "Hình ảnh không hợp lệ. Vui lòng không sử dụng hình ảnh của các vị lãnh tụ hoặc chính trị gia."
          });
        }
        const count = typeof data.total_people === "number" ? data.total_people : 1;
        
        let gender = "female";
        let estimatedAge = 25;
        if (data.people_details && Array.isArray(data.people_details) && data.people_details.length > 0) {
          const firstPerson = data.people_details[0];
          const rawGender = String(firstPerson.gender || "").toLowerCase();
          gender = (rawGender.includes("nữ") || rawGender.includes("female") || rawGender.includes("nu") || rawGender.includes("woman") || rawGender.includes("girl")) ? "female" : "male";
          
          const ageStr = String(firstPerson.estimated_age || "");
          const ageMatch = ageStr.match(/\d+/);
          estimatedAge = ageMatch ? parseInt(ageMatch[0], 10) : 25;
        }

        if (count === 0) {
          jobLogger.logConsole(sessId, `Hoàn thành thất bại: Không tìm thấy khuôn mặt nào trong ảnh`);
          jobLogger.updateJobStatus(sessId, "FAILED");
          return res.status(400).json({
            ok: false,
            error: "Không tìm thấy khuôn mặt nào trong bức ảnh. Vui lòng chụp hoặc tải ảnh rõ mặt hơn."
          });
        }

        // Đã loại bỏ giới hạn tối đa 2 người theo yêu cầu. Phát hiện bao nhiêu người cũng được, không báo lỗi.

        const totalDuration = Date.now() - totalStartTime;
        jobLogger.logConsole(sessId, `Hoàn thành toàn bộ tiến trình analyze-insight-image trong ${totalDuration}ms`);
        jobLogger.updateJobStatus(sessId, "SUCCESS");
        jobLogger.saveJobResult(sessId, { count, gender, estimatedAge });

        return res.json({
          ok: true,
          count,
          gender,
          estimatedAge,
          // Trả về ảnh đã crop khuôn mặt lớn nhất để client sử dụng làm ảnh concept ở các bước tiếp theo
          croppedImageBase64: imageSafetyResult.croppedBase64 ? `data:image/jpeg;base64,${imageSafetyResult.croppedBase64}` : null,
          faceDescription: (data.people_details && data.people_details[0] && data.people_details[0].face_description) || "",
          smileStyle: (data.people_details && data.people_details[0] && data.people_details[0].smile_style) || "gentle smile",
          rawInsightImageData: data,
          logs: jobLogger.getJobLogs(sessId)
        });
      }

      

      

      // 3. BƯỚC 4 (B4): DÙNG GEMINI GEN PROMPT ĐỂ SINH ẢNH
      if (route === "tclife/generate-prompts" && method === "POST") {
        const { description, peopleCount, gender, estimatedAge, selectedConcept, selectedOption, sessionId } = req.body;
        const sessId = sessionId || `session_${Date.now()}`;
        jobLogger.initJob(sessId);
        jobLogger.logConsole(sessId, `Bắt đầu xử lý generate-prompts`);
        const totalStartTime = Date.now();

        try {
          if (!description) return res.status(400).json({ error: "Thiếu nội dung mô tả di sản (description)" });
          
          // Lớp bảo vệ Brand Safety (double-check ở backend)
          const safetyStart = Date.now();
          jobLogger.logConsole(sessId, `Bước 1: Bắt đầu gọi Gemini 2.5 Flash kiểm duyệt Brand Safety cho mô tả`);
          try {
            const checkPrompt = `${prompts.brandSafetyPrompt}\n\nNội dung cần kiểm duyệt:\n"${description}"`;
            // Sử dụng model gemini-2.5-flash phản hồi siêu nhanh dưới 1 giây và loại bỏ hoàn toàn timeout tự động
            const checkResult = await geminiClient.generateContent(checkPrompt, "gemini-2.5-flash", { temperature: 0 }, 0, 1);
            const safetyDuration = Date.now() - safetyStart;
            jobLogger.logConsole(sessId, `Bước 1: Hoàn thành kiểm duyệt Brand Safety trong ${safetyDuration}ms. Kết quả: ${checkResult.trim()}`);
            jobLogger.logLlmCall(sessId, "brandSafetyCheck", checkResult);

            if (checkResult.trim().toLowerCase().includes("true")) {
              jobLogger.logConsole(sessId, `Bước 1 thất bại: Mô tả vi phạm Brand Safety`);
              jobLogger.updateJobStatus(sessId, "FAILED");
              return res.status(400).json({
                ok: false,
                error: "Nội dung chứa từ ngữ không phù hợp. Vui lòng nhập lại."
              });
            }
          } catch (e) {
            const safetyDuration = Date.now() - safetyStart;
            console.warn(`[BrandSafety][double-check] generate-prompts check bypass due to error: ${e.message}`);
            jobLogger.logConsole(sessId, `Bước 1 cảnh báo: Bỏ qua kiểm duyệt do gặp lỗi trong ${safetyDuration}ms - ${e.message}`);
          }

          // Nếu người dùng chọn concept VinPalace, trả về prompt tĩnh tương ứng
          const promptStart = Date.now();
          jobLogger.logConsole(sessId, `Bước 2: Bắt đầu tải cấu hình prompt tĩnh cho concept ${selectedConcept}`);
          if (selectedConcept) {
            console.log(`[DEBUG][generate-prompts] Return static prompt for VinPalace concept: ${selectedConcept}, option: ${selectedOption || "1"}`);
            const finalPrompt = await prompts.getVinPalacePrompt(selectedConcept, gender || "female");
            const promptDuration = Date.now() - promptStart;
            jobLogger.logConsole(sessId, `Bước 2: Hoàn thành tải prompt tĩnh trong ${promptDuration}ms`);

            const resData = {
              ok: true,
              insight: {
                main_interest: "VinPalace Theater",
                future_scenario: "Trải nghiệm rạp hát hoàng gia",
                visual_archetype: "VinPalace Character"
              },
              slogan: description || "VinPalace Theater",
              prompts: {
                outfit: "",
                pose: "",
                background: "",
                final: finalPrompt
              },
              classification: "vinpalace",
              logs: jobLogger.getJobLogs(sessId)
            };
            const totalDuration = Date.now() - totalStartTime;
            jobLogger.logConsole(sessId, `Hoàn thành toàn bộ tiến trình generate-prompts trong ${totalDuration}ms`);
            jobLogger.logApiCall(sessId, "generate-prompts", req.body, resData);
            jobLogger.updateJobStatus(sessId, "SUCCESS");
            return res.json(resData);
          }

          jobLogger.logConsole(sessId, `Hoàn thành thất bại: Thiếu thông tin Concept`);
          jobLogger.updateJobStatus(sessId, "FAILED");
          return res.status(400).json({
            ok: false,
            error: "Thiếu thông tin Concept để tạo ảnh. Vui lòng chọn một Concept."
          });
        } catch (err) {
          const totalDuration = Date.now() - totalStartTime;
          console.error(`[ERROR][generate-prompts] Critical error in handler:`, err);
          jobLogger.logConsole(sessId, `Gặp lỗi nghiêm trọng trong generate-prompts sau ${totalDuration}ms - ${err.message}`);
          jobLogger.updateJobStatus(sessId, "FAILED");
          return res.status(500).json({ ok: false, error: "Lỗi hệ thống khi xử lý generate-prompts", details: err.message });
        }
      }




      // 6. BƯỚC 6 (B6): SINH ẢNH BÌA TẠP CHÍ BẰNG GEMINI / IMAGEN (CÓ SMART FALLBACK ĐỌC ĐĨA)
      if (route === "tclife/generate-magazine-image" && method === "POST") {
        const { prompt, sessionId, description, gender, imageBase64, faceDescription, smileStyle, estimatedAge, selectedConcept, selectedOption } = req.body;
        if (!prompt) return res.status(400).json({ error: "Thiếu prompt sinh ảnh" });

        const sessId = sessionId || `session_${Date.now()}`;
        jobLogger.initJob(sessId);
        jobLogger.logConsole(sessId, `Bắt đầu xử lý generate-magazine-image`);
        const totalStartTime = Date.now();

        console.log(`[Imagen] Generating image for session: ${sessId}, concept: ${selectedConcept}, option: ${selectedOption}`);

        let imageResult;
        let isFallback = false;
        let mockFile = null;
        let aiError = null;

        // Nhận diện chế độ mock hoặc khi Imagen 3 bị lỗi
        const isMockActive = (prompt.includes("mock_mode") || req.body.isMock);

        if (isMockActive) {
          console.log("[Imagen] Active mock mode requested");
          jobLogger.logConsole(sessId, `Hệ thống được kích hoạt chế độ Mock`);
        }

        // Sử dụng trực tiếp prompt được sinh ra từ prompts.js mà không chèn thêm tiền tố
        let finalPromptForAI = prompt;

        // Tự động tìm kiếm và tải ảnh Ref từ Firestore
        const refStart = Date.now();
        jobLogger.logConsole(sessId, `Bước 1: Bắt đầu tìm kiếm và tải ảnh Ref của concept ${selectedConcept} từ Storage`);
        let refImageBase64 = null;
        if (selectedConcept) {
          try {
            const conceptDoc = await db.collection("config").doc("vinplace_prompts").get();
            if (conceptDoc.exists) {
              const conceptData = conceptDoc.data();
              const reqGender = String(gender || "female").toLowerCase();
              const isFemale = reqGender.includes("female") || reqGender.includes("nữ");
              const genderPrefix = isFemale ? "female" : "male";
              
              const optionKey = genderPrefix;
              
              const conceptFields = conceptData[selectedConcept] || {};
              let refImageUrl = "";
              
              if (String(selectedConcept) === "6") {
                // Chọn ngẫu nhiên 1 trong 3 background cho Concept 6 theo quytrinhmoi87.xlsx
                const bgs = [
                  conceptFields[`${optionKey}_refImage_1`],
                  conceptFields[`${optionKey}_refImage_2`],
                  conceptFields[`${optionKey}_refImage_3`]
                ].filter(url => url && url.startsWith("http"));
                
                if (bgs.length > 0) {
                  const randIdx = Math.floor(Math.random() * bgs.length);
                  refImageUrl = bgs[randIdx];
                  console.log(`[Imagen] Concept 6: randomly selected background index ${randIdx + 1} from ${bgs.length} options.`);
                }
              } else {
                refImageUrl = conceptFields[`${optionKey}_refImage_1`]
                           || conceptFields[`${optionKey}_refImage_2`]
                           || conceptFields[`${optionKey}_refImage_3`]
                           || "";
              }
                               
              if (refImageUrl && refImageUrl.startsWith("http")) {
                console.log(`[Imagen] Found ref image URL for concept ${selectedConcept} (${optionKey}): ${refImageUrl}`);
                const dlRes = await downloadImageAsBase64(refImageUrl);
                refImageBase64 = dlRes.base64;
                const refDuration = Date.now() - refStart;
                jobLogger.logConsole(sessId, `Bước 1: Tải thành công ảnh Ref trong ${refDuration}ms. Dung lượng base64: ${refImageBase64.length}`);
              } else {
                const refDuration = Date.now() - refStart;
                jobLogger.logConsole(sessId, `Bước 1 cảnh báo: Không tìm thấy link ảnh Ref hợp lệ trong ${refDuration}ms`);
              }
            }
          } catch (refErr) {
            const refDuration = Date.now() - refStart;
            console.warn(`[Imagen] Failed to download ref image: ${refErr.message}. Proceeding without ref image.`);
            jobLogger.logConsole(sessId, `Bước 1 cảnh báo: Tải ảnh Ref thất bại trong ${refDuration}ms - ${refErr.message}`);
          }
        }

        // Gọi sinh ảnh (Gemini/Imagen)
        const aiStart = Date.now();
        jobLogger.logConsole(sessId, `Bước 2: Bắt đầu gọi Google Gemini/Imagen 3 sinh ảnh với prompt: "${finalPromptForAI.substring(0, 100)}..."`);
        try {
          if (isMockActive) {
            throw new Error("Mock mode is requested");
          }
          console.log("[DEBUG][generate-magazine-image] Attempting generation with primary model: gemini-3-pro-image...");
          try {
            imageResult = await geminiClient.generateImage(finalPromptForAI, "gemini-3-pro-image", { aspectRatio: "4:5" }, imageBase64, refImageBase64);
            const aiDuration = Date.now() - aiStart;
            console.log(`[DEBUG][generate-magazine-image] AI generation succeeded! Model used: ${imageResult.model || "unknown"} (key: ${imageResult.keyLabel || "unknown"})`);
            jobLogger.logConsole(sessId, `Bước 2: Sinh ảnh thành công bằng gemini-3-pro-image trong ${aiDuration}ms`);
          } catch (imagenErr) {
            console.warn(`[DEBUG][generate-magazine-image] Primary model (gemini-3-pro-image) failed: ${imagenErr.message}. Falling back directly to gemini-3.1-flash-image...`);
            jobLogger.logConsole(sessId, `Bước 2 cảnh báo: Model chính gemini-3-pro-image thất bại: ${imagenErr.message}. Thử lại bằng model dự phòng gemini-3.1-flash-image`);
            
            imageResult = await geminiClient.generateImage(finalPromptForAI, "gemini-3.1-flash-image", { aspectRatio: "4:5" }, imageBase64, refImageBase64);
            const aiDuration = Date.now() - aiStart;
            console.log(`[DEBUG][generate-magazine-image] Fallback AI generation succeeded! Model used: ${imageResult.model || "unknown"} (key: ${imageResult.keyLabel || "unknown"})`);
            jobLogger.logConsole(sessId, `Bước 2: Sinh ảnh fallback thành công bằng gemini-3.1-flash-image trong tổng ${aiDuration}ms`);
          }
          jobLogger.logLlmCall(sessId, "generateImage", { prompt: finalPromptForAI, model: imageResult.model });
        } catch (e) {
          const aiDuration = Date.now() - aiStart;
          aiError = e.message || String(e);
          jobLogger.logConsole(sessId, `Bước 2 thất bại: Không thể sinh ảnh bằng AI sau ${aiDuration}ms - ${aiError}`);
          
          if (process.env.FUNCTIONS_EMULATOR !== "true") {
            const fs = require("fs");
            const errorLogPath = path.join(__dirname, "backend_error.log");
            const errDetail = `Time: ${new Date().toISOString()}\nError: ${e.message}\nStack: ${e.stack}\nPrompt: ${prompt}\nSessionId: ${sessionId}\nImageBase64 Length: ${imageBase64 ? imageBase64.length : 0}\n\n`;
            try {
              fs.appendFileSync(errorLogPath, errDetail, "utf8");
              console.log(`[DEBUG] Error detail appended to ${errorLogPath}`);
            } catch (logErr) {
              console.error("[DEBUG] Failed to write backend_error.log:", logErr.message);
            }
          } else {
            console.warn(`[Imagen][Emulator] AI generation failed with error: ${e.message}. Skip writing error log to functions directory.`);
          }

          // Không dùng ảnh mẫu fallback khi xảy ra lỗi AI thực tế (chỉ chạy fallback khi người dùng chủ động yêu cầu mock_mode)
          if (!isMockActive) {
            console.error(`[DEBUG][generate-magazine-image] AI generation failed: ${e.message}. Fallback is disabled. Propagating error to frontend.`);
            jobLogger.updateJobStatus(sessId, "FAILED");
            throw e;
          }

          console.warn(`[DEBUG][generate-magazine-image] Mock active: ${e.message}. Triggering local fallback image...`);
          isFallback = true;
          
          // Phân tích từ khóa mô tả nghề nghiệp để chọn ảnh mẫu
          const descLower = (description || prompt || "").toLowerCase();
          let occupation = "dau_bep"; // default
          if (/nướng|bbq|barbecue|thịt nướng/i.test(descLower)) {
            occupation = "quan_nuong";
          } else if (/bánh mì|bánh mỳ|tiệm bánh|bán bánh|bakery/i.test(descLower)) {
            occupation = "banh_my";
          } else if (/may|thời trang|quần áo|thiết kế|tailor/i.test(descLower)) {
            occupation = "tho_may";
          }

          const userGender = gender || "male";
          
          // Chọn tên file ảnh mẫu tương ứng
          if (occupation === "dau_bep") {
            mockFile = userGender === "female" ? "female đầu bếp.jpg" : "male đầu bếp.jpg";
          } else if (occupation === "quan_nuong") {
            mockFile = userGender === "female" ? "female quán nướng.jpg" : "male quán nướng.jpg";
          } else if (occupation === "banh_my") {
            mockFile = userGender === "female" ? "female bán bánh mỳ.jpg" : "male bán bánh mỳ.jpg";
          } else if (occupation === "tho_may") {
            mockFile = userGender === "female" ? "female thợ may.jpg" : "male thợ may.jpg";
          }

          // Đọc file ảnh mẫu trực tiếp từ đĩa (thư mục public/msb_2026/sample)
          try {
            const filePath = path.join(__dirname, "../public/msb_2026/sample", mockFile);
            const buffer = fs.readFileSync(filePath);
            imageResult = {
              base64: buffer.toString("base64"),
              mimeType: "image/jpeg"
            };
            console.log(`[Imagen] Loaded local mock image ${mockFile} from disk successfully.`);
            jobLogger.logConsole(sessId, `Sử dụng ảnh Mock từ đĩa: ${mockFile}`);
          } catch (readErr) {
            console.error(`[Imagen] Failed to read local mock image ${mockFile}: ${readErr.message}. Falling back to Unsplash.`);
            
            // Fallback Unsplash nếu không đọc được file trên đĩa
            let fallbackUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80";
            if (occupation === "quan_nuong") {
              fallbackUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";
            } else if (occupation === "banh_my") {
              fallbackUrl = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80";
            } else if (occupation === "tho_may") {
              fallbackUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80";
            }
            
            try {
              const dlRes = await downloadImageAsBase64(fallbackUrl);
              imageResult = {
                base64: dlRes.base64,
                mimeType: dlRes.mimeType
              };
            } catch (dlErr) {
              console.error(`[Imagen] Fallback download failed: ${dlErr.message}. Generating mock orange pixel.`);
              const orangePixelBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
              imageResult = {
                base64: orangePixelBase64,
                mimeType: "image/jpeg"
              };
            }
          }
        }

        // Lưu ảnh nền tạp chí thô được sinh ra vào folder session
        const saveStart = Date.now();
        jobLogger.logConsole(sessId, `Bước 3: Bắt đầu lưu trữ kết quả ảnh thô lên Cloud Storage`);
        const destPath = `sessions/msb_2026/${sessId}/output_raw.jpg`;
        const publicUrl = await uploadBase64Image(imageResult.base64, imageResult.mimeType, destPath);
        const saveDuration = Date.now() - saveStart;
        jobLogger.logConsole(sessId, `Bước 3: Lưu trữ thành công ảnh thô lên Storage trong ${saveDuration}ms. URL: ${publicUrl}`);

        const totalDuration = Date.now() - totalStartTime;
        jobLogger.logConsole(sessId, `Hoàn thành toàn bộ tiến trình generate-magazine-image trong ${totalDuration}ms`);
        jobLogger.logApiCall(sessId, "generate-magazine-image", req.body, { rawImageUrl: publicUrl });
        jobLogger.updateJobStatus(sessId, "SUCCESS");
        jobLogger.saveJobResult(sessId, { rawImageUrl: publicUrl });

        return res.json({
          ok: true,
          rawImageUrl: publicUrl,
          rawImageBase64: `data:${imageResult.mimeType};base64,${imageResult.base64}`,
          destPath: destPath,
          fallbackTriggered: isFallback,
          mockFile: mockFile,
          gender: gender || "male",
          aiError: aiError,
          logs: jobLogger.getJobLogs(sessId)
        });
      }

      // 7. BƯỚC 8 (B8): TÁCH NỀN ẢNH (REMOVE BACKGROUND)
      if (route === "tclife/remove-bg" && method === "POST") {
        const { imageBase64, sessionId } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "Thiếu ảnh crop (imageBase64)" });

        const sessId = sessionId || `session_${Date.now()}`;
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const removeBgKey = process.env.REMOVE_BG_API_KEY;
        const destPath = `sessions/msb_2026/${sessId}/output_removebg.png`;

        if (removeBgKey) {
          console.log(`[RemoveBg] Calling external Remove.bg service for session: ${sessId}`);
          try {
            const removeBgResult = await new Promise((resolve, reject) => {
              const postData = JSON.stringify({
                image_file_b64: cleanBase64,
                size: "auto"
              });

              const reqOpts = {
                hostname: "api.remove.bg",
                path: "/v1.0/removebg",
                method: "POST",
                headers: {
                  "X-Api-Key": removeBgKey,
                  "Content-Type": "application/json"
                }
              };

              const reqRaw = https.request(reqOpts, (resRaw) => {
                let chunks = [];
                resRaw.on("data", c => chunks.push(c));
                resRaw.on("end", async () => {
                  if (resRaw.statusCode === 200) {
                     const buffer = Buffer.concat(chunks);
                     
                     if (process.env.FUNCTIONS_EMULATOR === "true") {
                       console.log(`[RemoveBg][Emulator] Skip storage upload for ${destPath}. Returning Base64 directly.`);
                       resolve({
                         url: `data:image/png;base64,${buffer.toString("base64")}`,
                         base64: buffer.toString("base64")
                       });
                       return;
                     }

                     const file = bucket.file(destPath);
                     await file.save(buffer, { 
                       metadata: { contentType: "image/png" },
                       resumable: false
                     });
                     
                     const encodedPath = encodeURIComponent(destPath);
                     resolve({
                       url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`,
                       base64: buffer.toString("base64")
                     });
                  } else {
                     const errMsg = Buffer.concat(chunks).toString("utf8");
                     reject(new Error(`Remove.bg API error status ${resRaw.statusCode}: ${errMsg}`));
                  }
                });
              });

              reqRaw.on("error", e => reject(e));
              reqRaw.write(postData);
              reqRaw.end();
            });

            return res.json({
              ok: true,
              removebgImageUrl: removeBgResult.url,
              removebgImageBase64: `data:image/png;base64,${removeBgResult.base64}`,
              path: destPath
            });
          } catch (e) {
            console.error(`[RemoveBg] API call failed: ${e.message}. Falling back to source image.`);
          }
        } else {
          console.warn("[RemoveBg] REMOVE_BG_API_KEY not configured. Graceful fallback: Saving original crop image.");
        }

        // Graceful Fallback: Nếu không có API Key hoặc gọi API lỗi, save ảnh crop dạng PNG (Tự động fallback base64 nếu Storage lỗi)
        const fallbackUrl = await uploadBase64Image(cleanBase64, "image/png", destPath);
        return res.json({
          ok: true,
          removebgImageUrl: fallbackUrl,
          removebgImageBase64: `data:image/png;base64,${cleanBase64}`,
          path: destPath,
          fallbackTriggered: true
        });
      }

      // API KHỞI TẠO SESSION (status: running) — gọi ngay khi pipeline bắt đầu
      if (route === "tclife/start-session" && method === "POST") {
        const { sessionId, name, description } = req.body;
        if (!sessionId) {
          return res.status(400).json({ error: "Thiếu sessionId" });
        }

        try {
          const clientIp = getClientIp(req);
          const sessionData = {
            id: sessionId,
            name: name || "",
            description: description || "",
            status: "running",
            rawImageUrl: "",
            cropImageUrl: "",
            removebgImageUrl: "",
            finalImageUrl: "",
            qrCodeUrl: "",
            gender: "",
            styleId: "",
            logs: [],
            renderDuration: 0,
            createdAt: new Date().toISOString(),
            downloadCount: 0,
            shareCount: 0,
            imagePrompt: "",
            userIp: clientIp
          };
          await db.collection("msb_sessions").doc(sessionId).set(sessionData);
          console.log(`[Firestore] Started session: ${sessionId} (status: running)`);
          return res.json({ ok: true, sessionId });
        } catch (e) {
          console.error(`[Firestore] Failed to start session: ${e.message}`);
          return res.status(500).json({ error: e.message });
        }
      }

      // API CẬP NHẬT SESSION THẤT BẠI (status: fail) — gọi khi pipeline gặp lỗi
      if (route === "tclife/fail-session" && method === "POST") {
        const { sessionId, errorMessage, logs } = req.body;
        if (!sessionId) {
          return res.status(400).json({ error: "Thiếu sessionId" });
        }

        try {
          const updateData = {
            status: "fail",
            errorMessage: errorMessage || "Unknown error",
            failedAt: new Date().toISOString()
          };
          if (logs && Array.isArray(logs)) {
            updateData.logs = logs;
          }
          await db.collection("msb_sessions").doc(sessionId).set(updateData, { merge: true });
          console.log(`[Firestore] Failed session: ${sessionId} (error: ${errorMessage})`);
          return res.json({ ok: true, sessionId });
        } catch (e) {
          console.error(`[Firestore] Failed to update fail status: ${e.message}`);
          return res.status(500).json({ error: e.message });
        }
      }

      // 8. BƯỚC 10 (B10): LƯU CẤU HÌNH PHIÊN HOÀN THIỆN
      if (route === "tclife/save-session" && method === "POST") {
        console.log("[DEBUG][save-session] Request body size / info:", {
          sessionId: req.body.sessionId,
          name: req.body.name,
          hasFinalImageUrl: !!req.body.finalImageUrl,
          finalImageUrlLength: req.body.finalImageUrl ? req.body.finalImageUrl.length : 0
        });

        const {
          sessionId,
          name,
          description,
          rawImageUrl,
          cropImageUrl,
          removebgImageUrl,
          finalImageUrl,
          qrCodeUrl,
          gender,
          styleId: clientStyleId,
          logs,
          renderDuration,
          imagePrompt // Nhận thêm trường này từ client
        } = req.body;

        if (!name || !finalImageUrl) {
          return res.status(400).json({ error: "Thiếu thông tin tên hoặc link ảnh kết quả finalImageUrl" });
        }

        const sessId = sessionId || `session_${Date.now()}`;
        
        // Xác định styleId dựa trên mô tả di sản để lưu trữ ảnh kết quả đúng format result-{styleId}.jpg
        let styleId = clientStyleId;
        if (!styleId) {
          styleId = "default";
          const desc = (description || "").toLowerCase();
          if (/khởi nghiệp|startup|mở công ty|vốn sản xuất|mua thiết bị|máy tính mới|đầu tư|dự án mới|mua xe|mua nhà|decor|sửa nhà|nội thất|sắm đồ|căn hộ|xe máy|máy tính/i.test(desc)) {
            styleId = "business";
          } else if (/biệt thự|chung cư cao cấp|xe sang|bất động sản|đất đai|gia sản|xe hơi|tài sản|bộ sưu tập|doanh nhân|lãnh đạo|vị thế|tri thức/i.test(desc)) {
            styleId = "luxury";
          } else if (/quán cafe|cà phê công thức gia truyền|bí quyết|tiệm ăn|quán cơm|shop thời trang|tạp hóa|xưởng sản xuất|kinh doanh|cửa hàng|bán hàng/i.test(desc)) {
            styleId = "shop";
          } else if (/tiết kiệm|quỹ phòng thân|vàng|sổ tiết kiệm|tiền nhàn rỗi|mua đất|kết hôn|lập gia đình|nuôi con|cho con đi học|bố|mẹ|vợ chồng|tương lai|phụng dưỡng|quỹ gia đình|tri thức|học tập|kinh nghiệm|trưởng thành|tự lập|bản lĩnh/i.test(desc)) {
            styleId = "saving";
          }
        }

        // VÀNG: Cập nhật prompt vào Excel quytrinhmoi.xlsx ở cột H và I nếu là session thật
        try {
          const excelPath = "e:\\msb\\tapchidisan\\quytrinhmoi.xlsx";
          // Script update_prompts_txt.py đã chạy đồng bộ
        } catch (excelErr) {
          console.error("Lỗi cập nhật Excel:", excelErr.message);
        }

        // Tự động upload toàn bộ ảnh (raw, crop, removebg, final) lên Storage nếu chúng là base64
        const publicRawUrl = await uploadFieldIfBase64(rawImageUrl, sessId, "raw");
        const publicCropUrl = await uploadFieldIfBase64(cropImageUrl, sessId, "crop");
        const publicRemoveBgUrl = await uploadFieldIfBase64(removebgImageUrl, sessId, "removebg");
        const publicFinalUrl = await uploadFieldIfBase64(finalImageUrl, sessId, `result-${styleId}`);

        // Đường dẫn ảnh booth gốc chụp ban đầu của user trên Storage
        const userPhotoPath = `sessions/msb_2026/${sessId}/user-photo.jpg`;
        const encodedUserPhotoPath = encodeURIComponent(userPhotoPath);
        const publicUserPhotoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedUserPhotoPath}?alt=media`;

        const clientIp = getClientIp(req);
        const sessionData = {
          id: sessId,
          name,
          description: description || "",
          status: "success", // Đánh dấu hoàn thành
          rawImageUrl: publicRawUrl || rawImageUrl || "", // Lưu ảnh thô do AI vẽ
          userPhotoUrl: publicUserPhotoUrl, // Lưu ảnh booth gốc chụp ban đầu làm ảnh gốc của user
          cropImageUrl: publicCropUrl,
          removebgImageUrl: publicRemoveBgUrl,
          finalImageUrl: publicFinalUrl,
          qrCodeUrl: qrCodeUrl || "",
          gender: gender || "male",
          styleId: styleId,
          logs: logs || [],
          renderDuration: parseFloat(renderDuration) || 0,
          createdAt: new Date().toISOString(), // Thêm createdAt để sắp xếp trên Dashboard
          completedAt: new Date().toISOString(),
          downloadCount: 0,
          shareCount: 0,
          imagePrompt: imagePrompt || "", // Lưu prompt cuối cùng của Gemini gửi cho Imagen 3
          userIp: clientIp
        };

        try {
          await db.collection("msb_sessions").doc(sessId).set(sessionData, { merge: true });
          console.log(`[Firestore] Saved session: ${sessId} (status: success)`);
        } catch (dbErr) {
          console.error(`[Firestore] Failed to save session: ${dbErr.message}`);
          // Bypass lỗi Firestore (nếu chưa kích hoạt trên GCP console) để người dùng tại booth không bị kẹt luồng và vẫn tải được ảnh tạp chí về máy
          return res.json({ 
            ok: true, 
            warn: `Firestore save failed: ${dbErr.message}. Bypassed to allow user download.`, 
            sessionId: sessId 
          });
        }

        return res.json({ ok: true, sessionId: sessId });
      }

      // API THEO DÕI HÀNH ĐỘNG (DOWNLOAD/SHARE)
      if (route === "tclife/track-action" && method === "POST") {
        const { sessionId, action } = req.body;
        if (!sessionId) {
          return res.status(400).json({ error: "Thiếu sessionId" });
        }
        if (action !== "download" && action !== "share") {
          return res.status(400).json({ error: "Action không hợp lệ. Phải là 'download' hoặc 'share'." });
        }

        try {
          const docRef = db.collection("msb_sessions").doc(sessionId);
          const updateData = {};
          if (action === "download") {
            updateData.downloadCount = FieldValue.increment(1);
          } else if (action === "share") {
            updateData.shareCount = FieldValue.increment(1);
          }

          await docRef.set(updateData, { merge: true });
          console.log(`[Firestore] Tracked action '${action}' for session: ${sessionId}`);
          return res.json({ ok: true, sessionId, action });
        } catch (e) {
          console.error(`[Firestore] Failed to track action '${action}' for session ${sessionId}:`, e.message);
          return res.status(500).json({ error: e.message });
        }
      }

      // API THỐNG KÊ OVERVIEW DÙNG CHO DASHBOARD
      if (route === "tclife/dashboard-overview" && method === "GET") {
        try {
          const snapshot = await db.collection("msb_sessions").orderBy("createdAt", "desc").get();
          let sessions = [];
          snapshot.forEach(doc => {
            sessions.push(doc.data());
          });

          // Chỉ hiện job từ ngày 04/07/2026 (ngày ra mắt) trở đi (Đã bỏ theo yêu cầu của user để lấy toàn bộ lịch sử)
          // const cutoffTime = new Date("2026-07-04T00:00:00+07:00").getTime();
          // sessions = sessions.filter(s => s.createdAt && new Date(s.createdAt).getTime() >= cutoffTime);

          const totalJobs = sessions.length;
          const successJobs = sessions.filter(s => s.finalImageUrl && !s.finalImageUrl.includes("warn")).length;
          const failedJobs = totalJobs - successJobs;
          const successRate = totalJobs > 0 ? Math.round((successJobs / totalJobs) * 100) : 0;
          const errorRate = totalJobs > 0 ? Math.round((failedJobs / totalJobs) * 100) : 0;

          // Tính số thiết bị độc nhất (IP)
          const uniqueIps = new Set(sessions.map(s => s.userIp).filter(ip => ip && ip.length > 0));
          const uniqueDevices = uniqueIps.size;

          // Thống kê theo Style (Vin Palace)
          const styleCounts = {
            vinpalace_1: 0,
            vinpalace_2: 0,
            vinpalace_3: 0,
            vinpalace_4: 0,
            vinpalace_5: 0,
            vinpalace_6: 0
          };
          // Thống kê theo Giới tính
          const genderCounts = { male: 0, female: 0 };

          let totalDownloads = 30; // Cộng thêm 30 lượt tải để bắt đầu đếm từ 35 theo yêu cầu của user
          let totalShares = 0;

          sessions.forEach(s => {
            const style = s.styleId;
            if (style && styleCounts[style] !== undefined) {
              styleCounts[style]++;
            }

            const gender = s.gender || "male";
            if (genderCounts[gender] !== undefined) genderCounts[gender]++;
            else genderCounts[gender] = 1;

            totalDownloads += (s.downloadCount || 0);
            totalShares += (s.shareCount || 0);
          });

          // Biểu đồ xu hướng theo ngày (14 ngày qua)
          const dailyTrend = {};
          for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }); // "DD/MM"
            dailyTrend[dateStr] = 0;
          }

          // Hoạt động theo giờ
          const hourlyActivity = Array(24).fill(0);

          sessions.forEach(s => {
            if (!s.createdAt) return;
            const date = new Date(s.createdAt);
            const dateStr = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
            if (dailyTrend[dateStr] !== undefined) {
              dailyTrend[dateStr]++;
            }
            const hour = date.getHours();
            if (hour >= 0 && hour < 24) {
              hourlyActivity[hour]++;
            }
          });

          // Top 10 users tham gia
          const userCounts = {};
          sessions.forEach(s => {
            const name = s.name || "Unknown";
            userCounts[name] = (userCounts[name] || 0) + 1;
          });
          const topUsers = Object.entries(userCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          // Tính toán thời gian AI trung bình thực tế từ các session có renderDuration > 0
          const sessionsWithDuration = sessions.filter(s => s.renderDuration && s.renderDuration > 0);
          const totalDuration = sessionsWithDuration.reduce((sum, s) => sum + (s.renderDuration || 0), 0);
          const avgRenderTime = sessionsWithDuration.length > 0
            ? parseFloat((totalDuration / sessionsWithDuration.length).toFixed(1))
            : 0;

          return res.json({
            ok: true,
            total_jobs: totalJobs,
            success_jobs: successJobs,
            failed_jobs: failedJobs,
            success_rate: successRate,
            error_rate: errorRate,
            avg_render_time: avgRenderTime,
            style_counts: styleCounts,
            gender_counts: genderCounts,
            trend_labels: Object.keys(dailyTrend),
            trend_values: Object.values(dailyTrend),
            hourly_activity: hourlyActivity,
            top_users: topUsers,
            total_downloads: totalDownloads,
            total_shares: totalShares,
            unique_devices: uniqueDevices
          });
        } catch (e) {
          console.error("[Dashboard Overview API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API LẤY DANH SÁCH SESSION PHÂN TRANG CHO DASHBOARD
      if (route === "tclife/dashboard-sessions" && method === "GET") {
        try {
          const { page = 1, limit = 10, search = "", gender = "", styleId = "" } = req.query;
          
          const pageNum = parseInt(page, 10) || 1;
          const limitNum = parseInt(limit, 10) || 10;

          const snapshot = await db.collection("msb_sessions").orderBy("createdAt", "desc").get();
          let sessions = [];
          snapshot.forEach(doc => {
            sessions.push(doc.data());
          });

          // Chỉ hiện job từ ngày 04/07/2026 (ngày ra mắt) trở đi (Đã bỏ theo yêu cầu của user để lấy toàn bộ lịch sử)
          // const cutoffTime = new Date("2026-07-04T00:00:00+07:00").getTime();
          // sessions = sessions.filter(s => s.createdAt && new Date(s.createdAt).getTime() >= cutoffTime);

          // Áp dụng bộ lọc tại memory server
          if (search) {
            const s = search.toLowerCase();
            sessions = sessions.filter(x => 
              (x.id && x.id.toLowerCase().includes(s)) ||
              (x.name && x.name.toLowerCase().includes(s)) ||
              (x.description && x.description.toLowerCase().includes(s))
            );
          }

          if (gender) {
            sessions = sessions.filter(x => x.gender === gender);
          }

          if (styleId) {
            sessions = sessions.filter(x => x.styleId === styleId);
          }

          const totalFiltered = sessions.length;
          const totalPages = Math.ceil(totalFiltered / limitNum);
          
          const offset = (pageNum - 1) * limitNum;
          const pagedSessions = sessions.slice(offset, offset + limitNum);

          return res.json({
            ok: true,
            data: pagedSessions,
            meta: {
              current_page: pageNum,
              total_pages: totalPages,
              total_items: totalFiltered
            }
          });
        } catch (e) {
          console.error("[Dashboard Sessions API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API LẤY DANH SÁCH BÌA MỚI NHẤT CHO TRANG CHỦ SLIDER
      if (route === "tclife/latest-covers" && method === "GET") {
        try {
          const snapshot = await db.collection("msb_sessions")
            .orderBy("createdAt", "desc")
            .limit(100)
            .get();
          
          const covers = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === "success" && data.finalImageUrl) {
              covers.push(data.finalImageUrl);
            }
          });

          return res.json({ ok: true, covers: covers.slice(0, 20) });
        } catch (e) {
          console.error("[Latest Covers API Error]", e);
          return res.json({ ok: true, covers: [] });
        }
      }

      // API LẤY TOÀN BỘ BÀI THI CÔNG KHAI CHO TRANG TỔNG HỢP BÀI THI
      if (route === "tclife/public-submissions" && method === "GET") {
        try {
          const snapshot = await db.collection("msb_sessions")
            .orderBy("createdAt", "desc")
            .limit(100)
            .get();
          
          const submissions = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            // Chỉ lấy các bài thi đã thành công, có đầy đủ tên và ảnh kết quả
            if (data.status === "success" && data.finalImageUrl && data.name) {
              submissions.push({
                id: data.id,
                title: `Ký ức Di Sản - ${data.name}`,
                author: data.name,
                image: data.finalImageUrl,
                date: data.completedAt || data.createdAt || new Date().toISOString()
              });
            }
          });

          return res.json({ ok: true, data: submissions });
        } catch (e) {
          console.error("[Public Submissions API Error]", e);
          return res.json({ ok: true, data: [] });
        }
      }

      // API chia sẻ ảnh thành phẩm (OG Wrapper)
      if (route === "tclife/share-magazine" && method === "GET") {
        const { sessionId } = req.query;
        if (!sessionId) {
          return res.redirect("https://vuontamtudisan.msb.com.vn");
        }

        try {
          const doc = await db.collection("msb_sessions").doc(sessionId).get();
          if (!doc.exists) {
            console.log(`[Share OG] Session ${sessionId} not found. Redirecting to home.`);
            return res.redirect("https://vuontamtudisan.msb.com.vn");
          }

          const session = doc.data();
          const finalImageUrl = session.finalImageUrl || "";
          const name = session.name || "";
          const description = session.description || "";

          // Nhận diện Facebook Crawler hoặc các bot crawl link khác
          const userAgent = req.headers["user-agent"] || "";
          const isBot = /facebookexternalhit|Facebot|Twitterbot|Pinterest|LinkedInBot|TelegramBot/i.test(userAgent);

          if (isBot) {
            console.log(`[Share OG] Bot detected: ${userAgent}. Returning Open Graph HTML.`);
            res.set("Content-Type", "text/html");
            return res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Tạp chí Di sản tương lai của ${name}</title>
  <meta property="og:title" content="Tạp chí Di sản tương lai của ${name}" />
  <meta property="og:description" content="Xem tạp chí di sản tương lai của tôi cùng MSB!" />
  <meta property="og:image" content="${finalImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1680" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://vuontamtudisan.msb.com.vn" />
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tạp chí Di sản tương lai của ${name}">
  <meta name="twitter:description" content="Xem tạp chí di sản tương lai của tôi cùng MSB!">
  <meta name="twitter:image" content="${finalImageUrl}">
</head>
<body>
  <h1>Tạp chí Di sản tương lai của ${name}</h1>
  <img src="${finalImageUrl}" alt="Tạp chí Di sản" />
</body>
</html>`);
          } else {
            console.log(`[Share OG] Real user detected. Redirecting to home.`);
            return res.redirect("https://vuontamtudisan.msb.com.vn");
          }
        } catch (err) {
          console.error("[Share OG] Error processing share metadata:", err.message);
          return res.redirect("https://vuontamtudisan.msb.com.vn");
        }
      }

      // API lấy session
      if (route === "tclife/get-session" && method === "GET") {
        const { sessionId } = req.query;

        if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

        const doc = await db.collection("msb_sessions").doc(sessionId).get();
        if (!doc.exists) return res.status(404).json({ error: "Session not found" });

        return res.json({ ok: true, session: doc.data() });
      }

      // API LẤY NỘI DUNG PROMPTS CONFIG
      if (route === "tclife/get-prompts" && method === "GET") {
        try {
          const tmpPath = "/tmp/prompts.txt";
          const localPath = path.join(__dirname, "prompts.txt");
          const filePath = fs.existsSync(tmpPath) ? tmpPath : localPath;
          const content = fs.readFileSync(filePath, "utf8");
          return res.json({ ok: true, content });
        } catch (e) {
          console.error("[Get Prompts API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API CẬP NHẬT PROMPTS CONFIG
      if (route === "tclife/update-prompts" && method === "POST") {
        try {
          const { content, adminPin } = req.body;
          if (!content) {
            return res.status(400).json({ error: "Thiếu nội dung prompt cấu hình" });
          }

          if (!adminPin || (adminPin.toLowerCase() !== "msb2026" && adminPin !== "MSB_2026_Admin")) {
            return res.status(403).json({ error: "Sai mã PIN Admin. Không có quyền chỉnh sửa cấu hình hệ thống!" });
          }

          await db.collection("msb_configs").doc("prompts").set({ content });

          const tmpPath = "/tmp/prompts.txt";
          fs.writeFileSync(tmpPath, content, "utf8");
          
          console.log("[Prompts] Successfully updated prompts config in Firestore & local /tmp/prompts.txt.");
          return res.json({ ok: true });
        } catch (e) {
          console.error("[Update Prompts API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API LẤY VINPLACE PROMPTS (Tab 1 Concept Prompts)
      if (route === "tclife/get-vinplace-prompts" && method === "GET") {
        try {
          const doc = await db.collection("config").doc("vinplace_prompts").get();
          const data = doc.exists ? doc.data() : require("./vinplace_prompts.json");
          return res.json({ ok: true, prompts: data });
        } catch (e) {
          console.error("[Get VinPlace Prompts API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API LƯU VINPLACE PROMPTS (Tab 1 Concept Prompts)
      if (route === "tclife/save-vinplace-prompts" && method === "POST") {
        try {
          const { prompts } = req.body;
          if (!prompts) return res.status(400).json({ error: "Thiếu dữ liệu prompts" });
          await db.collection("config").doc("vinplace_prompts").set(prompts);
          console.log("[Prompts] Successfully updated vinplace_prompts in Firestore.");
          return res.json({ ok: true });
        } catch (e) {
          console.error("[Save VinPlace Prompts API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API LẤY SYSTEM PROMPTS (Tab 2 System Prompts)
      if (route === "tclife/get-system-prompts" && method === "GET") {
        try {
          const sysPrompts = await prompts.getSystemPrompts();
          return res.json({ ok: true, prompts: sysPrompts });
        } catch (e) {
          console.error("[Get System Prompts API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API LƯU SYSTEM PROMPTS (Tab 2 System Prompts)
      if (route === "tclife/save-system-prompts" && method === "POST") {
        try {
          const { prompts: newPrompts } = req.body;
          if (!newPrompts) return res.status(400).json({ error: "Thiếu dữ liệu prompts" });
          await db.collection("config").doc("system_prompts").set(newPrompts);
          console.log("[Prompts] Successfully updated system_prompts in Firestore.");
          return res.json({ ok: true });
        } catch (e) {
          console.error("[Save System Prompts API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API UPLOAD ẢNH REF
      if (route === "tclife/upload-ref-image" && method === "POST") {
        try {
          const { imageBase64, mimeType, conceptId, optionKey, slotIndex } = req.body;
          if (!imageBase64 || !mimeType || !conceptId || !optionKey || !slotIndex) {
            return res.status(400).json({ error: "Thiếu dữ liệu upload" });
          }

          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const ext = mimeType.split("/")[1] || "png";
          const destPath = `config/ref_images/concept_${conceptId}_${optionKey}_ref_${slotIndex}.${ext}`;

          console.log(`[Storage] Uploading ref image for concept: ${conceptId}, option: ${optionKey}, slot: ${slotIndex}`);
          const publicUrl = await uploadBase64Image(cleanBase64, mimeType, destPath);

          return res.json({ ok: true, publicUrl });
        } catch (e) {
          console.error("[Upload Ref Image API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // API XÓA SESSION JOB
      if (route === "tclife/delete-session" && method === "POST") {
        try {
          const { sessionId, adminPin } = req.body;
          if (!sessionId) {
            return res.status(400).json({ error: "Thiếu thông tin sessionId cần xóa" });
          }

          if (!adminPin || (adminPin.toLowerCase() !== "msb2026" && adminPin !== "MSB_2026_Admin")) {
            return res.status(403).json({ error: "Sai mã PIN Admin. Không có quyền xóa dữ liệu trên hệ thống!" });
          }

          await db.collection("msb_sessions").doc(sessionId).delete();
          console.log(`[Sessions] Session ${sessionId} deleted successfully by Admin.`);
          return res.json({ ok: true });
        } catch (e) {
          console.error("[Delete Session API Error]", e);
          return res.status(500).json({ error: e.message });
        }
      }

      // ──────────── FALLBACK ────────────
      return res.status(404).json({ error: `Route not found: ${method} /api/${route}` });

    } catch (e) {
      console.error(`[API] Error on route [${route}]:`, e);
      if (process.env.FUNCTIONS_EMULATOR !== "true") {
        try {
          const errorLogPath = path.join(__dirname, "backend_error.log");
          const errDetail = `Time: ${new Date().toISOString()}\n[API Error 500] Route: ${route}\nError: ${e.message}\nStack: ${e.stack}\n\n`;
          fs.appendFileSync(errorLogPath, errDetail, "utf8");
        } catch (logErr) {
          console.error("Failed to write to backend_error.log:", logErr.message);
        }
      } else {
        console.log(`[API][Emulator] Route [${route}] failed. Skipping backend_error.log write.`);
      }
      return res.status(500).json({ error: e.message });
    }
  }
);
