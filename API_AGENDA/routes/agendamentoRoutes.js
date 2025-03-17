const express = require('express');
const agendamentoController = require('../controllers/agendamentoController');
const router = express.Router();

// Criar um novo agendamento
router.post('/', agendamentoController.criarAgendamento);

// Listar todos os agendamentos de uma empresa
router.get('/empresa/:empresaId', agendamentoController.listarAgendamentos);

// Atualizar um agendamento
router.put('/:id', agendamentoController.atualizarAgendamento);

// Deletar um agendamento
router.delete('/:id', agendamentoController.deletarAgendamento);

module.exports = router;