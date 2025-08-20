'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiCheckCircle, FiClock, FiUsers, FiPieChart, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';

import api from '../../../lib/api'; // Verifique o caminho real para seu arquivo api.js

// --- COMPONENTES AUXILIARES (sem alteração) ---

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

const PIE_COLORS_STATUS = { 'aberto': '#EF4444', 'em andamento': '#F59E0B', 'concluido': '#10B981', 'cancelado': '#6B7280' };
// As cores podem ser customizadas ou usar classes Tailwind diretas (ex: text-blue-500)
const PIE_COLORS_TIPO = ['#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#FF0077', '#00BFFF']; // Adicione mais cores se houver mais tipos


// --- COMPONENTE PRINCIPAL DA DASHBOARD ---

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
                // Usamos Promise.allSettled para que uma falha não impeça as outras de tentarem
                const results = await Promise.allSettled([
                    api.get('/relatorios?tipo=status'),
                    api.get('/relatorios?tipo=tipo'), // Rota ajustada
                    api.get('/relatorios?tipo=tecnico')
                ]);

                // Verificamos o resultado de cada promessa
                const statusResult = results[0];
                const tipoResult = results[1];
                const tecnicoResult = results[2];

                // Coletamos erros, se houver
                const errors = results.filter(r => r.status === 'rejected');
                if (errors.length > 0) {
                    // Pega o primeiro erro encontrado para exibir
                    const firstError = errors[0].reason;
                    throw new Error(`Falha ao buscar um ou mais relatórios. Detalhe: ${firstError.response?.data?.message || firstError.message}`);
                }

                // Se tudo deu certo, pegamos os dados
                const fetchedStatusData = statusResult.value.data;
                const fetchedTipoData = tipoResult.value.data;
                const fetchedTecnicoData = tecnicoResult.value.data;

                setStatusData(fetchedStatusData);
                setTipoData(fetchedTipoData);
                setTecnicoData(fetchedTecnicoData);

                // Calcular as estatísticas gerais
                const totalChamados = fetchedStatusData.reduce((sum, item) => sum + item.total, 0);
                const chamadosConcluidos = fetchedStatusData.find(item => item.status === 'concluido')?.total || 0;

                const validTemposMedios = fetchedTecnicoData
                    .filter(item => item.tempo_medio_resolucao_minutos != null)
                    .map(item => parseFloat(item.tempo_medio_resolucao_minutos));

                const tempoMedioGeral = validTemposMedios.length > 0
                    ? Math.round(validTemposMedios.reduce((sum, avg) => sum + avg, 0) / validTemposMedios.length)
                    : 0;

                setGeneralStats({ totalChamados, chamadosConcluidos, tempoMedioGeral });

            } catch (err) {
                // Agora o erro será mais específico!
                console.error("Erro detalhado ao buscar relatórios:", err);
                setError(err.message || "Falha ao carregar os dados dos relatórios.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllReports();
    }, []);


    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans bg-gray-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-extrabold text-gray-800">Dashboard de Análise</h1>
                    <p className="text-sm text-gray-600 mt-1">Visão geral dos chamados e performance da equipe.</p>
                </motion.div>

                {/* SEÇÃO DE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard icon={<FiTrendingUp size={24} />} title="Total de Chamados" value={generalStats.totalChamados} color="red" />
                    <StatCard icon={<FiCheckCircle size={24} />} title="Chamados Concluídos" value={generalStats.chamadosConcluidos} color="green" />
                    <StatCard icon={<FiClock size={24} />} title="Tempo Médio de Resolução" value={`${generalStats.tempoMedioGeral} min`} color="yellow" />
                </div>

                {/* SEÇÃO DE GRÁFICOS DE PIZZA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gráfico de Pizza (Chamados por Status) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-subtle border border-gray-200/80"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <FiPieChart className="text-red-600" size={20} />
                            <h2 className="font-bold text-lg text-gray-800">Chamados por Status</h2>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={statusData} dataKey="total" nameKey="status" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                                        {statusData.map((entry, index) => <Cell key={`cell-status-${index}`} fill={PIE_COLORS_STATUS[entry.status] || '#ccc'} />)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Gráfico de Pizza (Chamados por Tipo) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white p-6 rounded-2xl shadow-subtle border border-gray-200/80"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <FiTag className="text-red-600" size={20} />
                            <h2 className="font-bold text-lg text-gray-800">Chamados por Tipo</h2>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={tipoData} dataKey="total" nameKey="tipo_chamado" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                                        {tipoData.map((entry, index) => <Cell key={`cell-tipo-${index}`} fill={PIE_COLORS_TIPO[index % PIE_COLORS_TIPO.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Gráfico de Barras (Performance dos Técnicos) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-subtle border border-gray-200/80"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FiUsers className="text-red-600" size={20} />
                        <h2 className="font-bold text-lg text-gray-800">Performance dos Técnicos</h2>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={tecnicoData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="tecnico_nome" fontSize={12} />
                                {/* yAxisId está usando "left" e "right" mas Recharts automaticamente cria e mapeia */}
                                <YAxis yAxisId="left" orientation="left" stroke="#DC2626" />
                                <YAxis yAxisId="right" orientation="right" stroke="#6366F1" />
                                <Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }} />
                                <Legend />
                                {/* Verifique se o dataKey corresponde aos nomes EXATOS das propriedades nos dados retornados da API */}
                                <Bar yAxisId="left" dataKey="total_chamados" name="Total de Chamados" fill="#DC2626" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="tempo_medio_resolucao_minutos" name="Tempo Médio (min)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}