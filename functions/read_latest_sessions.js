const admin = require("firebase-admin");
const serviceAccount = require("./sake.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function readLatestSessions() {
  try {
    const snapshot = await db.collection("msb_sessions")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
    
    console.log("=== LATEST 5 SESSIONS ===");
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${data.id}`);
      console.log(`Name: ${data.name}`);
      console.log(`Created At: ${data.createdAt}`);
      console.log(`Download Count: ${data.downloadCount || 0}`);
      console.log(`Share Count: ${data.shareCount || 0}`);
      console.log("------------------------");
    });
  } catch (e) {
    console.error("Error reading sessions:", e);
  }
}

readLatestSessions();
