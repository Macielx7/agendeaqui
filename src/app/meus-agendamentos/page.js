'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import MenuNavegacao from '../components/MenuNavegacao';
import styles from './meusAgendamentos.module.css';
import ModalEditarAgendamento from '../components/ModalEditarAgendamento';
import ModalConfirmarExclusao from '../components/ModalConfirmarExclusao';

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const [descricaoModal, setDescricaoModal] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);



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

  const handleExcluir = async () => {
    if (!agendamentoSelecionado) return;

    try {
      const response = await fetch(`http://localhost:5000/api/agendamentos/${agendamentoSelecionado._id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        fetchAgendamentos(); // Atualiza a lista após excluir
        setMostrarModalExcluir(false); // Fecha o modal
      } else {
        setErro('Erro ao excluir agendamento.');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor.');
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

      <Row className="mt-5 justify-content-center">
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
                <Table striped bordered hover responsive className="text-center align-middle">

                  <thead className="bg-light">
                    <tr>
                      <th>#</th>
                      <th>Título</th>
                      <th>Descrição</th>
                      <th>Data e Hora</th>
                      <th>Cliente</th>
                      <th className={styles.colunaLarga}>Telefone</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((agendamento, index) => (
                      <tr key={agendamento._id}>
                        <td>{index + 1}</td>
                        <td>{agendamento.titulo}</td>
                        <td>
                          <div className={styles.descricaoLimitada}>{agendamento.descricao}</div>
                          {agendamento.descricao.length > 100 && ( // Opcional: exibe o botão só se for longo
                            <Button
                              variant="link"
                              className="p-0"
                              onClick={() => {
                                setDescricaoModal(agendamento.descricao);
                                setMostrarModal(true);
                              }}
                            >
                              Ver descrição completa
                            </Button>
                          )}
                        </td>
                        <td>{formatarData(agendamento.dataInicio)}</td>
                        <td>{agendamento.nomeCliente}</td>
                        <td>{agendamento.telefoneCliente}</td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                            <Button variant="success" size="sm" title="Confirmar">
                              <FaCheck />
                            </Button>
                            <Button
                              variant="warning"
                              size="sm"
                              title="Editar"
                              onClick={() => {
                                setAgendamentoSelecionado(agendamento);
                                setMostrarModalEditar(true);
                              }}
                            >
                              <FaEdit />
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              title="Excluir"
                              onClick={() => {
                                setAgendamentoSelecionado(agendamento);
                                setMostrarModalExcluir(true);
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
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


      {/* Modal para descrição completa */}
      {mostrarModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Descrição Completa</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>{descricaoModal}</p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      <ModalConfirmarExclusao
        show={mostrarModalExcluir}
        onClose={() => setMostrarModalExcluir(false)}
        onExcluir={handleExcluir}
      />


      <ModalEditarAgendamento
        show={mostrarModalEditar}
        onClose={() => setMostrarModalEditar(false)}
        agendamento={agendamentoSelecionado}
        onSalvar={async (agendamentoEditado) => {
          try {
            // Enviar a requisição PUT para atualizar o agendamento
            const response = await fetch(`http://localhost:5000/api/agendamentos/${agendamentoEditado._id}`, {
              method: 'PUT',
              body: JSON.stringify(agendamentoEditado),
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.status === 200) {
              fetchAgendamentos(); // Atualiza a lista após editar
              setMostrarModalEditar(false); // Fecha o modal
            } else {
              setErro('Erro ao salvar agendamento.');
            }
          } catch (err) {
            setErro('Erro ao se conectar com o servidor.');
          }
        }}
      />


    </div>
  );
}
