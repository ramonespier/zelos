'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiCheckCircle, FiClock, FiUsers, FiPieChart, FiTag } from 'react-icons/fi';

import { motion } from 'framer-motion';

// --- DADOS DE EXEMPLO (simulando o retorno das suas views) ---

// vw_chamados_por_status
const mockStatusData = [
    { status: 'Aberto', total: 15 },
    { status: 'Em Andamento', total: 8 },
    { status: 'Concluído', total: 32 },
    { status: 'Cancelado', total: 5 },
];

// NOVO! vw_chamados_por_tipo
const mockTipoData = [
    { tipo_chamado: 'Manutenção Preventiva', total: 12 },
    { tipo_chamado: 'Suporte de Software', total: 25 },
    { tipo_chamado: 'Reparo de Hardware', total: 18 },
    { tipo_chamado: 'Apoio Técnico Geral', total: 5 },
];

// vw_atividades_tecnicos (com tempo médio)
const mockTecnicoData = [
    { tecnico_nome: 'Ana Silva', total_chamados: 20, tempo_medio_resolucao_minutos: 120 },
    { tecnico_nome: 'Carlos Dias', total_chamados: 18, tempo_medio_resolucao_minutos: 95 },
    { tecnico_nome: 'Bia Costa', total_chamados: 12, tempo_medio_resolucao_minutos: 210 },
    { tecnico_nome: 'Davi Lima', total_chamados: 10, tempo_medio_resolucao_minutos: 150 },
];

// Resumo geral
const mockGeneralStats = {
    totalChamados: 60,
    chamadosConcluidos: 32,
    tempoMedioGeral: 142,
};

// --- COMPONENTES AUXILIARES ---

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

const PIE_COLORS_STATUS = { 'Aberto': '#EF4444', 'Em Andamento': '#F59E0B', 'Concluído': '#10B981', 'Cancelado': '#6B7280' };
const PIE_COLORS_TIPO = ['#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

// --- COMPONENTE PRINCIPAL DA DASHBOARD ---

export default function DashboardPage() {
    const [statusData, setStatusData] = useState(mockStatusData);
    const [tipoData, setTipoData] = useState(mockTipoData); // Estado para os novos dados
    const [tecnicoData, setTecnicoData] = useState(mockTecnicoData);
    const [generalStats, setGeneralStats] = useState(mockGeneralStats);

    // useEffect(() => {
    //   // AQUI VOCÊ FARIA AS CHAMADAS À SUA API PARA BUSCAR OS DADOS REAIS
    // }, []);

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans bg-zinc-50/50">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-extrabold text-gray-800">Dashboard de Análise</h1>
                    <p className="text-sm text-gray-600 mt-1">Visão geral dos chamados e performance da equipe.</p>
                </motion.div>

                {/* SEÇÃO DE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard icon={<FiTrendingUp size={24} />} title="Total de Chamados" value={generalStats.totalChamados} color="blue" />
                    <StatCard icon={<FiCheckCircle size={24} />} title="Chamados Concluídos" value={generalStats.chamadosConcluidos} color="green" />
                    <StatCard icon={<FiClock size={24} />} title="Tempo Médio de Resolução" value={`${generalStats.tempoMedioGeral} min`} color="yellow" />
                </div>

                {/* SEÇÃO DE GRÁFICOS DE PIZZA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gráfico de Pizza (vw_chamados_por_status) */}
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
                                        {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS_STATUS[entry.status]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                    
                    {/* NOVO GRÁFICO: Chamados por Tipo (vw_chamados_por_tipo) */}
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
                                        {tipoData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS_TIPO[index % PIE_COLORS_TIPO.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* GRÁFICO ATUALIZADO: Atividade dos Técnicos (vw_atividades_tecnicos) */}
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
                                <YAxis yAxisId="left" orientation="left" stroke="#DC2626" />
                                <YAxis yAxisId="right" orientation="right" stroke="#6366F1" />
                                <Tooltip cursor={{fill: 'rgba(239, 68, 68, 0.1)'}} />
                                <Legend />
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