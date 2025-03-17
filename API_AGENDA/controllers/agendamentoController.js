const Agendamento = require('../models/Agendamento');

// Criar um novo agendamento
exports.criarAgendamento = async (req, res) => {
  try {
    const { data, hora, descricao, nomeCliente, cpf, telefone, usuarioId, empresaId } = req.body;

    // Validar campos obrigatórios
    if (!data || !hora || !descricao || !nomeCliente || !cpf || !telefone || !usuarioId || !empresaId) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Criar o agendamento
    const novoAgendamento = new Agendamento({
      data,
      hora,
      descricao,
      nomeCliente,
      cpf,
      telefone,
      usuarioId,
      empresaId,
    });

    await novoAgendamento.save();
    res.status(201).json({ message: 'Agendamento criado com sucesso!', agendamento: novoAgendamento });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar o agendamento.', error: err.message });
  }
};

// Listar todos os agendamentos de uma empresa
exports.listarAgendamentos = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const agendamentos = await Agendamento.find({ empresaId }).populate('usuarioId', 'nome email'); // Popula dados do usuário
    res.status(200).json(agendamentos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos.', error: err.message });
  }
};

// Atualizar um agendamento
exports.atualizarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, hora, descricao, nomeCliente, cpf, telefone } = req.body;

    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
      id,
      { data, hora, descricao, nomeCliente, cpf, telefone },
      { new: true } // Retorna o documento atualizado
    );

    if (!agendamentoAtualizado) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.status(200).json({ message: 'Agendamento atualizado com sucesso!', agendamento: agendamentoAtualizado });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar o agendamento.', error: err.message });
  }
};

// Deletar um agendamento
exports.deletarAgendamento = async (req, res) => {
  try {
    const { id } = req.params;

    const agendamentoDeletado = await Agendamento.findByIdAndDelete(id);

    if (!agendamentoDeletado) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.status(200).json({ message: 'Agendamento deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar o agendamento.', error: err.message });
  }
};