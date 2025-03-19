'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa'; // Importando ícones
import styles from './meusAgendamentos.module.css'; // Importando o CSS
import MenuNavegacao from '../components/MenuNavegacao';

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();

  // Função para buscar os agendamentos
  const fetchAgendamentos = async () => {
    try {
      // Recuperar o usuário logado do sessionStorage
      const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario'));
      if (!usuarioLogado || !usuarioLogado._id || !usuarioLogado.empresaId) {
        setErro('Usuário não autenticado. Faça login novamente.');
        router.push('/login');
        return;
      }

      // Buscar os agendamentos da empresa do usuário logado
      const response = await fetch(
        `http://localhost:5000/api/agendamentos?empresaId=${usuarioLogado.empresaId}`
      );

      const data = await response.json();

      if (response.status === 200) {
        setAgendamentos(data);
      } else {
        setErro(data.message || 'Erro ao buscar agendamentos.');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Função para editar um agendamento
  const handleEditar = (id) => {
    router.push(`/editar-agendamento/${id}`);
  };

  // Função para excluir um agendamento
  const handleExcluir = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/agendamentos/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 200) {
        // Atualizar a lista de agendamentos após a exclusão
        fetchAgendamentos();
      } else {
        const data = await response.json();
        setErro(data.message || 'Erro ao excluir agendamento.');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor.');
    }
  };

  // Função para confirmar um agendamento
  const handleConfirmar = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/agendamentos/${id}/confirmar`, {
        method: 'PUT',
      });

      if (response.status === 200) {
        // Atualizar a lista de agendamentos após a confirmação
        fetchAgendamentos();
      } else {
        const data = await response.json();
        setErro(data.message || 'Erro ao confirmar agendamento.');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor.');
    }
  };

  // Buscar os agendamentos ao carregar a página
  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // Função para formatar a data
  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.bgGradient}>
      <MenuNavegacao />
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className={`${styles.card} shadow-lg`}>
              <Card.Body>
                <h2 className={styles.titulo}>Meus Agendamentos</h2>
                {erro && <Alert variant="danger">{erro}</Alert>}

                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                  </div>
                ) : agendamentos.length === 0 ? (
                  <Alert variant="info">Nenhum agendamento encontrado.</Alert>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Data e Hora</th>
                        <th>Cliente</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agendamentos.map((agendamento, index) => (
                        <tr key={agendamento._id}>
                          <td>{index + 1}</td>
                          <td>{agendamento.titulo}</td>
                          <td>{agendamento.descricao}</td>
                          <td>{formatarData(agendamento.dataInicio)}</td>
                          <td>{agendamento.nomeCliente}</td>
                          <td>
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleConfirmar(agendamento._id)}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditar(agendamento._id)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleExcluir(agendamento._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}