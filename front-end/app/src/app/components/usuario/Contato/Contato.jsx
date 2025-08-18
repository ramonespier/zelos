'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic'; // Importa a função 'dynamic' do Next.js
import FormularioContato from './FormularioContato';

// Carrega o ModalSucesso dinamicamente no lado do cliente
const ModalSucesso = dynamic(() => import('./ModalSucess'), { ssr: false });

export default function Contato({ funcionario }) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <FormularioContato 
        abrirModal={() => setModalAberto(true)} 
        funcionario={funcionario} 
      />
      {/* O Next.js agora sabe que não deve pré-renderizar este componente no servidor */}
      <ModalSucesso aberto={modalAberto} fecharModal={() => setModalAberto(false)} />
    </>
  );
}