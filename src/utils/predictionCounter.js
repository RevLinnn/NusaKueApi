const { db } = require("../config/firebase");

const incrementPredictionCount = async (nama) => {
  const counterRef = db.collection("predictionCounts").doc(nama);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(counterRef);

    if (!doc.exists) {
      transaction.set(counterRef, { count: 1 });
    } else {
      const currentCount = doc.data().count || 0;
      const updatedCount = currentCount + 1;
      transaction.update(counterRef, { count: updatedCount });
    }
  });
};

module.exports = incrementPredictionCount;
