// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Importando as rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const colaboraradorRoutes = require('./routes/colaboradorRoutes');

// Importando o controller de usuário para a rota de login
const usuarioController = require('./controllers/usuarioController');

// Carregando variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
// Permitir requisições de qualquer origem (ou especifique a origem do front-end)
app.use(cors({
  origin: 'http://localhost:3000', // Substitua pela URL do seu front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Fazer parse de JSON no corpo da requisição

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro de conexão com MongoDB:', err));

// Rotas
app.use('/api/usuarios', usuarioRoutes); // Rotas de usuário
app.use('/api/empresas', empresaRoutes); // Rotas de empresa
app.use('/api/agendamentos', agendamentoRoutes); // Rotas de agendamento
app.use('/api/colaboradores', colaboraradorRoutes); // rotas de colaborador

// Rota de login
app.post('/api/login', usuarioController.loginUsuario);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});