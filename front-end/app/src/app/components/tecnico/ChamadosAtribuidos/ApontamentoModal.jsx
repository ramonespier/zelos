'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function ApontamentoModal({ chamado, tecnicoId, onClose, onSuccess }) {
    const [descricao, setDescricao] = useState("");
    const [comeco, setComeco] = useState("");
    const [fim, setFim] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setLoading(true);
        try {
            const response = await axios.post('/api/apontamentos', {
                chamado_id: chamado.id,
                tecnico_id: tecnicoId,
                descricao,
                comeco,
                fim: fim || null
            });
            setLoading(false);
            onSuccess(response.data);
            onClose();
        } catch (err) {
            setLoading(false);
            setErro(err.response?.data?.message || 'Erro ao criar apontamento.');
        }
    };

    return (
        <AnimatePresence>
            {chamado && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Novo Apontamento</h2>
                            <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-600"/></button>
                        </div>

                        {erro && <p className="text-red-600 mb-2">{erro}</p>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descrição*</label>
                                <textarea 
                                    value={descricao} 
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                    className="mt-1 w-full border rounded-lg p-2 text-sm"
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
                                    className="mt-1 w-full border rounded-lg p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fim</label>
                                <input
                                    type="datetime-local"
                                    value={fim}
                                    onChange={(e) => setFim(e.target.value)}
                                    className="mt-1 w-full border rounded-lg p-2 text-sm"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {loading ? 'Enviando...' : 'Criar Apontamento'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
