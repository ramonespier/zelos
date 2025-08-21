'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInbox, FiCheck, FiX, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import api from '../../../lib/api';

const Toast = ({ message, type }) => (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
        className={`fixed bottom-6 right-6 py-3 px-5 rounded-lg shadow-2xl flex items-center gap-3 z-50 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
        {type === 'success' ? <FiCheck /> : <FiAlertTriangle />}
        <span className="font-medium">{message}</span>
    </motion.div>
);

const FechamentoCard = ({ pedido, onResponder, isLoading }) => (
    <motion.div
        layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }}
        className="bg-white p-5 rounded-xl shadow-md border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
        <div className="flex-1">
            <p className="font-bold text-gray-800">{pedido.chamado.titulo}</p>
            <div className="flex items-center gap-4 text-sm mt-2 text-gray-500">
                <span>Patrimônio: <span className="font-semibold text-gray-700">{pedido.chamado.numero_patrimonio || 'N/A'}</span></span>
                <span>Técnico: <span className="font-semibold text-gray-700">{pedido.tecnico.nome}</span></span>
            </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
            <button
                onClick={() => onResponder(pedido.id, 'aprovado')}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-green-400">
                {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />} Aprovar
            </button>
            <button
                onClick={() => onResponder(pedido.id, 'reprovado')}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-red-400">
                {isLoading ? <FiLoader className="animate-spin" /> : <FiX />} Reprovar
            </button>
        </div>
    </motion.div>
);

export default function GerenciarFechamentos() {
    const [pedidos, setPedidos] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Armazena o ID do pedido em ação
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPedidos = async () => {
        setPageLoading(true);
        try {
            const response = await api.get('/pedidos-fechamento/pendentes');
            setPedidos(response.data);
        } catch (error) {
            console.error("Erro ao buscar pedidos de fechamento:", error);
            showToast("Falha ao carregar pedidos de fechamento.", "error");
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
            // Remove o pedido da lista na UI para feedback imediato
            setPedidos(prev => prev.filter(p => p.id !== pedidoId));
            showToast(`Pedido ${status} com sucesso!`, 'success');
        } catch (error) {
            console.error("Erro ao responder pedido:", error);
            showToast(error.response?.data?.message || `Falha ao ${status} pedido.`, "error");
        } finally {
            setActionLoading(null);
        }
    };

    if (pageLoading) return <div className="p-8 font-semibold text-gray-600">Carregando solicitações de fechamento...</div>;

    return (
        <div className="max-w-7xl mx-auto font-sans p-4">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-red-600 tracking-tight">Solicitações de Fechamento</h1>
                <p className="text-lg text-slate-500 mt-1">Aprove ou reprove os pedidos dos técnicos para concluir os chamados.</p>
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
                            className="text-center text-gray-500 py-16 bg-white rounded-lg border-2 border-dashed">
                            <FiInbox className="mx-auto text-5xl text-gray-400 mb-2" />
                            <p className="font-semibold text-lg">Nenhuma solicitação pendente.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </AnimatePresence>
        </div>
    );
}