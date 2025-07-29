'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, ListGroup, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import MenuNavegacao from '../components/MenuNavegacao';
import 'bootstrap/dist/css/bootstrap.min.css';
import CalendarioAgendamentos from '../components/CalendarioAgendamento';
import apiAGENDAFLOW from '../../services/apiAGENDAFLOW';

export default function Dashboard() {
  const [carregando, setCarregando] = useState(true);
  const [dadosDashboard, setDadosDashboard] = useState(null);
  const [erro, setErro] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cnpjEmpresa, setCnpjEmpresa] = useState('');

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
      window.location.href = '/login';
    } else {
      const dadosUsuario = JSON.parse(usuario);
      setNomeUsuario(dadosUsuario.nome);
      setCnpjEmpresa(dadosUsuario.cnpj);

      const carregarDados = async () => {
        try {
          const resposta = await apiAGENDAFLOW.get('/dashboard', {
            params: { empresa_id: dadosUsuario.empresa_id },
            headers: {
              Authorization: `Bearer ${dadosUsuario.token}`
            }
          });

          setDadosDashboard(resposta.data);
        } catch (erro) {
          setErro('Erro ao carregar dados do dashboard');
          console.error('Erro no dashboard:', erro);
        } finally {
          setCarregando(false);
        }
      };

      carregarDados();
    }
  }, []);

  const formatarVariacao = (valor) => {
    return `${valor > 0 ? '+' : ''}${valor}%`;
  };

  const getCorVariacao = (valor) => {
    return valor >= 0 ? 'success' : 'danger';
  };

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (erro) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{erro}</Alert>
      </Container>
    );
  }

  const metricas = dadosDashboard?.metricas || {};

  return (
    <div className='bg-light' style={{ minHeight: '100vh' }}>
      <MenuNavegacao collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className='bg-dark'
        style={{
          marginLeft: collapsed ? '60px' : '170px',
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 80px)',
          boxSizing: 'border-box',
        }}
      >
        <Row className="mb-4">
          <Col>
            <h2 className='text-white'>Bem-vindo(a), {nomeUsuario} - <span>{cnpjEmpresa}</span></h2>
            <p className="text-white">Visão geral dos agendamentos</p>
          </Col>
        </Row>

        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Agendamentos Hoje</Card.Title>
                <h1 className="display-5">{metricas.agendamentosHoje}</h1>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Badge bg={getCorVariacao(metricas.variacaoAgendamentos)}>
                    {formatarVariacao(metricas.variacaoAgendamentos)}
                  </Badge>
                  <small className={`fw-semibold text-${getCorVariacao(metricas.variacaoAgendamentos)}`}>
                    em relação à semana passada
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Clientes Ativos</Card.Title>
                <h1 className="display-5">{metricas.clientesAtivos}</h1>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Badge bg={getCorVariacao(metricas.variacaoClientes)}>
                    {formatarVariacao(metricas.variacaoClientes)}
                  </Badge>
                  <small className={`fw-semibold text-${getCorVariacao(metricas.variacaoClientes)}`}>
                    em relação à semana passada
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Atividades em Andamento</Card.Title>
                <h1 className="display-5">{metricas.atividadesAndamento}</h1>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Badge bg={getCorVariacao(metricas.variacaoAtividades)}>
                    {formatarVariacao(metricas.variacaoAtividades)}
                  </Badge>
                  <small className={`fw-semibold text-${getCorVariacao(metricas.variacaoAtividades)}`}>
                    em relação à semana passada
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <CalendarioAgendamentos />
      </div>
    </div>
  );
}