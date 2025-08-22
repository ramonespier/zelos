'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInbox, FiCheck, FiX, FiLoader, FiAlertTriangle, FiUserPlus } from 'react-icons/fi';
import api from '../../../lib/api';

const Toast = ({ message, type }) => (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ opacity: 1 }} exit={{ y: -50, opacity: 0 }}
        className={`fixed bottom-6 right-6 py-3 px-5 rounded-lg shadow-2xl flex items-center gap-3 z-50 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
        {type === 'success' ? <FiCheck /> : <FiAlertTriangle />}
        <span className="font-medium">{message}</span>
    </motion.div>
);

const PedidoCard = ({ pedido, onResponder, isLoading }) => (
    <motion.div
        layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
        className="bg-white p-5 rounded-xl shadow-subtle border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
                onClick={() => onResponder(pedido.id, 'aceito')}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-green-400">
                {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />} Aceitar
            </button>
            <button
                onClick={() => onResponder(pedido.id, 'recusado')}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-red-400">
                {isLoading ? <FiLoader className="animate-spin" /> : <FiX />} Recusar
            </button>
        </div>
    </motion.div>
);

export default function GerenciarPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPedidos = async () => {
        setPageLoading(true);
        try {
            const response = await api.get('/pedidos-chamado/pendentes');
            setPedidos(response.data);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            showToast("Falha ao carregar pedidos de atribuição.", "error");
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
            await api.patch(`/pedidos-chamado/${pedidoId}/responder`, { status });
            setPedidos(prev => prev.filter(p => p.id !== pedidoId));
            showToast(`Pedido de atribuição ${status} com sucesso!`, 'success');
        } catch (error) {
            console.error("Erro ao responder pedido:", error);
            showToast(error.response?.data?.message || `Falha ao ${status} pedido.`, "error");
        } finally {
            setActionLoading(null);
        }
    };

    if (pageLoading) return <div className="p-8 text-center font-semibold text-gray-600">Carregando solicitações de atribuição...</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-5 sm:p-8 rounded-2xl shadow-subtle max-w-7xl mx-auto border border-gray-200/80">
                <header className="border-b border-gray-200/80 pb-6 mb-6">
                    <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-md flex items-center gap-3">
                        <FiUserPlus />
                        Solicitações de Atribuição
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">Aprove ou recuse os pedidos dos técnicos para se atribuírem a chamados abertos.</p>
                </header>

                <div className="space-y-4">
                    <AnimatePresence>
                        {pedidos.length > 0 ? (
                            pedidos.map(pedido => (
                                <PedidoCard
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
            
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </AnimatePresence>
        </div>
    );
}