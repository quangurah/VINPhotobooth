const admin = require("firebase-admin");
const serviceAccount = require("./sake.json");

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function check() {
  const doc = await db.collection("config").doc("vinplace_prompts").get();
  if (doc.exists) {
    console.log("Firestore Data Keys:", Object.keys(doc.data()));
    console.log("Concept 2 Female Prompt length:", doc.data()["2"] ? doc.data()["2"]["female"].length : "undefined");
    console.log("Concept 2 Female Prompt snippet:", doc.data()["2"] ? doc.data()["2"]["female"].substring(0, 200) : "undefined");
  } else {
    console.log("Document config/vinplace_prompts DOES NOT EXIST!");
  }
  process.exit(0);
}

check();
