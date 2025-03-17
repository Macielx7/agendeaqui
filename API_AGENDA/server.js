// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const usuarioRoutes = require('./routes/usuarioRoutes');
const empresaRoutes = require('./routes/empresaRoutes'); // Importando as rotas da empresa
const agendamentoRoutes = require('./routes/agendamentoRoutes'); // Importando as rotas da empresa
const usuarioController = require('./controllers/usuarioController');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Usando CORS para permitir requisições
app.use(cors());
app.use(express.json()); // Para fazer parse de JSON no corpo da requisição

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro de conexão com MongoDB:', err));

// Usar as rotas de usuário
app.use('/api/usuarios', usuarioRoutes);

app.post('/api/login', usuarioController.loginUsuario);  // Rota de login

// rotas da empresa
app.use('/api/empresas', empresaRoutes); 

// Rotas de agendamento
app.use('/api/agendamentos', agendamentoRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
