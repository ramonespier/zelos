'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiAlertTriangle, FiCheckCircle, FiLoader, FiPackage, FiX } from 'react-icons/fi';
import api from '../../../lib/api';

// --- SUBCOMPONENTES DE UI ---

const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
        className={`fixed bottom-6 right-6 py-3 px-5 rounded-lg shadow-2xl flex items-center gap-3 z-50 ${type === 'error' ? 'bg-red-600' : 'bg-gray-900'} text-white`}>
        {type === 'success' ? <FiCheckCircle className="text-green-400" /> : <FiAlertTriangle className="text-yellow-400" />}
        <span className="font-medium">{message}</span>
    </motion.div>
);

const ConfirmationModal = ({ title, message, onConfirm, onCancel, isLoading }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            className="bg-white rounded-xl w-full max-w-sm text-center p-6 shadow-2xl">
            <FiAlertTriangle className="mx-auto text-red-500 text-5xl mb-4" />
            <h3 className="font-bold text-xl text-gray-800">{title}</h3>
            <p className="text-gray-600 my-4">{message}</p>
            <div className="flex gap-4 justify-center mt-6">
                <button onClick={onCancel} className="py-2 px-6 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700">Cancelar</button>
                <button onClick={onConfirm} disabled={isLoading} className="py-2 px-6 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold flex items-center justify-center gap-2 min-w-[120px]">
                    {isLoading ? <FiLoader className="animate-spin"/> : 'Confirmar'}
                </button>
            </div>
        </motion.div>
    </motion.div>
);

const PatrimonioModal = ({ equipamento, onClose, onSave, isLoading }) => {
    const [patrimonio, setPatrimonio] = useState(equipamento?.patrimonio || '');
    const [sala, setSala] = useState(equipamento?.sala || '');
    const [nomeEquipamento, setNomeEquipamento] = useState(equipamento?.equipamento || '');
    const isEditing = !!equipamento;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ patrimonio, sala, equipamento: nomeEquipamento });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl text-gray-800">{isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-full"><FiX /></button>
                    </div>
                    <form id="patrimonio-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Patrimônio*</label>
                            <input type="text" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)}
                                disabled={isEditing} required
                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Sala / Localização</label>
                            <input type="text" value={sala} onChange={(e) => setSala(e.target.value)}
                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">Nome do Equipamento</label>
                            <input type="text" value={nomeEquipamento} onChange={(e) => setNomeEquipamento(e.target.value)}
                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition" />
                        </div>
                    </form>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                    <button onClick={onClose} className="py-2 px-5 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 transition">Cancelar</button>
                    <button type="submit" form="patrimonio-form" disabled={isLoading}
                        className="py-2 px-5 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold disabled:bg-red-400 flex items-center gap-2 transition">
                        {isLoading && <FiLoader className="animate-spin" />}
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
    const [modal, setModal] = useState({ formOpen: false, deleteOpen: false });
    const [selectedEquipamento, setSelectedEquipamento] = useState(null);
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

    const showToast = (message, type = 'success') => {
        setToast({ id: Date.now(), message, type });
        setTimeout(() => setToast(null), 3000);
    };
    
    const handleSave = async (data) => {
        setActionLoading(true);
        try {
            if (selectedEquipamento) {
                await api.patch(`/equipamentos/${selectedEquipamento.patrimonio}`, data);
                showToast("Equipamento atualizado com sucesso!");
            } else {
                await api.post('/equipamentos', data);
                showToast("Equipamento criado com sucesso!");
            }
            setModal({ formOpen: false, deleteOpen: false });
            setSelectedEquipamento(null);
            await fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || "Ocorreu um erro.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedEquipamento) return;
        setActionLoading(true);
        try {
            await api.delete(`/equipamentos/${selectedEquipamento.patrimonio}`);
            showToast("Equipamento excluído com sucesso!");
            setModal({ formOpen: false, deleteOpen: false });
            await fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || "Erro ao excluir.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteModal = (equipamento) => {
        setSelectedEquipamento(equipamento);
        setModal({ formOpen: false, deleteOpen: true });
    };

    const openFormModal = (equipamento = null) => {
        setSelectedEquipamento(equipamento);
        setModal({ deleteOpen: false, formOpen: true });
    };
    
    const filteredEquipamentos = useMemo(() => {
        const p = pesquisa.toLowerCase();
        return equipamentos.filter(eq => 
            (eq.patrimonio || '').toLowerCase().includes(p) ||
            (eq.sala || '').toLowerCase().includes(p) ||
            (eq.equipamento || '').toLowerCase().includes(p)
        );
    }, [equipamentos, pesquisa]);
    

    if (isLoading) return <div className="p-8 flex justify-center items-center h-[50vh]"><FiLoader className="text-4xl text-red-600 animate-spin"/></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Gerenciar Patrimônios</h1>
                    <p className="text-sm text-gray-500 mt-1">Adicione, edite ou remova equipamentos do sistema.</p>
                </div>
                <button onClick={() => openFormModal()}
                    className="mt-4 sm:mt-0 flex items-center gap-2 bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-red-700 transition-all">
                    <FiPlus /> Novo Equipamento
                </button>
            </header>
            
            <div className="mb-6 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar por patrimônio, sala ou nome do equipamento..." value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>
            
            <div className="bg-white rounded-lg shadow-subtle border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Patrimônio</th>
                                <th className="p-4">Equipamento</th>
                                <th className="p-4">Sala/Local</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipamentos.map(eq => (
                                <tr key={eq.patrimonio} className="border-t hover:bg-gray-50/50">
                                    <td className="p-4 font-mono font-semibold text-gray-700">{eq.patrimonio}</td>
                                    <td className="p-4 text-gray-800">{eq.equipamento || '-'}</td>
                                    <td className="p-4 text-gray-600">{eq.sala || '-'}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openFormModal(eq)}
                                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"><FiEdit size={18} /></button>
                                        <button onClick={() => openDeleteModal(eq)}
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"><FiTrash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                             {filteredEquipamentos.length === 0 && (
                                <tr className="border-t">
                                    <td colSpan="4" className="text-center py-12 text-gray-500">
                                        <FiPackage className="mx-auto text-4xl mb-2 text-gray-400" />
                                        Nenhum equipamento encontrado.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {modal.formOpen && (
                    <PatrimonioModal 
                        equipamento={selectedEquipamento}
                        onClose={() => setModal({ ...modal, formOpen: false })}
                        onSave={handleSave}
                        isLoading={actionLoading}
                    />
                )}
                 {modal.deleteOpen && selectedEquipamento && (
                    <ConfirmationModal
                        title="Confirmar Exclusão"
                        message={`Tem certeza que deseja excluir o patrimônio "${selectedEquipamento.patrimonio}"? Esta ação não pode ser desfeita.`}
                        onConfirm={handleDelete}
                        onCancel={() => setModal({ ...modal, deleteOpen: false })}
                        isLoading={actionLoading}
                    />
                )}
                {toast && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}