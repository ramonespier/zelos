'use client';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, Wrench, SprayCan, CircleHelp } from 'lucide-react';

const statusConfig = {
  'aberto': { label: 'Aberto', classes: 'bg-blue-100 text-blue-800' },
  'em andamento': { label: 'Em Andamento', classes: 'bg-yellow-100 text-yellow-800' },
  'concluido': { label: 'Concluído', classes: 'bg-green-100 text-green-800' }
};

const tituloConfig = {
  'externo': { label: 'Externo', icon: <User size={18} /> },
  'manutencao': { label: 'Manutenção', icon: <Wrench size={18} /> },
  'apoio_tecnico': { label: 'Apoio Técnico', icon: <User size={18} /> },
  'limpeza': { label: 'Limpeza', icon: <SprayCan size={18} /> },
  'outro': { label: 'Outro', icon: <CircleHelp size={18} /> }
};

// <<< CORREÇÃO PRINCIPAL AQUI >>>
// Agora o componente recebe a prop 'chamado' de forma clara
export default function PoolCard({ chamado }) {
  // Verificação de segurança: se por algum motivo o chamado não chegar, não quebra a página
  if (!chamado) {
    return null; // ou um card de erro/carregamento
  }

  const { label, classes } = statusConfig[chamado.status] || { label: 'Desconhecido', classes: 'bg-gray-100 text-gray-800'};
  const { label: tituloLabel, icon: tituloIcon } = tituloConfig[chamado.pool?.titulo] || tituloConfig.outro;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-5 flex-grow">
        <header className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 text-red-600 font-bold">
            {tituloIcon}
            <span className="text-lg text-gray-800">{tituloLabel}</span>
          </div>
          <div className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
            {label}
          </div>
        </header>
        <p className="font-semibold text-gray-800 mb-2">{chamado.titulo}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{chamado.descricao}</p>
      </div>
      <footer className="bg-gray-50/70 border-t border-gray-200/80 px-5 py-3 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{new Date(chamado.criado_em).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag size={14} />
          <span>Chamado ID: {chamado.id}</span>
        </div>
      </footer>
    </motion.div>
  );
}