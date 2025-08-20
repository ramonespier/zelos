'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ChamadoForm from './ChamadoForm';
import api from '../../../lib/api';

const ModalSucesso = dynamic(() => import('./ModalSucesso'), { ssr: false });

export default function Chamado({ funcionario }) {
  // Estados para o arquivo de imagem
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [patrimonio, setPatrimonio] = useState('');
  const [poolId, setPoolId] = useState('');
  const [poolOptions, setPoolOptions] = useState([]);
  
  // Estados de controle da UI
  const [isLoadingPools, setIsLoadingPools] = useState(true);
  const [erros, setErros] =    useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPools = async () => {
      setIsLoadingPools(true);
      try {
        const response = await api.get('/pools');
        // Filtramos para mostrar apenas as pools ativas no dropdown
        const ativas = response.data.filter(pool => pool.status === 'ativo');
        setPoolOptions(ativas);
      } catch (error) {
        console.error("Falha ao buscar as pools:", error);
        setErros(prev => ({ ...prev, api: 'Não foi possível carregar os tipos de chamado.' }));
      } finally {
        setIsLoadingPools(false); // ESSENCIAL: Desbloqueia o campo em qualquer cenário
      }
    };
    fetchPools();
  }, []);

  const validarFormulario = () => {
    const newErros = {};
    if (titulo.trim().length < 5) newErros.titulo = 'Título precisa ter ao menos 5 caracteres.';
    if (descricao.trim().length < 10) newErros.descricao = 'Descrição precisa ter ao menos 10 caracteres.';
    if (!patrimonio.trim()) newErros.patrimonio = 'O número de patrimônio é obrigatório.';
    if (!poolId) newErros.poolId = 'Selecione um tipo de solicitação.';
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
      // Limpa o formulário
      setTitulo(''); setDescricao(''); setPatrimonio('');
      setPoolId(''); setImagem(null); setImagemPreview(''); setErros({});
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao enviar o chamado.';
      setErros({ api: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto mt-10 mb-20 bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h2 className="text-4xl font-extrabold mb-10 text-red-600 text-center tracking-wide drop-shadow-sm">
          Solicitar Novo Chamado
        </h2>
        
        <ChamadoForm
          titulo={titulo} setTitulo={setTitulo}
          descricao={descricao} setDescricao={setDescricao}
          patrimonio={patrimonio} setPatrimonio={setPatrimonio}
          poolId={poolId} setPoolId={setPoolId}
          poolOptions={poolOptions}
          isLoadingPools={isLoadingPools}
          erros={erros}
          handleSubmit={handleSubmit}
          imagem={imagem} setImagem={setImagem}
          imagemPreview={imagemPreview} setImagemPreview={setImagemPreview}
          isSubmitting={isSubmitting}
        />
      </motion.div>
      <ModalSucesso aberto={modalAberto} onFechar={() => setModalAberto(false)} />
    </>
  ); 
} 