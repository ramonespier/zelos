'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, UserCircleIcon, WrenchScrewdriverIcon, PlusCircleIcon, ArrowUpOnSquareIcon, BuildingOffice2Icon, PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../../../lib/api';

// --- Função Helper para formatar data ---
const formatarData = (dataString) => {
    if (!dataString) return 'Data indisponível';
    try {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dataString).toLocaleDateString('pt-BR', options).replace(',', ' às');
    } catch (e) {
        return 'Data inválida';
    }
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
export default function ChamadoDetailView({ chamado, onAbrirApontamento, onSuccessApontamento }) {
    // === ESTADOS DO COMPONENTE ===
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apontamentos, setApontamentos] = useState([]);
    const [loadingApontamentos, setLoadingApontamentos] = useState(true);
    const [pedidoFechamentoEnviado, setPedidoFechamentoEnviado] = useState(false);

    // === BUSCA DINÂMICA DE DADOS (APONTAMENTOS E PEDIDOS DE FECHAMENTO) ===
    useEffect(() => {
        if (!chamado?.id) return;
        
        // Função para ser chamada quando um apontamento novo é criado
        const handleNewApontamento = (novoApontamento) => {
          setApontamentos(prev => [novoApontamento, ...prev]);
        }

        // Isso simula o recebimento da prop (necessário para o seu useEffect mais abaixo)
        if (onSuccessApontamento) {
          handleNewApontamento(onSuccessApontamento);
        }

        const fetchData = async () => {
            setLoadingApontamentos(true);
            setPedidoFechamentoEnviado(false); // Reseta o estado
            try {
                // Buscamos em paralelo os apontamentos e o status do pedido de fechamento
                const [apontamentosRes, pedidosRes] = await Promise.all([
                    api.get(`/chamados/${chamado.id}/apontamentos`),
                    api.get(`/pedidos-fechamento?chamado_id=${chamado.id}`)
                ]);
                
                setApontamentos(apontamentosRes.data);

                if (pedidosRes.data.length > 0) {
                    setPedidoFechamentoEnviado(true);
                }

            } catch (error) {
                console.error("Erro ao buscar dados do chamado:", error);
                setApontamentos([]);
            } finally {
                setLoadingApontamentos(false);
            }
        };

        fetchData();
    }, [chamado?.id]);
    
    // === FUNÇÃO PARA SOLICITAR FECHAMENTO ===
    const solicitarFechamento = async () => {
        setIsSubmitting(true);
        try {
            await api.post('/pedidos-fechamento', { chamado_id: chamado.id });
            setPedidoFechamentoEnviado(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Não foi possível enviar o pedido.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Mapeamento seguro de dados para evitar erros de renderização
    const usuarioNome = chamado.usuario?.nome || "Usuário não identificado";
    const localizacao = capitalize(chamado.pool?.titulo || "Não especificado");
    const imagemUrl = chamado.img_url ? `http://localhost:3001${chamado.img_url}` : null;
    const patrimonio = chamado.numero_patrimonio || 'Não informado';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Card 1: Informações Gerais */}
            <div className="bg-white rounded-2xl shadow-xl border p-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 break-words">{chamado.titulo}</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <UserCircleIcon className="w-10 h-10 text-gray-400" />
                            <div>
                                <p className="font-semibold text-gray-800">{usuarioNome}</p>
                                <p className="text-gray-500">Solicitante</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <BuildingOffice2Icon className="w-10 h-10 text-gray-400" />
                            <div>
                                <p className="font-semibold text-gray-800">{localizacao}</p>
                                <p className="text-gray-500">Tipo / Local</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="w-10 h-10 text-gray-400" />
                            <div>
                                <p className="font-semibold text-gray-800">{formatarData(chamado.criado_em)}</p>
                                <p className="text-gray-500">Data de Abertura</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="font-bold text-gray-800">Patrimônio:</p>
                            <p className="text-red-600 font-bold mt-1">{patrimonio}</p>
                        </div>
                         <div>
                            <p className="font-bold text-gray-800">Descrição do Problema:</p>
                            <p className="text-gray-600 leading-relaxed mt-1">{chamado.descricao}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Card 2: Histórico de Atividades (Apontamentos) */}
            <div className="bg-white rounded-2xl shadow-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Atividades</h3>
                {loadingApontamentos ? (
                    <p className="text-gray-500 text-center py-4">Carregando histórico...</p>
                ) : (
                    <div className="space-y-4">
                        {apontamentos.length > 0 ? (
                            apontamentos.map(ap => <ApontamentoCard key={ap.id} apontamento={ap} />)
                        ) : (
                            <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
                                <WrenchScrewdriverIcon className="w-8 h-8 mx-auto text-gray-400 mb-2"/>
                                <p className="font-medium">Nenhum apontamento registrado.</p>
                                <p className="text-sm">Clique em "Criar Apontamento" para iniciar o trabalho.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Card 3: Imagem Anexada */}
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
                <button 
                    onClick={() => onAbrirApontamento(chamado)} 
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-base transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    <PlusCircleIcon className="w-5 h-5"/> 
                    <span>Criar Apontamento</span>
                </button>
                <button 
                    onClick={solicitarFechamento} 
                    disabled={pedidoFechamentoEnviado || isSubmitting}
                    className="px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-base transition-colors font-bold shadow-md hover:shadow-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300/70 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                    <ArrowUpOnSquareIcon className="w-5 h-5"/>
                    <span>{pedidoFechamentoEnviado ? 'Pedido Enviado' : (isSubmitting ? 'Enviando...' : 'Solicitar Fechamento')}</span>
                </button>
            </div>
        </motion.div>
    );
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}