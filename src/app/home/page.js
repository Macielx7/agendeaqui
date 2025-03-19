'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import MenuNavegacao from '../components/MenuNavegacao';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TelaPrincipal() {
  const [usuario, setUsuario] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioLogado = sessionStorage.getItem('usuario');
    if (usuarioLogado) {
      const usuario = JSON.parse(usuarioLogado);
      setUsuario(usuario);
      fetch(`http://localhost:5000/api/empresas/${usuario.empresaId}`)
        .then((response) => response.json())
        .then((data) => {
          setEmpresa(data);
          setLoading(false);
        })
        .catch(() => {
          setErro('Erro ao buscar os dados da empresa');
          setLoading(false);
        });
    } else {
      setErro('Usuário não encontrado');
      setLoading(false);
    }
  }, []);

  if (erro) {
    return (
      <div className="bg-light vh-100">
        <MenuNavegacao />
        <Container className="d-flex justify-content-center align-items-center h-100">
          <Row className="w-100 justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <Alert variant="danger" className="text-center">
                <h4>Erro</h4>
                <p>{erro}</p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-light vh-100">
        <MenuNavegacao />
        <Container className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <MenuNavegacao />
      <Container className="mt-5 d-flex justify-content-center align-items-center h-100">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="shadow-lg p-4 rounded-3">
              <Card.Body className="text-center">
                <h2 className="fw-bold">Bem-vindo, {usuario.nome}!</h2>
                <p className="text-muted">
                  Você faz parte da empresa <strong>{empresa.nome}</strong> ({empresa.cnpj}).
                </p>
                <div className="d-grid gap-3">
                  <Button variant="primary" href="/agendar">
                    Agendar Novo Compromisso
                  </Button>
                  <Button variant="secondary" href="/meus-agendamentos">
                    Meus Agendamentos
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}