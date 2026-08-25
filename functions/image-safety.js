const vision = require('@google-cloud/vision');
const path = require('path');
const { Jimp } = require('jimp');

// Khởi tạo client sử dụng sake.json
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, 'sake.json')
});

// Danh sách các mức độ Likelihood của Vision API tương ứng với chỉ số từ 0 đến 5
const LIKELIHOODS = ['UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'];

// Danh sách thực thể cấm để kiểm duyệt ảnh lãnh tụ/chính trị gia (cả tiếng Việt và tiếng Anh)
const FORBIDDEN_ENTITIES = [
  "ho chi minh", "hồ chí minh", "vo nguyen giap", "võ nguyên giáp",
  "nguyen phu trong", "nguyễn phú trọng", "to lam", "tô lâm",
  "pham minh chinh", "phạm minh chính", "tran dai quang", "trần đại quang",
  "nguyen tan dung", "nguyễn tấn dũng", "nguyen minh triet", "nguyễn minh triết",
  "luong cuong", "lương cường", "tran thanh man", "trần thanh mẫn",
  "mao zedong", "mao trạch đông", "xi jinping", "tập cận bình",
  "vladimir putin", "putin", "joe biden", "biden", "donald trump", "trump",
  "barack obama", "obama", "lenin", "karl marx", "chính trị gia", "politician",
  "leader of vietnam", "vietnamese politician", "vietnam president",
  "tổng bí thư", "thủ tướng", "chủ tịch nước", "vietnam general secretary"
];

// Hàm phụ trợ bỏ dấu tiếng Việt để so khớp chính xác hơn
function removeVietnameseTones(str) {
  if (!str) return "";
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0309|\u0303|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  return str.toLowerCase();
}

/**
 * Kiểm duyệt hình ảnh Brand Safety (SafeSearch, Face Detection & Web Detection)
 * Và tự động crop khuôn mặt có diện tích lớn nhất nếu phát hiện từ 2 người trở lên.
 * @param {string} base64Image Dữ liệu ảnh dạng Base64
 * @returns {Promise<{safe: boolean, error?: string, croppedBase64?: string}>} Kết quả kiểm duyệt
 */
