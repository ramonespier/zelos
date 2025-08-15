    'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CardChamado from './CardChamado';
import ModalAtribuicao from './ModalAtribuicao';
import ModalImagem from './ModalImagem';

const chamados = [
  // ... seus chamados aqui
];

export default function ChamadosAbertos() {
  const [atribuidos, setAtribuidos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemModal, setImagemModal] = useState(null);

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
        className="h-[51rem] flex flex-col w-full"
      >
        <h1 className='text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center'>
          Aqui estão seus chamados abertos
        </h1>

        <div className="flex-1 flex justify-center overflow-y-auto">
          <div className="space-y-5 p-4">
            {chamados.map(chamado => (
              <CardChamado
                key={chamado.id}
                chamado={chamado}
                atribuidos={atribuidos}
                onAtribuir={handleAtribuir}
                onAbrirImagem={abrirModalImagem}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <ModalAtribuicao aberto={modalAberto} onClose={() => setModalAberto(false)} />
      <ModalImagem url={imagemModal} onClose={fecharModalImagem} />
    </>
  );
}
