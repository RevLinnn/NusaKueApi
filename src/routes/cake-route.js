const { addKue, getAllKue, getCakeById } = require('../handlers/cake-handler.js');

const routes = [
  {
    method: 'GET',
    path: '/cakes',
    handler: getAllKue
  },
  {
    method: 'GET',
    path: '/cakes/{id}',
    handler: getCakeById
  },
  {
    method: 'POST',
    path: '/cakes',
    handler: addKue,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10485760,
        allow: 'multipart/form-data'
      }
    }
  }
];

module.exports = routes;
