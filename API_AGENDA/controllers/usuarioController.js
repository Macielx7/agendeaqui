// controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');  // Adiciona esta linha
// Criar novo usuário
exports.criarUsuario = async (req, res) => {
    try {
      const { nome, email, senha, empresaId } = req.body;  // Agora estamos recebendo empresaId
  
      // Verifica se o ID da empresa foi fornecido
      if (!empresaId) {
        return res.status(400).json({ message: 'O campo empresaId é obrigatório.' });
      }
  
      // Verifica se a empresa existe
      const empresaExistente = await Empresa.findById(empresaId);
      if (!empresaExistente) {
        return res.status(404).json({ message: 'Empresa não encontrada.' });
      }
  
      // Cria o novo usuário associando o empresaId
      const novoUsuario = new Usuario({
        nome,
        email,
        senha,
        empresaId  // Aqui associamos o ID da empresa ao usuário
      });
  
      await novoUsuario.save();
      res.status(201).json({ message: 'Usuário criado com sucesso', usuario: novoUsuario });
    } catch (err) {
      res.status(400).json({ message: 'Erro ao criar o usuário', error: err.message });
    }
  };

// Obter todos os usuários
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao buscar os usuários', error: err.message });
  }
};

// Obter um usuário pelo ID
exports.getUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.status(200).json(usuario);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao buscar o usuário', error: err.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nome, email, senha },
      { new: true }
    );
    if (!usuarioAtualizado) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.status(200).json({ message: 'Usuário atualizado com sucesso', usuario: usuarioAtualizado });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar o usuário', error: err.message });
  }
};

// Deletar usuário
exports.deletarUsuario = async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar o usuário', error: err.message });
  }
};

// Função de login
exports.loginUsuario = async (req, res) => {
    try {
      const { email, senha } = req.body;
  
      // Verificar se o usuário existe
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }
  
      // Verificar se a senha está correta
      if (usuario.senha !== senha) {
        return res.status(400).json({ message: 'Senha incorreta' });
      }
  
      // Caso o login seja bem-sucedido
      res.status(200).json({ message: 'Login bem-sucedido', usuario });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao realizar login', error: err.message });
    }
  };
