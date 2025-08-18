'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ChamadoForm from './ChamadoForm';
import ModalSucesso from './ModalSucesso';
import api from '../../../lib/api'; // Importe a instância centralizada do axios

// Recebe o objeto 'funcionario' do componente pai (Dashboard)
export default function Chamado({ funcionario }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});
  const [modalAberto, setModalAberto] = useState(false);

  // Lógica de validação do formulário (sem alterações)
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

    // Prepara o payload com os dados do chamado e do usuário logado
    const payload = {
      titulo,
      descricao,
      usuario_id: funcionario.id,
      created_by: funcionario.id,
      updated_by: funcionario.id
    };

    try {
      // Faz a requisição POST para a API usando axios
      // Assumindo que a rota para criar chamados é '/chamados'
      await api.post('/chamados', payload);

      // Limpa o formulário e abre o modal de sucesso
      setModalAberto(true);
      setTitulo('');
      setDescricao('');
      setErros({});
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      // Extrai uma mensagem de erro mais amigável da resposta da API
      const errorMessage = err.response?.data?.error || 'Erro ao enviar chamado, tente novamente.';
      alert(errorMessage);
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