'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiCheckCircle, FiClock, FiUsers, FiPieChart, FiTag, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../../lib/api';

const StatCard = ({ icon, title, value, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-subtle border border-gray-200/80 flex items-center gap-5"
    >
        <div className={`p-4 rounded-full bg-${color}-100 text-${color}-600`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className="text-3xl font-extrabold text-gray-800">{value}</p>
        </div>
    </motion.div>
);

const capitalize = (str = '') => {
    if (!str) return '';
    const s = str.replace(/_/g, ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const PIE_COLORS_STATUS = {
    'aberto': '#C62828',     
    'em andamento': '#F97316',
    'concluido': '#16A34A',     
    'cancelado': '#64748B'    
};

const PIE_COLORS_TIPO = ['#B91C1C', '#374151', '#9CA3AF', '#4B5563', '#F87171']; 

export default function DashboardPage() {
    const [statusData, setStatusData] = useState([]);
    const [tipoData, setTipoData] = useState([]);
    const [tecnicoData, setTecnicoData] = useState([]);
    const [generalStats, setGeneralStats] = useState({
        totalChamados: 0,
        chamadosConcluidos: 0,
        tempoMedioGeral: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const results = await Promise.allSettled([
                    api.get('/relatorios?tipo=status'),
                    api.get('/relatorios?tipo=tipo'),
                    api.get('/relatorios?tipo=tecnico')
                ]);

                const errors = results.filter(r => r.status === 'rejected');
                if (errors.length > 0) {
                    const firstError = errors[0].reason;
                    throw new Error(`Falha ao buscar um ou mais relatórios. Detalhe: ${firstError.response?.data?.message || firstError.message}`);
                }

                const fetchedStatusData = results[0].value.data;
                const fetchedTipoData = results[1].value.data;
                const fetchedTecnicoData = results[2].value.data;

                setStatusData(fetchedStatusData);
                setTipoData(fetchedTipoData);
                setTecnicoData(fetchedTecnicoData);

                const totalChamados = fetchedStatusData.reduce((sum, item) => sum + item.total, 0);
                const chamadosConcluidos = fetchedStatusData.find(item => item.status === 'concluido')?.total || 0;
                const validTemposMedios = fetchedTecnicoData.filter(item => item.tempo_medio_resolucao_minutos != null).map(item => parseFloat(item.tempo_medio_resolucao_minutos));
                const tempoMedioGeral = validTemposMedios.length > 0 ? Math.round(validTemposMedios.reduce((sum, avg) => sum + avg, 0) / validTemposMedios.length) : 0;
                setGeneralStats({ totalChamados, chamadosConcluidos, tempoMedioGeral });
            } catch (err) {
                console.error("Erro detalhado ao buscar relatórios:", err);
                setError(err.message || "Falha ao carregar os dados dos relatórios.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllReports();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><FiLoader className="animate-spin text-4xl text-red-600"/></div>;
    if (error) return <div className="text-center p-10 font-semibold text-red-600 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans bg-gray-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-extrabold text-gray-800">Dashboard de Análise</h1>
                    <p className="text-sm text-gray-600 mt-1">Visão geral dos chamados e performance da equipe.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard icon={<FiTrendingUp size={24} />} title="Total de Chamados" value={generalStats.totalChamados} color="red" />
                    <StatCard icon={<FiCheckCircle size={24} />} title="Chamados Concluídos" value={generalStats.chamadosConcluidos} color="green" />
                    <StatCard icon={<FiClock size={24} />} title="Tempo Médio de Resolução" value={`${generalStats.tempoMedioGeral} min`} color="yellow" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div className="bg-white p-6 rounded-2xl shadow-subtle border border-gray-200/80">
                        <div className="flex items-center gap-3 mb-4">
                            <FiPieChart className="text-red-600" size={20} />
                            <h2 className="font-bold text-lg text-gray-800">Chamados por Status</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={statusData} dataKey="total" nameKey="status" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${capitalize(name)}: ${(percent * 100).toFixed(0)}%`}>
                                    {statusData.map((entry) => <Cell key={`cell-status-${entry.status}`} fill={PIE_COLORS_STATUS[entry.status.toLowerCase()] || '#9CA3AF'} />)}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, capitalize(name)]} />
                                <Legend iconType="circle" formatter={capitalize} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div className="bg-white p-6 rounded-2xl shadow-subtle border border-gray-200/80">
                        <div className="flex items-center gap-3 mb-4">
                            <FiTag className="text-red-600" size={20} />
                            <h2 className="font-bold text-lg text-gray-800">Chamados por Tipo</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={tipoData} dataKey="total" nameKey="tipo_chamado" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                                    {tipoData.map((entry, index) => <Cell key={`cell-tipo-${index}`} fill={PIE_COLORS_TIPO[index % PIE_COLORS_TIPO.length]} stroke={'#fff'}/>)}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, capitalize(name)]} />
                                <Legend iconType="circle" formatter={capitalize} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                <motion.div className="bg-white p-6 rounded-2xl shadow-subtle border border-gray-200/80">
                    <div className="flex items-center gap-3 mb-4">
                        <FiUsers className="text-red-600" size={20} />
                        <h2 className="font-bold text-lg text-gray-800">Performance dos Técnicos</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={tecnicoData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="tecnico_nome" fontSize={12} tick={{ fill: '#4B5563' }} />
                            <YAxis yAxisId="left" orientation="left" stroke="#B91C1C" />
                            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                            <Tooltip
                                cursor={{ fill: 'rgba(185, 28, 28, 0.05)' }}
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '0.75rem' }}/>
                            <Legend />
                            <Bar yAxisId="left" dataKey="total_chamados" name="Total de Chamados" fill="#B91C1C" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="tempo_medio_resolucao_minutos" name="Tempo Médio (min)" fill="#6B7280" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
            <span className="hidden bg-red-100 text-red-600 bg-yellow-100 text-yellow-600 bg-green-100 text-green-600 bg-gray-100 text-gray-800"></span>
        </div>
    );
}