'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import apiAGENDAFLOW from '../../services/apiAGENDAFLOW';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const usuarioLogado = sessionStorage.getItem('usuario');
    if (usuarioLogado) {
      setCarregando(true); // Exibe loading enquanto redireciona
      router.push('/dashboard');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const res = await apiAGENDAFLOW.post('/usuarios/login', { email, senha });

      if (res.status === 200) {
        const { usuario, empresa } = res.data;

        const dadosSessao = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          empresa_id: empresa?.id || null,
          nome_empresa: empresa?.nome || '',
          cnpj: empresa?.cnpj || '',
        };

        sessionStorage.setItem('usuario', JSON.stringify(dadosSessao));
        router.push('/dashboard');
      } else {
        setErro('Email ou senha inválidos');
        setCarregando(false);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErro(err.response.data.message);
      } else {
        setErro('Erro ao se conectar com o servidor');
      }
      setCarregando(false);
    }
  };

  // 🔄 Tela de carregamento total (bloqueia tudo)
  if (carregando) {
    return (
      <Container
        fluid
        className="d-flex vh-100 justify-content-center align-items-center bg-dark"
      >
        <div className="text-center text-warning">
          <Spinner animation="border" variant="warning" className="mb-3" />
          <h5>Aguarde, redirecionando...</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: '#212529' }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-lg rounded-4" style={{ borderColor: '#ffc107' }}>
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: '#ffc107' }}>
                  Agenda Flow
                </h2>
                <p className="text-warning">Faça login para continuar</p>
              </div>

              {erro && (
                <Alert variant="warning" className="text-center">
                  {erro}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label style={{ color: '#ffc107' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      backgroundColor: '#343a40',
                      color: '#ffc107',
                      borderColor: '#ffc107',
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-4">
                  <Form.Label style={{ color: '#ffc107' }}>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    style={{
                      backgroundColor: '#343a40',
                      color: '#ffc107',
                      borderColor: '#ffc107',
                    }}
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  type="submit"
                  className="w-100 fw-bold"
                  style={{ boxShadow: '0 4px 15px rgba(255, 193, 7, 0.6)' }}
                >
                  Entrar
                </Button>
              </Form>
            </Card.Body>  
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
