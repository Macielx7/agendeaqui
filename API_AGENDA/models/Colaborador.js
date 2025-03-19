const mongoose = require('mongoose');

const colaboradorSchema = new mongoose.Schema({
  // Informações básicas do colaborador
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cargo: {
    type: String,
    required: true,
  },
  dataAdmissao: {
    type: Date,
    required: true,
  },
  dataNascimento: {
    type: Date,
    required: true,
  },

  // Endereço do colaborador
  endereco: {
    cep: { type: String, required: true },
    logradouro: { type: String, required: true },
    numero: { type: String, required: true },
    complemento: { type: String },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    pais: { type: String, default: 'Brasil' },
  },

  // Vínculo com o usuário que criou o colaborador
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Referência ao modelo de Usuario
    required: true,
  },

  // Vínculo com a empresa
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa', // Referência ao modelo de Empresa
    required: true,
  },

  // Data de criação e atualização
  dataCriacao: { type: Date, default: Date.now },
  dataAtualizacao: { type: Date, default: Date.now },
});

// Atualiza a data de atualização antes de salvar
colaboradorSchema.pre('save', function (next) {
  this.dataAtualizacao = new Date();
  next();
});

module.exports = mongoose.model('Colaborador', colaboradorSchema);