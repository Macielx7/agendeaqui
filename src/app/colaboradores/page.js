'use client'
import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuNavegacao from '../components/MenuNavegacao'; // Importe seu componente de navegação

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@example.com', cargo: 'Gerente' },
    { id: 2, nome: 'Maria Oliveira', email: 'maria@example.com', cargo: 'Desenvolvedor' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentColaborador, setCurrentColaborador] = useState({ id: null, nome: '', email: '', cargo: '' });

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentColaborador({ id: null, nome: '', email: '', cargo: '' });
  };

  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentColaborador({ ...currentColaborador, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      setColaboradores(colaboradores.map(col => col.id === currentColaborador.id ? currentColaborador : col));
    } else {
      setColaboradores([...colaboradores, { ...currentColaborador, id: colaboradores.length + 1 }]);
    }
    handleClose();
  };

  const handleEdit = (colaborador) => {
    setCurrentColaborador(colaborador);
    setEditMode(true);
    handleShow();
  };

  const handleDelete = (id) => {
    setColaboradores(colaboradores.filter(col => col.id !== id));
  };

  return (
    <>
      <MenuNavegacao /> {/* Adicione o componente de navegação */}
      <Container fluid className="p-4">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Colaboradores</h1>
            <p className="text-center">Gerencie os colaboradores da sua equipe.</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="text-end">
            <Button variant="primary" onClick={handleShow}>
              <i className="fas fa-plus"></i> Cadastrar Novo Colaborador
            </Button>
          </Col>
        </Row>

        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Cargo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {colaboradores.map((colaborador) => (
                  <tr key={colaborador.id}>
                    <td>{colaborador.id}</td>
                    <td>{colaborador.nome}</td>
                    <td>{colaborador.email}</td>
                    <td>{colaborador.cargo}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleEdit(colaborador)} className="me-2">
                        <i className="fas fa-edit"></i> Editar
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(colaborador.id)}>
                        <i className="fas fa-trash"></i> Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Editar Colaborador' : 'Cadastrar Novo Colaborador'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={currentColaborador.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentColaborador.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cargo</Form.Label>
                <Form.Control
                  type="text"
                  name="cargo"
                  value={currentColaborador.cargo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {editMode ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Colaboradores;