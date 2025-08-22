'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ChamadoForm from './ChamadoForm';
import api from '../../../lib/api';

const ModalSucesso = dynamic(() => import('./ModalSucesso'), { ssr: false });

export default function Chamado({ funcionario }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [patrimonio, setPatrimonio] = useState('');
  const [poolId, setPoolId] = useState('');
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');
  const [poolOptions, setPoolOptions] = useState([]);
  const [isLoadingPools, setIsLoadingPools] = useState(true);
  const [erros, setErros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const fetchPools = async () => {
      setIsLoadingPools(true);
      try {
        const response = await api.get('/pools');
        const ativas = response.data.filter(pool => pool.status === 'ativo');
        setPoolOptions(ativas);
      } catch (error) {
        console.error("Falha ao buscar as pools:", error);
        setErros(prev => ({ ...prev, api: 'Não foi possível carregar os tipos de chamado.' }));
      } finally {
        setIsLoadingPools(false);
      }
    };
    fetchPools();
  }, []);

  const limparFormulario = () => {
    setTitulo('');
    setDescricao('');
    setPatrimonio('');
    setPoolId('');
    setImagem(null);
    setImagemPreview('');
    setErros({});
  };

  const validarFormulario = () => {
    const newErros = {};
    if (titulo.trim().length < 5) newErros.titulo = 'O título precisa ter no mínimo 5 caracteres.';
    if (descricao.trim().length < 10) newErros.descricao = 'A descrição precisa ter no mínimo 10 caracteres.';
    if (!poolId) newErros.poolId = 'Por favor, selecione um tipo de solicitação.';
    
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setIsSubmitting(true);
    setErros({});

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('numero_patrimonio', patrimonio);
    formData.append('pool_id', poolId);
    if (imagem) {
      formData.append('imagem', imagem);
    }

    try {
      await api.post('/chamados', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setModalAberto(true);
      limparFormulario();
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao enviar o chamado.';
      setErros({ api: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fecharModal = () => setModalAberto(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white p-10 rounded-2xl shadow-lg border border-gray-200"
      >
        <h2 className="text-4xl font-extrabold mb-10 text-center tracking-tight bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Abrir Novo Chamado
        </h2>
        
        <ChamadoForm
          titulo={titulo} setTitulo={setTitulo}
          descricao={descricao} setDescricao={setDescricao}
          patrimonio={patrimonio} setPatrimonio={setPatrimonio}
          poolId={poolId} setPoolId={setPoolId}
          poolOptions={poolOptions}
          imagem={imagem} setImagem={setImagem}
          imagemPreview={imagemPreview} setImagemPreview={setImagemPreview}
          isLoadingPools={isLoadingPools}
          isSubmitting={isSubmitting}
          erros={erros}
          handleSubmit={handleSubmit}
        />
      </motion.div>

      <ModalSucesso aberto={modalAberto} onFechar={fecharModal} />
    </>
  ); 
}
