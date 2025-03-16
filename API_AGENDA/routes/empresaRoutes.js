// routes/empresaRoutes.js
const express = require('express');
const empresaController = require('../controllers/empresaController');
const router = express.Router();

// Rota POST para criar empresa
router.post('/', empresaController.criarEmpresa);

// Rota GET para listar todas as empresas
router.get('/', empresaController.getEmpresas);

// Rota GET para obter uma empresa específica
router.get('/:id', empresaController.getEmpresaPorId);

// Rota PUT para atualizar uma empresa
router.put('/:id', empresaController.atualizarEmpresa);

// Rota DELETE para deletar uma empresa
router.delete('/:id', empresaController.deletarEmpresa);

module.exports = router;
