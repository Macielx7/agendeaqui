'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import MenuNavegacao from '../components/MenuNavegacao'; // Importando o Menu de Navegação
import styles from './home.module.css'; // Importando o arquivo CSS

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

      // Buscar informações da empresa associada ao usuário
      fetch(`http://localhost:5000/api/empresas/${usuario.empresaId}`)
        .then((response) => response.json())
        .then((data) => {
          setEmpresa(data);
          setLoading(false);
        })
        .catch((err) => {
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
      
      <div className={styles.bgGradient}>
        <MenuNavegacao />
        <Container fluid className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card className={`${styles.card} shadow-lg`}>
                <Card.Body>
                  <h2 className={styles.tituloErro}>Erro</h2>
                  <p className="text-center text-danger">{erro}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.bgGradient}>
        <MenuNavegacao />
        <Container fluid className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card className={`${styles.card} shadow-lg`}>
                <Card.Body>
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-3">Carregando...</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.bgGradient}>
      <MenuNavegacao />
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className={`${styles.card} shadow-lg`}>
              <Card.Body>
                <h2 className={styles.titulo}>Bem-vindo, {usuario.nome}!</h2>
                <p className="text-center text-muted mb-4">
                  Você faz parte da empresa <strong>{empresa.nome}</strong> ({empresa.cnpj}).
                </p>
                <div className="d-grid gap-3">
                  <Button variant="primary" className={styles.botao} href="/agendar">
                    Agendar Novo Compromisso
                  </Button>
                  <Button variant="secondary" className={styles.botao} href="/meus-agendamentos">
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