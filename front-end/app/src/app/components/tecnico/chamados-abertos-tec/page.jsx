'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const chamados = [
    {
        id: 1,
        titulo: "Monitor quebrado",
        usuario: "Maria Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: 123456,
        descricao: "Na sala D2-6 têm 4 monitores que não ligam",
        imagem: "https://s2-techtudo.glbimg.com/ydQHZwG3XpDgagaQ9s7WlSC4HEQ=/0x0:695x391/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/s/l/8Efj0lQAyWZ7mPEkTi0w/2014-03-24-mon-031.jpg"
    },
    {
        id: 2,
        titulo: "Teclado não funciona",
        usuario: "João Pereira",
        usuarioImg: "https://i.pravatar.cc/150?img=6",
        patrimonio: 654321,
        descricao: "O teclado do computador da recepção parou de responder.",
        imagem: "https://previews.123rf.com/images/timltv/timltv2111/timltv211100074/177913302-old-keyboard-and-broken-monitor-are-on-wooden-table-and-covered-in-thick-dust-in-a-workshop-top.jpg"
    },
    {
        id: 3,
        titulo: "Problema de conexão",
        usuario: "Ana Costa",
        usuarioImg: "https://i.pravatar.cc/150?img=7",
        patrimonio: 678910,
        descricao: "A internet não está funcionando na sala B3-1.",
        imagem: "https://www.unimedgoiania.coop.br/wps/wcm/connect/f69c4f65-8532-40bf-856f-7209149e9af0/Sala+computador.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-f69c4f65-8532-40bf-856f-7209149e9af0-oxUOo-2"
    },
    {
        id: 4,
        titulo: "Troca de toner",
        usuario: "Pedro Santos",
        usuarioImg: "https://i.pravatar.cc/150?img=8",
        patrimonio: 345678,
        descricao: "A impressora da sala C1-2 precisa de um novo toner.",
        imagem: "https://img.olx.com.br/images/35/353559783090166.jpg"
    }
];

export default function ChamadosAbertos() {
    const [modalAberto, setModalAberto] = useState(false);

    const handleAtribuir = (chamadoId) => {
        console.log(`Chamado ${chamadoId} atribuído!`);
        setModalAberto(true);
    };

    return (

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[42rem] flex flex-col w-full" 
        >
            <h1 className='text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center'>Aqui estão todos os chamados abertos</h1>
            <div className="flex-1 flex justify-center overflow-y-auto ">
                <div className="space-y-5 p-4">
                    {chamados.map(chamado => (
                        <div key={chamado.id} className="bg-white p-5 rounded-3xl shadow-xl border w-200  border-gray-200">
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-extrabold text-red-600 tracking-wide drop-shadow-sm mb-3">{chamado.titulo}</h1>
                                    <div className="flex gap-3 items-center">
                                        <img className="w-7 h-7 rounded-full bg-cover bg-center shadow-md shadow-[#b30000]/60" 
                                             src={chamado.usuarioImg} 
                                             alt={`Foto de ${chamado.usuario}`} />
                                        <h1 className="font-semibold text-[#b30000]">{chamado.usuario}</h1>
                                    </div>
                                    <h2 className='py-3 font-bold text-gray-800'>N. Patrimônio: {chamado.patrimonio}</h2>
                                    <h2 className="font-sans">{chamado.descricao}</h2>
                                    <div className="mt-4">
                                        <button 
                                            onClick={() => handleAtribuir(chamado.id)}
                                            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300 ease-in-out cursor-pointer"
                                        >
                                            Atribuir Chamado
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center md:justify-end">
                                    <img className="max-w-60 rounded-2xl shadow-md" 
                                         src={chamado.imagem} 
                                         alt={chamado.titulo} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

    
            <AnimatePresence>
                {modalAberto && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
                        aria-modal="true"
                        role="dialog"
                        aria-labelledby="modal-title"
                        tabIndex={-1}
                        onClick={() => setModalAberto(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center relative shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setModalAberto(false)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition"
                                aria-label="Fechar modal"
                            >
                   
                            </button>
                            <h3 id="modal-title" className="text-2xl font-extrabold text-red-600 mb-4">
                                Permissão necessária!
                            </h3>
                            <p className="text-gray-700 mb-6">
                                O seu pedido de atribuição de chamado foi enviado para a administração e está em análise. Nossa equipe entrará em contato o mais breve possível.
                            </p>
                            <button
                                onClick={() => setModalAberto(false)}
                                className="mt-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow hover:bg-red-700 transition cursor-pointer"
                                aria-label="Fechar modal"
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}