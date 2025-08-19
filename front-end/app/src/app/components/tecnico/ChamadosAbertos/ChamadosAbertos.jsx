'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/api'; 
import CardChamado from './CardChamado';
import ModalAtribuicao from './ModalAtribuicao';
import ModalImagem from './ModalImagem';

export default function ChamadosAbertos({ funcionario }) {
  // Estados para controlar os dados e a UI
  const [chamadosAbertos, setChamadosAbertos] = useState([]);
  const [pedidosEnviados, setPedidosEnviados] = useState([]); // Este agora será populado pela API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemModal, setImagemModal] = useState(null);

  // useEffect para buscar TODOS os dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      // Garantimos que só buscamos os dados quando temos o objeto 'funcionario'
      if (!funcionario || !funcionario.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Usamos Promise.all para fazer as duas requisições em paralelo,
        // o que é mais rápido e eficiente.
        const [chamadosResponse, pedidosResponse] = await Promise.all([
          api.get('/chamados'),          // 1. Busca todos os chamados
          api.get('/pedidos-chamado/meus-pedidos') // 2. Busca os pedidos do técnico logado
        ]);
        
        // Processa a resposta dos chamados
        const abertos = chamadosResponse.data.filter(chamado => chamado.status === 'aberto');
        setChamadosAbertos(abertos);
        
        // Processa a resposta dos pedidos
        // O backend agora nos envia um array de IDs [1, 5, 12]
        setPedidosEnviados(pedidosResponse.data);
        
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
        setError("Não foi possível carregar os dados. Tente atualizar a página.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [funcionario]); // Este hook roda sempre que o 'funcionario' for carregado

  const handleAtribuir = async (chamadoId) => {
    if (pedidosEnviados.includes(chamadoId)) return;
    
    try {
      await api.post('/pedidos-chamado', { chamado_id: chamadoId });
      setPedidosEnviados(prev => [...prev, chamadoId]);
      setModalAberto(true);
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      const errorMessage = err.response?.data?.message || "Não foi possível enviar o pedido.";
      alert(errorMessage);
    }
  };

  const abrirModalImagem = (url) => setImagemModal(url);
  const fecharModalImagem = () => setImagemModal(null);

  // O resto do seu componente JSX continua exatamente o mesmo
  if (isLoading) return <div className="text-center p-10">Carregando chamados...</div>;
  if (error) return <div className="text-center p-10 text-red-600">{error}</div>;

  return (
    <>
      <motion.div /* ... */ >
        <h1 className='text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 text-center'>
          Aqui estão os chamados disponíveis
        </h1>

        {chamadosAbertos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {chamadosAbertos.map(chamado => (
              <CardChamado
                key={chamado.id}
                chamado={chamado}
                pedidosEnviados={pedidosEnviados}
                onAtribuir={handleAtribuir}
                onAbrirImagem={abrirModalImagem}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">Nenhum chamado aberto no momento.</p>
        )}
      </motion.div>

      <ModalAtribuicao aberto={modalAberto} onClose={() => setModalAberto(false)} />
      <ModalImagem url={imagemModal} onClose={fecharModalImagem} />
    </>
  );
}