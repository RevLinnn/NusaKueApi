const db = require("../config/firebase.js");

const getAllKue = async (req, h) => {
    try {
        const snapshot = await db.collection('detailkue').get();
        const cakeList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        if (cakeList.length === 0) {
            return h.response({
                message: 'No cakes found'
            }).code(404);
        }

        return h.response({
            message: 'Success',
            data: cakeList
        }).code(200);

    } catch (error) {
        console.error(error);
        return h.response({
            message: 'Failed to retrieve cakes'
        }).code(500);
    }
};

const getCakeById = async (req, h) => {
    try {
        const { id } = req.params;

        const cakeDoc = await db.collection('detailkue').doc(id).get();

        if (!cakeDoc.exists) {
            return h.response({
                message: 'Cake not found'
            }).code(404);
        }

        return h.response({
            message: 'Success',
            data: {
                id: cakeDoc.id,
                ...cakeDoc.data()
            }
        }).code(200);

    } catch (error) {
        console.error(error);
        return h.response({
            message: 'Failed to retrieve cake'
        }).code(500);
    }
};

module.exports = {
    getAllKue,
    getCakeById
};
