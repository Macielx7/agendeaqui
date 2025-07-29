// src/components/ModalConfirmacao.jsx
import { Modal, Button } from 'react-bootstrap';

export default function ModalConfirmacao({ show, onConfirmar, onCancelar, titulo = 'Confirmar Ação', mensagem = 'Tem certeza que deseja continuar?' }) {
  return (
    <Modal show={show} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensagem}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
