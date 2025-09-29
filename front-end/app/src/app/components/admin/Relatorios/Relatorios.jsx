'use client';

import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
    FiTrendingUp, FiCheckCircle, FiClock, FiUsers, FiPieChart, 
    FiTag, FiLoader, FiTool, FiAlertTriangle, FiPackage
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../../lib/api';
    
// --- CONSTANTES E UTILS ---

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
    'aberto': '#C62828', // Vermelho
    'em andamento': '#F97316', // Laranja
    'concluido': '#16A34A', // Verde
    'cancelado': '#64748B' // Cinza
};

const PIE_COLORS_TIPO = ['#B91C1C', '#374151', '#9CA3AF', '#4B5563', '#F87171'];
const CHART_COLORS = {
    RED: '#C62828',
    BLUE: '#1E40AF',
    GREEN: '#16A34A',
    YELLOW: '#F59E0B',
    GRAY: '#64748B'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                <p className="font-bold text-gray-800">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="text-sm">
                        {`${p.name}: ${p.dataKey.includes('minutos') ? Math.round(p.value) + ' min' : Math.round(p.value)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- COMPONENTE PRINCIPAL ---

export default function DashboardPage() {
    // --- ESTADOS ---
    const [statusData, setStatusData] = useState([]);
    const [tipoData, setTipoData] = useState([]);
    const [tecnicoData, setTecnicoData] = useState([]);

    // Novos Estados para os Novos Relatórios
    const [chamadosEspera, setChamadosEspera] = useState([]);
    const [eficienciaApontamento, setEficienciaApontamento] = useState([]);
    const [usoPatrimonio, setUsoPatrimonio] = useState([]);

    const [generalStats, setGeneralStats] = useState({ 
        totalChamados: 0, 
        chamadosConcluidos: 0, 
        tempoMedioGeral: 0,
        totalEmEspera: 0
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllReports = async () => {
            setLoading(true);
            setError(null);
            try {
                // Chamadas para os relatórios ORIGINAIS e NOVOS
                const results = await Promise.allSettled([
                    api.get('/relatorios?tipo=status'),
                    api.get('/relatorios?tipo=tipo'),
                    api.get('/relatorios?tipo=tecnico'), // vw_atividades_tecnicos (tempo_medio_resolucao_minutos)
                    api.get('/relatorios?tipo=espera'), // vw_chamados_sem_tecnico (horas_em_espera)
                    api.get('/relatorios?tipo=eficienciaTecnico'), // vw_eficiencia_apontamentos_tecnicos
                    api.get('/relatorios?tipo=usoPatrimonio') // vw_uso_patrimonios_em_chamados
                ]);

                const errors = results.filter(r => r.status === 'rejected');
                if (errors.length > 0) {
                    const firstError = errors[0].reason;
                    // Tenta extrair a mensagem de erro da resposta da API ou usa a mensagem genérica
                    const message = firstError.response?.data?.message || firstError.message;
                    throw new Error(`Falha ao buscar relatórios: ${message}`);
                }

                // Desestruturação dos resultados
                const [statusRes, tipoRes, tecnicoRes, esperaRes, eficienciaRes, patrimonioRes] = results.map(r => r.value.data);

                setStatusData(statusRes);
                setTipoData(tipoRes);
                setTecnicoData(tecnicoRes);
                setChamadosEspera(esperaRes);
                setEficienciaApontamento(eficienciaRes);
                setUsoPatrimonio(patrimonioRes);

                // Cálculo das Estatísticas Gerais
                const totalChamados = statusRes.reduce((sum, item) => sum + item.total, 0);
                const chamadosConcluidos = statusRes.find(item => item.status === 'concluido')?.total || 0;
                
                const validTemposMedios = tecnicoRes.filter(item => item.tempo_medio_resolucao_minutos != null)
                                                    .map(item => parseFloat(item.tempo_medio_resolucao_minutos));
                
                const tempoMedioGeral = validTemposMedios.length > 0 
                    ? Math.round(validTemposMedios.reduce((sum, avg) => sum + avg, 0) / validTemposMedios.length) 
                    : 0;

                const totalEmEspera = esperaRes.length;

                setGeneralStats({ totalChamados, chamadosConcluidos, tempoMedioGeral, totalEmEspera });

            } catch (err) {
                console.error("Erro detalhado ao buscar relatórios:", err);
                setError(err.message || "Falha ao carregar os dados dos relatórios.");
            } finally {
                setLoading(false);
            }
        };

        // Adiciona classes tailwind usadas dinamicamente para que o PurgeCSS as mantenha
        const dummyClasses = "bg-red-100 text-red-600 bg-green-100 text-green-600 bg-yellow-100 text-yellow-600 bg-blue-100 text-blue-600 bg-orange-100 text-orange-600";

        fetchAllReports();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><FiLoader className="animate-spin text-4xl text-red-600"/></div>;
    if (error) return <div className="text-center p-10 font-semibold text-red-600 bg-red-50 rounded-lg max-w-7xl mx-auto">{error}</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg max-w-7xl mx-auto border border-gray-200/80"
            >
                
                <header className="border-b border-gray-200/80 pb-6 mb-8">
                    <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-sm">Dashboard de Análise Operacional</h1>
                    <p className="text-sm text-gray-600 mt-1">Visão geral dos chamados, performance da equipe e utilização de recursos.</p>
                </header>

                {/* --- 1. Cartões de Estatísticas Gerais --- */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={<FiTrendingUp size={24} />} title="Total de Chamados" value={generalStats.totalChamados} color="red" />
                        <StatCard icon={<FiCheckCircle size={24} />} title="Chamados Concluídos" value={generalStats.chamadosConcluidos} color="green" />
                        <StatCard icon={<FiClock size={24} />} title="Tempo Médio Resolução (min)" value={generalStats.tempoMedioGeral} color="yellow" />
                        <StatCard icon={<FiAlertTriangle size={24} />} title="Chamados em Espera (Sem Técnico)" value={generalStats.totalEmEspera} color="orange" />
                    </div>

                    {/* --- 2. Gráficos de Status e Tipo (PIE CHARTS) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gray-50/50 p-6 rounded-xl shadow-inner border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <FiPieChart className="text-red-600" size={20} />
                                <h2 className="font-bold text-lg text-gray-800">Distribuição por Status</h2>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie 
                                        data={statusData} 
                                        dataKey="total" 
                                        nameKey="status" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={100} 
                                        fill="#8884d8"
                                        labelLine={false} 
                                        label={({ name, percent }) => `${capitalize(name)}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {statusData.map((entry) => <Cell key={`cell-status-${entry.status}`} fill={PIE_COLORS_STATUS[entry.status.toLowerCase()] || CHART_COLORS.GRAY} />)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, capitalize(name)]} />
                                    <Legend iconType="circle" formatter={capitalize} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="bg-gray-50/50 p-6 rounded-xl shadow-inner border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <FiTag className="text-red-600" size={20} />
                                <h2 className="font-bold text-lg text-gray-800">Distribuição por Pool/Tipo</h2>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie 
                                        data={tipoData} 
                                        dataKey="total" 
                                        nameKey="tipo_chamado" 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={100} 
                                        paddingAngle={3}
                                    >
                                        {tipoData.map((entry, index) => <Cell key={`cell-tipo-${index}`} fill={PIE_COLORS_TIPO[index % PIE_COLORS_TIPO.length]} stroke={CHART_COLORS.RED}/>)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, capitalize(name)]} />
                                    <Legend iconType="square" formatter={capitalize} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    {/* --- 3. Gráficos de Performance e Utilização --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* --- NOVO GRÁFICO: EFICIÊNCIA DE APONTAMENTO --- */}
                        <div className="bg-gray-50/50 p-6 rounded-xl shadow-inner border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <FiTool className="text-red-600" size={20} />
                                <h2 className="font-bold text-lg text-gray-800">Eficiência de Apontamentos (Tempo Médio por Ação)</h2>
                            </div>
                            
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={eficienciaApontamento} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="tecnico_nome" fontSize={12} tick={{ fill: CHART_COLORS.GRAY }} />
                                        <YAxis orientation="left" stroke={CHART_COLORS.BLUE} domain={[0, 'auto']} tickFormatter={(value) => `${value} min`} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 64, 175, 0.05)' }}/>
                                        <Legend />
                                        <Area 
                                            type="monotone" 
                                            dataKey="duracao_media_apontamento_minutos" 
                                            name="Duração Média (min)" 
                                            stroke={CHART_COLORS.BLUE} 
                                            fill={CHART_COLORS.BLUE} 
                                            fillOpacity={0.4}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* --- NOVO GRÁFICO: UTILIZAÇÃO DE PATRIMÔNIO (Tabela para clareza) --- */}
                        <div className="bg-gray-50/50 p-6 rounded-xl shadow-inner border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <FiPackage className="text-red-600" size={20} />
                                <h2 className="font-bold text-lg text-gray-800">Patrimônios Mais Problemáticos (Uso em Chamados)</h2>
                            </div>
                            
                            <div className="h-[350px] overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-white shadow-sm border-b text-gray-500">
                                        <tr>
                                            <th className="py-2 font-semibold">Patrimônio</th>
                                            <th className="py-2 font-semibold">Equipamento</th>
                                            <th className="py-2 text-center font-semibold">Total de Chamados</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usoPatrimonio.sort((a, b) => b.total_chamados_registrados - a.total_chamados_registrados).map((item, index) => (
                                            <tr key={item.patrimonio} className={`border-b last:border-none ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="py-3 font-mono text-xs text-gray-600">{item.patrimonio}</td>
                                                <td className="py-3 font-semibold text-gray-700">{item.equipamento}</td>
                                                <td className="py-3 text-center font-extrabold text-red-600">{item.total_chamados_registrados}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {usoPatrimonio.length === 0 && (
                                    <div className="text-center py-10 text-gray-500">Nenhum patrimônio registrado em chamados.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- 4. Performance dos Técnicos (ORIGINAL MELHORADO) --- */}
                    <div className="bg-gray-50/50 p-6 rounded-xl shadow-inner border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <FiUsers className="text-red-600" size={20} />
                            <h2 className="font-bold text-lg text-gray-800">Performance Geral dos Técnicos</h2>
                        </div>
                        
                        {/* Tabela para mobile */}
                        <div className="md:hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b text-gray-500">
                                    <tr>
                                        <th className="py-2 font-semibold">Técnico</th>
                                        <th className="py-2 text-center font-semibold">Chamados</th>
                                        <th className="py-2 text-center font-semibold">T. Médio (min)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tecnicoData.map(tecnico => (
                                        <tr key={tecnico.tecnico_nome} className="border-b last:border-none">
                                            <td className="py-3 font-semibold text-gray-700">{tecnico.tecnico_nome}</td>
                                            <td className="py-3 text-center font-mono">{tecnico.total_chamados}</td>
                                            <td className="py-3 text-center font-mono">{Math.round(tecnico.tempo_medio_resolucao_minutos || 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Gráfico de Barras Duplas para desktop */}
                        <div className="hidden md:block" style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart data={tecnicoData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="tecnico_nome" fontSize={12} tick={{ fill: CHART_COLORS.GRAY }} />
                                    <YAxis yAxisId="chamados" orientation="left" stroke={CHART_COLORS.RED} label={{ value: 'Total de Chamados', angle: -90, position: 'insideLeft', offset: -5, fill: CHART_COLORS.RED, fontSize: 12 }} />
                                    <YAxis yAxisId="tempo" orientation="right" stroke={CHART_COLORS.GRAY} label={{ value: 'Tempo Médio (min)', angle: 90, position: 'insideRight', offset: 5, fill: CHART_COLORS.GRAY, fontSize: 12 }} tickFormatter={(value) => `${value}m`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(185, 28, 28, 0.05)' }}/>
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar yAxisId="chamados" dataKey="total_chamados" name="Total de Chamados" fill={CHART_COLORS.RED} radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="tempo" dataKey="tempo_medio_resolucao_minutos" name="Tempo Médio (min)" fill={CHART_COLORS.GRAY} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </motion.div>
             {/* Classes hidden para o PurgeCSS */}
             <span className="hidden bg-red-100 text-red-600 bg-yellow-100 text-yellow-600 bg-green-100 text-green-600 bg-orange-100 text-orange-600"></span>
        </div>
    );
}