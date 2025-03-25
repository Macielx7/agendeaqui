// components/ModalConfirmarExclusao.jsx
'use client';

import { Modal, Button } from 'react-bootstrap';

export default function ModalConfirmarExclusao({ show, onClose, onExcluir }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tem certeza de que deseja excluir este agendamento? Esta ação não pode ser desfeita.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onExcluir}>
          Excluir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
