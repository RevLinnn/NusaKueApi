const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

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
