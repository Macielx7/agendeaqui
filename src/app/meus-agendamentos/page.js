'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import MenuNavegacao from '../components/MenuNavegacao';
import styles from './meusAgendamentos.module.css';

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();

  const fetchAgendamentos = async () => {
    try {
      const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario'));
      if (!usuarioLogado || !usuarioLogado._id || !usuarioLogado.empresaId) {
        setErro('Usuário não autenticado. Faça login novamente.');
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/agendamentos?empresaId=${usuarioLogado.empresaId}`);
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

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const formatarData = (dataISO) => {
    return new Date(dataISO).toLocaleString('pt-BR', {
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
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white text-center py-3">
                <h3 className="mb-0">Meus Agendamentos</h3>
              </Card.Header>
              <Card.Body>
                {erro && <Alert variant="danger">{erro}</Alert>}

                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" />
                    <p className="mt-2">Carregando...</p>
                  </div>
                ) : agendamentos.length === 0 ? (
                  <Alert variant="info" className="text-center">Nenhum agendamento encontrado.</Alert>
                ) : (
                  <Table striped bordered hover responsive className="text-center">
                    <thead className="bg-light">
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
                            <Button variant="success" size="sm" className="me-1" title="Confirmar">
                              <FaCheck />
                            </Button>
                            <Button variant="warning" size="sm" className="me-1" title="Editar">
                              <FaEdit />
                            </Button>
                            <Button variant="danger" size="sm" title="Excluir">
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
