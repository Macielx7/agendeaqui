'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuNavegacao from '../components/MenuNavegacao';
import QrCodeWhatsApp from '../components/QrCodeWhatsApp';
import ModalNovoFluxo from '../components/ModalNovoFluxo';
import ModalConfirmacao from '../components/ModalConfirmacao';
import { useRouter } from 'next/navigation';
import apiAGENDAFLOW from '../../services/apiAGENDAFLOW';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ChatbotPage() {
  const [fluxos, setFluxos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [numero, setNumero] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [fluxoParaExcluir, setFluxoParaExcluir] = useState(null);
  const router = useRouter();

  const usuario =
    typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('usuario')) : null;

  const carregarFluxos = async () => {
    try {
      const resposta = await apiAGENDAFLOW.get('/chatbot/fluxos', {
        params: { empresa_id: usuario.empresa_id },
        headers: { Authorization: `Bearer ${usuario.token}` },
      });

      const fluxosAPI = Array.isArray(resposta.data) ? resposta.data : [];
      setFluxos(fluxosAPI);
    } catch (error) {
      console.error(error);
      setFluxos([]);
      toast.error('Erro ao carregar fluxos');
    } finally {
      setCarregando(false);
    }
  };

  const salvarNovoFluxo = async ({ gatilho, resposta }) => {
    try {
      await apiAGENDAFLOW.post(
        '/chatbot/fluxos',
        {
          empresa_id: usuario.empresa_id,
          gatilho,
          resposta,
        },
        {
          headers: { Authorization: `Bearer ${usuario.token}` },
        }
      );

      toast.success('Fluxo criado com sucesso!');
      carregarFluxos();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar fluxo');
    }
  };

  const alternarStatus = async (fluxoId, statusAtual) => {
    try {
      await apiAGENDAFLOW.patch(`chatbot/fluxos/${fluxoId}`, {
        status: !statusAtual,
      }, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });

      setFluxos((prev) =>
        prev.map((f) => (f.id === fluxoId ? { ...f, status: !statusAtual } : f))
      );
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      toast.error('Erro ao atualizar status');
    }
  };

  const editarFluxo = (fluxoId) => {
  try {
    const fluxoParaEditar = fluxos.find(f => f.id === fluxoId);
    
    if (!fluxoParaEditar) {
      toast.error('Fluxo não encontrado para edição');
      return;
    }

    // Armazena os dados temporariamente
    sessionStorage.setItem('fluxoParaEditar', JSON.stringify({
      ...fluxoParaEditar,
      id: fluxoId
    }));

    // Redireciona com o ID na URL
    router.push(`/chatbot/new?editar=${fluxoId}`);
    
  } catch (error) {
    console.error('Erro ao preparar edição:', error);
    toast.error('Erro ao abrir fluxo para edição');
  }
};

  const solicitarExclusao = (fluxoId) => {
    setFluxoParaExcluir(fluxoId);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (!fluxoParaExcluir) return;

    try {
      await apiAGENDAFLOW.delete(`chatbot/fluxos/${fluxoParaExcluir}`, {
        headers: { Authorization: `Bearer ${usuario.token}` }
      });

      toast.success('Fluxo excluído com sucesso!');
      carregarFluxos();
    } catch (error) {
      console.error('Erro ao excluir fluxo:', error);
      toast.error('Erro ao excluir fluxo');
    } finally {
      setMostrarModalConfirmacao(false);
      setFluxoParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setMostrarModalConfirmacao(false);
    setFluxoParaExcluir(null);
  };

  useEffect(() => {
    if (usuario) carregarFluxos();
  }, []);

  return (
    <div className='bg-light' style={{ minHeight: '100vh' }}>
      <ToastContainer />
      <MenuNavegacao collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className='bg-dark'
        style={{
          marginLeft: collapsed ? '60px' : '170px',
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 80px)',
          boxSizing: 'border-box',
        }}
      >
        <div className='mt-3'>
          <QrCodeWhatsApp />
        </div>
        <h2 className='text-white'>Fluxos do Chatbot</h2>

        <div className='card mt-3'>
          <div className='card-header d-flex justify-content-between align-items-center'>
            <h5 className='mb-0'>Gatilhos cadastrados</h5>
            <button
              className='btn btn-primary'
              onClick={() => router.push('/chatbot/new')}
            >
              + Novo fluxo
            </button>
          </div>

          <div className='card-body'>
            {carregando ? (
              <div className='text-center'>
                <div className='spinner-border text-primary'></div>
                <p>Carregando...</p>
              </div>
            ) : !Array.isArray(fluxos) ? (
              <p>Erro ao carregar fluxos.</p>
            ) : fluxos.length === 0 ? (
              <p>Nenhum fluxo cadastrado ainda.</p>
            ) : (
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fluxos.map((fluxo) => (
                    <tr key={fluxo.id}>
                      <td>{fluxo.titulo}</td>
                      <td>
                        <label className='switch'>
                          <input
                            type="checkbox"
                            checked={!!fluxo.status}
                            onChange={() => alternarStatus(fluxo.id, fluxo.status)}
                          />
                          <span className='slider round'></span>
                        </label>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => editarFluxo(fluxo.id)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => solicitarExclusao(fluxo.id)}
                            title="Excluir"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 25px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          left: 4px;
          bottom: 3.5px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #28a745;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>

      <ModalNovoFluxo
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        onSalvar={salvarNovoFluxo}
      />

      <ModalConfirmacao
        show={mostrarModalConfirmacao}
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
        titulo="Confirmar Exclusão"
        mensagem="Tem certeza que deseja excluir este fluxo?"
      />
    </div>
  );
}