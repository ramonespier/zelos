'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import FormChamado from './FormChamado';
import ModalSucesso from './ModalSucesso';

export default function Chamado() {
  const [modalAberto, setModalAberto] = useState(false);

  const handleSubmitChamado = async ({ titulo, descricao }) => {
    const usuario_id = 'ID_DO_USUARIO_ATUAL';
    const created_by = usuario_id;
    const updated_by = usuario_id;

    try {
      const res = await fetch('/api/pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descricao, usuario_id, created_by, updated_by })
      });

      if (!res.ok) throw new Error('Erro ao criar chamado');
      setModalAberto(true);
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
          Solicitar novo chamado              
        </h2>

        <FormChamado onSubmit={handleSubmitChamado} />
      </motion.div>

      <ModalSucesso aberto={modalAberto} onClose={() => setModalAberto(false)} />
    </>
  );
}
