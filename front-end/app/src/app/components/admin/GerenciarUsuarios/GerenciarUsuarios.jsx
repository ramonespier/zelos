'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { FiFilter, FiEdit, FiX, FiPlus, FiSearch, FiAlertTriangle, FiCheckCircle, FiChevronDown, FiInbox, FiSlash, FiLoader, FiChevronLeft, FiChevronRight, FiUser, FiUserCheck, FiUserX, FiMail, FiBriefcase, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../../../lib/api';

const capitalize = (s = '') => {
    if (!s) return '';
    const str = s.replace(/_/g, ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const StatusBadge = ({ status }) => {
    const statusLabel = capitalize(status);
    const config = {
        'Ativo': { icon: <FiUserCheck />, color: 'green' },
        'Inativo': { icon: <FiUserX />, color: 'red' },
    };
    const { icon, color } = config[statusLabel] || { icon: <FiUser />, color: 'gray' };
    const colorClasses = `bg-${color}-100 text-${color}-800`;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
            {icon} {statusLabel}
        </span>
    );
};

const FuncaoBadge = ({ funcao }) => {
    const funcaoLabel = capitalize(funcao);
    const config = {
        'Admin': { color: 'red' },
        'Tecnico': { color: 'blue' },
        'Usuario': { color: 'green' },
    };
    const { color } = config[funcaoLabel] || { color: 'gray' };
    const colorClasses = `bg-${color}-100 text-${color}-800`;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
            {funcaoLabel}
        </span>
    );
};

const Spinner = () => <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />;

const ReportCard = ({ title, count, icon, color, onClick, isActive, isLoading, isClickable = true }) => {
    const baseClasses = "flex flex-col p-5 rounded-xl shadow-lg transition-all duration-300 transform bg-white";
    
    let clickClasses = "";
    if (isClickable) {
        clickClasses = "cursor-pointer hover:scale-[1.02] active:scale-[0.98]";
    } else {
        clickClasses = "cursor-default";
    }

    const borderColor = color === 'red' ? 'red' : color;

    const activeClasses = isActive 
        ? `border-2 border-red-500`
        : `hover:shadow-xl`;
    
    const handleClick = () => {
        if (isClickable && onClick) {
            onClick();
        }
    };

    return (
        <motion.div 
            layout 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`${baseClasses} ${clickClasses} ${activeClasses} min-w-[200px]`}
            onClick={handleClick}
        >
            <div className={`text-${color}-600 p-2 rounded-full bg-${color}-100/70 w-fit mb-3`}>
                {icon}
            </div>
            <p className="text-xl font-extrabold text-gray-800">
                {isLoading ? <FiLoader className="animate-spin inline-block mr-1 text-base" /> : count}
            </p>
            <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
        </motion.div>
    );
};

