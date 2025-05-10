const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Tes koneksi
db.collection('kue').get().then(snapshot => {
    console.log('Koleksi kue:', snapshot.docs.map(doc => doc.data()));
  }).catch(error => {
    console.error('Gagal mengambil data:', error);
  });

module.exports = db;
