'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiFilter, FiEdit, FiX, FiPlus, FiSearch, FiAlertTriangle, FiCheckCircle, FiChevronDown, FiInbox, FiSlash, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../../../lib/api';

const capitalize = (s = '') => {
    if (!s) return '';
    const str = s.replace(/_/g, ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const StatusBadge = ({ status }) => {
    const statusLabel = capitalize(status === 'em andamento' ? 'Em Andamento' : status);
    const config = {
        'Aberto': { icon: <FiAlertTriangle />, color: 'red' },
        'Em Andamento': { icon: <FiLoader className="animate-spin" />, color: 'yellow' },
        'Concluido': { icon: <FiCheckCircle />, color: 'green' },
        'Cancelado': { icon: <FiSlash />, color: 'gray' },
    };
    const { icon, color } = config[statusLabel] || { icon: '?', color: 'gray' };
    const colorClasses = `bg-${color}-100 text-${color}-800`;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
            {icon} {statusLabel}
        </span>
    );
};

const Spinner = () => <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />;

export default function TabelaChamados({ setActiveTab, funcionario }) {
    const [chamados, setChamados] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [editingTicket, setEditingTicket] = useState(null);
    const [ticketToCancel, setTicketToCancel] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        if (!chamados.length) setPageLoading(true);
        try {
            const [chamadosRes, tecnicosRes] = await Promise.all([
                api.get('/chamados'),
                api.get('/usuarios/tecnicos')
            ]);

            setChamados(chamadosRes.data);
            setTecnicos(tecnicosRes.data);
        } catch (error) {
            toast.error("Erro ao carregar dados do sistema.");
            console.error("Erro ao buscar dados:", error);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!editingTicket) return;
        setActionLoading(true);
        try {
            await api.patch(`/chamados/${editingTicket.id}`, {
                titulo: editingTicket.titulo,
                tecnico_id: editingTicket.tecnico_id || null,
                status: editingTicket.status
            });
            await fetchData();
            setEditingTicket(null);
            toast.success('Chamado atualizado com sucesso!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Falha ao atualizar o chamado.');
            console.error('Falha na atualização:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!ticketToCancel) return;
        setActionLoading(true);
        try {
            await api.patch(`/chamados/${ticketToCancel.id}/status`, { status: 'cancelado' });
            await fetchData();
            setTicketToCancel(null);
            toast.success('Chamado cancelado com sucesso!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Falha ao cancelar o chamado.');
            console.error('Falha ao cancelar:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredTickets = useMemo(() => {
        return chamados.filter(c => {
            const tecnicoNome = (c.tecnico ? c.tecnico.nome : 'não atribuído').toLowerCase();
            const p = pesquisa.toLowerCase();
            return (c.titulo.toLowerCase().includes(p) || tecnicoNome.includes(p)) &&
                (filtroStatus === '' || c.status === filtroStatus);
        });
    }, [chamados, pesquisa, filtroStatus]);

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

    if (pageLoading) {
        return <div className="flex justify-center items-center h-[50vh]"><FiLoader className="animate-spin text-4xl text-red-600" /></div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="bg-white p-5 sm:p-8 rounded-2xl shadow-subtle max-w-7xl mx-auto border border-gray-200/80">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-md">Gerenciamento de Chamados</h1>
                        <p className="text-sm text-gray-600 mt-1">Visualize, edite e gerencie todos os chamados.</p>
                    </div>
                    <motion.button
                        onClick={() => setActiveTab('abrir')}
                        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-red-700 transition-all w-full sm:w-auto justify-center cursor-pointer">
                        <FiPlus size={18} /> Novo Chamado
                    </motion.button>
                </header>

                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                    <div className="relative w-full md:flex-1 group">
                        <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                        <input type="text" placeholder="Pesquisar por título ou técnico..." className="bg-zinc-100 border-2 border-transparent p-3 pl-12 rounded-lg w-full focus:bg-white focus:border-red-500 transition-all outline-none" value={pesquisa} onChange={e => setPesquisa(e.target.value)} />
                    </div>
                    <div className="relative w-full md:w-auto group">
                        <FiFilter className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <FiChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select className="bg-zinc-100 border-2 border-transparent font-medium text-gray-700 p-3 pl-12 rounded-lg w-full md:w-60 appearance-none focus:bg-white focus:border-red-500 transition-all outline-none" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                            <option value="">Todos os Status</option>
                            <option value="aberto">Aberto</option>
                            <option value="em andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <motion.table variants={containerVariants} initial="hidden" animate="show" className="w-full text-left table-auto hidden md:table">
                        <thead className="bg-gray-50/70 text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Patrimônio</th>
                                <th className="px-4 py-3 font-semibold">Título</th>
                                <th className="px-4 py-3 font-semibold">Técnico Atribuído</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.length > 0 ? filteredTickets.map((chamado, index) => {
                                const isActionable = chamado.status === 'aberto' || chamado.status === 'em andamento';
                                return (
                                    <motion.tr variants={itemVariants} key={`${chamado.id}-${index}`} className="border-b border-gray-200/80 hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-4 py-4 font-mono text-sm text-gray-500">{chamado.numero_patrimonio || 'N/A'}</td>
                                        <td className="px-4 py-4 font-medium text-gray-800">{chamado.titulo}</td>
                                        <td className="px-4 py-4 text-gray-600">{chamado.tecnico ? chamado.tecnico.nome : 'Não atribuído'}</td>
                                        <td className="px-4 py-4"><StatusBadge status={chamado.status} /></td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2 justify-end">
                                                {isActionable ? (
                                                    <>
                                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingTicket({ ...chamado })} aria-label="Editar" className="p-2 text-gray-400 hover:text-blue-600"><FiEdit size={18} /></motion.button>
                                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setTicketToCancel(chamado)} aria-label="Cancelar" className="p-2 text-gray-400 hover:text-red-600"><FiX size={18} /></motion.button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic pr-4">N/A</span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            }) : (
                                <motion.tr><td colSpan="5" className="text-center py-12 text-gray-500"><FiInbox className="mx-auto text-3xl mb-2" />Nenhum chamado encontrado.</td></motion.tr>
                            )}
                        </tbody>
                    </motion.table>
                </div>
                <AnimatePresence>
                    {(editingTicket || ticketToCancel) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                                {editingTicket && (
                                    <>
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-xl text-gray-800">Editar Chamado <span className="font-mono text-sm text-gray-500">#{editingTicket.id}</span></h3><button onClick={() => setEditingTicket(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full"><FiX /></button></div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 mb-1 block">Técnico</label>
                                                    <select value={editingTicket.tecnico_id || ''} onChange={e => setEditingTicket({ ...editingTicket, tecnico_id: e.target.value })} className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg appearance-none focus:outline-none focus:bg-white focus:border-red-500">
                                                        <option value="">Não atribuído</option>
                                                        {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 mb-1 block">Status</label>
                                                    <select value={editingTicket.status} onChange={e => setEditingTicket({ ...editingTicket, status: e.target.value })} className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg appearance-none focus:outline-none focus:bg-white focus:border-red-500">
                                                        <option value="aberto">Aberto</option>
                                                        <option value="em andamento">Em Andamento</option>
                                                        <option value="concluido">Concluído</option>
                                                        <option value="cancelado">Cancelado</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                            <motion.button type="button" onClick={() => setEditingTicket(null)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-5 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 transition">Voltar</motion.button>
                                            <motion.button onClick={handleSave} disabled={actionLoading} className="py-2 px-5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 flex justify-center items-center gap-2 disabled:bg-red-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{actionLoading ? <Spinner /> : 'Salvar Alterações'}</motion.button>
                                        </div>
                                    </>
                                )}
                                {ticketToCancel && (
                                    <div className="p-6 text-center">
                                        <FiAlertTriangle className="mx-auto text-red-500 text-5xl mb-4" />
                                        <h3 className="font-bold text-xl mb-2 text-gray-800">Confirmar Cancelamento</h3>
                                        <p className="text-gray-600 mb-6">Tem certeza de que deseja cancelar o chamado "{ticketToCancel.titulo}"? Esta ação não pode ser desfeita.</p>
                                        <div className="flex gap-4 justify-center">
                                            <motion.button onClick={() => setTicketToCancel(null)} disabled={actionLoading} className="py-2 px-6 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Voltar</motion.button>
                                            <motion.button onClick={handleCancel} disabled={actionLoading} className="py-2 px-6 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold flex items-center justify-center gap-2 min-w-[120px]" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{actionLoading ? <Spinner /> : 'Sim, Cancelar'}</motion.button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <span className="hidden bg-red-100 text-red-800 bg-yellow-100 text-yellow-800 bg-green-100 text-green-800 bg-gray-100 text-gray-800"></span>
        </div>
    );
}