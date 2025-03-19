const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaboradorController');

// Rotas para Colaborador
router.post('/',  colaboradorController.criarColaborador);
router.get('/',  colaboradorController.obterColaboradores);
router.get('/:id',  colaboradorController.obterColaboradorPorId);
router.put('/:id', colaboradorController.atualizarColaborador);
router.delete('/:id',  colaboradorController.deletarColaborador);

module.exports = router;