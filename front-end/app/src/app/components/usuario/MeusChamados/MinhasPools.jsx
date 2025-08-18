'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PoolCard from './PoolCard';
import PoolFiltros from './PoolFitros';
import api from '../../../lib/api'; // Importe a instância do axios

// Configuração de status (sem alterações)
const statusConfig = {
  'aguardando aprovacao': { label: 'Aguardando', classes: 'bg-yellow-100 text-yellow-800' },
  'ativo': { label: 'Ativo', classes: 'bg-green-100 text-green-800' },
  'rejeitado': { label: 'Rejeitado', classes: 'bg-red-100 text-red-800' }
};

// Recebe o objeto 'funcionario' como prop
export default function MinhasPools({ funcionario }) {
  const [chamados, setChamados] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os dados da API quando o componente carregar
  useEffect(() => {
    if (funcionario && funcionario.id) {
      const fetchChamados = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Busca os chamados do usuário logado na API.
          // Sua API precisa ter uma rota como '/chamados/usuario/ID_DO_USUARIO'
          const response = await api.get(`/chamados/usuario/${funcionario.id}`);
          setChamados(response.data);
        } catch (err) {
          console.error("Erro ao buscar chamados:", err);
          setError("Não foi possível carregar seus chamados. Tente novamente mais tarde.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchChamados();
    }
  }, [funcionario]); // Roda novamente se o objeto funcionario mudar

  // A lógica de filtragem agora usa os dados reais do estado 'chamados'
  const poolsFiltradas = chamados.filter(pool => {
    const correspondeStatus = filtroStatus === 'Todos' || pool.status === filtroStatus;
    const correspondeBusca = termoBusca === '' || 
      pool.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pool.titulo.toLowerCase().includes(termoBusca.toLowerCase());
    return correspondeStatus && correspondeBusca;
  });
  
  // Tratamento de UI para estados de carregamento e erro
  if (isLoading) {
    return <div className="text-center py-20 font-semibold text-gray-600">Carregando seus chamados...</div>
  }

  if (error) {
     return <div className="text-center py-20 font-semibold text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Minhas Pools</h1>
          <p className="mt-2 text-lg text-gray-500">Acompanhe e gerencie suas solicitações de recursos.</p>
        </header>

        <PoolFiltros
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          statusConfig={statusConfig}
        />

        <AnimatePresence>
          {poolsFiltradas.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {poolsFiltradas.map(pool => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <h3 className="mt-2 text-lg font-semibold text-gray-800">Nenhuma pool encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros ou você ainda não abriu um chamado.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}