'use client';
import React from 'react';
import { motion } from 'framer-motion';

const chamados = [
    {
        id: 1,
        titulo: "Monitor quebrado",
        usuario: "Maria Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        patrimonio: 123456,
        descricao: "Na sala D2-6 têm 4 monitores que não ligam",
        imagem: "https://s2-techtudo.glbimg.com/ydQHZwG3XpDgagaQ9s7WlSC4HEQ=/0x0:695x391/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/s/l/8Efj0lQAyWZ7mPEkTi0w/2014-03-24-mon-031.jpg"
    }
];

export default function ChamadosAtribuidos() {
    return (
  
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[42rem] flex flex-col"
        >
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-5 p-3 ">
                    <h1 className='text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center'>Aqui estão os chamados atribuídos a você.</h1>

                    {chamados.map(chamado => (
                        <div key={chamado.id} className="bg-white p-5 rounded-3xl shadow-xl border w-full lg:w-200 border-gray-200">
                      
                           <div className="flex flex-col md:flex-row gap-5">
                                <div className="flex-1">

                                    <h1 className="text-3xl font-extrabold text-red-600 tracking-wide drop-shadow-sm mb-3">{chamado.titulo}</h1>
                                    <div className="flex gap-3 items-center">
                                        <img className="w-7 h-7 rounded-full bg-cover bg-center shadow-md shadow-[#b30000]/60" src={chamado.usuarioImg} alt={`Foto de ${chamado.usuario}`} />
                                        <h1 className="font-semibold text-[#b30000]">{chamado.usuario}</h1>
                                    </div>
                                    <h2 className='py-3 font-bold text-gray-800'>N. Patrimônio: {chamado.patrimonio}</h2>
                                    <h2 className="font-sans">{chamado.descricao}</h2>
                                </div>
                                <div className="flex items-center justify-center md:justify-end">
                                    <img className="max-w-60 rounded-2xl shadow-md" src={chamado.imagem} alt={chamado.titulo} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}