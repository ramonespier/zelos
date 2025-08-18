'use client';
import { useState } from 'react';
import FormularioContato from './FormularioContato';
import ModalSucesso from './ModalSucess';

// Recebe a prop 'funcionario' do Dashboard
export default function Contato({ funcionario }) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      {/* Passa o objeto 'funcionario' para o componente do formulário */}
      <FormularioContato abrirModal={() => setModalAberto(true)} />
      <ModalSucesso aberto={modalAberto} fecharModal={() => setModalAberto(false)} />
    </>
  );
}