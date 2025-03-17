'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import styles from './register.module.css'; // Importando o CSS atualizado

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    try {
      // Enviar requisição POST para a API de registro
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (res.status === 201) {
        // Se o registro for bem-sucedido, redirecione para a página de login
        router.push('/login');
      } else {
        // Se a resposta for um erro
        setErro(data.message || 'Erro ao realizar o registro');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor');
    }
  };

  return (
    <Container fluid className={styles.container}>
      <Row className="justify-content-center">
        <Col xs={12} >
          <Card className={styles.card}>
            <Card.Body className={styles.cardBody}>
              <div className="text-center mb-4">
                <h1 className={styles.title}>Agenda Facil</h1>
                <p className={styles.textMuted}>Crie sua conta para continuar</p>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName" className="mb-3">
                  <Form.Label className={styles.label}>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className={styles.input}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label className={styles.label}>Email</Form.Label>
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
                  <Form.Label className={styles.label}>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className={styles.input}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
                  <Form.Label className={styles.label}>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    className={styles.input}
                  />
                </Form.Group>

                {erro && <div className={styles.errorMessage}>{erro}</div>}

                <Button variant="primary" type="submit" className={styles.btnRegister}>
                  Registrar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}