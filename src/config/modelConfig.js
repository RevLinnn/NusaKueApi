const path = require('path');

// Lokasi model tfjs
const MODEL_PATH = `file://${path.resolve(__dirname, '../model/model.json')}`;

// Label kelas sesuai indeks
const LABEL = [
  "Kue Akar Kelapa", 
  "Kue Ali Agrem", 
  "Kue Ape", 
  "Kue Bakpia", 
  "Kue Bay Tat", 
  "Kue Bingke", 
  "Kue Bolu Kojo", 
  "Kue Chaikue", 
  "Kue Cucur", 
  "Kue Dadar Gulung", 
  "Kue Getuk Lindri", 
  "Kue Kembang Goyang", 
  "Kue Klepon", 
  "Kue Lapis Legit", 
  "Kue Mendut", 
  "Kue Nopia", 
  "Kue Onde Onde", 
  "Kue Pukis", 
  "Kue Putu Ayu", 
  "Kue Wingko Babat"
];

module.exports = {
  MODEL_PATH,
  LABEL
};
