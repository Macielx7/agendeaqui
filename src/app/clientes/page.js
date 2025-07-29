'use client'
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import apiAGENDAFLOW from 'src/services/apiAGENDAFLOW';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuNavegacao from '../components/MenuNavegacao';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dados = sessionStorage.getItem('usuario');
      if (dados) {
        setUsuario(JSON.parse(dados));
      }
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      carregarClientes();
    }
  }, [usuario]);



  const carregarClientes = async () => {
    try {
      const resposta = await apiAGENDAFLOW.get('/clientes', { params: { empresa_id: usuario.empresa_id } });
      setClientes(resposta.data);
    } catch (error) {
      setErro('Erro ao carregar clientes');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setModoEdicao(true);
      setClienteEditando(cliente);
      setForm({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone });
    } else {
      setModoEdicao(false);
      setClienteEditando(null);
      setForm({ nome: '', email: '', telefone: '' });
    }
    setMostrarModal(true);
  };

  const salvarCliente = async (e) => {
    e.preventDefault();
    try {
      const dados = { ...form, empresa_id: usuario.empresa_id };
      if (modoEdicao && clienteEditando) {
        await apiAGENDAFLOW.put(`/clientes/${clienteEditando.id}`, dados);
        toast.success('Cliente atualizado');
      } else {
        await apiAGENDAFLOW.post('/clientes', dados);
        toast.success('Cliente criado');
      }
      setMostrarModal(false);
      carregarClientes();
    } catch (error) {
      toast.error('Erro ao salvar cliente');
    }
  };

  const deletarCliente = async (id) => {
    if (confirm('Deseja excluir este cliente?')) {
      try {
        await apiAGENDAFLOW.delete(`/clientes/${id}`);
        toast.success('Cliente excluído');
        carregarClientes();
      } catch (error) {
        toast.error('Erro ao excluir cliente');
      }
    }
  };

  return (
    <div className='bg-light' style={{ minHeight: '100vh' }}>
      <MenuNavegacao collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className='bg-dark'
        style={{
          marginLeft: collapsed ? '60px' : '170px', // Ajusta dinamicamente
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 80px)',
          boxSizing: 'border-box',
        }}
      >
        <div className="p-4 bg-light" style={{ minHeight: '100vh' }}>
          <h2 className="mb-4">Gerenciamento de Clientes</h2>

          {carregando ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : erro ? (
            <Alert variant="danger">{erro}</Alert>
          ) : (
            <>
              <Button variant="primary" className="mb-3" onClick={() => abrirModal()}>
                <FaPlus className="me-2" /> Novo Cliente
              </Button>
              <Table bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th style={{ width: 120 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nome}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefone}</td>
                      <td>
                        <Button size="sm" variant="warning" className="me-2" onClick={() => abrirModal(cliente)}>
                          <FaEdit />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => deletarCliente(cliente.id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{modoEdicao ? 'Editar Cliente' : 'Novo Cliente'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={salvarCliente}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button type="submit" variant="success">
                    {modoEdicao ? 'Salvar Alterações' : 'Criar Cliente'}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          <ToastContainer position="top-right" autoClose={4000} theme="colored" />
        </div>
      </div>
    </div>
  );
}