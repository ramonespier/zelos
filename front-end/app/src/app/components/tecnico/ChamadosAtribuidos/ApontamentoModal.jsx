'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../../lib/api'; // Importa a nossa instância do axios

export default function ApontamentoModal({ chamado, tecnicoId, onClose, onSuccess }) {
    const [descricao, setDescricao] = useState("");
    const [comeco, setComeco] = useState("");
    const [fim, setFim] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    // Hook para limpar os campos quando um novo chamado for selecionado para o modal
    useEffect(() => {
        if (chamado) {
            setDescricao("");
            setComeco("");
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
            fim: fim || null // Envia null para o backend se o campo 'fim' estiver vazio
        };

        try {
            // A chamada de API agora usa nossa instância 'api' e a rota correta
            const response = await api.post('/apontamentos', payload);
            setLoading(false);
            onSuccess(response.data); // Chama a função de sucesso do componente pai com os dados do novo apontamento
            onClose(); // Fecha o modal
        } catch (err) {
            setLoading(false);
            // Pega a mensagem de erro específica do backend para exibir ao usuário
            setErro(err.response?.data?.message || 'Erro ao criar apontamento.');
        }
    };
    
    // Se não houver um objeto 'chamado', o modal não é renderizado
    if (!chamado) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="apontamentoModal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
                    onClick={(e) => e.stopPropagation()} // Impede que clicar no modal o feche
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Novo Apontamento</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                            <XMarkIcon className="w-6 h-6 text-gray-600"/>
                        </button>
                    </div>

                    {erro && <p className="text-red-600 bg-red-100 p-2 rounded-lg text-sm mb-4">{erro}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descrição do Serviço*</label>
                            <textarea 
                                value={descricao} 
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                                placeholder="Descreva o trabalho realizado..."
                                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Início*</label>
                            <input
                                type="datetime-local"
                                value={comeco}
                                onChange={(e) => setComeco(e.target.value)}
                                required
                                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fim (opcional)</label>
                            <input
                                type="datetime-local"
                                value={fim}
                                onChange={(e) => setFim(e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'}`}
                        >
                            {loading ? 'Enviando...' : 'Criar Apontamento'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}