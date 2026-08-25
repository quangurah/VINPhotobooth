const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("./sake.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function readConfig() {
  try {
    const docRef = db.collection("config").doc("system_prompts");
    const doc = await docRef.get();
    if (doc.exists) {
      console.log("SYSTEM_PROMPTS DATA:");
      console.log(JSON.stringify(doc.data(), null, 2));
    } else {
      console.log("Document system_prompts does not exist.");
    }
  } catch (e) {
    console.error("Error reading firestore:", e);
  }
}

readConfig();
