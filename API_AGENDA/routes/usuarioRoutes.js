// routes/usuarioRoutes.js
const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const router = express.Router();

// Rota POST para criar usuário
router.post('/', usuarioController.criarUsuario);

// Rota GET para listar todos os usuários
router.get('/', usuarioController.getUsuarios);

// Rota GET para obter um usuário específico
router.get('/:id', usuarioController.getUsuarioPorId);

// Rota PUT para atualizar um usuário
router.put('/:id', usuarioController.atualizarUsuario);

// Rota DELETE para deletar um usuário
router.delete('/:id', usuarioController.deletarUsuario);

module.exports = router;
