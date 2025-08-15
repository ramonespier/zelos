    'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CardChamado from './CardChamado';
import ModalImagem from './ModalImagem';

export const statusCores = {
    "Aberto": "bg-red-500",
    "Em Andamento": "bg-yellow-500",
    "Concluído": "bg-green-500",
};

const chamados = [
    // ... seus chamados
];

export default function MeusChamados() {
    const [filtroStatus, setFiltroStatus] = useState('Todos');
    const [termoBusca, setTermoBusca] = useState('');
    const [imagemModal, setImagemModal] = useState(null);

    const chamadosFiltrados = chamados.filter(chamado => {
        const correspondeStatus = filtroStatus === 'Todos' || chamado.status === filtroStatus;
        const correspondeBusca = termoBusca === '' ||
            chamado.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
            chamado.patrimonio.toString().includes(termoBusca);
        return correspondeStatus && correspondeBusca;
    });

    const abrirModal = (imagemUrl) => setImagemModal(imagemUrl);
    const fecharModal = () => setImagemModal(null);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className='text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center'>
                    Aqui estão os chamados que você solicitou.
                </h1>

                <div className="h-190 w-240 overflow-y-auto mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                    <h2 className="text-4xl font-extrabold mb-6 text-red-600 text-center tracking-wide drop-shadow-sm">
                        Meus Chamados
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou patrimônio..."
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex items-center justify-center gap-2">
                            <span className="font-semibold text-gray-600">Status:</span>
                            {['Todos', 'Aberto', 'Em Andamento', 'Concluído'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFiltroStatus(status)}
                                    className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${
                                        filtroStatus === status
                                            ? status === 'Aberto' ? 'bg-red-500 text-white' :
                                              status === 'Em Andamento' ? 'bg-yellow-500 text-white' :
                                              status === 'Concluído' ? 'bg-green-500 text-white' :
                                              'bg-gray-600 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {chamadosFiltrados.length > 0 ? (
                        chamadosFiltrados.map(chamado => (
                            <CardChamado key={chamado.id} chamado={chamado} onAbrirModal={abrirModal} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-10">Nenhum chamado encontrado com os filtros aplicados.</p>
                    )}
                </div>
            </motion.div>

            <ModalImagem imagemUrl={imagemModal} onClose={fecharModal} />
        </>
    )
}
