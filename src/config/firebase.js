const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccountPath = '/secrets/firebasekey';

let serviceAccount;
try {
  const serviceAccountJSON = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountJSON);
} catch (err) {
  console.error('Gagal membaca service account dari secret mount:', err);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'resonant-forge-456915-j1.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = {
  db,
  bucket
};
