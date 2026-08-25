/**
 * Gemini API Client với HTTPS thuần Node.js, API Key Rotation, Retry và Model Fallback.
 * Tương thích với Quy trình chuẩn MSB và học tập từ dự án mẫu Techcomlife.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const KEYS_FILE = path.join(__dirname, 'api_keys.json');

class APIKeyManager {
  constructor(keysFile = KEYS_FILE) {
    this.keysFile = keysFile;
    this.allKeys = [];
    this.activeKeys = [];
    this.currentIndex = 0;
    this.failedKeys = new Set(); // Các key bị lỗi trong phiên làm việc
    this.lastMtime = 0;
    this._loadKeys();
  }

  _loadKeys() {
    try {
      if (!fs.existsSync(this.keysFile)) {
        const envKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        if (envKey) {
          console.warn(`[KeyManager] api_keys.json not found. Falling back to GEMINI_API_KEY from environment variables.`);
          this.allKeys = [{ key: envKey, label: "Env_Key", group: "Environment", active: true }];
        } else {
          console.warn(`[KeyManager] api_keys.json not found and no GEMINI_API_KEY environment variable. Using a dummy key to prevent startup crash.`);
          this.allKeys = [{ key: "DUMMY_KEY", label: "Dummy_Key", group: "Dummy", active: false }];
        }
        this.activeKeys = this.allKeys.filter(k => k.active !== false);
        this.currentIndex = 0;
        return;
      }

      const stats = fs.statSync(this.keysFile);
      if (stats.mtimeMs === this.lastMtime && this.allKeys.length > 0) {
        // Tránh tải lại file và ghi đè currentIndex nếu file trên đĩa không thay đổi
        return;
      }
      this.lastMtime = stats.mtimeMs;

      const raw = fs.readFileSync(this.keysFile, 'utf8');
      const data = JSON.parse(raw);
      this.allKeys = data.keys || [];
      this.activeKeys = this.allKeys.filter(k => k.active !== false);
      this.currentIndex = (data.current_index || 0) % Math.max(this.activeKeys.length, 1);
      console.log(`[KeyManager] Loaded ${this.activeKeys.length} active keys from ${this.allKeys.length} total.`);
    } catch (e) {
      console.error('[KeyManager] Load keys error:', e.message);
      // Tránh crash tiến trình khi deploy hoặc khởi tạo
      this.allKeys = [{ key: "DUMMY_KEY", label: "Dummy_Key", group: "Dummy", active: false }];
      this.activeKeys = [];
      this.currentIndex = 0;
    }
  }

  getCurrentKey() {
    this._loadKeys(); // Kiểm tra xem file có thay đổi không trước khi lấy key
    if (this.activeKeys.length === 0) {
      throw new Error('No active API keys available!');
    }
    return this.activeKeys[this.currentIndex];
  }

  rotate() {
    this._loadKeys(); // Cập nhật lại trước khi xoay vòng
    if (this.activeKeys.length === 0) {
      throw new Error('No active API keys available!');
    }
    this.currentIndex = (this.currentIndex + 1) % this.activeKeys.length;
    const keyInfo = this.activeKeys[this.currentIndex];
    console.log(`[KeyManager] Rotated to key: ${keyInfo.label} (group: ${keyInfo.group})`);
    return keyInfo;
  }

  markFailed(keyValue) {
    this.failedKeys.add(keyValue);
    console.warn(`[KeyManager] Marked key as failed: ${keyValue.substring(0, 15)}...`);
  }

  getNextAvailableKey() {
    for (let i = 0; i < this.activeKeys.length; i++) {
      const keyInfo = this.rotate();
      if (!this.failedKeys.has(keyInfo.key)) {
        return keyInfo;
      }
    }
    // Nếu tất cả các key đều đã fail trong phiên, reset lại danh sách lỗi
    console.warn('[KeyManager] All active keys exhausted in session! Resetting failed keys list.');
    this.failedKeys.clear();
    return this.rotate();
  }

  saveState() {
    console.log("[DEBUG][KeyManager] saveState invoked.");
    if (process.env.FUNCTIONS_EMULATOR === "true") {
      console.log("[DEBUG][KeyManager] Running in emulator. Skipping api_keys.json write to prevent hot-reload loop.");
      return;
    }
    try {
      if (!fs.existsSync(this.keysFile)) return;
      const raw = fs.readFileSync(this.keysFile, 'utf8');
      const data = JSON.parse(raw);
      data.current_index = this.currentIndex;
      fs.writeFileSync(this.keysFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('[KeyManager] Save state error:', e.message);
    }
  }
}

class GeminiClient {
  constructor(keysFile = KEYS_FILE) {
    this.keyManager = new APIKeyManager(keysFile);
    this.TEXT_MODELS = ['gemini-2.5-flash', 'gemini-3.5-flash'];
    this.IMAGE_MODELS = ['gemini-3-pro-image', 'gemini-3-pro-image-preview', 'gemini-3.1-flash-image'];
    this._initClient();
  }

  _initClient() {
    const keyInfo = this.keyManager.getCurrentKey();
    this.currentKeyUsed = keyInfo.key;
    console.log(`[GeminiClient] Initialized client with API Key: ${keyInfo.label}`);
  }

  _switchKey() {
    const keyInfo = this.keyManager.getNextAvailableKey();
    this.currentKeyUsed = keyInfo.key;
    console.log(`[GeminiClient] Switched to API Key: ${keyInfo.label}`);
  }

  _isQuotaError(error) {
    const errStr = String(error).toLowerCase();
    return (
      errStr.includes('429') ||
      errStr.includes('quota') ||
      errStr.includes('resource_exhausted') ||
      errStr.includes('rate_limit') ||
      errStr.includes('too many requests') ||
      errStr.includes('resourceexhausted') ||
      errStr.includes('prepayment credits') ||
      errStr.includes('credits are depleted') ||
      errStr.includes('depleted')
    );
  }

  _isKeyError(error) {
    const errStr = String(error).toLowerCase();
    return (
      errStr.includes('key not valid') ||
      errStr.includes('key not found') ||
      errStr.includes('permission denied') ||
      errStr.includes('suspended') ||
      errStr.includes('invalid api key') ||
      errStr.includes('key expired') ||
      errStr.includes('paid plans') ||
      errStr.includes('not found') ||
      errStr.includes('403') ||
      errStr.includes('400')
    );
  }

  _isRetryableError(error) {
    const errStr = String(error).toLowerCase();
    return (
      errStr.includes('500') ||
      errStr.includes('503') ||
      errStr.includes('internal') ||
      errStr.includes('unavailable') ||
      errStr.includes('timeout') ||
      errStr.includes('deadline') ||
      errStr.includes('connection') ||
      errStr.includes('high demand') ||
      errStr.includes('spikes in demand') ||
      errStr.includes('try again later')
    );
  }

  /**
   * Gọi HTTPS request trực tiếp đến Gemini API v1beta với cơ chế Timeout
   */
  _callGeminiAPI(apiPath, postData, apiKey, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/${apiPath}?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      let timer;
      const req = https.request(options, (res) => {
        if (timer) clearTimeout(timer);
        let responseBody = '';
        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(responseBody));
            } catch (e) {
              reject(new Error(`Failed to parse response JSON: ${responseBody}`));
            }
          } else {
            try {
              const parsed = JSON.parse(responseBody);
              reject(new Error(parsed.error ? parsed.error.message : responseBody));
            } catch (e) {
              reject(new Error(`API Error status ${res.statusCode}: ${responseBody}`));
            }
          }
        });
      });

      req.on('error', (err) => {
        if (timer) clearTimeout(timer);
        reject(err);
      });

      // Đã loại bỏ hoàn toàn cơ chế tự động timeout theo yêu cầu để chờ kết quả từ Google API vô thời hạn

      req.write(JSON.stringify(postData));
      req.end();
    });
  }

  /**
   * Helper chạy một chức năng API với cơ chế tự động xoay key ngay khi gặp lỗi và thực hiện retry chéo.
   */
  async _executeWithRetry(apiCallFn, maxRetries = 3, opName = 'api_call') {
    let keysTried = 0;
    const maxKeys = this.keyManager.activeKeys.length;
    const limitTries = Math.min(maxRetries, maxKeys);

    console.log(`[DEBUG][gemini-helper] Bắt đầu gọi API ${opName} với pool gồm ${maxKeys} keys (thử tối đa ${limitTries} lần).`);

    while (keysTried < limitTries) {
      const currentKey = this.keyManager.getCurrentKey();
      try {
        console.log(`[DEBUG][gemini-helper] Đang sử dụng key: ${currentKey.label}`);
        const result = await apiCallFn(currentKey.key);
        this.keyManager.saveState();
        return result;
      } catch (e) {
        const errMsg = e.message || String(e);
        console.warn(`[DEBUG][gemini-helper][${opName}] Gặp lỗi khi dùng key ${currentKey.label}: ${errMsg.substring(0, 200)}`);

        // Ghi log lỗi gốc vào backend_error.log để tiện debug (Bỏ qua khi chạy trong Emulator)
        if (process.env.FUNCTIONS_EMULATOR !== "true") {
          const fs = require("fs");
          const path = require("path");
          const logPath = path.join(__dirname, "backend_error.log");
          try {
            fs.appendFileSync(logPath, `Time: ${new Date().toISOString()}\nOriginal Error [${opName}] (Key: ${currentKey.label}): ${errMsg}\nStack: ${e.stack}\n\n`, "utf8");
          } catch (logErr) {}
        }

        keysTried++;

        if (this._isQuotaError(e) || this._isKeyError(e)) {
          console.log(`[DEBUG][gemini-helper] Lỗi Key hoặc Quota. Đánh dấu key hỏng và tự động chuyển sang key tiếp theo.`);
          this.keyManager.markFailed(currentKey.key);
        } else if (this._isRetryableError(e)) {
          console.log(`[DEBUG][gemini-helper] Lỗi tạm thời (retryable). Chuyển sang key tiếp theo để thử lại ngay.`);
          // Chờ một chút ngắn (500ms) để ổn định kết nối trước khi đổi key
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          console.log(`[DEBUG][gemini-helper] Lỗi không xác định. Đánh dấu key hỏng và tự động chuyển sang key tiếp theo.`);
          this.keyManager.markFailed(currentKey.key);
        }

        if (keysTried < limitTries) {
          this._switchKey();
          console.log(`[DEBUG][gemini-helper] Đã chuyển key. Lượt thử tiếp theo: ${keysTried + 1}/${limitTries}`);
        }
      }
    }

    throw new Error("Ui! Lỗi hệ thống, bạn hãy vui lòng thử lại nha!");
  }

  /**
   * Sinh nội dung văn bản.
   */
  async generateContent(prompt, model = 'gemini-2.5-flash', config = {}, timeoutMs = 25000, maxRetries = 3) {
    return this._executeWithRetry(
      async (apiKey) => {
        const payload = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: config
        };
        const response = await this._callGeminiAPI(`models/${model}:generateContent`, payload, apiKey, timeoutMs);
        if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
          const parts = response.candidates[0].content.parts;
          if (parts && parts[0]) {
            return parts[0].text;
          }
        }
        throw new Error("No text returned in generateContent response");
      },
      maxRetries,
      `generateContent/${model}`
    );
  }

  /**
   * Sinh ảnh bằng Gemini Image (Mặc định dùng gemini-3.1-flash-image).
   */
  async generateImage(prompt, model = 'gemini-3-pro-image', config = {}, inputImageBase64 = null, refImageBase64 = null) {
    let targetModel = model || 'gemini-3-pro-image';

    return this._executeWithRetry(
      async (apiKey) => {
        console.log(`[DEBUG][gemini-helper][generateImage] Bắt đầu sinh ảnh với model: ${targetModel}`);
        
        const parts = [];
        if (inputImageBase64) {
          parts.push({
            text: "Hình 1 (Ảnh chân dung thực tế của người dùng, chứa khuôn mặt gốc):"
          });
          const cleanBase64 = inputImageBase64.replace(/^data:image\/\w+;base64,/, "");
          parts.push({
            inlineData: {
              data: cleanBase64,
              mimeType: "image/jpeg"
            }
          });
        }
        if (refImageBase64) {
          parts.push({
            text: "Hình 2 (Ảnh mẫu concept trang phục, tư thế và bối cảnh tham khảo):"
          });
          const cleanRefBase64 = refImageBase64.replace(/^data:image\/\w+;base64,/, "");
          parts.push({
            inlineData: {
              data: cleanRefBase64,
              mimeType: "image/jpeg"
            }
          });
        }
        parts.push({
          text: `Yêu cầu thiết kế: ${prompt}`
        });

        // Lọc sạch generationConfig, chỉ giữ lại các tham số được Google Gemini API hỗ trợ thực tế
        const allowedParams = ['temperature', 'topP', 'topK', 'candidateCount', 'maxOutputTokens', 'stopSequences', 'responseModalities', 'outputMimeType'];

        const safeConfig = {};
        for (const key in config) {
          if (allowedParams.includes(key) && key !== 'aspectRatio') {
            safeConfig[key] = config[key];
          } else if (key !== 'aspectRatio') {
            console.log(`[DEBUG][gemini-helper][generateImage] Loại bỏ tham sực lạ khỏi generationConfig: ${key}`);
          }
        }

        const payload = {
          contents: [{ parts: parts }],
          generationConfig: {
            responseModalities: ["IMAGE"],
            ...safeConfig
          }
        };

        // Đưa aspectRatio vào imageConfig đúng chuẩn REST API của Google Gemini
        if (config && config.aspectRatio) {
          payload.generationConfig.imageConfig = {
            aspectRatio: config.aspectRatio
          };
        }

        // Đặt timeout cho Imagen 3 sinh ảnh là 55 giây để đảm bảo đủ thời gian xử lý tải ảnh mẫu lên và xử lý chéo
        const response = await this._callGeminiAPI(`models/${targetModel}:generateContent`, payload, apiKey, 55000);

        
        if (response && response.candidates && response.candidates[0]) {
          const candidate = response.candidates[0];
          if (candidate.finishReason === 'SAFETY') {
            console.error(`[DEBUG][gemini-helper][generateImage] Bị chặn bởi bộ lọc an toàn (SAFETY):`, JSON.stringify(response));
            throw new Error(`Yêu cầu sinh ảnh bị từ chối bởi bộ lọc an toàn của Gemini (SAFETY Block). Vui lòng thử lại bằng ảnh chân dung rõ nét hơn hoặc mô tả khác.`);
          }
          if (candidate.content) {
            const responseParts = candidate.content.parts;
            if (responseParts && Array.isArray(responseParts)) {
              for (const part of responseParts) {
                if (part.inlineData) {
                  return {
                    base64: part.inlineData.data,
                    mimeType: part.inlineData.mimeType || 'image/jpeg',
                    model: targetModel,
                    keyLabel: this.keyManager.getCurrentKey().label
                  };
                }
              }
            } else {
              console.warn(`[DEBUG][gemini-helper][generateImage] Content tồn tại nhưng parts không hợp lệ:`, JSON.stringify(candidate));
            }
          }
        }
        
        // Log phản hồi lỗi thô nếu không lấy được ảnh
        console.error(`[DEBUG][gemini-helper][generateImage] Không nhận được ảnh từ API. Phản hồi đầy đủ:`, JSON.stringify(response));
        throw new Error(`Gemini Image model ${targetModel} did not return any image data.`);
      },
      1,
      `generateImage/${targetModel}`
    );
  }

  /**
   * Gọi Gemini Vision API để phân tích ảnh.
   */
  async analyzeImage(base64Image, mimeType, prompt, model = 'gemini-2.5-flash', timeoutMs = 15000, maxRetries = 3) {
    return this._executeWithRetry(
      async (apiKey) => {
        const payload = {
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                  }
                }
              ]
            }
          ]
        };
        const response = await this._callGeminiAPI(`models/${model}:generateContent`, payload, apiKey, timeoutMs);
        if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
          const parts = response.candidates[0].content.parts;
          if (parts && parts[0]) {
            return parts[0].text;
          }
        }
        throw new Error("No text returned in analyzeImage response");
      },
      maxRetries,
      `analyzeImage/${model}`
    );
  }
}

module.exports = {
  APIKeyManager,
  GeminiClient,
  client: new GeminiClient()
};
