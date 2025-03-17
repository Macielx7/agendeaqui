const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  data: { type: Date, required: true }, // Data do agendamento
  hora: { type: String, required: true }, // Hora do agendamento
  descricao: { type: String, required: true }, // Descrição do compromisso
  nomeCliente: { type: String, required: true }, // Nome do cliente
  cpf: { type: String, required: true }, // CPF do cliente
  telefone: { type: String, required: true }, // Telefone do cliente
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // ID do usuário que criou o agendamento
  empresaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', required: true }, // ID da empresa associada
  createdAt: { type: Date, default: Date.now }, // Data de criação do agendamento
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);