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
    prioridade: 'Alta',
    criado_em: '2025-08-15T09:30:00',
    usuario: 'José Silva',
    imagem:'senai.png'
  },
  {
    id: 2,
    titulo: 'Limpeza especial',
    descricao: 'Necessária limpeza profunda no laboratório de química antes da aula prática.',
    status: 'Aberto',
    prioridade: 'Média',
    criado_em: '2025-08-14T14:00:00',
    usuario: 'Maria Oliveira',
    imagem: null
  },
  {
    id: 3,
    titulo: 'Configuração de equipamentos',
    descricao: 'Novos computadores da recepção precisam ser configurados com softwares básicos.',
    status: 'Aberto',
    prioridade: 'Baixa',
    criado_em: '2025-08-13T08:00:00',
    usuario: 'Carlos Pereira',
    imagem: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 4,
    titulo: 'Lâmpada queimada',
    descricao: 'Lâmpada queimada no corredor principal próximo à biblioteca.',
    status: 'Aberto',
    prioridade: 'Média',
    criado_em: '2025-08-16T11:00:00',
    usuario: 'Ana Souza',
    imagem: null
  },
  {
    id: 5,
    titulo: 'Solicitação de cadeiras',
    descricao: 'Solicitação de compra de novas cadeiras para a sala de estudos.',
    status: 'Aberto',
    prioridade: 'Baixa',
    criado_em: '2025-08-14T16:45:00',
    usuario: 'Roberto Lima',
    imagem: null
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
