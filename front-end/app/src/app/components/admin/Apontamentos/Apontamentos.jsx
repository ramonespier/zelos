'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLoader, FiUsers, FiClock, FiCalendar, FiUser, FiInfo, FiHash, FiPackage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../../lib/api'; 
import { toast } from 'sonner';

// --- NOVO COMPONENTE DE PAGINAÇÃO (Reutilizado e adaptado) ---
const PaginationControls = ({ currentPage, totalPages, setCurrentPage, totalItems }) => {
    const pages = useMemo(() => {
        const p = [];
        const maxVisible = 5; 
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (totalPages > maxVisible && endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, totalPages - maxVisible + 1);
            endPage = totalPages;
        }

        for (let i = startPage; i <= endPage; i++) {
            p.push(i);
        }
        
        return p;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
                Mostrando página {currentPage} de {totalPages} ({totalItems} apontamentos no total).
            </span>
            <div className="flex justify-center items-center gap-2">
                {/* Botão Anterior */}
                <motion.button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <FiChevronLeft size={20} />
                </motion.button>

                {/* Botões de Página */}
                {pages.map(page => (
                    <motion.button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className={`py-2 px-4 rounded-lg font-semibold transition ${
                            currentPage === page
                                ? 'bg-red-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {page}
                    </motion.button>
                ))}
                
                {/* Botão Próximo */}
                <motion.button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <FiChevronRight size={20} />
                </motion.button>
            </div>
        </div>
    );
};
// --- FIM NOVO COMPONENTE DE PAGINAÇÃO ---

// Função auxiliar para formatar datas/horas
const formatDateTime = (dateString) => {
    if (!dateString) return 'Em andamento';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Data inválida';
    
    return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
};

// Componente para exibir um único apontamento
const ApontamentoCard = ({ apontamento }) => {
    const inicio = formatDateTime(apontamento.comeco);
    const fim = formatDateTime(apontamento.fim);
    
    const duracao = useMemo(() => {
        if (!apontamento.fim) return null;
        const start = new Date(apontamento.comeco);
        const end = new Date(apontamento.fim);
        const diffInMs = Math.abs(end - start);
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }, [apontamento.comeco, apontamento.fim]);


    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-l-4 border-red-600 rounded-lg p-4 shadow-md transition hover:shadow-lg space-y-2"
        >
            <div className="flex justify-between items-start border-b pb-2 mb-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <FiHash size={14} className="text-red-500" /> Chamado #{apontamento.chamado_id}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${apontamento.fim ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {apontamento.fim ? 'Finalizado' : 'Em Curso'}
                </span>
            </div>
            
            <p className="text-gray-800 text-sm italic whitespace-pre-wrap">
                <strong className="text-red-600">Descrição:</strong> {apontamento.descricao}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-1">
                    <FiCalendar size={14} className="text-gray-400" />
                    <strong>Início:</strong> {inicio}
                </div>
                <div className="flex items-center gap-1">
                    <FiClock size={14} className="text-gray-400" />
                    <strong>Fim:</strong> {fim}
                </div>
                {duracao && (
                    <div className="flex items-center gap-1 col-span-2">
                        <FiClock size={14} className="text-red-600" />
                        <strong>Duração:</strong> <span className="font-bold text-gray-800">{duracao}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Componente principal para a lista de apontamentos
export default function Apontamentos() {
    const [apontamentos, setApontamentos] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    // --- ESTADOS DE PAGINAÇÃO ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // 10 apontamentos por página
    // --- FIM ESTADOS DE PAGINAÇÃO ---


    const fetchData = async () => {
        setPageLoading(true);
        try {
            // Buscamos todos os dados, a paginação será feita no frontend
            const response = await api.get('/apontamentos');
            setApontamentos(response.data);
            setCurrentPage(1); // Resetar página ao buscar novos dados
        } catch (error) {
            toast.error("Erro ao carregar a lista de apontamentos.");
        } finally {
            setPageLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    // 1. Lógica de Paginação (Filtra a lista total)
    const totalPages = Math.ceil(apontamentos.length / itemsPerPage);
    const paginatedApontamentos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return apontamentos.slice(startIndex, startIndex + itemsPerPage);
    }, [apontamentos, currentPage, itemsPerPage]);


    // 2. Lógica de Agrupamento (Agrupa a lista paginada)
    const apontamentosAgrupados = useMemo(() => {
        return paginatedApontamentos.reduce((acc, apontamento) => {
            const tecnicoNome = apontamento.tecnico?.nome || `Técnico ID ${apontamento.tecnico_id}`;
            if (!acc[tecnicoNome]) {
                acc[tecnicoNome] = [];
            }
            acc[tecnicoNome].push(apontamento);
            return acc;
        }, {});
    }, [paginatedApontamentos]);

    const nomesDosTecnicos = Object.keys(apontamentosAgrupados);

    if (pageLoading) {
        return (
            <div className="p-8 flex justify-center items-center h-[50vh]">
                <FiLoader className="text-4xl text-red-600 animate-spin"/>
                <p className="ml-3 text-gray-600">Carregando apontamentos...</p>
            </div>
        );
    }
    
    if (apontamentos.length === 0 && !pageLoading) {
        return (
            <div className="p-8 flex justify-center items-center h-[50vh] text-center">
                <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
                    <FiPackage className="mx-auto text-5xl mb-4 text-red-600" />
                    <h2 className="text-xl font-bold text-gray-800">Nenhum Apontamento Encontrado</h2>
                    <p className="text-gray-500 mt-2">Parece que nenhum técnico registrou atividades ainda.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 font-sans max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
                className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl border border-gray-200/80">
                
                <header className="border-b border-gray-200/80 pb-6 mb-6">
                    <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-md flex items-center gap-2">
                        <FiInfo /> Detalhamento de Apontamentos
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">Apontamentos de trabalho agrupados por técnico.</p>
                </header>
                
                <div className="space-y-8">
                    {nomesDosTecnicos.map((tecnicoNome) => (
                        <section key={tecnicoNome} className="border border-gray-100 rounded-xl p-4 bg-zinc-50 shadow-inner">
                            {/* Cabeçalho do Técnico */}
                            <motion.h2 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2"
                            >
                                <FiUser className="text-red-600" /> Técnico: {tecnicoNome}
                                <span className="ml-auto text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                                    {apontamentosAgrupados[tecnicoNome].length} Apontamento(s) nesta página
                                </span>
                            </motion.h2>

                            {/* Lista de Apontamentos do Técnico */}
                            <motion.div 
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                <AnimatePresence>
                                    {apontamentosAgrupados[tecnicoNome].map((apontamento) => (
                                        <ApontamentoCard key={apontamento.id} apontamento={apontamento} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </section>
                    ))}

                    {/* Mensagem de Sem Resultados (se a página atual não tiver dados, mas a lista total tiver) */}
                    {paginatedApontamentos.length === 0 && apontamentos.length > 0 && (
                        <div className="text-center py-8 text-gray-500">
                             <p>Não há apontamentos nesta página. Tente voltar uma página.</p>
                        </div>
                    )}
                </div>

                {/* CONTROLES DE PAGINAÇÃO */}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    totalItems={apontamentos.length}
                />
                {/* FIM CONTROLES DE PAGINAÇÃO */}

            </motion.div>
        </div>
    );
}