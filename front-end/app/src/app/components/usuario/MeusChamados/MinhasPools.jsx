'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PoolCard from './PoolCard';
import PoolFiltros from './PoolFitros';
import api from '../../../lib/api';

// Configuração de status para os CHAMADOS
const statusConfig = {
  'aberto': { label: 'Aberto', classes: 'bg-blue-100 text-blue-800' },
  'em andamento': { label: 'Em Andamento', classes: 'bg-yellow-100 text-yellow-800' },
  'concluido': { label: 'Concluído', classes: 'bg-green-100 text-green-800' }
};

export default function MinhasPools({ funcionario }) {
  const [chamados, setChamados] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (funcionario && funcionario.id) {
      const fetchChamados = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await api.get(`/chamados`);
          const meusChamados = response.data.filter(chamado => chamado.usuario_id === funcionario.id);
          setChamados(meusChamados);
        } catch (err) {
          console.error("Erro ao buscar chamados:", err);
          setError("Não foi possível carregar seus chamados.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchChamados();
    }
  }, [funcionario]);

  const chamadosFiltrados = chamados.filter(chamado => {
    const correspondeStatus = filtroStatus === 'Todos' || chamado.status === filtroStatus;
    const poolTitulo = chamado.pool ? chamado.pool.titulo.toLowerCase() : '';
    const correspondeBusca = termoBusca === '' || 
      chamado.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      chamado.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      poolTitulo.includes(termoBusca.toLowerCase());
    return correspondeStatus && correspondeBusca;
  });
  
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
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Meus Chamados</h1>
          <p className="mt-2 text-lg text-gray-500">Acompanhe e gerencie suas solicitações e chamados.</p>
        </header>

        <PoolFiltros
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          statusConfig={statusConfig}
        />

        <AnimatePresence>
          {chamadosFiltrados.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* <<< CORREÇÃO PRINCIPAL AQUI >>> */}
              {/* Agora passamos a prop com o nome 'chamado' */}
              {chamadosFiltrados.map(chamado => (
                <PoolCard key={chamado.id} chamado={chamado} />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <h3 className="mt-2 text-lg font-semibold text-gray-800">Nenhum chamado encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros ou você ainda não abriu um chamado.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}