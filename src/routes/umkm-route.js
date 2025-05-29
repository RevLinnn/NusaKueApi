const { addUmkm, getAllUmkm, getUmkmById, updateUmkmById, deleteUmkmById } = require('../handlers/umkm-handler.js');

const routes = [
  {
    method: 'GET',
    path: '/umkms',
    handler: getAllUmkm
  },
  {
    method: 'POST',
    path: '/umkms',
    handler: addUmkm,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 5 * 1024 * 1024,
        allow: 'multipart/form-data'
      }
    }
  },
  {
    method: 'GET',
    path: '/umkms/{id}',
    handler: getUmkmById
  },
  {
    method: 'PUT',
    path: '/umkms/{id}',
    handler: updateUmkmById,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 5 * 1024 * 1024,
        allow: 'multipart/form-data'
      }
    }
  },
  {
    method: 'DELETE',
    path: '/umkms/{id}',
    handler: deleteUmkmById
  }
];

module.exports = routes;
