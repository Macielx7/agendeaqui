'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import MenuNavegacao from '../components/MenuNavegacao'; // Importando o Menu de Navegação
import styles from './agendar.module.css'; // Importando o arquivo CSS

export default function Agendar() {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!data || !hora || !descricao || !nomeCliente || !cpf || !telefone) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario'));

      // Enviar requisição POST para a API de agendamento
      const response = await fetch('http://localhost:5000/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          hora,
          descricao,
          nomeCliente,
          cpf,
          telefone,
          usuarioId: usuarioLogado.id,
          empresaId: usuarioLogado.empresaId,
        }),
      });

      const dataResponse = await response.json();

      if (response.status === 201) {
        setSucesso('Agendamento realizado com sucesso!');
        setData('');
        setHora('');
        setDescricao('');
        setNomeCliente('');
        setCpf('');
        setTelefone('');
        setTimeout(() => {
          router.push('/meus-agendamentos'); // Redirecionar após o sucesso
        }, 2000);
      } else {
        setErro(dataResponse.message || 'Erro ao realizar o agendamento.');
      }
    } catch (err) {
      setErro('Erro ao se conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bgGradient}>
      <MenuNavegacao />
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className={`${styles.card} shadow-lg`}>
              <Card.Body>
                <h2 className={styles.titulo}>Agendar Compromisso</h2>
                {erro && <Alert variant="danger">{erro}</Alert>}
                {sucesso && <Alert variant="success">{sucesso}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formData" className="mb-3">
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                      type="date"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group controlId="formHora" className="mb-3">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                      type="time"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group controlId="formNomeCliente" className="mb-3">
                    <Form.Label>Nome do Cliente</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome do cliente"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group controlId="formCpf" className="mb-3">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o CPF do cliente"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group controlId="formTelefone" className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o telefone do cliente"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </Form.Group>

                  <Form.Group controlId="formDescricao" className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Descreva o compromisso"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      className={styles.botao}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Agendando...</span>
                        </>
                      ) : (
                        'Agendar'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}