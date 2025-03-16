import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { email, senha } = await request.json();

  if (!email || !senha) {
    return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
  }

  try {
    // Conectar ao MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usuariosCollection = db.collection('usuarios');

    // Buscar usuário no banco de dados
    const usuario = await usuariosCollection.findOne({ email });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se a senha é válida
    if (usuario.senha !== senha) {  // Aqui estamos comparando sem criptografia
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // Criar sessão do usuário
    return NextResponse.json({ message: 'Login bem-sucedido', usuario }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao realizar login' }, { status: 500 });
  }
}
