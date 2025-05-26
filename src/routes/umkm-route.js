const { addUmkm,getAllUmkm, getUmkmById, getManyUmkm } = require('../handlers/umkm-handler.js');

const routes = [
  {
    method: 'GET',
    path: '/umkms',
    handler: getAllUmkm
  },
  {
    method: 'GET',
    path: '/umkms/{id}',
    handler: getUmkmById
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
        maxBytes: 10485760,
        allow: 'multipart/form-data'
      }
    }
  },
  {
    method: 'GET',
    path: '/umkms/many',
    handler: getManyUmkm
  } 
];

module.exports = routes;
