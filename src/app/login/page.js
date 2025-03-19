'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (res.status === 200) {
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        router.push('/home');
      } else {
        setErro(data.message || 'Erro ao realizar o login');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor');
    }
  };

  return (
    <Container fluid className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-lg p-4 rounded-3">
            <Card.Body>
              <div className="text-center mb-4">
                <Image src="/logo.png" alt="Logo" width={150} height={150} className="mb-3" />
                <h2 className="fw-bold">Agenda Fácil</h2>
                <p className="text-muted">Faça login para continuar</p>
              </div>
              {erro && <Alert variant="danger" className="text-center">{erro}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
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