'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AgendamentoModal({ exibir, fechar, aoSalvar, colaboradores }) {
  const [dadosFormulario, setDadosFormulario] = useState({
    titulo: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    colaboradorId: '',
  });

  const handleAlterarCampo = (e) => {
    const { name, value } = e.target;
    setDadosFormulario((prevDados) => ({
      ...prevDados,
      [name]: value,
    }));
  };

  const handleSalvar = () => {
    aoSalvar(dadosFormulario);
    fechar();
  };

  useEffect(() => {
    if (!exibir) {
      setDadosFormulario({
        titulo: '',
        data: '',
        horaInicio: '',
        horaFim: '',
        colaboradorId: '',
      });
    }
  }, [exibir]);

  return (
    <Modal show={exibir} onHide={fechar}>
      <Modal.Header closeButton>
        <Modal.Title>Novo Agendamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={dadosFormulario.titulo}
              onChange={handleAlterarCampo}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              name="data"
              value={dadosFormulario.data}
              onChange={handleAlterarCampo}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Hora de Início</Form.Label>
            <Form.Control
              type="time"
              name="horaInicio"
              value={dadosFormulario.horaInicio}
              onChange={handleAlterarCampo}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Hora de Término</Form.Label>
            <Form.Control
              type="time"
              name="horaFim"
              value={dadosFormulario.horaFim}
              onChange={handleAlterarCampo}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Colaborador</Form.Label>
            <Form.Select
              name="colaboradorId"
              value={dadosFormulario.colaboradorId}
              onChange={handleAlterarCampo}
            >
              <option value="">Selecione</option>
              {colaboradores.map((colab) => (
                <option key={colab.id} value={colab.id}>
                  {colab.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={fechar}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSalvar}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AgendamentoModal;
