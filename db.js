const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "motionbit-kpopschool.appspot.com",
});

module.exports = db;
