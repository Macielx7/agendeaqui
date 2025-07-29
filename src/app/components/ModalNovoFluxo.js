'use client';

import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ModalNovoFluxo({ show, onHide, onSalvar }) {
  const [gatilho, setGatilho] = useState('');
  const [resposta, setResposta] = useState('');

  const handleSalvar = () => {
    if (!gatilho || !resposta) return alert('Preencha todos os campos.');
    onSalvar({ gatilho, resposta });
    setGatilho('');
    setResposta('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Novo Fluxo de Resposta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Gatilho (mensagem que o cliente envia)</Form.Label>
            <Form.Control
              type="text"
              value={gatilho}
              onChange={(e) => setGatilho(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Resposta automática</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSalvar}>Salvar</Button>
      </Modal.Footer>
    </Modal>
  );
}
