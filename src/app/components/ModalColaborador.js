'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import apiAGENDAFLOW from '../../services/apiAGENDAFLOW';

export default function ModalColaborador({ mostrar, aoFechar, aoSalvar, colaboradorParaEditar }) {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (colaboradorParaEditar) {
      setNome(colaboradorParaEditar.nome || '');
      setCargo(colaboradorParaEditar.cargo || '');
      setCpf(colaboradorParaEditar.cpf || '');
      setEmail(colaboradorParaEditar.email || '');
      setTelefone(colaboradorParaEditar.telefone || '');
      setNascimento(colaboradorParaEditar.nascimento || '');
      setEndereco(colaboradorParaEditar.endereco || '');
      // Corrigido aqui - verifica se status === 'A' para definir ativo
      setAtivo(colaboradorParaEditar.status === 'A');
      setErro('');
    } else {
      limparFormulario();
    }
  }, [colaboradorParaEditar, mostrar]);

  const limparFormulario = () => {
    setNome('');
    setCargo('');
    setCpf('');
    setEmail('');
    setTelefone('');
    setNascimento('');
    setEndereco('');
    setAtivo(true);
    setErro('');
  };

  const handleSalvar = async () => {
    if (!nome || !cargo || !cpf || !email) {
      setErro('Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      const empresaId = usuario?.empresa_id;

      if (!empresaId) {
        setErro('Erro: empresa não encontrada no sessionStorage');
        setLoading(false);
        return;
      }

      // Formatando os dados antes de enviar
      const dadosColaborador = {
        nome: nome.trim(),
        cargo: cargo.trim(),
        cpf: cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
        email: email.trim(),
        telefone: telefone.replace(/\D/g, ''), // Remove caracteres não numéricos
        nascimento: nascimento || null, // Envia null se vazio
        endereco: endereco.trim() || null,
        status: ativo ? 'A' : 'I', // Converte para 'A' (ativo) ou 'I' (inativo)
        empresa_id: empresaId
      };

      let resposta;

      if (colaboradorParaEditar) {
        resposta = await apiAGENDAFLOW.put(`/colaboradores/${colaboradorParaEditar.id}`, dadosColaborador);
        aoSalvar({
          ...colaboradorParaEditar,
          ...resposta.data,
          ...dadosColaborador // Garante que todos os campos atualizados serão enviados
        });
      } else {
        resposta = await apiAGENDAFLOW.post('/colaboradores', dadosColaborador);
        aoSalvar(resposta.data);
      }

      limparFormulario();
      aoFechar();
    } catch (error) {
      console.error('Erro ao salvar colaborador:', error);
      setErro(error.response?.data?.message || 'Falha ao salvar colaborador. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={mostrar} onHide={aoFechar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{colaboradorParaEditar ? 'Editar Colaborador' : 'Novo Colaborador'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {erro && <div className="alert alert-danger">{erro}</div>}

          <Form.Group className="mb-3">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cargo *</Form.Label>
            <Form.Control
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Cargo do colaborador"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>CPF *</Form.Label>
                <Form.Control
                  as={IMaskInput}
                  mask="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>E-mail *</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              as={IMaskInput}
              mask="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Digite o endereço completo"
            />
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={ativo ? 'A' : 'I'}
              onChange={(e) => setAtivo(e.target.value === 'A')}
            >
              <option value="A">Ativo</option>
              <option value="I">Inativo</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={aoFechar} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSalvar} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Salvar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}