const Paginacao = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-between sm:justify-end gap-4 mt-6">
            <div className="text-sm text-gray-600 hidden sm:block">
                Página {currentPage} de {totalPages}
            </div>
            
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <FiChevronLeft size={16} />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                            currentPage === page
                                ? 'bg-red-600 text-white border-red-600'
                                : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <FiChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [counts, setCounts] = useState({
        todos: 0,
        ativos: 0,
        tecnicos: 0,
        admins: 0,
    });
    
    const [countsLoading, setCountsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [userToToggle, setUserToToggle] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroFuncao, setFiltroFuncao] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchCounts = useCallback(async () => {
        setCountsLoading(true);
        try {
            const usuariosRes = await api.get('/usuarios');
            const todosUsuarios = usuariosRes.data || [];

            const ativosCount = todosUsuarios.filter(u => u.status === 'ativo').length;
            const tecnicosCount = todosUsuarios.filter(u => u.funcao === 'tecnico').length;
            const adminsCount = todosUsuarios.filter(u => u.funcao === 'admin').length;

            setCounts({
                todos: todosUsuarios.length,
                ativos: ativosCount,
                tecnicos: tecnicosCount,
                admins: adminsCount,
            });
        } catch (error) {
            console.error("Erro ao buscar contagens:", error);
            if (countsLoading) toast.error("Falha ao carregar dados de resumo."); 
        } finally {
            setCountsLoading(false);
        }
    }, [countsLoading]);

    const fetchUsuariosData = async () => {
        if (!usuarios.length) setPageLoading(true);
        try {
            const usuariosRes = await api.get('/usuarios');
            setUsuarios(usuariosRes.data);
        } catch (error) {
            toast.error("Erro ao carregar dados da tabela.");
            console.error("Erro ao buscar dados da tabela:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchUsuariosData();
        fetchCounts();
        toast.info("A atualizar dados...");
    }

    useEffect(() => {
        fetchUsuariosData();
        fetchCounts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtroStatus, filtroFuncao, pesquisa]);

    const handleSave = async () => {
        if (!editingUser) return;
        setActionLoading(true);
        try {
            await api.patch(`/usuarios/${editingUser.id}`, {
                nome: editingUser.nome,
                email: editingUser.email,
                funcao: editingUser.funcao,
                especialidade: editingUser.especialidade || null
            });
            await fetchUsuariosData();
            fetchCounts();
            setEditingUser(null);
            toast.success('Usuário atualizado com sucesso!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Falha ao atualizar o usuário.');
            console.error('Falha na atualização:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!userToToggle) return;
        setActionLoading(true);
        try {
            const novoStatus = userToToggle.status === 'ativo' ? 'inativo' : 'ativo';
            await api.patch(`/usuarios/${userToToggle.id}/status`, { status: novoStatus });
            await fetchUsuariosData();
            fetchCounts();
            setUserToToggle(null);
            toast.success(`Usuário ${novoStatus === 'ativo' ? 'ativado' : 'inativado'} com sucesso!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Falha ao alterar status do usuário.');
            console.error('Falha ao alterar status:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return usuarios.filter(u => {
            const matchesSearch = u.nome.toLowerCase().includes(pesquisa.toLowerCase()) || 
                                u.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
                                u.username.toLowerCase().includes(pesquisa.toLowerCase());
            const matchesStatus = filtroStatus === '' || u.status === filtroStatus;
            const matchesFuncao = filtroFuncao === '' || u.funcao === filtroFuncao;
            
            return matchesSearch && matchesStatus && matchesFuncao;
        });
    }, [usuarios, pesquisa, filtroStatus, filtroFuncao]);

    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredUsers.slice(startIndex, endIndex);

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

    if (pageLoading) {
        return <div className="flex justify-center items-center h-[50vh]"><FiLoader className="animate-spin text-4xl text-red-600" /></div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ReportCard 
                        title="Todos os Usuários"
                        count={counts.todos}
                        icon={<FiUser size={24} />}
                        color="red"
                        isLoading={countsLoading}
                        onClick={() => {
                            setFiltroStatus('');
                            setFiltroFuncao('');
                            setCurrentPage(1);
                        }}
                        isActive={filtroStatus === '' && filtroFuncao === ''}
                    />
                    <ReportCard 
                        title="Usuários Ativos"
                        count={counts.ativos}
                        icon={<FiUserCheck size={24} />}
                        color="green"
                        isLoading={countsLoading}
                        onClick={() => { 
                            setFiltroStatus('ativo');
                            setFiltroFuncao('');
                            setCurrentPage(1);
                        }}
                        isActive={filtroStatus === 'ativo'}
                    />
                    <ReportCard 
                        title="Técnicos"
                        count={counts.tecnicos}
                        icon={<FiBriefcase size={24} />}
                        color="blue"
                        isLoading={countsLoading}
                        onClick={() => {
                            setFiltroFuncao('tecnico');
                            setFiltroStatus('');
                            setCurrentPage(1);
                        }}
                        isActive={filtroFuncao === 'tecnico'}
                    />
                    <ReportCard 
                        title="Administradores"
                        count={counts.admins}
                        icon={<FiUserCheck size={24} />}
                        color="purple"
                        isLoading={countsLoading}
                        onClick={() => {
                            setFiltroFuncao('admin');
                            setFiltroStatus('');
                            setCurrentPage(1);
                        }}
                        isActive={filtroFuncao === 'admin'}
                    />
                </div>
                
                <motion.div className="bg-white p-5 sm:p-8 rounded-2xl shadow-subtle border border-gray-200/80">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="min-h-[400px]"
                    >
                        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/80 pb-6 mb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-md">Gerenciamento de Usuários</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {totalItems} usuário{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
                                    {filtroStatus && ` • Filtrado por status: ${capitalize(filtroStatus)}`}
                                    {filtroFuncao && ` • Filtrado por função: ${capitalize(filtroFuncao)}`}
                                </p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <motion.button
                                    onClick={handleRefresh}
                                    disabled={countsLoading || pageLoading}
                                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition-all w-full sm:w-auto justify-center cursor-pointer disabled:opacity-50 disabled:cursor-wait">
                                    {countsLoading || pageLoading ? <FiLoader size={18} className="animate-spin" /> : <FiRefreshCw size={18} />} 
                                    Atualizar
                                </motion.button>
                            </div>
                        </header>

                        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                            <div className="relative w-full md:flex-1 group">
                                <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Pesquisar por nome, email ou username..." 
                                    className="bg-zinc-100 border-2 border-transparent p-3 pl-12 rounded-lg w-full focus:bg-white focus:border-red-500 transition-all outline-none" 
                                    value={pesquisa} 
                                    onChange={e => setPesquisa(e.target.value)} 
                                />
                            </div>
                            <div className="relative w-full md:w-auto group">
                                <FiFilter className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <FiChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select 
                                    className="bg-zinc-100 border-2 border-transparent font-medium text-gray-700 p-3 pl-12 rounded-lg w-full md:w-48 appearance-none focus:bg-white focus:border-red-500 transition-all outline-none" 
                                    value={filtroStatus} 
                                    onChange={e => setFiltroStatus(e.target.value)}
                                >
                                    <option value="">Todos os Status</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                            <div className="relative w-full md:w-auto group">
                                <FiFilter className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <FiChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select 
                                    className="bg-zinc-100 border-2 border-transparent font-medium text-gray-700 p-3 pl-12 rounded-lg w-full md:w-48 appearance-none focus:bg-white focus:border-red-500 transition-all outline-none" 
                                    value={filtroFuncao} 
                                    onChange={e => setFiltroFuncao(e.target.value)}
                                >
                                    <option value="">Todas as Funções</option>
                                    <option value="admin">Admin</option>
                                    <option value="tecnico">Técnico</option>
                                    <option value="usuario">Usuário</option>
                                </select>
                            </div>
                            <div className="relative w-full md:w-auto group">
                                <select 
                                    value={itemsPerPage} 
                                    onChange={e => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="bg-zinc-100 border-2 border-transparent font-medium text-gray-700 p-3 rounded-lg w-full md:w-32 appearance-none focus:bg-white focus:border-red-500 transition-all outline-none"
                                >
                                    <option value={5}>5 por página</option>
                                    <option value={10}>10 por página</option>
                                    <option value={20}>20 por página</option>
                                    <option value={50}>50 por página</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <motion.table variants={containerVariants} initial="hidden" animate="show" className="w-full text-left table-auto hidden md:table">
                                <thead className="bg-gray-50/70 text-gray-600 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Nome</th>
                                        <th className="px-4 py-3 font-semibold">Username</th>
                                        <th className="px-4 py-3 font-semibold">Email</th>
                                        <th className="px-4 py-3 font-semibold">Função</th>
                                        <th className="px-4 py-3 font-semibold">Especialidade</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? currentItems.map((usuario, index) => (
                                        <motion.tr variants={itemVariants} key={`${usuario.id}-${index}`} className="border-b border-gray-200/80 hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-4 py-4 font-medium text-gray-800">{usuario.nome}</td>
                                            <td className="px-4 py-4 font-mono text-sm text-gray-500">{usuario.username}</td>
                                            <td className="px-4 py-4 text-gray-600 flex items-center gap-2">
                                                <FiMail className="text-gray-400" size={14} />
                                                {usuario.email}
                                            </td>
                                            <td className="px-4 py-4"><FuncaoBadge funcao={usuario.funcao} /></td>
                                            <td className="px-4 py-4 text-gray-600">{usuario.especialidade || 'N/A'}</td>
                                            <td className="px-4 py-4"><StatusBadge status={usuario.status} /></td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2 justify-end">
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }} 
                                                        whileTap={{ scale: 0.9 }} 
                                                        onClick={() => setEditingUser({ ...usuario })} 
                                                        aria-label="Editar" 
                                                        className="p-2 cursor-pointer text-gray-400 hover:text-blue-600"
                                                    >
                                                        <FiEdit size={18} />
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }} 
                                                        whileTap={{ scale: 0.9 }} 
                                                        onClick={() => setUserToToggle(usuario)} 
                                                        aria-label={usuario.status === 'ativo' ? 'Inativar' : 'Ativar'} 
                                                        className={`p-2 cursor-pointer ${
                                                            usuario.status === 'ativo' 
                                                                ? 'text-gray-400 hover:text-red-600' 
                                                                : 'text-gray-400 hover:text-green-600'
                                                        }`}
                                                    >
                                                        {usuario.status === 'ativo' ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <motion.tr>
                                            <td colSpan="7" className="text-center py-12 text-gray-500">
                                                <FiInbox className="mx-auto text-3xl mb-2" />
                                                Nenhum usuário encontrado.
                                            </td>
                                        </motion.tr>
                                    )}
                                </tbody>
                            </motion.table>
                        </div>

                        {totalPages > 1 && (
                            <Paginacao 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {(editingUser || userToToggle) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                                {editingUser && (
                                    <>
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-xl text-gray-800">Editar Usuário</h3>
                                                <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full">
                                                    <FiX />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 mb-1 block">Nome</label>
                                                    <input 
                                                        type="text"
                                                        value={editingUser.nome}
                                                        onChange={e => setEditingUser({ ...editingUser, nome: e.target.value })}
                                                        className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg focus:outline-none focus:bg-white focus:border-red-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                                                    <input 
                                                        type="email"
                                                        value={editingUser.email}
                                                        onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                                        className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg focus:outline-none focus:bg-white focus:border-red-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 mb-1 block">Função</label>
                                                    <select 
                                                        value={editingUser.funcao} 
                                                        onChange={e => setEditingUser({ ...editingUser, funcao: e.target.value })} 
                                                        className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg appearance-none focus:outline-none focus:bg-white focus:border-red-500"
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="tecnico">Técnico</option>
                                                        <option value="usuario">Usuário</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600 mb-1 block">Especialidade</label>
                                                    <input 
                                                        type="text"
                                                        value={editingUser.especialidade || ''}
                                                        onChange={e => setEditingUser({ ...editingUser, especialidade: e.target.value })}
                                                        placeholder="Opcional - apenas para técnicos"
                                                        className="w-full bg-zinc-100 border-2 border-transparent p-3 rounded-lg focus:outline-none focus:bg-white focus:border-red-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                            <motion.button 
                                                type="button" 
                                                onClick={() => setEditingUser(null)} 
                                                whileHover={{ scale: 1.05 }} 
                                                whileTap={{ scale: 0.95 }} 
                                                className="cursor-pointer py-2 px-5 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 transition"
                                            >
                                                Voltar
                                            </motion.button>
                                            <motion.button 
                                                onClick={handleSave} 
                                                disabled={actionLoading} 
                                                className="cursor-pointer py-2 px-5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 flex justify-center items-center gap-2 disabled:bg-red-400" 
                                                whileHover={{ scale: 1.05 }} 
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {actionLoading ? <Spinner /> : 'Salvar Alterações'}
                                            </motion.button>
                                        </div>
                                    </>
                                )}
                                {userToToggle && (
                                    <div className="p-6 text-center">
                                        <FiAlertTriangle className="mx-auto text-red-500 text-5xl mb-4" />
                                        <h3 className="font-bold text-xl mb-2 text-gray-800">
                                            {userToToggle.status === 'ativo' ? 'Confirmar Inativação' : 'Confirmar Ativação'}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Tem certeza de que deseja {userToToggle.status === 'ativo' ? 'inativar' : 'ativar'} o usuário "{userToToggle.nome}"?
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            <motion.button 
                                                onClick={() => setUserToToggle(null)} 
                                                disabled={actionLoading} 
                                                className="cursor-pointer py-2 px-6 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700" 
                                                whileHover={{ scale: 1.05 }} 
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Voltar
                                            </motion.button>
                                            <motion.button 
                                                onClick={handleToggleStatus} 
                                                disabled={actionLoading} 
                                                className={`cursor-pointer py-2 px-6 rounded-lg text-white font-semibold flex items-center justify-center gap-2 min-w-[120px] ${
                                                    userToToggle.status === 'ativo' 
                                                        ? 'bg-red-600 hover:bg-red-700' 
                                                        : 'bg-green-600 hover:bg-green-700'
                                                }`} 
                                                whileHover={{ scale: 1.05 }} 
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {actionLoading ? <Spinner /> : (userToToggle.status === 'ativo' ? 'Inativar' : 'Ativar')}
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <span className="hidden bg-red-100 text-red-800 bg-green-100 text-green-800 bg-blue-100 text-blue-800 bg-purple-100 text-purple-800"></span>
        </div>
    );
}