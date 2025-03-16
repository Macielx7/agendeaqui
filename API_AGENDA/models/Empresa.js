// models/Empresa.js
const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  dataCriacao: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Empresa', empresaSchema);
