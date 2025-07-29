'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuNavegacao from 'src/app/components/MenuNavegacao';
import { ReactSortable } from 'react-sortablejs';
import apiAGENDAFLOW from 'src/services/apiAGENDAFLOW';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ChatbotNovoFluxoPage() {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [itens, setItens] = useState([{
        ordem: 1,
        gatilho: '',
        resposta: '',
        tipo: 'resposta',
        estado: '',
        proximo_estado: ''
    }]);

    const [qualquerMensagem, setQualquerMensagem] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [fluxoId, setFluxoId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fluxoIdEdicao = params.get('editar');

        if (fluxoIdEdicao) {
            carregarFluxoParaEdicao(fluxoIdEdicao);
        }
    }, []);

    const carregarFluxoParaEdicao = async (fluxoId) => {
        try {
            const usuarioStr = sessionStorage.getItem('usuario');
            if (!usuarioStr) throw new Error('Usuário não logado');
            const usuario = JSON.parse(usuarioStr);

            const responseFluxo = await apiAGENDAFLOW.get(`/chatbot/fluxos/${fluxoId}`, {
                headers: { Authorization: `Bearer ${usuario.token}` }
            });

            const responseGatilhos = await apiAGENDAFLOW.get(`/chatbot/gatilhos`, {
                params: { fluxo_id: fluxoId, empresa_id: usuario.empresa_id },
                headers: { Authorization: `Bearer ${usuario.token}` }
            });

            setTitulo(responseFluxo.data.titulo);
            setFluxoId(fluxoId);
            setModoEdicao(true);

            const itensPreparados = responseGatilhos.data.map((gatilho, index) => ({
                ordem: index + 1,
                gatilho: gatilho.gatilho === '__QUALQUER_MENSAGEM__' ? '' : gatilho.gatilho,
                resposta: gatilho.resposta,
                tipo: gatilho.tipo,
                estado: gatilho.estado,
                proximo_estado: gatilho.proximo_estado,
                id: gatilho.id
            }));

            const temQualquerMensagem = responseGatilhos.data.some(
                g => g.gatilho === '__QUALQUER_MENSAGEM__'
            );

            setQualquerMensagem(temQualquerMensagem);
            setItens(itensPreparados);

        } catch (error) {
            console.error('Erro ao carregar fluxo para edição:', error);
            toast.error('Erro ao carregar fluxo para edição');
            router.push('/chatbot');
        }
    };

    const adicionarLinha = () => {
        const novaOrdem = itens.length + 1;
        setItens([...itens, {
            ordem: novaOrdem,
            gatilho: '',
            resposta: '',
            tipo: 'resposta',
            estado: '',
            proximo_estado: ''
        }]);
    };

    const atualizarItem = (index, campo, valor) => {
        const novosItens = [...itens];
        novosItens[index][campo] = valor;
        setItens(novosItens);
    };

    const removerItem = (index) => {
        const novosItens = [...itens];
        novosItens.splice(index, 1);
        setItens(novosItens);
    };

    const salvarFluxo = async () => {
        if (!titulo.trim()) {
            toast.error('Título é obrigatório');
            return;
        }

        const itensValidos = itens.every((item, index) =>
            (index === 0 && qualquerMensagem) || (item.gatilho.trim() && item.resposta.trim())
        );

        if (!itensValidos) {
            toast.error('Todos os gatilhos e respostas devem ser preenchidos');
            return;
        }

        try {
            const usuarioStr = sessionStorage.getItem('usuario');
            if (!usuarioStr) throw new Error('Usuário não logado');
            const usuario = JSON.parse(usuarioStr);
            const empresa_id = usuario.empresa_id;

            let fluxo_id;

            if (modoEdicao) {
                fluxo_id = fluxoId;

                await apiAGENDAFLOW.put(`/chatbot/fluxos/${fluxo_id}`, {
                    titulo,
                    status: true
                }, {
                    headers: { Authorization: `Bearer ${usuario.token}` }
                });

                const responseGatilhosExistentes = await apiAGENDAFLOW.get(`/chatbot/gatilhos`, {
                    params: { fluxo_id, empresa_id },
                    headers: { Authorization: `Bearer ${usuario.token}` }
                });

                const gatilhosExistentes = responseGatilhosExistentes.data;

                const idsExistentes = gatilhosExistentes.map(g => g.id);
                const idsNoFront = itens.filter(i => i.id).map(i => i.id);

                const idsParaRemover = idsExistentes.filter(id => !idsNoFront.includes(id));

                for (const id of idsParaRemover) {
                    await apiAGENDAFLOW.delete(`/chatbot/gatilhos/${id}`, {
                        headers: { Authorization: `Bearer ${usuario.token}` }
                    });
                }

                for (let index = 0; index < itens.length; index++) {
                    const item = itens[index];
                    const payload = {
                        gatilho: index === 0 && qualquerMensagem ? '__QUALQUER_MENSAGEM__' : item.gatilho,
                        resposta: item.resposta,
                        ordem: index + 1,
                        fluxo_id,
                        empresa_id,
                        tipo: item.tipo,
                        estado: item.estado,
                        proximo_estado: item.proximo_estado
                    };

                    if (item.id) {
                        await apiAGENDAFLOW.put(`/chatbot/gatilhos/${item.id}`, payload, {
                            headers: { Authorization: `Bearer ${usuario.token}` }
                        });
                    } else {
                        await apiAGENDAFLOW.post(`/chatbot/gatilhos`, [payload], {
                            params: { empresa_id },
                            headers: { Authorization: `Bearer ${usuario.token}` }
                        });
                    }
                }

            } else {
                const fluxoResponse = await apiAGENDAFLOW.post(`/chatbot/fluxos`, {
                    empresa_id,
                    titulo,
                    status: true
                }, {
                    headers: { Authorization: `Bearer ${usuario.token}` }
                });

                fluxo_id = fluxoResponse.data.id;

                if (!fluxo_id) throw new Error('Erro ao salvar fluxo');

                const gatilhosPayload = itens.map((item, index) => ({
                    gatilho: index === 0 && qualquerMensagem ? '__QUALQUER_MENSAGEM__' : item.gatilho,
                    resposta: item.resposta,
                    ordem: index + 1,
                    fluxo_id,
                    empresa_id,
                    tipo: item.tipo,
                    estado: item.estado,
                    proximo_estado: item.proximo_estado
                }));

                await apiAGENDAFLOW.post(`/chatbot/gatilhos`, gatilhosPayload, {
                    params: { empresa_id },
                    headers: { Authorization: `Bearer ${usuario.token}` }
                });
            }

            toast.success(modoEdicao ? 'Fluxo atualizado com sucesso!' : 'Fluxo e gatilhos salvos com sucesso!');
            router.push('/chatbot');

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Erro ao salvar fluxo');
        }
    };

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <ToastContainer />
            <MenuNavegacao collapsed={collapsed} setCollapsed={setCollapsed} />

            <div
                className="bg-dark text-white"
                style={{
                    marginLeft: collapsed ? '60px' : '170px',
                    padding: '20px',
                    transition: 'margin-left 0.3s ease',
                    minHeight: 'calc(100vh - 80px)',
                    boxSizing: 'border-box',
                }}
            >
                <h2>{modoEdicao ? 'Editar fluxo' : 'Novo fluxo'}</h2>

                <div className="mt-4">
                    <label className="form-label text-white">Título do fluxo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Digite o título do fluxo"
                    />
                </div>

                <div className="mt-4 bg-white p-3 rounded text-dark">
                    <h5>Gatilhos e Respostas</h5>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Gatilho</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Próximo Estado</th>
                                <th>Resposta</th>
                                <th></th>
                            </tr>
                        </thead>

                        <ReactSortable
                            tag="tbody"
                            list={itens}
                            setList={setItens}
                            animation={150}
                            handle=".drag-handle"
                        >
                            {itens.map((item, index) => (
                                <tr key={index} className="sortable-item">
                                    <td className={index === 0 ? '' : 'drag-handle'} style={{ cursor: index === 0 ? 'default' : 'move' }}>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {index === 0 && qualquerMensagem ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value="Qualquer mensagem"
                                                disabled
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item.gatilho}
                                                onChange={(e) => atualizarItem(index, 'gatilho', e.target.value)}
                                                placeholder="Ex: oi, bom dia"
                                            />
                                        )}
                                        {index === 0 && (
                                            <div className="form-check mt-1">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={qualquerMensagem}
                                                    onChange={(e) => setQualquerMensagem(e.target.checked)}
                                                    id={`checkQualquerMensagem_${index}`}
                                                />
                                                <label className="form-check-label" htmlFor={`checkQualquerMensagem_${index}`}>
                                                    Qualquer mensagem
                                                </label>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            className="form-control"
                                            value={item.tipo}
                                            onChange={(e) => atualizarItem(index, 'tipo', e.target.value)}
                                        >
                                            <option value="resposta">Resposta</option>
                                            <option value="menu">Menu</option>
                                            <option value="sub_menu">Sub Menu</option>
                                            <option value="fim">Finalizar</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.estado}
                                            onChange={(e) => atualizarItem(index, 'estado', e.target.value)}
                                            placeholder="Ex: inicio, menu_principal"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.proximo_estado}
                                            onChange={(e) => atualizarItem(index, 'proximo_estado', e.target.value)}
                                            placeholder="Ex: agendar_data ou vazio"
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            className="form-control"
                                            value={item.resposta}
                                            onChange={(e) => atualizarItem(index, 'resposta', e.target.value)}
                                            rows={3}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </td>
                                    <td>
                                        {index !== 0 && (
                                            <button className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>
                                                Remover
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </ReactSortable>
                    </table>

                    <button className="btn btn-secondary" onClick={adicionarLinha}>
                        + Adicionar Gatilho
                    </button>
                </div>

                <div className="mt-4">
                    <button className="btn btn-success" onClick={salvarFluxo}>
                        {modoEdicao ? 'Atualizar fluxo' : 'Salvar fluxo'}
                    </button>
                    <button className="btn btn-secondary m-2" onClick={() => router.back()}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}
