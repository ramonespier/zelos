'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInbox, FiCheck, FiX, FiLoader, FiAlertTriangle, FiCheckSquare } from 'react-icons/fi';
import api from '../../../lib/api';
import { toast } from 'sonner'; 

const FechamentoCard = ({ pedido, onResponder, isLoading }) => (
    <motion.div
        layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
        className="bg-white p-5 rounded-xl shadow-subtle border border-green-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
        <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 truncate" title={pedido.chamado.titulo}>{pedido.chamado.titulo}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm mt-2 text-gray-500">
                <span>Patrimônio: <span className="font-semibold text-gray-700">{pedido.chamado.numero_patrimonio || 'N/A'}</span></span>
                <span>Técnico: <span className="font-semibold text-gray-700">{pedido.tecnico.nome}</span></span>
            </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto flex-shrink-0">
            <button
                onClick={() => onResponder(pedido.id, 'aprovado')}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 cursor-pointer bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-green-400">
                {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />} Aprovar
            </button>
            <button
                onClick={() => onResponder(pedido.id, 'reprovado')}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 cursor-pointer bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-red-400">
                {isLoading ? <FiLoader className="animate-spin" /> : <FiX />} Reprovar
            </button>
        </div>
    </motion.div>
);

export default function GerenciarFechamentos() {
    const [pedidos, setPedidos] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const fetchPedidos = async () => {
        setPageLoading(true);
        try {
            const response = await api.get('/pedidos-fechamento/pendentes');
            setPedidos(response.data);
        } catch (error) {
            console.error("Erro ao buscar pedidos de fechamento:", error);
            toast.error("Falha ao carregar pedidos de fechamento."); 
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    const handleResponder = async (pedidoId, status) => {
        setActionLoading(pedidoId);
        try {
            await api.patch(`/pedidos-fechamento/${pedidoId}/responder`, { status });
            setPedidos(prev => prev.filter(p => p.id !== pedidoId));
            toast.success(`Pedido de fechamento ${status} com sucesso!`); 
        } catch (error) {
            console.error("Erro ao responder pedido:", error);
            toast.error(error.response?.data?.message || `Falha ao ${status} pedido.`); 
        } finally {
            setActionLoading(null);
        }
    };

    if (pageLoading) return <div className="p-8 text-center font-semibold text-gray-600">Carregando solicitações de fechamento...</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-5 sm:p-8 rounded-2xl shadow-subtle max-w-7xl mx-auto border border-gray-200/80">
                <header className="border-b border-gray-200/80 pb-6 mb-6">
                    <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-md flex items-center gap-3">
                        <FiCheckSquare />
                        Solicitações de Fechamento
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">Aprove ou reprove os pedidos dos técnicos para concluir os chamados.</p>
                </header>
                
                <div className="space-y-4">
                    <AnimatePresence>
                        {pedidos.length > 0 ? (
                            pedidos.map(pedido => (
                                <FechamentoCard
                                    key={pedido.id}
                                    pedido={pedido}
                                    onResponder={handleResponder}
                                    isLoading={actionLoading === pedido.id}
                                />
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center text-gray-500 py-16">
                                <FiInbox className="mx-auto text-5xl text-gray-400 mb-2" />
                                <p className="font-semibold text-lg">Nenhuma solicitação pendente.</p>
                                <p className="text-sm">A caixa de entrada está limpa!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );  
}