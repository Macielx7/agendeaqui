'use client';

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import { Spinner, Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MenuNavegacao from '../components/MenuNavegacao';
import apiAGENDAFLOW from 'src/services/apiAGENDAFLOW';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalConfirmacao from '../components/ModalConfirmacao';


const locales = {
  'pt-BR': ptBR
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const mensagens = {
  allDay: 'Dia todo',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Nenhum evento neste período.',
  showMore: total => `+ Ver mais (${total})`
};

const formatarDataParaInput = (date) => {
  if (!date) return '';
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatarHoraParaInput = (date) => {
  if (!date) return '';
  const localDate = new Date(date);
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const converterParaUTC = (date) => {
  return date.toISOString(); // Envia como string ISO
};

const converterParaLocal = (dateString) => {
  // Verifica se a string está no formato "DD/MM/YYYY, HH:mm:ss"
  if (dateString && dateString.includes(',')) {
    const [datePart, timePart] = dateString.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');

    // Cria a data no formato YYYY-MM-DDTHH:mm:ss (ISO)
    const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    return new Date(isoString);
  }

  // Se não estiver no formato esperado, tenta criar a data normalmente
  return new Date(dateString);
};

export default function Agendar() {
  const [eventos, setEventos] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [visualizacao, setVisualizacao] = useState('month');
  const [dataAtual, setDataAtual] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoPagina, setCarregandoPagina] = useState(true);
  const [erro, setErro] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [clientes, setClientes] = useState([]);


  const [dadosFormulario, setDadosFormulario] = useState({
    titulo: '',
    data: formatarDataParaInput(new Date()),
    horaInicio: formatarHoraParaInput(new Date()),
    horaFim: formatarHoraParaInput(new Date(new Date().getTime() + 60 * 60 * 1000)),
    colaboradorId: '',
    observacoes: '',
    nomeCliente: '',
    clienteId: '',
    status: 'pendente'

  });
  const [erroApi, setErroApi] = useState(null);
  const [carregandoModal, setCarregandoModal] = useState(false);
  const [eventosPorData, setEventosPorData] = useState({});

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
      window.location.href = '/login';
    } else {
      const dadosUsuario = JSON.parse(usuario);
      setUsuario(dadosUsuario);
      setCarregandoPagina(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario) return;

    const carregarDadosIniciais = async () => {
      setCarregando(true);
      try {
        const empresaId = usuario?.empresa_id;

        if (empresaId) {
          const [respostaColab, respostaAgend, respostaClientes] = await Promise.all([
            apiAGENDAFLOW.get('/colaboradores', { params: { empresa_id: empresaId } }),
            apiAGENDAFLOW.get('/agendamentos', { params: { empresa_id: empresaId } }),
            apiAGENDAFLOW.get('/clientes', { params: { empresa_id: empresaId } })
          ]);

          setColaboradores(respostaColab.data);
          setClientes(respostaClientes.data);



          const eventosFormatados = respostaAgend.data.map(agendamento => {
            const inicio = converterParaLocal(agendamento.hora_inicio);
            const fim = converterParaLocal(agendamento.hora_fim);

            return {
              id: agendamento.id,
              titulo: agendamento.titulo || 'Sem título',
              inicio,
              fim,
              colaboradorId: agendamento.colaborador_id,
              colaboradorNome: agendamento.colaborador?.nome || 'Sem colaborador',
              observacoes: agendamento.observacoes || '',
              clienteId: agendamento.cliente_id,
              nomeCliente: agendamento.nome_cliente || '',
              status: agendamento.status || 'pendente'
            };
          });


          setEventos(eventosFormatados);

        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setErro('Erro ao carregar agendamentos. Tente recarregar a página.');
        toast.error('Erro ao carregar agendamentos');
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosIniciais();
  }, [usuario]);

  // Agrupa eventos por data para controle do "Ver mais"
  useEffect(() => {
    const agruparEventosPorData = () => {
      const agrupados = {};

      eventos.forEach(evento => {
        const dataChave = formatarDataParaInput(evento.inicio);
        if (!agrupados[dataChave]) {
          agrupados[dataChave] = [];
        }
        agrupados[dataChave].push(evento);
      });

      setEventosPorData(agrupados);
    };

    agruparEventosPorData();
  }, [eventos]);

  const lidarComSelecaoEvento = (evento) => {
    setAgendamentoEditando(evento);
    setModoEdicao(true);
    setDadosFormulario({
      titulo: evento.titulo,
      data: formatarDataParaInput(evento.inicio),
      horaInicio: formatarHoraParaInput(evento.inicio),
      horaFim: formatarHoraParaInput(evento.fim),
      colaboradorId: evento.colaboradorId,
      observacoes: evento.observacoes || '',
      clienteId: evento.clienteId || '',    // <=== seta aqui o clienteId
      nomeCliente: evento.nomeCliente || '',
      status: evento.status || 'pendente'
    });
    setMostrarModal(true);
  };


  const lidarComSelecaoSemana = (slotInfo) => {
    setSlotSelecionado(slotInfo);
    setModoEdicao(false);
    setAgendamentoEditando(null);
    setDadosFormulario({
      titulo: '',
      data: formatarDataParaInput(slotInfo.start),
      horaInicio: formatarHoraParaInput(slotInfo.start),
      horaFim: formatarHoraParaInput(slotInfo.end),
      colaboradorId: '',
      observacoes: '',
      nomeCliente: ''
    });
    setMostrarModal(true);
  };

  const lidarComMudancaInput = (e) => {
    const { name, value } = e.target;
    setDadosFormulario({ ...dadosFormulario, [name]: value });
  };

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setCarregandoModal(true);
    setErro(null);
    setErroApi(null);

    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      if (!usuario) {
        setErro('Usuário não autenticado');
        toast.error('Usuário não autenticado');
        return;
      }

      if (!dadosFormulario.colaboradorId) {
        setErro('Selecione um colaborador');
        toast.error('Selecione um colaborador');
        return;
      }

      const dataHoraInicioLocal = new Date(`${dadosFormulario.data}T${dadosFormulario.horaInicio}`);
      const dataHoraFimLocal = new Date(`${dadosFormulario.data}T${dadosFormulario.horaFim}`);

      if (dataHoraInicioLocal >= dataHoraFimLocal) {
        setErro('A data/hora de início deve ser anterior à data/hora de término');
        toast.error('A data/hora de início deve ser anterior à data/hora de término');
        return;
      }

      const colaboradorSelecionado = colaboradores.find(colab => colab.id == dadosFormulario.colaboradorId);
      if (!colaboradorSelecionado) {
        setErro('Colaborador selecionado não encontrado');
        toast.error('Colaborador selecionado não encontrado');
        return;
      }

      const dataHoraInicioUTC = converterParaUTC(dataHoraInicioLocal);
      const dataHoraFimUTC = converterParaUTC(dataHoraFimLocal);

      const dadosAgendamento = {
        titulo: dadosFormulario.titulo,
        hora_inicio: dataHoraInicioUTC,
        hora_fim: dataHoraFimUTC,
        data_agendamento: dadosFormulario.data,
        colaborador_id: parseInt(dadosFormulario.colaboradorId),
        usuario_id: usuario.id,
        empresa_id: usuario.empresa_id,
        observacoes: dadosFormulario.observacoes || '',
        cliente_id: dadosFormulario.clienteId ? parseInt(dadosFormulario.clienteId) : null,
        nome_cliente: dadosFormulario.nomeCliente || '',
        status: dadosFormulario.status
      };


      let resposta;
      if (modoEdicao && agendamentoEditando) {
        resposta = await apiAGENDAFLOW.put(`/agendamentos/${agendamentoEditando.id}`, dadosAgendamento, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        setEventos(prevEventos =>
          prevEventos.map(evento =>
            evento.id === agendamentoEditando.id
              ? {
                ...evento,
                titulo: dadosFormulario.titulo,
                inicio: dataHoraInicioLocal,
                fim: dataHoraFimLocal,
                colaboradorId: dadosFormulario.colaboradorId,
                observacoes: dadosFormulario.observacoes,
                nomeCliente: dadosFormulario.nomeCliente,
                status: dadosFormulario.status // 👈 ADICIONE ISSO
              }
              : evento
          )
        );


      } else {
        resposta = await apiAGENDAFLOW.post('/agendamentos', dadosAgendamento, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        setEventos(prevEventos => [
          ...prevEventos,
          {
            id: resposta.data.id,
            titulo: dadosFormulario.titulo,
            inicio: dataHoraInicioLocal,
            fim: dataHoraFimLocal,
            colaboradorId: dadosFormulario.colaboradorId,
            colaboradorNome: colaboradorSelecionado.nome,
            observacoes: dadosFormulario.observacoes,
            nomeCliente: dadosFormulario.nomeCliente
          }
        ]);
        toast.success('Agendamento criado com sucesso!');
      }

      setMostrarModal(false);
      setModoEdicao(false);
      setAgendamentoEditando(null);
      setDadosFormulario({
        titulo: '',
        data: formatarDataParaInput(new Date()),
        horaInicio: formatarHoraParaInput(new Date()),
        horaFim: formatarHoraParaInput(new Date(new Date().getTime() + 60 * 60 * 1000)),
        colaboradorId: '',
        observacoes: '',
        nomeCliente: ''
      });

    } catch (error) {
      console.error(`Erro ao ${modoEdicao ? 'editar' : 'criar'} agendamento:`, error);
      const mensagemErro = error.response?.data?.message ||
        error.response?.data?.error ||
        `Erro ao ${modoEdicao ? 'editar' : 'criar'} o agendamento.`;
      setErroApi(mensagemErro);
      toast.error(mensagemErro);
    } finally {
      setCarregandoModal(false);
    }
  };

  const lidarComExclusaoAgendamento = async () => {
    if (!agendamentoEditando) return;

    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    try {
      setCarregandoModal(true);
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));

      await apiAGENDAFLOW.delete(`/agendamentos/${agendamentoEditando.id}`, {
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        }
      });

      setEventos(eventos.filter(e => e.id !== agendamentoEditando.id));
      setMostrarModal(false);
      setModoEdicao(false);
      setAgendamentoEditando(null);
      setDadosFormulario({
        titulo: '',
        data: formatarDataParaInput(new Date()),
        horaInicio: formatarHoraParaInput(new Date()),
        horaFim: formatarHoraParaInput(new Date(new Date().getTime() + 60 * 60 * 1000)),
        colaboradorId: '',
        observacoes: '',
        nomeCliente: ''
      });
      toast.success('Agendamento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      setErroApi('Erro ao excluir agendamento. Tente novamente.');
      toast.error('Erro ao excluir agendamento');
    } finally {
      setMostrarModalConfirmacao(false);
      setCarregandoModal(false);
    }
  };

  // Componente personalizado para renderizar os eventos no calendário
  const EventoCalendario = ({ evento }) => {
    return (
      <div style={{ padding: '1px', fontSize: '12px', lineHeight: '1.2' }}>
        <strong>{evento.titulo}</strong>
        {evento.nomeCliente && <div style={{ fontSize: '11px' }}>Cliente: {evento.nomeCliente}</div>}
        {evento.status && <div style={{ fontSize: '11px' }}>{evento.status}</div>} {/* ✅ novo */}
      </div>
    );
  };


  // Componente personalizado para renderizar a célula do mês
  const CelulaMes = ({ data, eventosDia }) => {
    const eventosNaData = eventosDia || [];
    const chaveData = formatarDataParaInput(data);
    const totalEventos = eventosPorData[chaveData]?.length || 0;
    const mostrarVerMais = totalEventos > 3;

    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {eventosNaData.slice(0, 3).map((evento, index) => (
          <EventoCalendario key={index} evento={evento} />
        ))}
        {mostrarVerMais && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              lidarComVerMais(chaveData);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#3174ad',
              cursor: 'pointer',
              fontSize: '11px',
              padding: '2px 4px',
              textDecoration: 'underline'
            }}
          >
            Ver mais ({totalEventos - 3})
          </button>
        )}
      </div>
    );
  };

  if (carregandoPagina) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
        <div className="alert alert-danger">
          {erro}
          <button className="btn btn-primary ms-3" onClick={() => window.location.reload()}>
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-light' style={{ minHeight: '100vh' }}>
      <MenuNavegacao collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className='bg-dark'
        style={{
          marginLeft: collapsed ? '60px' : '170px',
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        <h2 className='text-white mb-4'>Bem-vindo(a), {usuario?.nome || 'Usuário'}</h2>

        <div style={{ height: '80vh', padding: '2rem' }}>
          {carregando && (
            <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
              <Spinner animation="border" variant="primary" />
              <span className="ms-3 text-white">Carregando agendamentos...</span>
            </div>
          )}

          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="inicio"
            endAccessor="fim"
            onSelectEvent={lidarComSelecaoEvento}
            onSelectSlot={lidarComSelecaoSemana}
            selectable
            style={{ height: '100%', borderRadius: '10px', backgroundColor: '#D3D3D3' }}
            view={visualizacao}
            onView={setVisualizacao}
            date={dataAtual}
            onNavigate={setDataAtual}
            messages={mensagens}
            culture="pt-BR"
            eventPropGetter={(evento) => {
              let cor = '#3174ad'; // padrão

              switch (evento.status?.toLowerCase()) {
                case 'confirmado':
                case 'agendado': // agora agendado também fica verde
                  cor = '#28a745'; // verde
                  break;
                case 'pendente':
                  cor = '#ffc107'; // amarelo
                  break;
                case 'cancelado':
                  cor = '#dc3545'; // vermelho
                  break;
                case 'finalizado':
                  cor = '#6c757d'; // cinza
                  break;
                default:
                  cor = '#3174ad'; // fallback
              }

              return {
                style: {
                  backgroundColor: cor,
                  borderRadius: '4px',
                  padding: '1px 3px',
                  fontSize: '12px',
                  margin: '1px',
                  opacity: 0.9,
                  color: cor === '#ffc107' ? 'black' : 'white' // texto preto se fundo for amarelo
                }
              };
            }}

            components={{
              event: ({ event }) => <EventoCalendario evento={event} />,
              month: {
                dateHeader: ({ date }) => (
                  <div style={{ textAlign: 'right', paddingRight: '5px' }}>
                    {date.getDate()}
                  </div>
                ),
                event: ({ event }) => <EventoCalendario evento={event} />,
              },
              day: {
                event: ({ event }) => <EventoCalendario evento={event} />,
              },
              week: {
                event: ({ event }) => <EventoCalendario evento={event} />,
              },
            }}
          />
        </div>

        <Modal show={mostrarModal} onHide={() => {
          setMostrarModal(false);
          setModoEdicao(false);
          setAgendamentoEditando(null);
          setErro(null);
          setErroApi(null);
        }} centered>
          <Modal.Header closeButton>
            <Modal.Title>{modoEdicao ? 'Editar Agendamento' : 'Novo Agendamento'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {erroApi && <Alert variant="danger">{erroApi}</Alert>}
            {erro && <Alert variant="danger">{erro}</Alert>}

            {modoEdicao && agendamentoEditando && (
              <Form.Group className="mb-3">
                <Form.Label>ID do Agendamento</Form.Label>
                <Form.Control
                  type="text"
                  value={agendamentoEditando.id}
                  readOnly
                  plaintext
                  className="fw-bold"
                />
              </Form.Group>
            )}

            <Form onSubmit={lidarComEnvio}>
              <Form.Group controlId="formTitulo" className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={dadosFormulario.titulo}
                  onChange={lidarComMudancaInput}
                  required
                  maxLength={50}
                />

              </Form.Group>

              <Form.Group controlId="formStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={dadosFormulario.status}
                  onChange={lidarComMudancaInput}
                  required
                >
                  <option value="pendente">Pendente</option>
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="formData" className="mb-3">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  name="data"
                  value={dadosFormulario.data}
                  onChange={lidarComMudancaInput}
                  required
                />
              </Form.Group>



              <Row>
                <Col>
                  <Form.Group controlId="formHoraInicio" className="mb-3">
                    <Form.Label>Hora Início</Form.Label>
                    <Form.Control
                      type="time"
                      name="horaInicio"
                      value={dadosFormulario.horaInicio}
                      onChange={lidarComMudancaInput}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formHoraFim" className="mb-3">
                    <Form.Label>Hora Fim</Form.Label>
                    <Form.Control
                      type="time"
                      name="horaFim"
                      value={dadosFormulario.horaFim}
                      onChange={lidarComMudancaInput}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formCliente" className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Select
                  name="clienteId"
                  value={dadosFormulario.clienteId}
                  onChange={lidarComMudancaInput}
                >
                  <option value="">Selecione...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>


              <Form.Group controlId="formColaborador" className="mb-3">
                <Form.Label>Colaborador</Form.Label>
                <Form.Select
                  name="colaboradorId"
                  value={dadosFormulario.colaboradorId}
                  onChange={lidarComMudancaInput}
                  required
                >
                  <option value="">Selecione...</option>
                  {colaboradores.map(colab => (
                    <option key={colab.id} value={colab.id}>{colab.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>




              <Form.Group controlId="formObservacoes" className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  name="observacoes"
                  value={dadosFormulario.observacoes}
                  onChange={lidarComMudancaInput}
                  maxLength={300}
                />
              </Form.Group>

              <div className="d-flex justify-content-between mt-4">
                {modoEdicao && (
                  <Button
                    variant="danger"
                    type="button"
                    onClick={lidarComExclusaoAgendamento}
                    disabled={carregandoModal}
                  >
                    <FaTrash className="me-2" />
                    {carregandoModal ? 'Excluindo...' : 'Excluir'}
                  </Button>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  disabled={carregandoModal}
                  className={modoEdicao ? '' : 'ms-auto'}
                >
                  {carregandoModal ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processando...
                    </>
                  ) : modoEdicao ? (
                    'Salvar Alterações'
                  ) : (
                    'Agendar'
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        // Dentro do return principal, depois do <ToastContainer />
        <ModalConfirmacao
          show={mostrarModalConfirmacao}
          onConfirmar={confirmarExclusao}
          onCancelar={() => setMostrarModalConfirmacao(false)}
          titulo="Excluir Agendamento"
          mensagem="Tem certeza que deseja excluir este agendamento?
           Essa ação não poderá ser desfeita."
        />
      </div>
    </div>
  );
}