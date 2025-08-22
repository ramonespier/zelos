'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import api from '../../../lib/api';


// --- COMPONENTE DO MODAL (para Criar e Editar) ---
const PatrimonioModal = ({ equipamento, onClose, onSave, isLoading }) => {
    const [patrimonio, setPatrimonio] = useState(equipamento ? equipamento.patrimonio : '');
    const [sala, setSala] = useState(equipamento ? equipamento.sala : '');
    const [nomeEquipamento, setNomeEquipamento] = useState(equipamento ? equipamento.equipamento : '');
    const isEditing = !!equipamento;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ patrimonio, sala, equipamento: nomeEquipamento });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-white rounded-xl w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-4">{isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold">Patrimônio*</label>
                            <input type="text" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)}
                                disabled={isEditing} // Não pode editar a chave primária
                                required
                                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-red-500 disabled:bg-gray-100" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Sala / Localização</label>
                            <input type="text" value={sala} onChange={(e) => setSala(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Nome do Equipamento</label>
                            <input type="text" value={nomeEquipamento} onChange={(e) => setNomeEquipamento(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-red-500" />
                        </div>
                    </form>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancelar</button>
                    <button onClick={handleSubmit} disabled={isLoading}
                        className="py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold disabled:bg-red-400">
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function GerenciarPatrimonios() {
    const [equipamentos, setEquipamentos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipamento, setEditingEquipamento] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/equipamentos');
            setEquipamentos(response.data);
        } catch (error) {
            showToast("Erro ao carregar equipamentos.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (message, type = 'success') => { /* ... (copie das outras páginas) ... */ };
    
    const handleSave = async (data) => {
        setActionLoading(true);
        try {
            if (editingEquipamento) { // Modo de Edição
                await api.patch(`/equipamentos/${editingEquipamento.patrimonio}`, data);
                showToast("Equipamento atualizado com sucesso!");
            } else { // Modo de Criação
                await api.post('/equipamentos', data);
                showToast("Equipamento criado com sucesso!");
            }
            setIsModalOpen(false);
            setEditingEquipamento(null);
            fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || "Ocorreu um erro.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (patrimonio) => {
        if (confirm(`Tem certeza que deseja excluir o patrimônio ${patrimonio}?`)) {
            try {
                await api.delete(`/equipamentos/${patrimonio}`);
                showToast("Equipamento excluído com sucesso!");
                fetchData();
            } catch (error) {
                showToast(error.response?.data?.message || "Erro ao excluir.", "error");
            }
        }
    };

    const filteredEquipamentos = useMemo(() => {
        return equipamentos.filter(eq => 
            (eq.patrimonio || '').toLowerCase().includes(pesquisa.toLowerCase()) ||
            (eq.sala || '').toLowerCase().includes(pesquisa.toLowerCase()) ||
            (eq.equipamento || '').toLowerCase().includes(pesquisa.toLowerCase())
        );
    }, [equipamentos, pesquisa]);
    

    if (isLoading) return <p>Carregando equipamentos...</p>;

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-red-600">Gerenciar Patrimônios</h1>
                    <p className="text-sm text-gray-500">Adicione, edite ou remova equipamentos do sistema.</p>
                </div>
                <button onClick={() => { setEditingEquipamento(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-red-700">
                    <FiPlus /> Novo Equipamento
                </button>
            </header>
            
            <div className="mb-4 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar por patrimônio, sala ou nome..." value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
            </div>
            
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3">Patrimônio</th>
                            <th className="p-3">Equipamento</th>
                            <th className="p-3">Sala/Local</th>
                            <th className="p-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEquipamentos.map(eq => (
                            <tr key={eq.patrimonio} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-mono">{eq.patrimonio}</td>
                                <td className="p-3">{eq.equipamento}</td>
                                <td className="p-3">{eq.sala}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => { setEditingEquipamento(eq); setIsModalOpen(true); }}
                                        className="p-2 text-gray-500 hover:text-blue-600"><FiEdit /></button>
                                    <button onClick={() => handleDelete(eq.patrimonio)}
                                        className="p-2 text-gray-500 hover:text-red-600"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <PatrimonioModal 
                        equipamento={editingEquipamento}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                        isLoading={actionLoading}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}