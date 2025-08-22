    'use client';

    import { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import {
        CalendarIcon, UserCircleIcon, WrenchScrewdriverIcon, PlusCircleIcon,
        ArrowUpOnSquareIcon, BuildingOffice2Icon, PhotoIcon, ClockIcon
    } from '@heroicons/react/24/outline';
    import api from '../../../lib/api';
    import ConfirmaModal from './ConfirmaModal'; // <<< IMPORTADO DO CAMINHO CORRETO

    // --- Função Helper ---
    const formatarData = (dataString) => {
        if (!dataString) return 'Data indisponível';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dataString).toLocaleDateString('pt-BR', options).replace(',', ' às');
    };

    // --- Subcomponente: Card de um Apontamento ---
    const ApontamentoCard = ({ apontamento }) => {
        const duracao = apontamento.fim ? `${Math.floor(apontamento.duracao / 60)}h ${apontamento.duracao % 60}min` : "Em andamento";
        return (
            <div className="flex gap-4 p-4 border-l-4 border-red-500 bg-red-50/50 rounded-r-lg">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shadow-sm">
                        <WrenchScrewdriverIcon className="w-5 h-5 text-red-600" />
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">{apontamento.descricao}</p>
                    <div className="text-xs text-gray-500 mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <span className="font-semibold">Início: {formatarData(apontamento.comeco)}</span>
                        {apontamento.fim && <span className="font-semibold">Fim: {formatarData(apontamento.fim)} ({duracao})</span>}
                    </div>
                </div>
            </div>
        );
    };

    // --- Componente Principal ---
    export default function ChamadoDetailView({ chamado, apontamentos, onAbrirApontamento }) {
        const [pedidoEnviado, setPedidoEnviado] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
        // NOVO ESTADO: controla a visibilidade do modal de confirmação
        const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

        // Verifica se já existe um pedido de fechamento para este chamado ao carregar
        useEffect(() => {
            if (!chamado?.id) return;
            const verificarPedidoExistente = async () => {
                try {
                    // (Assumindo que seu backend terá uma rota GET /pedidos-fechamento?chamado_id=...)
                    const response = await api.get(`/pedidos-fechamento?chamado_id=${chamado.id}`);
                    if (response.data && response.data.length > 0) {
                        setPedidoEnviado(true);
                    } else {
                        setPedidoEnviado(false);
                    }
                } catch (error) {
                    // Não é um erro crítico se esta chamada falhar, o botão apenas ficará ativo.
                    console.error("Não foi possível verificar pedidos de fechamento existentes:", error);
                }
            };
            verificarPedidoExistente();
        }, [chamado?.id]);


        // Ação principal, agora chamada pelo modal
        const handleConfirmarFechamento = async () => {
            setIsSubmitting(true);
            try {
                await api.post('/pedidos-fechamento', { chamado_id: chamado.id });
                setPedidoEnviado(true); // Bloqueia o botão na UI
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Não foi possível enviar o pedido.";
                alert(errorMessage);
            } finally {
                setIsSubmitting(false);
                setIsConfirmModalOpen(false); // Fecha o modal após a ação
            }
        };

        const usuarioNome = chamado.usuario?.nome || "Usuário não identificado";
        const localizacao = capitalize(chamado.pool?.titulo || "Não especificado");
        const imagemUrl = chamado.img_url ? `http://localhost:3001${chamado.img_url}` : null;
        const patrimonio = chamado.numero_patrimonio || 'Não informado';

        return (
            <>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Seção Principal de Detalhes do Chamado */}
                    <div className="bg-white rounded-2xl shadow-xl border p-6">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 break-words">{chamado.titulo}</h2>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3"><UserCircleIcon className="w-10 h-10 text-gray-400" /><div><p className="font-semibold text-gray-800">{usuarioNome}</p><p className="text-gray-500">Solicitante</p></div></div>
                                <div className="flex items-center gap-3"><BuildingOffice2Icon className="w-10 h-10 text-gray-400" /><div><p className="font-semibold text-gray-800">{localizacao}</p><p className="text-gray-500">Tipo / Local</p></div></div>
                                <div className="flex items-center gap-3"><CalendarIcon className="w-10 h-10 text-gray-400" /><div><p className="font-semibold text-gray-800">{formatarData(chamado.criado_em)}</p><p className="text-gray-500">Data de Abertura</p></div></div>
                            </div>
                            <div className="space-y-4">
                                <div><p className="font-bold text-gray-800">Patrimônio:</p><p className="text-red-600 font-bold mt-1">{patrimonio}</p></div>
                                <div><p className="font-bold text-gray-800">Descrição do Problema:</p><p className="text-gray-600 leading-relaxed mt-1">{chamado.descricao}</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Seção do Histórico de Apontamentos */}
                    <div className="bg-white rounded-2xl shadow-xl border p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Atividades</h3>
                        <div className="space-y-4">
                            {apontamentos && apontamentos.length > 0 ? (
                                apontamentos.map(ap => <ApontamentoCard key={ap.id} apontamento={ap} />)
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">Nenhum apontamento registrado.</p>
                            )}
                        </div>
                    </div>

                    {/* Seção da Imagem Anexada */}
                    {imagemUrl && (
                    <div className="bg-white rounded-2xl shadow-xl border p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <PhotoIcon className="w-6 h-6 text-gray-500" /> Imagem Anexada
                        </h3>
                        <div className="mt-4">
                            <img src={imagemUrl} alt={`Anexo para ${chamado.titulo}`}
                            className="w-full h-auto max-h-[70vh] object-contain rounded-lg border-2 border-gray-200 bg-gray-50 p-1"
                            loading="lazy" />
                        </div>
                    </div>
                    )}
                    
                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <button onClick={() => onAbrirApontamento(chamado)} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg ...">
                            <PlusCircleIcon className="w-5 h-5"/> 
                            <span>Criar Apontamento</span>
                        </button>
                        <button 
                            onClick={() => setIsConfirmModalOpen(true)} // << ABRE O MODAL
                            disabled={pedidoEnviado || isSubmitting}
                            className="px-4 py-2 rounded-lg flex items-center justify-center gap-2 ... disabled:cursor-not-allowed">
                            <ArrowUpOnSquareIcon className="w-5 h-5"/>
                            <span>{pedidoEnviado ? 'Pedido Enviado' : 'Solicitar Fechamento'}</span>
                        </button>
                    </div>
                </motion.div>
                
                {/* RENDERIZAÇÃO DO MODAL DE CONFIRMAÇÃO */}
                <ConfirmaModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmarFechamento}
                    title="Solicitar Fechamento de Chamado"
                    message={`Você confirma que concluiu todas as tarefas para o chamado "${chamado.titulo}" e deseja solicitar o fechamento?`}
                    isLoading={isSubmitting}
                    confirmText="Sim, solicitar"
                    cancelText="Não, voltar"
                />
            </>
        );
    }

    function capitalize(str = '') { return str.charAt(0).toUpperCase() + str.slice(1); }