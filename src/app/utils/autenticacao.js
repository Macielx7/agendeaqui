// utils/autenticacao.js
export const buscarDadosUsuario = async () => {
  const dados = sessionStorage.getItem('usuario');
  if (!dados) return null;

  const { usuario_id, empresa_id } = JSON.parse(dados);

  const resposta = await fetch(`/api/usuarios/${usuario_id}?empresa=${empresa_id}`);
  if (!resposta.ok) throw new Error('Erro ao buscar dados do usuário');

  return await resposta.json(); // Deve retornar { nome: 'Davi', cnpj: '12.345.678/0001-00' }
};
