'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ChamadoCard from './ChamadoCard';
import ChamadoDetailView from './ChamadoDetailView';
import ApontamentoModal from './ApontamentoModal';

// dados de exemplo
const chamados = [
    {
        id: 1,
        titulo: "Monitor quebrado na sala D2-6",
        usuario: "Maria Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: "PAT-2023-123456",
        descricao: "Na sala D2-6, quatro monitores da bancada central não estão ligando...",
        status: "em andamento",
        tecnico_id: 1,
        data_abertura: "2025-08-15T10:30:00Z",
        imagem: "https://s2-techtudo.glbimg.com/ydQHZwG3XpDgagaQ9s7WlSC4HEQ=/0x0:695x391/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/s/l/8Efj0lQAyWZ7mPEkTi0w/2014-03-24-mon-031.jpg",
        localizacao: "Bloco D, Sala 206",
    },
    {
        id: 2,
        titulo: "Projetor com imagem amarelada",
        usuario: "João Pereira",
        usuarioImg: "https://i.pravatar.cc/150?img=12",
        patrimonio: "PAT-2024-789012",
        descricao: "O projetor da sala A1-2 está com a projeção totalmente amarelada...",
        status: "em andamento",
        tecnico_id: 1,
        data_abertura: "2025-08-14T14:00:00Z",
        imagem: "https://www.showmetech.com.br/wp-content/uploads//2019/07/2-projetor-com-mancha-amarela-1024x576.jpg",
        localizacao: "Bloco A, Sala 102",
    },
];

export default function ChamadosAtribuidos() {
    const [apontamentoModal, setApontamentoModal] = useState(null);
    const [selectedChamado, setSelectedChamado] = useState(null);
    const tecnicoId = 1;

    const criarApontamento = (dados) => {
        console.log("Apontamento criado:", dados);
        setApontamentoModal(null);
    };

    return (
        <div className="p-4 sm:p-6 h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    {selectedChamado && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedChamado(null)}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeftIcon className="w-6 h-6 text-red-600" />
                        </motion.button>
                    )}
                    {selectedChamado ? 'Detalhes do Chamado' : 'Meus Chamados Atribuídos'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {selectedChamado ? `Visualizando detalhes do chamado #${selectedChamado.id}` : 'Aqui estão os chamados que precisam da sua atenção.'}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!selectedChamado ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {chamados.map(chamado => (
                            <ChamadoCard
                                key={chamado.id}
                                chamado={chamado}
                                onVerDetalhes={() => setSelectedChamado(chamado)}
                                onAbrirApontamento={setApontamentoModal}
                            />
                        ))}
                    </motion.div>

                ) : (
                    <motion.div key="detail">
                        <ChamadoDetailView
                            chamado={selectedChamado}
                            tecnicoId={tecnicoId}
                            onGoBack={() => setSelectedChamado(null)}
                            onAbrirApontamento={setApontamentoModal}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ApontamentoModal
                chamado={apontamentoModal}
                tecnicoId={tecnicoId}
                onClose={() => setApontamentoModal(null)}
                onSuccess={criarApontamento}
            />
        </div>
    )
}
