'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic'; // Importa a função 'dynamic' do Next.js
import ChamadoForm from './ChamadoForm';
import api from '../../../lib/api'; // Ajuste o caminho para a sua API se necessário

// Importa dinamicamente o ModalSucesso para evitar o erro de hidratação do Next.js
// A opção { ssr: false } garante que ele só será renderizado no navegador
const ModalSucesso = dynamic(() => import('./ModalSucesso'), { ssr: false });

export default function Chamado({ funcionario }) {
  // Estados para os campos do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [patrimonio, setPatrimonio] = useState('');
  const [poolId, setPoolId] = useState('');
  
  // Estados para as opções do dropdown e seu carregamento
  const [poolOptions, setPoolOptions] = useState([]);
  const [isLoadingPools, setIsLoadingPools] = useState(true);

  // Estados de controle da UI
  const [erros, setErros] = useState({});
  const [modalAberto, setModalAberto] = useState(false);

  // Busca as opções de 'Pool' da API assim que o componente é montado
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await api.get('/pools');
        const ativas = response.data.filter(pool => pool.status === 'ativo');
        setPoolOptions(ativas);
      } catch (error) {
        console.error("Falha ao buscar as pools:", error);
      } finally {
        setIsLoadingPools(false); // Finaliza o carregamento, com ou sem erro
      }
    };
    fetchPools();
  }, []); // O array vazio [] faz com que este useEffect execute apenas uma vez

  // Função para validar o formulário antes do envio
  const validarFormulario = () => {
    const newErros = {};
    if (titulo.trim().length < 5) newErros.titulo = 'Título precisa ter ao menos 5 caracteres.';
    if (descricao.trim().length < 10) newErros.descricao = 'Descrição precisa ter ao menos 10 caracteres.';
    if (!patrimonio.trim()) newErros.patrimonio = 'O número de patrimônio é obrigatório.';
    if (!poolId) newErros.poolId = 'Selecione um tipo de solicitação.';
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  // Função para enviar os dados para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    if (!funcionario || !funcionario.id) {
      alert("Sua sessão é inválida. Por favor, faça o login novamente.");
      return;
    }

    const payload = {
      titulo,
      descricao,
      numero_patrimonio: patrimonio,
      pool_id: parseInt(poolId, 10),
    };

    try {
      await api.post('/chamados', payload);
      setModalAberto(true);
      // Limpa os campos do formulário após o sucesso
      setTitulo('');
      setDescricao('');
      setPatrimonio('');
      setPoolId('');
      setErros({});
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao enviar o chamado.';
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
        
        {/* Passa todas as props necessárias para o componente do formulário */}
        <ChamadoForm
          titulo={titulo} setTitulo={setTitulo}
          descricao={descricao} setDescricao={setDescricao}
          patrimonio={patrimonio} setPatrimonio={setPatrimonio}
          poolId={poolId} setPoolId={setPoolId}
          poolOptions={poolOptions}
          isLoadingPools={isLoadingPools}
          erros={erros}
          handleSubmit={handleSubmit}
        />
      </motion.div>

      {/* Renderiza o modal (somente no navegador) */}
      <ModalSucesso aberto={modalAberto} onFechar={() => setModalAberto(false)} />
    </>
  );
}