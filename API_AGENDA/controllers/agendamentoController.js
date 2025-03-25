// controllers/agendamentoController.js
const Agendamento = require('../models/Agendamento');

// Criar um novo agendamento
exports.createAgendamento = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      nomeCliente,
      cpfCliente,
      telefoneCliente,
      emailCliente,
      usuarioId,
      empresaId
    } = req.body;

    const agendamento = new Agendamento({
      titulo,
      descricao,
      dataInicio,
      dataFim,
      nomeCliente,
      cpfCliente,
      telefoneCliente,
      emailCliente,
      usuarioId,
      empresaId
    });

    await agendamento.save();
    res.status(201).json(agendamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Obter todos os agendamentos
exports.getAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().populate('usuarioId empresaId');
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obter um agendamento por ID
exports.getAgendamentoById = async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id).populate('usuarioId empresaId');
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.status(200).json(agendamento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualizar um agendamento
exports.updateAgendamento = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      nomeCliente,
      cpfCliente,
      telefoneCliente,
      emailCliente,
      usuarioId,
      empresaId
    } = req.body;

    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        descricao,
        dataInicio,
        dataFim,
        nomeCliente,
        cpfCliente,
        telefoneCliente,
        emailCliente,
        usuarioId,
        empresaId,
        dataAtualizacao: new Date()
      },
      { new: true }
    );

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.status(200).json(agendamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Deletar um agendamento
exports.deleteAgendamento = async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndDelete(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.status(200).json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};