async function checkImageBrandSafety(base64Image) {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, 'base64');

    console.log('[VisionSDK] Requesting face detection, safe search, and web detection...');
    const [result] = await client.annotateImage({
      image: { content: buffer },
      features: [
        { type: 'FACE_DETECTION' },
        { type: 'SAFE_SEARCH_DETECTION' },
        { type: 'WEB_DETECTION' }
      ]
    });

    if (result.error) {
      console.warn('[VisionSDK] API response error but bypassed:', result.error.message);
      return { safe: true, warn: `Bypassed Vision error: ${result.error.message}` };
    }

    // 1. Kiểm tra SafeSearch
    const safeSearch = result.safeSearchAnnotation;
    if (safeSearch) {
      const adultScore = LIKELIHOODS.indexOf(safeSearch.adult || 'UNKNOWN');
      const violenceScore = LIKELIHOODS.indexOf(safeSearch.violence || 'UNKNOWN');

      console.log(`[VisionSDK] SafeSearch score - Adult: ${adultScore} (${safeSearch.adult}), Violence: ${violenceScore} (${safeSearch.violence})`);

      // Tương tự check_image.php: adult > 4 (Likely hoặc Very Likely) hoặc violence > 3 (Possible, Likely, Very Likely)
      if (adultScore > 4 || violenceScore > 3) {
        return { safe: false, error: 'Hình ảnh không hợp lệ (Vi phạm tiêu chuẩn nội dung).' };
      }
    }

    // 1.2. Kiểm duyệt ảnh Lãnh tụ & Chính trị gia qua Web Detection (Google Lens)
    const webDetection = result.webDetection;
    if (webDetection) {
      console.log('[VisionSDK] Web Detection processing...');
      let detectedPoliticalText = null;

      // Gom tất cả các nhãn thực thể tìm thấy từ webEntities và bestGuessLabels
      const detectedLabels = [];
      
      if (webDetection.webEntities && Array.isArray(webDetection.webEntities)) {
        for (const entity of webDetection.webEntities) {
          if (entity.description) {
            detectedLabels.push(entity.description.toLowerCase());
          }
        }
      }
      
      if (webDetection.bestGuessLabels && Array.isArray(webDetection.bestGuessLabels)) {
        for (const guess of webDetection.bestGuessLabels) {
          if (guess.label) {
            detectedLabels.push(guess.label.toLowerCase());
          }
        }
      }

      console.log('[VisionSDK] Detected web labels (first 10):', detectedLabels.slice(0, 10));

      for (const label of detectedLabels) {
        const cleanLabel = removeVietnameseTones(label);
        for (const forbidden of FORBIDDEN_ENTITIES) {
          const cleanForbidden = removeVietnameseTones(forbidden);
          // So khớp chứa từ khóa nhạy cảm
          if (cleanLabel.includes(cleanForbidden) || label.includes(forbidden.toLowerCase())) {
            detectedPoliticalText = `${forbidden} (phát hiện qua nhãn: "${label}")`;
            break;
          }
        }
        if (detectedPoliticalText) break;
      }

      if (detectedPoliticalText) {
        console.warn(`[BrandSafety][Image] Chặn ảnh phát hiện chính trị gia/lãnh tụ: ${detectedPoliticalText}`);
        return { 
          safe: false, 
          error: 'Hình ảnh không hợp lệ. Vui lòng không sử dụng hình ảnh của các vị lãnh tụ hoặc chính trị gia.' 
        };
      }
    }

    // 2. Kiểm tra Face Detection
    const faces = result.faceAnnotations || [];
    console.log(`[VisionSDK] Face Detection - Detected faces: ${faces.length}`);
    if (faces.length === 0) {
      return { safe: false, error: 'Hình ảnh phải có mặt người tham gia.' };
    }

    // Nếu phát hiện 1 hoặc nhiều người, tự động cắt lấy khuôn mặt có diện tích lớn nhất (gần camera nhất)
    if (faces.length >= 1) {
      console.log(`[VisionSDK] Phát hiện ${faces.length} khuôn mặt. Tiến hành chọn khuôn mặt lớn nhất...`);
      let largestFace = null;
      let maxArea = 0;

      for (const face of faces) {
        if (!face.fdBoundingPoly || !face.fdBoundingPoly.vertices) continue;
        const vertices = face.fdBoundingPoly.vertices;
        const xCoords = vertices.map(v => v.x || 0);
        const yCoords = vertices.map(v => v.y || 0);
        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);
        const width = maxX - minX;
        const height = maxY - minY;
        const area = width * height;

        if (area > maxArea) {
          maxArea = area;
          largestFace = { minX, maxX, minY, maxY, width, height };
        }
      }

      if (largestFace) {
        try {
          const image = await Jimp.read(buffer);
          const imgWidth = image.bitmap.width;
          const imgHeight = image.bitmap.height;

          // Tính toán vùng crop có chứa vai và tóc (padding 60% ngang, 80% dọc)
          const paddingX = Math.round(largestFace.width * 0.6);
          const paddingY = Math.round(largestFace.height * 0.8);

          let cropX = Math.max(0, largestFace.minX - paddingX);
          let cropY = Math.max(0, largestFace.minY - paddingY);
          
          let cropRight = Math.min(imgWidth, largestFace.maxX + paddingX);
          let cropBottom = Math.min(imgHeight, largestFace.maxY + paddingY);

          let cropWidth = cropRight - cropX;
          let cropHeight = cropBottom - cropY;

          console.log(`[VisionSDK] Tiến hành crop mặt lớn nhất: rect(${cropX}, ${cropY}, ${cropWidth}, ${cropHeight}) trên ảnh gốc ${imgWidth}x${imgHeight}`);
          
          image.crop({ x: cropX, y: cropY, w: cropWidth, h: cropHeight });
          // Sử dụng image.getBuffer chuẩn Jimp v1.x thay thế cho getBufferAsync cũ
          const croppedBuffer = await image.getBuffer("image/jpeg");
          const croppedBase64 = croppedBuffer.toString('base64');

          return { 
            safe: true, 
            croppedBase64: croppedBase64 
          };
        } catch (cropErr) {
          console.error('[VisionSDK] Lỗi khi crop mặt lớn nhất:', cropErr.message);
          return { safe: true, warn: `Lỗi crop ảnh, fallback về ảnh gốc: ${cropErr.message}` };
        }
      }
    }

    return { safe: true };

  } catch (e) {
    console.warn('[VisionSDK] Error checking image safety but bypassed:', e.message);
    return { safe: true, warn: `Bypassed exception: ${e.message}` };
  }
}

module.exports = {
  checkImageBrandSafety
};
