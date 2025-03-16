// controllers/empresaController.js
const Empresa = require('../models/Empresa');

// Criar nova empresa
exports.criarEmpresa = async (req, res) => {
  try {
    const { nome, cnpj } = req.body;
    const novaEmpresa = new Empresa({ nome, cnpj });
    await novaEmpresa.save();
    res.status(201).json({ message: 'Empresa criada com sucesso', empresa: novaEmpresa });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar a empresa', error: err.message });
  }
};

// Obter todas as empresas
exports.getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.status(200).json(empresas);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao buscar as empresas', error: err.message });
  }
};

// Obter uma empresa pelo ID
exports.getEmpresaPorId = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
    res.status(200).json(empresa);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao buscar a empresa', error: err.message });
  }
};

// Atualizar empresa
exports.atualizarEmpresa = async (req, res) => {
  try {
    const { nome, cnpj } = req.body;
    const empresaAtualizada = await Empresa.findByIdAndUpdate(
      req.params.id,
      { nome, cnpj },
      { new: true }
    );
    if (!empresaAtualizada) return res.status(404).json({ message: 'Empresa não encontrada' });
    res.status(200).json({ message: 'Empresa atualizada com sucesso', empresa: empresaAtualizada });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar a empresa', error: err.message });
  }
};

// Deletar empresa
exports.deletarEmpresa = async (req, res) => {
  try {
    const empresaDeletada = await Empresa.findByIdAndDelete(req.params.id);
    if (!empresaDeletada) return res.status(404).json({ message: 'Empresa não encontrada' });
    res.status(200).json({ message: 'Empresa deletada com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar a empresa', error: err.message });
  }
};
