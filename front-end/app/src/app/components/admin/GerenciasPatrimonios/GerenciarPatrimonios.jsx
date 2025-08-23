'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiAlertTriangle, FiLoader, FiPackage, FiX } from 'react-icons/fi';
import api from '../../../lib/api';
import { toast } from 'sonner'; // <<< IMPORTAÇÃO DA SONNER

// --- SUBCOMPONENTES DE MODAIS ---
// Estes componentes continuam os mesmos, pois a lógica de toast agora é externa a eles.

function ConfirmationModal({ title, message, onConfirm, onCancel, isLoading }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl w-full max-w-sm text-center p-6 shadow-2xl">
                <FiAlertTriangle className="mx-auto text-red-500 text-5xl mb-4" />
                <h3 className="font-bold text-xl text-gray-800">{title}</h3>
                <p className="text-gray-600 my-4">{message}</p>
                <div className="flex gap-4 justify-center mt-6">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onCancel} className="py-2 cursor-pointer px-6 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 ">Cancelar</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onConfirm} disabled={isLoading} className="py-2 cursor-pointer px-6 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold flex items-center justify-center gap-2 min-w-[120px]">
                        {isLoading ? <FiLoader className="animate-spin"/> : 'Confirmar'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function PatrimonioModal({ equipamento, onClose, onSave, isLoading }) {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-gray-800">{isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}</h3>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition-colors"><FiX /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Patrimônio*</label>
                                <input type="text" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)}
                                    disabled={isEditing} required
                                    className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg focus:bg-white focus:border-red-500 transition-all outline-none disabled:bg-gray-200 disabled:cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Nome do Equipamento</label>
                                <input type="text" value={nomeEquipamento} onChange={(e) => setNomeEquipamento(e.target.value)}
                                    placeholder="Ex: Computador Dell Optiplex"
                                    className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg focus:bg-white focus:border-red-500 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Sala / Localização</label>
                                <input type="text" value={sala} onChange={(e) => setSala(e.target.value)}
                                    placeholder="Ex: Sala 101, Laboratório 3"
                                    className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg focus:bg-white focus:border-red-500 transition-all outline-none" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                        <motion.button type="button" onClick={onClose} className="py-2 px-5  cursor-pointer rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 transition" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Cancelar</motion.button>
                        <motion.button type="submit" disabled={isLoading} className="py-2 px-5 rounded-lg cursor-pointer text-white bg-red-600 hover:bg-red-700 font-semibold disabled:bg-red-400 flex items-center gap-2 transition" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            {isLoading && <FiLoader className="animate-spin" />}
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function GerenciarPatrimonios() {
    const [equipamentos, setEquipamentos] = useState([]);
    const [pesquisa, setPesquisa] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [modal, setModal] = useState({ formOpen: false, deleteOpen: false });
    const [selectedEquipamento, setSelectedEquipamento] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    // O estado do toast foi removido, pois a sonner gerencia isso globalmente

    const fetchData = async () => {
        setPageLoading(true);
        try {
            const response = await api.get('/equipamentos');
            setEquipamentos(response.data);
        } catch (error) {
            toast.error("Erro ao carregar equipamentos.");
        } finally {
            setPageLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (data) => {
        setActionLoading(true);
        try {
            if (selectedEquipamento) {
                await api.patch(`/equipamentos/${selectedEquipamento.patrimonio}`, data);
                toast.success("Equipamento atualizado com sucesso!");
            } else {
                await api.post('/equipamentos', data);
                toast.success("Equipamento criado com sucesso!");
            }
            setModal({ formOpen: false, deleteOpen: false });
            setSelectedEquipamento(null);
            await fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Ocorreu um erro.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedEquipamento) return;
        setActionLoading(true);
        try {
            await api.delete(`/equipamentos/${selectedEquipamento.patrimonio}`);
            toast.success("Equipamento excluído com sucesso!");
            setModal({ formOpen: false, deleteOpen: false });
            await fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erro ao excluir.");
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
    

    if (pageLoading) return <div className="p-8 flex justify-center items-center h-[50vh]"><FiLoader className="text-4xl text-red-600 animate-spin"/></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-5 sm:p-8 rounded-2xl shadow-subtle max-w-7xl mx-auto border border-gray-200/80">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-md">Gerenciar Patrimônios</h1>
                        <p className="text-sm text-gray-600 mt-1">Adicione, edite ou remova equipamentos do sistema.</p>
                    </div>
                    <motion.button onClick={() => openFormModal()} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-red-600 text-white font-semibold cursor-pointer py-2.5 px-5 rounded-lg shadow-sm hover:bg-red-700 transition-all w-full sm:w-auto justify-center">
                        <FiPlus /> Novo Equipamento
                    </motion.button>
                </header>
            
                <div className="mb-6 relative group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600" />
                    <input type="text" placeholder="Buscar por patrimônio, sala ou nome do equipamento..." value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-100 border-2 border-transparent rounded-lg focus:bg-white focus:border-red-500 transition-all outline-none"
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <motion.table initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } }}}
                        className="w-full text-left text-sm table-auto">
                        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Patrimônio</th>
                                <th className="px-4 py-3 font-semibold">Equipamento</th>
                                <th className="px-4 py-3 font-semibold">Sala/Local</th>
                                <th className="px-4 py-3 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipamentos.map((eq, index) => (
                                <motion.tr variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                                    key={`${eq.patrimonio}-${index}`} className="border-t hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-4 py-4 font-mono font-semibold text-gray-700">{eq.patrimonio}</td>
                                    <td className="px-4 py-4 text-gray-800">{eq.equipamento || '-'}</td>
                                    <td className="px-4 py-4 text-gray-600">{eq.sala || '-'}</td>
                                    <td className="px-4 py-4 text-right">
                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openFormModal(eq)} className="p-2 cursor-pointer text-gray-500 hover:text-blue-600"><FiEdit /></motion.button>
                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openDeleteModal(eq)} className="p-2 cursor-pointer text-gray-500 hover:text-red-600"><FiTrash2 /></motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                             {filteredEquipamentos.length === 0 && (
                                <tr className="border-t">
                                    <td colSpan="4" className="text-center py-16 text-gray-500">
                                        <FiPackage className="mx-auto text-4xl mb-2 text-gray-400" />
                                        Nenhum equipamento encontrado.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </motion.table>
                </div>
            </motion.div>

            <AnimatePresence>
                {modal.formOpen && (
                    <PatrimonioModal 
                        key="form-modal"
                        equipamento={selectedEquipamento}
                        onClose={() => setModal({ ...modal, formOpen: false })}
                        onSave={handleSave}
                        isLoading={actionLoading}
                    />
                )}
                 {modal.deleteOpen && selectedEquipamento && (
                    <ConfirmationModal
                        key="confirm-modal"
                        title="Confirmar Exclusão"
                        message={`Tem certeza que deseja excluir o patrimônio "${selectedEquipamento.patrimonio}"? Esta ação não pode ser desfeita.`}
                        onConfirm={handleDelete}
                        onCancel={() => setModal({ ...modal, deleteOpen: false })}
                        isLoading={actionLoading}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}