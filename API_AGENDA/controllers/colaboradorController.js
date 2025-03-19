const Colaborador = require('../models/Colaborador');

// Criar um novo colaborador (POST)
exports.criarColaborador = async (req, res) => {
  try {
    const { nome, cpf, telefone, email, cargo, dataAdmissao, dataNascimento, endereco, empresaId } = req.body;

    // Verifica se o colaborador já existe pelo CPF ou e-mail
    const colaboradorExistente = await Colaborador.findOne({ $or: [{ cpf }, { email }] });
    if (colaboradorExistente) {
      return res.status(400).json({ message: 'Colaborador já cadastrado com este CPF ou e-mail.' });
    }

    // Cria o novo colaborador
    const novoColaborador = new Colaborador({
      nome,
      cpf,
      telefone,
      email,
      cargo,
      dataAdmissao,
      dataNascimento,
      endereco,
      criadoPor: req.usuarioId, // ID do usuário logado (deve ser passado no middleware de autenticação)
      empresaId, // ID da empresa vinculada
    });

    await novoColaborador.save();

    res.status(201).json({ message: 'Colaborador criado com sucesso!', colaborador: novoColaborador });
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    res.status(500).json({ message: 'Erro ao criar colaborador.' });
  }
};

// Obter todos os colaboradores (GET)
exports.obterColaboradores = async (req, res) => {
  try {
    const colaboradores = await Colaborador.find({ empresaId: req.empresaId }); // Filtra por empresa
    res.status(200).json(colaboradores);
  } catch (error) {
    console.error('Erro ao obter colaboradores:', error);
    res.status(500).json({ message: 'Erro ao obter colaboradores.' });
  }
};

// Obter um colaborador por ID (GET)
exports.obterColaboradorPorId = async (req, res) => {
  try {
    const colaborador = await Colaborador.findById(req.params.id);
    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador não encontrado.' });
    }
    res.status(200).json(colaborador);
  } catch (error) {
    console.error('Erro ao obter colaborador:', error);
    res.status(500).json({ message: 'Erro ao obter colaborador.' });
  }
};

// Atualizar um colaborador (PUT)
exports.atualizarColaborador = async (req, res) => {
  try {
    const { nome, cpf, telefone, email, cargo, dataAdmissao, dataNascimento, endereco } = req.body;

    const colaborador = await Colaborador.findById(req.params.id);
    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador não encontrado.' });
    }

    // Atualiza os campos
    colaborador.nome = nome || colaborador.nome;
    colaborador.cpf = cpf || colaborador.cpf;
    colaborador.telefone = telefone || colaborador.telefone;
    colaborador.email = email || colaborador.email;
    colaborador.cargo = cargo || colaborador.cargo;
    colaborador.dataAdmissao = dataAdmissao || colaborador.dataAdmissao;
    colaborador.dataNascimento = dataNascimento || colaborador.dataNascimento;
    colaborador.endereco = endereco || colaborador.endereco;

    await colaborador.save();

    res.status(200).json({ message: 'Colaborador atualizado com sucesso!', colaborador });
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    res.status(500).json({ message: 'Erro ao atualizar colaborador.' });
  }
};

// Deletar um colaborador (DELETE)
exports.deletarColaborador = async (req, res) => {
  try {
    const colaborador = await Colaborador.findByIdAndDelete(req.params.id);
    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador não encontrado.' });
    }
    res.status(200).json({ message: 'Colaborador deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar colaborador:', error);
    res.status(500).json({ message: 'Erro ao deletar colaborador.' });
  }
};