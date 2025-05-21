const db = require("../config/firebase.js");

const getAllUmkm = async (req, h) => {
    try {
        const snapshot = await db.collection('umkm').get();
        const umkmList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        if (umkmList.length === 0) {
            return h.response({
                message: 'No UMKM data found'
            }).code(404);
        }

        return h.response({
            message: 'Success',
            data: umkmList
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            message: 'Failed to retrieve UMKM data'
        }).code(500);
    }
};

const getUmkmById = async (req, h) => {
    return {
        message: 'UMKM by ID'
    };
};

module.exports = {
    getAllUmkm,
    getUmkmById
};
