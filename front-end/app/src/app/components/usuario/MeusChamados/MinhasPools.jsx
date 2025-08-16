'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PoolCard from './PoolCard';
import PoolFiltros from './PoolFitros';

// --- DADOS DE EXEMPLO ---
const poolsExemplo = [
  { id: 1, titulo: 'manutencao', descricao: 'Problema no sistema de ar-condicionado da sala 203', status: 'aguardando aprovacao', criado_em: '2025-08-15T09:30:00', usuario_id: 'user1' },
  { id: 2, titulo: 'limpeza', descricao: 'Necessária limpeza especial no laboratório de química', status: 'ativo', criado_em: '2025-08-10T14:15:00', usuario_id: 'user2' },
  { id: 3, titulo: 'apoio_tecnico', descricao: 'Configuração de novos equipamentos na recepção', status: 'rejeitado', criado_em: '2025-08-01T08:00:00', usuario_id: 'user3' },
  { id: 4, titulo: 'manutencao', descricao: 'Lâmpada queimada no corredor principal, próximo à biblioteca.', status: 'ativo', criado_em: '2025-08-16T11:00:00', usuario_id: 'user4' },
  { id: 5, titulo: 'outro', descricao: 'Solicitação de compra de novas cadeiras para a sala de estudos.', status: 'aguardando aprovacao', criado_em: '2025-08-14T16:45:00', usuario_id: 'user5' }
];

const statusConfig = {
  'aguardando aprovacao': { label: 'Aguardando', classes: 'bg-yellow-100 text-yellow-800' },
  'ativo': { label: 'Ativo', classes: 'bg-green-100 text-green-800' },
  'rejeitado': { label: 'Rejeitado', classes: 'bg-red-100 text-red-800' }
};

export default function MinhasPools() {
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');

  const poolsFiltradas = poolsExemplo.filter(pool => {
    const correspondeStatus = filtroStatus === 'Todos' || pool.status === filtroStatus;
    const correspondeBusca = termoBusca === '' || pool.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    return correspondeStatus && correspondeBusca;
  });

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
              <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros ou limpar a busca.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
