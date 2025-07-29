'use client';

import { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import apiAGENDAFLOW from '../../services/apiAGENDAFLOW';
import MenuNavegacao from '../components/MenuNavegacao';
import { ToastContainer, toast } from 'react-toastify';
import QrCodeWhatsApp from '../components/QrCodeWhatsApp';

export default function Configuracoes() {
  const [configuracao, setConfiguracao] = useState({
    googleToken: '',
    calendarId: 'primary',
    sincronizarAutomaticamente: true
  });
  const [carregando, setCarregando] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    setCarregando(true);
    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      if (!usuario) throw new Error('Usuário não autenticado');

      const resposta = await apiAGENDAFLOW.get('/configuracoes/google-calendar', {
        params: { empresa_id: usuario.empresa_id },
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        }
      });

      if (resposta.data) {
        setConfiguracao(resposta.data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setTimeout(() => {
        setCarregando(false);
      }, 3000); // garante 3 segundos mínimo
    }
  };

  const salvarConfiguracao = async () => {
    setCarregando(true);
    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      if (!usuario) throw new Error('Usuário não autenticado');

      await apiAGENDAFLOW.post('/configuracoes/google-calendar', {
        empresa_id: usuario.empresa_id,
        ...configuracao
      }, {
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        }
      });

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setCarregando(false);
    }
  };

  const conectarGoogle = () => {
    if (window.google && window.google.accounts) {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: '301779624998-uncfv4kckf4s39ja0r8gvg15ed660l1g.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar',
        redirect_uri: window.location.origin,
        callback: (response) => {
          if (response.code) {
            enviarCodigoParaBackend(response.code);
          } else {
            toast.error('Erro ao obter código de autorização');
          }
        }
      });
      client.requestCode(); // CORRETO: é requestCode, não requestAccessToken
    } else {
      toast.error('Google API não carregada');
    }
  };

  const enviarCodigoParaBackend = async (codigoAutorizacao) => {
    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));

      await apiAGENDAFLOW.post('/configuracoes/google-calendar/oauth', {
        codigoAutorizacao,
        empresa_id: usuario.empresa_id
      }, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        }
      });

      toast.success('Conta do Google conectada com sucesso!');
      carregarConfiguracoes();
    } catch (error) {
      console.error('Erro ao enviar código para backend:', error);
      toast.error('Erro ao conectar com Google');
    }
  };

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
        <h2 className="text-white">Configurações de Integração</h2>

        <div className="card mt-3">
          <div className="card-header">
            <h5>Google Calendar</h5>
          </div>
          <div className="card-body">
            {carregando ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
                <span className="ms-2">Carregando...</span>
              </div>
            ) : (
              <>
                {!configuracao.googleToken ? (
                  <div>
                    <p>Conecte sua conta do Google para sincronizar os agendamentos:</p>
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-danger" onClick={conectarGoogle}>
                        Conectar com Google
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="alert alert-success">
                      Conta do Google conectada com sucesso!
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        googleLogout();
                        setConfiguracao({ ...configuracao, googleToken: '' });
                        toast.info('Conta do Google desconectada');
                      }}
                    >
                      Desconectar do Google
                    </button>
                  </div>
                )}

                <div className="mt-3">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={configuracao.sincronizarAutomaticamente}
                      onChange={(e) =>
                        setConfiguracao({
                          ...configuracao,
                          sincronizarAutomaticamente: e.target.checked
                        })
                      }
                    />
                    Sincronizar automaticamente com Google Calendar
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

         

        <div className="mt-3">
          <button
            className="btn btn-primary"
            onClick={salvarConfiguracao}
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>

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
    </div>
  );
}
