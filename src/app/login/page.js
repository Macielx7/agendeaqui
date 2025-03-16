'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar requisição POST para a API de login
      const res = await fetch('http://localhost:5000/api/login', {  // Altere a URL para a URL da sua API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // Se o login for bem-sucedido, armazene o usuário na sessão e redirecione
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        router.push('/home');
      } else {
        // Se a resposta for um erro
        setErro(data.message || 'Erro ao realizar o login');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor');
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-gradient">
      <Row className="justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card className={`${styles.card} shadow-lg`}>
            <Card.Body>
              <div className="text-center mb-4">
                <h1 className={`fw-bold text-primary ${styles.title}`}>Agenda Facil</h1>
                <p className="text-muted">Faça login para continuar</p>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
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
                    className={styles.input}
                  />
                </Form.Group>

                {erro && <div className="text-danger">{erro}</div>}

                <Button variant="primary" type="submit" className={`${styles.btnLogin} w-100`}>
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
