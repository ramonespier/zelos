'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// --- Ícones aprimorados ---
import { XMarkIcon, CalendarDaysIcon, ClockIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../../../lib/api';

export default function ApontamentoModal({ chamado, tecnicoId, onClose, onSuccess }) {
    const [descricao, setDescricao] = useState("");
    const [comeco, setComeco] = useState("");
    const [fim, setFim] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (chamado) {
            setDescricao("");
            // Pré-popula a data de início com a data e hora atuais para conveniência
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setComeco(now.toISOString().slice(0, 16));

            setFim("");
            setErro("");
        }
    }, [chamado]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setLoading(true);

        const payload = {
            chamado_id: chamado.id,
            tecnico_id: tecnicoId,
            descricao,
            comeco,
            fim: fim || null
        };

        try {
            const response = await api.post('/apontamentos', payload);
            setLoading(false);
            onSuccess(response.data); // Envia o novo apontamento para o componente pai
            onClose();
        } catch (err) {
            setLoading(false);
            setErro(err.response?.data?.message || 'Erro ao criar apontamento.');
        }
    };
    
    if (!chamado) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="apontamentoModalBackdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose} >
                <motion.div
                    key="apontamentoModalContent"
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-gray-200"
                    onClick={(e) => e.stopPropagation()} >
                    
                    <div className="flex justify-between items-center pb-4 border-b">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Criar Apontamento</h2>
                            <p className="text-sm text-gray-500">Registre o trabalho realizado para o chamado #{chamado.id}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                            <XMarkIcon className="w-6 h-6"/>
                        </button>
                    </div>

                    {erro && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm my-4">{erro}</p>}

                    <form onSubmit={handleSubmit} className="space-y-5 pt-5">
                        <div className="relative">
                            <PencilSquareIcon className="w-5 h-5 text-gray-400 absolute left-3 top-11" />
                            <label className="block text-sm font-semibold text-gray-700">Descrição do Serviço*</label>
                            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required
                                placeholder="Ex: Realizada a troca do cabo de força e testes..."
                                className="mt-2 w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="relative">
                                <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute left-3 top-11" />
                                <label className="block text-sm font-semibold text-gray-700">Início*</label>
                                <input type="datetime-local" value={comeco} onChange={(e) => setComeco(e.target.value)} required
                                    className="mt-2 cursor-pointer   w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                                />
                            </div>
                             <div className="relative">
                                <ClockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-11" />
                                <label className="block text-sm  font-semibold text-gray-700">Fim (opcional)</label>
                                <input type="datetime-local" value={fim} onChange={(e) => setFim(e.target.value)}
                                    className="mt-2 w-full border cursor-pointer border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className={`w-full mt-4 px-4 py-3 rounded-lg cursor-pointer text-white font-bold transition-colors flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
                            <PlusIcon className="w-5 h-5" />
                            {loading ? 'Salvando...' : 'Adicionar Apontamento'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}