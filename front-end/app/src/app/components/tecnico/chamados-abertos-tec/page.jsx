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
    const [atribuidos, setAtribuidos] = useState([]); 
    const [imagemModal, setImagemModal] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    const handleAtribuir = (id) => {
        if (!atribuidos.includes(id)) {
            setAtribuidos(prev => [...prev, id]);
            setModalAberto(true);
        }
    };

    const abrirModalImagem = (url) => setImagemModal(url);
    const fecharModalImagem = () => setImagemModal(null);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="h-[42rem] flex flex-col w-full"
            >
                <h1 className='text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center'>
                    Chamados Abertos
                </h1>

                <div className="flex-1 flex justify-center overflow-y-auto">
                    <div className="space-y-5 p-4">
                        {chamados.map(chamado => (
                            <motion.div
                                key={chamado.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-5 rounded-3xl shadow-xl border border-gray-200"
                            >
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-extrabold text-red-600 mb-3">{chamado.titulo}</h1>
                                        <div className="flex gap-3 items-center mb-3">
                                            <img 
                                                className="w-7 h-7 rounded-full shadow-md" 
                                                src={chamado.usuarioImg} 
                                                alt={`Foto de ${chamado.usuario}`} 
                                            />
                                            <h2 className="font-semibold text-red-600">{chamado.usuario}</h2>
                                        </div>
                                        <p className='font-bold text-gray-800 mb-2'>N. Patrimônio: {chamado.patrimonio}</p>
                                        <p className="text-gray-700 mb-4">{chamado.descricao}</p>
                                        <button
                                            onClick={() => handleAtribuir(chamado.id)}
                                            className={`px-6 py-2 rounded-lg font-bold shadow-md transition duration-300 ease-in-out 
                                                ${atribuidos.includes(chamado.id) 
                                                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                                                    : 'bg-red-600 text-white hover:bg-red-700'}`}
                                        >
                                            {atribuidos.includes(chamado.id) ? 'Pedido Enviado' : 'Atribuir Chamado'}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end">
                                        <div
                                            className="w-70 h-47 rounded-2xl shadow-md overflow-hidden cursor-pointer"
                                            onClick={() => abrirModalImagem(chamado.imagem)}
                                        >
                                            <img
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                src={chamado.imagem}
                                                alt={chamado.titulo}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
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
                            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
                            onClick={() => setModalAberto(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-2xl font-extrabold text-red-600 mb-4">Permissão necessária!</h3>
                                <p className="text-gray-700 mb-6">
                                    O seu pedido de atribuição de chamado foi enviado para a administração e está em análise. Nossa equipe entrará em contato em breve.
                                </p>
                                <button
                                    onClick={() => setModalAberto(false)}
                                    className="mt-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow hover:bg-red-700 transition cursor-pointer"
                                >
                                    Fechar
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {imagemModal && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={fecharModalImagem}
                >
                    <div className="relative rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={fecharModalImagem}
                            className="absolute -top-4 -right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg"
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
    );
}
