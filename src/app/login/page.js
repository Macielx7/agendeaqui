'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import styles from './login.module.css'; // Importando o CSS atualizado
import Image from 'next/image'; // Importe o componente Image do Next.js

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Enviar requisição POST para a API de login
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
  
      const data = await res.json();
      console.log('Resposta do backend:', data); // Adicione este log
  
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
    <Container fluid className={styles.container}>
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card className={styles.card}>
            <Card.Body className={styles.cardBody}>
              <div className="text-center mb-4">
                {/* Adicionando a logo */}
                <div className={styles.logoContainer}>
                  <Image
                    src="/logo.png" // Caminho relativo da imagem
                    alt="Logo da Empresa"
                    width={210} // Largura da logo
                    height={200} // Altura da logo
                    className={styles.logo}
                  />
                </div>
                <h1 className={styles.title}>Agenda Facil</h1>
                <p className={styles.textMuted}>Faça login para continuar</p>
              </div>
              <Form onSubmit={handleSubmit}>
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

                {erro && <div className={styles.errorMessage}>{erro}</div>}

                <Button variant="primary" type="submit" className={styles.btnLogin}>
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