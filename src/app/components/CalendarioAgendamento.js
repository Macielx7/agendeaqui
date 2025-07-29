'use client';

import { Card, Badge, Button, Spinner } from 'react-bootstrap';
import { CiCalendar } from "react-icons/ci";
import { useState, useEffect } from 'react';
import apiAGENDAFLOW from '../../services/apiAGENDAFLOW'; // ajuste o caminho se estiver diferente
import { useRouter } from 'next/navigation';


export default function CalendarioAgendamentos() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('todas');
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const empresaId = 1; // Você pode trocar isso para vir do sessionStorage, props ou contexto

    const corStatusBootstrap = (status) => {
        switch (status?.toLowerCase()) {
            case 'agendado':
            case 'confirmado':
                return 'success'; // verde
            case 'pendente':
                return 'warning'; // amarelo
            case 'cancelado':
                return 'danger'; // vermelho
            case 'finalizado':
                return 'secondary'; // cinza
            default:
                return 'primary'; // azul (padrão)
        }
    };


    const getCurrentWeekDays = () => {
        const days = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());

        const dayNames = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            days.push({
                dia: dayNames[i],
                data: date.getDate().toString().padStart(2, '0'),
                fullDate: date
            });
        }

        return days;
    };

    const diasSemana = getCurrentWeekDays();

    const formatarData = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const buscarAgendamentos = async () => {
        setLoading(true);
        try {
            const response = await apiAGENDAFLOW.get('/agendamentos', {
                params: {
                    empresa_id: empresaId,
                    data_agendamento: formatarData(selectedDate),
                    status: activeTab === 'todas' ? '' : activeTab
                }
            });

            setAgendamentos(response.data);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            setAgendamentos([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        buscarAgendamentos();
    }, [selectedDate, activeTab]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <Card className="shadow-sm h-100" style={{ minWidth: '350px' }}>
            <Card.Body className="p-3">
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Calendário Semanal</h5>
                        <Button
                            variant="dark"
                            className="d-flex align-items-center gap-2 py-1 px-3"
                            style={{ fontSize: '0.75rem', borderRadius: '20px' }}
                            onClick={() => router.push('/agenda')}
                        >
                            <CiCalendar size={16} />
                            Ver agenda completa
                        </Button>

                    </div>

                    <div className="d-flex justify-content-between">
                        {diasSemana.map((dia, index) => {
                            const isSelected =
                                selectedDate.getDate() === dia.fullDate.getDate() &&
                                selectedDate.getMonth() === dia.fullDate.getMonth();

                            return (
                                <div
                                    key={index}
                                    className={`text-center d-flex flex-column align-items-center p-2 ${isSelected ? 'bg-primary rounded text-white' : ''}`}
                                    style={{ width: '56px', cursor: 'pointer', borderRadius: '8px' }}
                                    onClick={() => handleDateClick(dia.fullDate)}
                                >
                                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{dia.dia}</div>
                                    <div style={{ width: '28px', height: '28px', fontSize: '1.5rem', fontWeight: '400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {dia.data}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <hr className="my-3" style={{ opacity: 0.1 }} />

                <div className="mb-3">
                    <div className="d-flex gap-1 p-1 bg-light rounded" style={{ width: 'fit-content' }}>
                        {['todas', 'agendadas', 'concluidas'].map((tab) => (
                            <Button
                                key={tab}
                                variant="link"
                                className={`p-2 text-decoration-none ${activeTab === tab ? 'bg-white text-dark fw-bold shadow-sm' : 'text-muted'} rounded`}
                                onClick={() => setActiveTab(tab)}
                                style={{ fontSize: '0.875rem', minWidth: '80px', textAlign: 'center' }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>

                <hr className="my-3" style={{ opacity: 0.1 }} />

                <div className="mt-3">
                    {loading ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {agendamentos.length > 0 ? agendamentos.map((agendamento, index) => (
                                <Card key={index} className="p-2" style={{ border: '1px solid #c7c3c1', borderRadius: '8px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f0f0f0' }}>
                                                <i className="bi bi-person-fill" style={{ fontSize: '1.2rem', color: '#6c757d' }}></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: '0.875rem' }}>{agendamento.titulo}</div>
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{agendamento.hora_inicio}</small>
                                            </div>
                                        </div>
                                        <Badge bg={corStatusBootstrap(agendamento.status)} pill style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                                            {agendamento.status}
                                        </Badge>

                                    </div>
                                </Card>
                            )) : (
                                <div className="text-center text-muted">Nenhum agendamento encontrado.</div>
                            )}
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
