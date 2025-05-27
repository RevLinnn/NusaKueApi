const { db } = require("../config/firebase");

const incrementPredictionCount = async (nama) => {
  const counterRef = db.collection("predictionCounts").doc(nama);

  try {
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(counterRef);

      if (!doc.exists) {
        transaction.set(counterRef, { count: 1 });
      } else {
        const currentCount = doc.data().count || 0;
        transaction.update(counterRef, { count: currentCount + 1 });
      }
    });
  } catch (error) {
    console.error(`Gagal menambah hitungan prediksi untuk '${nama}':`, error);
    throw new Error("Gagal memperbarui jumlah prediksi");
  }
};

module.exports = incrementPredictionCount;
