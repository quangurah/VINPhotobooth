const fs = require("fs");
const path = require("path");

/**
 * Prompt AI nhận diện hình ảnh ở Bước 2 (Chỉ chấp nhận ảnh có đúng 1 người và kiểm duyệt an toàn)
 */
const VISION_DETECT_PROMPT = `# VAI TRÒ
Bạn là Chuyên gia Phân tích Hình ảnh (Computer Vision Agent) cho chiến dịch của Vin Palace Theater.

# NHIỆM VỤ
Phân tích bức ảnh do người dùng tải lên. Xác định chính xác tổng số người xuất hiện trong ảnh, liệt kê giới tính và độ tuổi ước tính của từng cá nhân. Đồng thời, kiểm tra kỹ xem bức ảnh có chứa chân dung của bất kỳ vị lãnh tụ, chính trị gia nổi tiếng nào của Việt Nam hay thế giới hay không.
⚠️ YÊU CẦU BẮT BUỘC: Toàn bộ kết quả trả về phải bằng TIẾNG VIỆT tự nhiên.

# DỮ LIỆU ĐẦU VÀO
- Hình ảnh người dùng tải lên: {{User Photo}}

# QUY TẮC PHÂN TÍCH NGHIÊM NGẶT
1. CHỈ LIỆT KÊ NHỮNG GÌ NHÌN THẤY: Phân tích và liệt kê thông tin của đúng những người xuất hiện trong ảnh.
2. CẤM BÌNH LUẬN DƯ THỪA: TUYỆT ĐỐI KHÔNG ĐƯỢC thêm các ghi chú về những đối tượng/giới tính không có mặt (Ví dụ: Cấm tuyệt đối các câu như "Trong ảnh không có nam giới", "Không có phụ nữ", hay "Ảnh thiếu trẻ em"). 
3. ƯỚC TÍNH ĐỘ TUỔI: Độ tuổi có thể đưa ra một khoảng (ví dụ: 25-30 tuổi) hoặc mô tả nhóm tuổi cụ thể (ví dụ: thanh niên, trung niên) nhưng phải sát thực tế nhất.
4. KIỂM TRA CHÍNH TRỊ GIA / LÃNH TỰ: Nhận diện xem người trong ảnh có phải là lãnh tụ chính trị, lãnh đạo quốc gia nổi tiếng (lịch sử hoặc đương nhiệm) của Việt Nam (ví dụ: Hồ Chí Minh, Võ Nguyên Giáp, các vị lãnh đạo Đảng và Nhà nước,...) hoặc thế giới hay không. Nếu có bất kỳ nghi ngờ nào, hãy đánh dấu "is_political_figure" là true.

# ĐỊNH DẠNG ĐẦU RA (Chỉ trả về JSON hợp lệ)
{
  "total_people": 1,
  "people_details": [
    {
      "person_index": 1,
      "gender": "Nữ",
      "estimated_age": "20-30 tuổi"
    }
  ],
  "is_political_figure": false,
  "political_figure_reason": ""
}
`;

/**
 * Hàm lấy prompt vẽ ảnh dã sử tương ứng của Concept và Giới tính từ Firestore hoặc file JSON mặc định (Bước 3)
 */
async function getVinPalacePrompt(conceptId, gender) {
  const cId = String(conceptId || "1");
  const isFemale = String(gender).toLowerCase().includes("female") || String(gender).toLowerCase().includes("nữ");

  let activePrompts = null;
  try {
    const admin = require("firebase-admin");
    const db = admin.firestore();
    const doc = await db.collection("config").doc("vinplace_prompts").get();
    if (doc.exists) {
      activePrompts = doc.data();
    } else {
      const defaultPrompts = require("./vinplace_prompts.json");
      await db.collection("config").doc("vinplace_prompts").set(defaultPrompts);
      activePrompts = defaultPrompts;
      console.log("[Prompts] Seeded default prompts from JSON file to Firestore config/vinplace_prompts.");
    }
  } catch (e) {
    console.warn("[Prompts] Failed to read from Firestore config/vinplace_prompts, falling back to local defaults:", e.message);
    activePrompts = require("./vinplace_prompts.json");
  }

  const concept = activePrompts[cId] || activePrompts["1"];
  const key = isFemale ? "female" : "male";
  const finalPrompt = concept[key] || concept["female"];
  return finalPrompt;
}

/**
 * Gọi Gemini Flash để phân tích và nhận diện người trong ảnh (Bước 2)
 */
async function analyzeInsightImage(geminiClient, imageBase64, mimeType = "image/jpeg") {
  try {
    const promptText = VISION_DETECT_PROMPT;
    // Sử dụng model gemini-2.5-flash phản hồi siêu nhanh dưới 1 giây và loại bỏ hoàn toàn timeout tự động
    const response = await geminiClient.analyzeImage(
      imageBase64,
      mimeType,
      promptText,
      "gemini-2.5-flash",
      0, // 0 có nghĩa là không giới hạn timeout ở client
      1
    );

    if (!response) {
      throw new Error("Không có phản hồi từ Gemini API");
    }

    // Làm sạch chuỗi trả về
    let cleaned = response.trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    const parsed = JSON.parse(cleaned);
    return { ok: true, data: parsed };
  } catch (e) {
    console.error("[Prompts] Lỗi phân tích ảnh với Gemini:", e.message);
    return { ok: false, error: e.message };
  }
}

/**
 * Lấy các system prompts từ Firestore (bản ghi config/system_prompts)
 */
async function getSystemPrompts() {
  try {
    const admin = require("firebase-admin");
    const db = admin.firestore();
    const doc = await db.collection("config").doc("system_prompts").get();
    if (doc.exists) {
      return doc.data();
    } else {
      console.warn("[Prompts] config/system_prompts không tồn tại trên Firestore, đang trả về bản ghi trống.");
      return {};
    }
  } catch (e) {
    console.error("[Prompts] Lỗi truy vấn system_prompts từ Firestore:", e.message);
    throw e;
  }
}

module.exports = {
  VISION_DETECT_PROMPT,
  getVinPalacePrompt,
  analyzeInsightImage,
  getSystemPrompts
};
