"use client"

import { useState } from 'react';
import { motion } from 'framer-motion'; // 1. Adicionei a importação do 'motion'

const chamados = [
    {
        id: 1,
        titulo: "Monitor quebrado",
        usuario: "José Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: 123456,
        descricao: "Na sala D2-6 têm 4 monitores que não ligam.",
        imagem: "https://s2-techtudo.glbimg.com/ydQHZwG3XpDgagaQ9s7WlSC4HEQ=/0x0:695x391/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/s/l/8Efj0lQAyWZ7mPEkTi0w/2014-03-24-mon-031.jpg",
        status: "Aberto"
    },
    {
        id: 2,
        titulo: "Computador não liga",
        usuario: "José Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: 654321,
        descricao: "O computador da minha mesa não está dando sinal de vida.",
        imagem: "https://s2-techtudo.glbimg.com/MdkSGwAagg2CHuv08Q2Rv4y77Qk=/0x0:695x505/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/Q/p/o5P2DjQSmmoVAx15WSHw/2016-03-23-como-resolver-problema-no-pixel-0.jpg",
        status: "Em Andamento"
    },
    {
        id: 3,
        titulo: "Impressora com falha",
        usuario: "José Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: 789012,
        descricao: "A impressora do corredor está atolando papel constantemente.",
        imagem: "https://img.olx.com.br/images/35/353559783090166.jpg",
        status: "Concluído"
    },
    {
        id: 4,
        titulo: "Mouse sem fio não funciona",
        usuario: "José Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: 345678,
        descricao: "Troquei a pilha do mouse, mas ele continua sem conectar.",
        imagem: "https://preview.redd.it/mouse-sensor-isnt-working-but-honestly-im-not-surprised-can-v0-3nli1bpjgfd81.jpg?width=1080&crop=smart&auto=webp&s=24b735f8d3f96a30531becff5b7975866e02581f",
        status: "Aberto"
    }
];

const statusCores = {
    "Aberto": "bg-red-500",
    "Em Andamento": "bg-yellow-500",
    "Concluído": "bg-green-500",
};

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
            {/* 2. Envolvi o container principal com o motion.div e suas propriedades de animação */}
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
                            <button onClick={() => setFiltroStatus('Todos')} className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${filtroStatus === 'Todos' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Todos</button>
                            <button onClick={() => setFiltroStatus('Aberto')} className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${filtroStatus === 'Aberto' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Aberto</button>
                            <button onClick={() => setFiltroStatus('Em Andamento')} className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${filtroStatus === 'Em Andamento' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Em Andamento</button>
                            <button onClick={() => setFiltroStatus('Concluído')} className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${filtroStatus === 'Concluído' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Concluído</button>
                        </div>
                    </div>

                    {chamadosFiltrados.length > 0 ? (
                        chamadosFiltrados.map(chamado => (
                            <div key={chamado.id} className="bg-white mb-5 p-5 rounded-3xl shadow-xl border w-full border-gray-200">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-4 h-4 rounded-full ${statusCores[chamado.status]}`}></div>
                                            <h1 className="text-3xl font-extrabold text-red-600 tracking-wide drop-shadow-sm">{chamado.titulo}</h1>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <img className="w-7 h-7 rounded-full bg-cover bg-center shadow-md shadow-[#b30000]/60" src={chamado.usuarioImg} alt={`Foto de ${chamado.usuario}`} />
                                            <h1 className="font-semibold text-[#b30000]">{chamado.usuario}</h1>
                                        </div>
                                        <h2 className='py-3 font-bold text-gray-800'>N. Patrimônio: {chamado.patrimonio}</h2>
                                        <h2 className="font-sans">{chamado.descricao}</h2>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end">
                                        <div
                                            className="w-60 h-40 rounded-2xl shadow-md overflow-hidden cursor-pointer"
                                            onClick={() => abrirModal(chamado.imagem)}
                                        >
                                            <img
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                src={chamado.imagem}
                                                alt={chamado.titulo}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-10">Nenhum chamado encontrado com os filtros aplicados.</p>
                    )}
                </div>
            </motion.div>


            {imagemModal && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={fecharModal}
                >

                    <div
                        className="relative rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={fecharModal}
                            className="absolute -top-4 -right-4 bg-white cursor-pointer text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg"
                        >
                            &times;
                        </button>

                        <img
                            src={imagemModal}
                            alt="Visualização ampliada"
                            className="object-contain rounded-md max-h-[85vh] max-w-[90vw]"
                        />
                    </div>
                </div>
            )}

        </>
    )
}