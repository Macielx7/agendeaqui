'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function QrCodeWhatsApp() {
  const [qrCode, setQrCode] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [numeroConectado, setNumeroConectado] = useState(null);
  const [contador, setContador] = useState(10);

  const usuarioStorage = typeof window !== 'undefined' ? sessionStorage.getItem('usuario') : null;
  const empresaId = usuarioStorage ? JSON.parse(usuarioStorage)?.empresa_id : null;

  useEffect(() => {
    if (!empresaId) {
      setErro('Empresa não identificada.');
      setCarregando(false);
      return;
    }

    const verificarStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/whatsapp/${empresaId}/status`);
        if (response.data?.conectado && response.data?.numero) {
          setNumeroConectado(response.data.numero);
          return true;
        } else {
          setNumeroConectado(null);
          return false;
        }
      } catch (err) {
        setNumeroConectado(null);
        console.error('Erro ao verificar status do WhatsApp:', err);
        return false;
      }
    };

    const buscarQRCode = async () => {
      setCarregando(true);
      setErro(null);

      const conectado = await verificarStatus();

      if (!conectado) {
        try {
          const response = await axios.get(`http://localhost:3001/whatsapp/${empresaId}/qrcode`);
          setQrCode(response.data.qr);
        } catch {
          setQrCode(null);
          // Evitar mostrar erro durante transição
        }
      } else {
        setQrCode(null);
      }

      setCarregando(false);
    };

    // Contador e intervalo para chamar buscarQRCode a cada 30s
    const intervalo = setInterval(() => {
      setContador((prev) => {
        if (prev === 1) {
          buscarQRCode();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    buscarQRCode();

    return () => clearInterval(intervalo);
  }, [empresaId]);

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return <Alert variant="danger">{erro}</Alert>;
  }

  if (numeroConectado) {
    return (
      <Card className="text-center p-4">
        <h5 className="mb-3">Conectado ao WhatsApp</h5>
        <p className="text-success fw-bold">Número: {numeroConectado}</p>
        <p className="text-secondary mt-3" style={{ fontSize: '0.9rem' }}>
          Verificando status da conexão em: <strong>{contador}s</strong>
        </p>
      </Card>
    );
  }

  if (!qrCode) {
  return (
    <div className="bg-white d-flex justify-content-center align-items-center p-4">
      <Spinner animation="border" variant="primary" />
      <span className="ms-2">Gerando QR Code, aguarde...</span>
    </div>
  );
}


  return (
    <Card className="text-center p-4">
      <h5 className="mb-3">Escaneie o QR Code com o WhatsApp</h5>
      <div className="d-flex justify-content-center mb-2">
        <img src={qrCode} alt="QR Code WhatsApp" style={{ width: '250px', height: '250px' }} />
      </div>
      <p className="text-muted mb-2">Abra o WhatsApp &gt; Dispositivos conectados &gt; Escanear</p>
      <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
        Verificando status da conexão em: <strong>{contador}s</strong>
      </p>
    </Card>
  );
}
