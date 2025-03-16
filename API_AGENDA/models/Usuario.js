const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',  // Referência para o modelo de Empresa
    required: true
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
