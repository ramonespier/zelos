'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    CalendarIcon, 
    UserCircleIcon, 
    MapPinIcon,
    TagIcon,
    EyeIcon,
    PlusCircleIcon,
    ArrowUpOnSquareIcon,
    ArrowLeftIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'

// --- DADOS MOCADOS ---
const chamados = [
    {
        id: 1,
        titulo: "Monitor quebrado na sala D2-6",
        usuario: "Maria Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: "PAT-2023-123456",
        descricao: "Na sala D2-6, quatro monitores da bancada central não estão ligando. O problema começou após uma queda de energia no setor. Verificar se há danos na fonte de alimentação.",
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
        descricao: "O projetor da sala A1-2 está com a projeção totalmente amarelada, impossibilitando o uso para aulas de design.",
        status: "em andamento",
        tecnico_id: 1,
        data_abertura: "2025-08-14T14:00:00Z",
        imagem: "https://www.showmetech.com.br/wp-content/uploads//2019/07/2-projetor-com-mancha-amarela-1024x576.jpg",
        localizacao: "Bloco A, Sala 102",
    },
];

const formatarData = (dataString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
};

// --- CARD DE CHAMADO ---
function ChamadoCard({ chamado, onVerDetalhes, onAbrirApontamento }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
        >
            <div className="h-48 overflow-hidden cursor-pointer" onClick={onVerDetalhes}>
                <img 
                    src={chamado.imagem} 
                    alt={chamado.titulo}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{chamado.titulo}</h2>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                     <div className="flex items-center gap-3">
                        <UserCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0"/>
                        <span>{chamado.usuario}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <TagIcon className="w-5 h-5 text-red-500 flex-shrink-0"/>
                        <span className="font-semibold">{chamado.patrimonio}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-red-500 flex-shrink-0"/>
                        <span>{formatarData(chamado.data_abertura)}</span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
                    <button onClick={onVerDetalhes} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        <EyeIcon className="w-5 h-5"/>
                        Ver Detalhes
                    </button>
                    <button onClick={() => onAbrirApontamento(chamado)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all">
                        <PlusCircleIcon className="w-5 h-5"/>
                        Apontamento
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// --- VISTA DE DETALHES ---
function ChamadoDetailView({ chamado, tecnicoId, onGoBack, onAbrirApontamento }) {
    const [pedidoEnviado, setPedidoEnviado] = useState(false);

    const solicitarFechamento = async () => {
        // Aqui você pode chamar API se necessário
        setPedidoEnviado(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{chamado.titulo}</h2>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Esquerda: Solicitante */}
                <div className="bg-gray-50/80 rounded-xl p-5 space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">Solicitante</h3>
                     <div className="flex items-center gap-4">
                        <img src={chamado.usuarioImg} alt={chamado.usuario} className="w-12 h-12 rounded-full shadow-sm"/>
                        <div>
                            <p className="font-semibold text-gray-900">{chamado.usuario}</p>
                            <p className="text-sm text-gray-600">Usuário Solicitante</p>
                        </div>
                     </div>
                     <div className="text-sm space-y-2 pt-2 border-t">
                        <p className="flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-gray-500"/><strong>Localização:</strong> {chamado.localizacao}</p>
                        <p className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-500"/><strong>Abertura:</strong> {formatarData(chamado.data_abertura)}</p>
                     </div>
                </div>
                {/* Direita: Detalhes */}
                <div className="bg-gray-50/80 rounded-xl p-5 space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">Detalhes do Chamado</h3>
                     <div className="text-sm space-y-2">
                         <div>
                             <p className="font-semibold text-gray-800">Nº de Patrimônio:</p>
                             <p className="text-red-600 font-bold">{chamado.patrimonio}</p>
                         </div>
                         <div>
                             <p className="font-semibold text-gray-800">Descrição Completa:</p>
                             <p className="text-gray-600 leading-relaxed">{chamado.descricao}</p>
                         </div>
                     </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-5 border-t">
                <button 
                    onClick={() => onAbrirApontamento(chamado)} 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                    <PlusCircleIcon className="w-5 h-5"/> Criar Apontamento
                </button>
                <button 
                    onClick={solicitarFechamento} 
                    disabled={pedidoEnviado}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${pedidoEnviado ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                    <ArrowUpOnSquareIcon className="w-5 h-5"/>
                    {pedidoEnviado ? 'Pedido Enviado' : 'Solicitar Fechamento'}
                </button>
            </div>
        </motion.div>
    )
}

// --- MODAL DE APONTAMENTO INTEGRADO COM API ---
function ApontamentoModal({ chamado, tecnicoId, onClose, onSuccess }) {
    const [descricao, setDescricao] = useState("");
    const [comeco, setComeco] = useState("");
    const [fim, setFim] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setLoading(true);
        try {
            const response = await axios.post('/api/apontamentos', {
                chamado_id: chamado.id,
                tecnico_id: tecnicoId,
                descricao,
                comeco,
                fim: fim || null
            });
            setLoading(false);
            onSuccess(response.data);
            onClose();
        } catch (err) {
            setLoading(false);
            setErro(err.response?.data?.message || 'Erro ao criar apontamento.');
        }
    };

    return (
        <AnimatePresence>
            {chamado && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Novo Apontamento</h2>
                            <button onClick={onClose}><XMarkIcon className="w-6 h-6 text-gray-600"/></button>
                        </div>

                        {erro && <p className="text-red-600 mb-2">{erro}</p>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descrição*</label>
                                <textarea 
                                    value={descricao} 
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                    className="mt-1 w-full border rounded-lg p-2 text-sm"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Início*</label>
                                <input
                                    type="datetime-local"
                                    value={comeco}
                                    onChange={(e) => setComeco(e.target.value)}
                                    required
                                    className="mt-1 w-full border rounded-lg p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fim</label>
                                <input
                                    type="datetime-local"
                                    value={fim}
                                    onChange={(e) => setFim(e.target.value)}
                                    className="mt-1 w-full border rounded-lg p-2 text-sm"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {loading ? 'Enviando...' : 'Criar Apontamento'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// --- COMPONENTE PRINCIPAL ---
export default function ChamadosAtribuidos() {
    const [apontamentoModal, setApontamentoModal] = useState(null)
    const [selectedChamado, setSelectedChamado] = useState(null)

    const tecnicoId = 1; // Simulando técnico logado

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
                            <ArrowLeftIcon className="w-6 h-6 text-red-600"/>
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
                        className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
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

            {/* Modal de Apontamento */}
            <ApontamentoModal 
                chamado={apontamentoModal} 
                tecnicoId={tecnicoId}
                onClose={() => setApontamentoModal(null)}
                onSuccess={criarApontamento}
            />
        </div>
    )
}
