'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInbox, FiUsers, FiTrendingUp, FiCheckCircle, FiChevronDown, FiCornerUpRight, FiLoader } from 'react-icons/fi';
import api from '../../../lib/api';
import { toast } from 'sonner';         

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-5">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-3 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ChamadoPendenteCard = ({ chamado, tecnicos, onAtribuir }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
        className="bg-white p-5 rounded-lg shadow-sm border border-slate-200/80 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-semibold text-slate-800 w-full">{chamado.titulo}</p>
            <div className="relative w-full sm:w-52 flex-shrink-0">
                <select
                    onChange={(e) => onAtribuir(chamado.id, e.target.value)}
                    className="appearance-none w-full bg-slate-50 border border-slate-300/70 p-2.5 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                    defaultValue=""
                >
                    <option value="" disabled>Atribuir a um técnico...</option>
                    {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
        </div>
    </motion.div>
);

const TecnicoCard = ({ tecnico, chamados, onDesatribuir }) => {
    const getInitials = (name = "") => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                    {getInitials(tecnico.nome)}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{tecnico.nome}</h3>
                    <p className="text-sm text-slate-500">{chamados.length} chamado(s) na fila</p>
                </div>
            </div>
            <div className="space-y-2">
                <AnimatePresence>
                    {chamados.map(chamado => (
                        <motion.div
                            layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            key={chamado.id} className="bg-slate-100 p-2.5 rounded-md text-sm group" >
                            <div className="flex justify-between items-center">
                                <p className="text-slate-700 truncate" title={chamado.titulo}>{chamado.titulo}</p>
                                <button onClick={() => onDesatribuir(chamado.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                    title="Desatribuir" >
                                    <FiCornerUpRight />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function PainelAtribuicaoAdmin() {
    const [tecnicos, setTecnicos] = useState([]);
    const [chamados, setChamados] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    const fetchData = async () => {
        if (!chamados.length) setPageLoading(true);
        try {
            const [chamadosRes, tecnicosRes] = await Promise.all([
                api.get('/chamados'),
                api.get('/usuarios/tecnicos')
            ]);
            
            const mappedChamados = chamadosRes.data.map(c => ({
                id: c.id,
                titulo: c.titulo,
                tecnico: c.tecnico ? c.tecnico.nome : null,
                status: c.status
            }));

            setChamados(mappedChamados);
            setTecnicos(tecnicosRes.data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            toast.error("Erro ao carregar dados. Tente novamente."); 
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAtribuir = async (chamadoId, tecnicoId) => {
        if (!tecnicoId) return;
        try {
            await api.patch(`/chamados/${chamadoId}/atribuir`, { tecnico_id: tecnicoId });
            await fetchData();
            const tecnicoNome = tecnicos.find(t => t.id === tecnicoId)?.nome;
            toast.success(`Atribuído a ${tecnicoNome || 'um técnico'}!`); 
        } catch (error) {
            console.error("Erro ao atribuir chamado:", error.response?.data || error);
            toast.error("Falha ao atribuir chamado."); 
        }
    };

    const handleDesatribuir = async (chamadoId) => {
        try {
            await api.patch(`/chamados/${chamadoId}/atribuir`, { tecnico_id: null });
            await fetchData();
            toast.success('Chamado retornado para a fila.'); 
        } catch (error) {
            console.error("Erro ao desatribuir chamado:", error);
            toast.error("Falha ao desatribuir chamado."); 
        }
    };

    const { pendentes, chamadosAtribuiveis } = useMemo(() => {
        const pendentes = chamados.filter(c => !c.tecnico && c.status === 'aberto');
        const atribuidosAtivos = chamados.filter(c => c.tecnico && (c.status === 'aberto' || c.status === 'em andamento'));
        return { pendentes, chamadosAtribuiveis: atribuidosAtivos };
    }, [chamados]);

    if (pageLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-slate-500">
                <FiLoader className="animate-spin text-4xl mb-4" />
                <p className="text-lg">Carregando painel de atribuição...</p>
            </div>
        );
    }
    
    return (
        <div className="font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-black text-red-600 tracking-tight">Painel de Atribuição</h1>
                    <p className="text-lg text-slate-500 mt-1">Atribua rapidamente os chamados pendentes para a sua equipe.</p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <StatCard icon={<FiTrendingUp className="text-sky-600"/>} label="Total de Chamados Ativos" value={pendentes.length + chamadosAtribuiveis.length} />
                        <StatCard icon={<FiInbox className="text-red-600"/>} label="Pendentes na Fila" value={pendentes.length} />
                        <StatCard icon={<FiUsers className="text-green-600"/>} label="Em Atendimento" value={chamadosAtribuiveis.length} />
                    </div>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <main className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-slate-800 px-2">Fila de Espera</h2>
                        <AnimatePresence>
                            {pendentes.length > 0 ? (
                                pendentes.map(chamado => (
                                    <ChamadoPendenteCard key={chamado.id} chamado={chamado} tecnicos={tecnicos} onAtribuir={handleAtribuir} />
                                ))
                            ) : (
                                <div className="text-center text-slate-500 py-16 bg-white rounded-lg border-2 border-dashed">
                                    <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-2" />
                                    <p className="font-semibold">Fila de chamados vazia. Bom trabalho!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                    <aside className="space-y-6 lg:sticky lg:top-8">
                        <h2 className="text-xl font-bold text-slate-800 px-2">Equipe Técnica</h2>
                        {tecnicos.map(tecnico => (
                            <TecnicoCard
                                key={tecnico.id}
                                tecnico={tecnico}
                                chamados={chamadosAtribuiveis.filter(c => c.tecnico === tecnico.nome)}
                                onDesatribuir={handleDesatribuir}
                            />
                        ))}
                    </aside>
                </div>
            </div>
        </div>
    );
}