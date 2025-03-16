import { MongoClient } from 'mongodb';
import { conectarMongo } from './mongodb'; // Conectando com o MongoDB

// Função para inicializar o banco de dados
export async function inicializarBanco() {
  try {
    const db = await conectarMongo();
    const usuariosCollection = db.collection('usuarios');
    const agendamentosCollection = db.collection('agendamentos');

    // Verifica se a coleção 'usuarios' já existe
    const usuariosCount = await usuariosCollection.countDocuments();
    if (usuariosCount === 0) {
      // Inserir um usuário inicial para testes, se necessário
      await usuariosCollection.insertOne({
        nome: 'Admin',
        email: 'admin@agenda.com',
        senha: 'admin123',
      });
      console.log('Usuário admin inicializado!');
    }

    // Verifica se a coleção 'agendamentos' já existe
    const agendamentosCount = await agendamentosCollection.countDocuments();
    if (agendamentosCount === 0) {
      // Inserir um agendamento inicial
      await agendamentosCollection.insertOne({
        usuarioId: 'admin@agenda.com',
        data: new Date(),
        descricao: 'Primeiro agendamento',
      });
      console.log('Agendamento inicializado!');
    }
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}
