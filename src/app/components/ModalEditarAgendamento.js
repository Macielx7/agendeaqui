// components/ModalEditarAgendamento.jsx
'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ModalEditarAgendamento({ show, onClose, agendamento, onSalvar }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');

  useEffect(() => {
    if (agendamento) {
      setTitulo(agendamento.titulo || '');
      setDescricao(agendamento.descricao || '');
      setDataInicio(agendamento.dataInicio ? agendamento.dataInicio.slice(0, 16) : '');
      setNomeCliente(agendamento.nomeCliente || '');
    }
  }, [agendamento]);

  const handleSalvar = () => {
    const agendamentoEditado = {
      ...agendamento,
      titulo,
      descricao,
      dataInicio,
      nomeCliente,
    };

    onSalvar(agendamentoEditado);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Agendamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data e Hora</Form.Label>
            <Form.Control
              type="datetime-local"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nome do Cliente</Form.Label>
            <Form.Control
              type="text"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSalvar}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
