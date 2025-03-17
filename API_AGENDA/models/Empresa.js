// models/Empresa.js
const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  // Informações básicas
  razaoSocial: { type: String, required: true }, // Razão social da empresa
  nomeFantasia: { type: String, required: true }, // Nome fantasia da empresa
  cnpj: { type: String, required: true, unique: true }, // CNPJ da empresa (único)
  inscricaoEstadual: { type: String }, // Inscrição estadual (opcional)
  inscricaoMunicipal: { type: String }, // Inscrição municipal (opcional)

  // Endereço
  endereco: {
    cep: { type: String, required: true }, // CEP
    logradouro: { type: String, required: true }, // Rua/Avenida
    numero: { type: String, required: true }, // Número
    complemento: { type: String }, // Complemento (opcional)
    bairro: { type: String, required: true }, // Bairro
    cidade: { type: String, required: true }, // Cidade
    estado: { type: String, required: true }, // Estado (UF)
    pais: { type: String, default: 'Brasil' }, // País (padrão: Brasil)
  },

  // Contato
  telefone: { type: String, required: true }, // Telefone principal
  email: { type: String, required: true }, // E-mail de contato
  site: { type: String }, // Site da empresa (opcional)

  // Informações adicionais
  atividadePrincipal: { type: String }, // Atividade principal da empresa
  dataFundacao: { type: Date }, // Data de fundação da empresa
  situacaoCadastral: { type: String, default: 'Ativa' }, // Situação cadastral (Ativa, Inativa, Suspensa, etc.)
  regimeTributario: { type: String }, // Regime tributário (Simples Nacional, Lucro Presumido, etc.)

  // Data de criação e atualização
  dataCriacao: { type: Date, default: Date.now }, // Data de criação do registro
  dataAtualizacao: { type: Date, default: Date.now }, // Data da última atualização
});

// Atualiza a data de atualização antes de salvar
empresaSchema.pre('save', function (next) {
  this.dataAtualizacao = new Date();
  next();
});

module.exports = mongoose.model('Empresa', empresaSchema);