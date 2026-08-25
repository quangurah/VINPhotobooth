const admin = require("firebase-admin");
const serviceAccount = require("./sake.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkStats() {
  try {
    const snapshot = await db.collection("msb_sessions").get();
    
    console.log(`Total sessions in Firestore: ${snapshot.size}`);
    
    let totalDownloads = 0;
    let totalShares = 0;
    const dailyStats = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const downloads = data.downloadCount || 0;
      const shares = data.shareCount || 0;
      totalDownloads += downloads;
      totalShares += shares;

      let dateStr = "Unknown";
      if (data.createdAt) {
        const date = new Date(data.createdAt);
        dateStr = date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
      }

      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          sessions: 0,
          downloads: 0,
          shares: 0
        };
      }

      dailyStats[dateStr].sessions++;
      dailyStats[dateStr].downloads += downloads;
      dailyStats[dateStr].shares += shares;
    });

    console.log("\n=== STATS BY DATE ===");
    console.table(dailyStats);

    console.log(`\nTotal Downloads: ${totalDownloads}`);
    console.log(`Total Shares: ${totalShares}`);
    
  } catch (e) {
    console.error("Error checking stats:", e);
  } finally {
    process.exit(0);
  }
}

checkStats();
