'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ChamadoForm from './ChamadoForm';
import ModalSucesso from './ModalSucesso';

export default function Chamado({ usuario_id }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});
  const [modalAberto, setModalAberto] = useState(false);

  const created_by = usuario_id;
  const updated_by = usuario_id;

  const validarFormulario = () => {
    const newErros = {};
    if (titulo.trim().length < 5) newErros.titulo = 'Título precisa ter ao menos 5 caracteres.';
    if (descricao.trim().length < 10) newErros.descricao = 'Descrição precisa ter ao menos 10 caracteres.';
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const res = await fetch('/api/pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descricao, usuario_id, created_by, updated_by })
      });
      if (!res.ok) throw new Error('Erro ao criar chamado');

      setModalAberto(true);
      setTitulo('');
      setDescricao('');
      setErros({});
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar chamado, tente novamente.');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto mt-10 mb-20 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
      >
        <h2 className="text-4xl font-extrabold mb-10 text-red-600 text-center tracking-wide drop-shadow-sm">
          Solicitar Novo Chamado
        </h2>

        <ChamadoForm
          titulo={titulo}
          setTitulo={setTitulo}
          descricao={descricao}
          setDescricao={setDescricao}
          erros={erros}
          handleSubmit={handleSubmit}
        />
      </motion.div>

      <ModalSucesso aberto={modalAberto} onFechar={() => setModalAberto(false)} />
    </>
  );
}
