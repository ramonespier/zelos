'use client';
import { useState } from 'react';
import FormularioContato from './FormularioContato';
import ModalSucesso from './ModalSucess';

export default function Contato() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <FormularioContato abrirModal={() => setModalAberto(true)} />
      <ModalSucesso aberto={modalAberto} fecharModal={() => setModalAberto(false)} />
    </>
  );
}
