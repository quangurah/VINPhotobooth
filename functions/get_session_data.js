const admin = require("firebase-admin");
const path = require("path");

// Nạp tệp key service account có sẵn
const serviceAccount = require(path.join(__dirname, "../../msbtapchidisan-ecc08c32271d.json"));

// Khởi tạo Firebase Admin sử dụng key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const sessionId = "session_msb_1782339416300";

async function getSession() {
  try {
    console.log(`Đang truy vấn session: ${sessionId} từ Firestore...`);
    const doc = await db.collection("msb_sessions").doc(sessionId).get();
    if (!doc.exists) {
      console.log("Không tìm thấy session này trong database.");
      return;
    }
    const data = doc.data();
    console.log("\n=== THÔNG TIN SESSION ===");
    console.log(`ID: ${data.id}`);
    console.log(`Tên: ${data.name}`);
    console.log(`Mô tả: ${data.description}`);
    console.log(`Giới tính: ${data.gender}`);
    console.log(`Style ID: ${data.styleId}`);
    console.log(`Raw Image URL: ${data.rawImageUrl}`);
    console.log(`Final Image URL: ${data.finalImageUrl}`);
    console.log(`Thời gian tạo: ${data.createdAt}`);
    console.log("=========================\n");

    // Lấy thông tin logs để xem prompt cuối
    if (data.logs && data.logs.length > 0) {
      console.log("=== LOGS TRONG SESSION ===");
      data.logs.forEach((log, index) => {
        console.log(`Log [${index}]:`, JSON.stringify(log, null, 2));
      });
    } else {
      console.log("Không tìm thấy log lưu trong session này.");
    }
    
  } catch (e) {
    console.error("Lỗi khi kết nối Firestore:", e.message);
  }
}

getSession().then(() => process.exit(0));
