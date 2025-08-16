'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CardChamado from './CardChamado';
import ModalAtribuicao from './ModalAtribuicao';
import ModalImagem from './ModalImagem';

// Chamados abertos de exemplo
const chamados = [
  {
    id: 1,
    titulo: 'Problema no ar-condicionado',
    descricao: 'O ar-condicionado da sala 203 está com vazamento e não resfria corretamente.',
    status: 'Aberto',
    criado_em: '2025-08-15T09:30:00',
    usuario: 'José Silva',
    patrimonio: '1234',
      imagem: 'monitor.webp'
  },
  {
    id: 2,
    titulo: 'Limpeza especial',
    descricao: 'Necessária limpeza profunda no laboratório de química antes da aula prática.',
    status: 'Aberto',
    criado_em: '2025-08-14T14:00:00',
    usuario: 'Maria Oliveira',
    patrimonio: '5678',
      imagem: 'monitor.webp'
  },
  {
    id: 3,
    titulo: 'Configuração de equipamentos',
    descricao: 'Novos computadores da recepção precisam ser configurados com softwares básicos.',
    status: 'Aberto',
    criado_em: '2025-08-13T08:00:00',
    usuario: 'Carlos Pereira',
    patrimonio: '91011',
    imagem: 'monitor.webp'
  },
  {
    id: 4,
    titulo: 'Lâmpada queimada',
    descricao: 'Lâmpada queimada no corredor principal próximo à biblioteca.',
    status: 'Aberto',
    criado_em: '2025-08-16T11:00:00',
    usuario: 'Ana Souza',
    patrimonio: '1213',
    imagem: 'monitor.webp'
  },
  {
    id: 5,
    titulo: 'Solicitação de cadeiras',
    descricao: 'Solicitação de compra de novas cadeiras para a sala de estudos.',
    status: 'Aberto',
    criado_em: '2025-08-14T16:45:00',
    usuario: 'Roberto Lima',
    patrimonio: '1415',
      imagem: 'monitor.webp'      
  }
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
        className="flex flex-col w-full px-4 sm:px-6 md:px-10 py-6"
      >
        <h1 className='text-xl sm:text-2xl font-semibold text-gray-700 mb-6 text-center'>
          Aqui estão seus chamados abertos
        </h1>

        {/* GRID RESPONSIVO */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </motion.div>

      <ModalAtribuicao aberto={modalAberto} onClose={() => setModalAberto(false)} />
      <ModalImagem url={imagemModal} onClose={fecharModalImagem} />
    </>
  );
}
