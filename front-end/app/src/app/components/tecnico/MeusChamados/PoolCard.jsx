'use client';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, Wrench, SprayCan, CircleHelp } from 'lucide-react';


const statusConfig = {
  'aguardando aprovacao': { label: 'Aguardando', classes: 'bg-yellow-100 text-yellow-800' },
  'ativo': { label: 'Ativo', classes: 'bg-green-100 text-green-800' },
  'rejeitado': { label: 'Rejeitado', classes: 'bg-red-100 text-red-800' }
};

const tituloConfig = {
  'externo': { label: 'Externo', icon: <User size={18} /> },
  'manutencao': { label: 'Manutenção', icon: <Wrench size={18} /> },
  'apoio_tecnico': { label: 'Apoio Técnico', icon: <User size={18} /> },
  'limpeza': { label: 'Limpeza', icon: <SprayCan size={18} /> },
  'outro': { label: 'Outro', icon: <CircleHelp size={18} /> }
};

export default function PoolCard({ pool }) {
  const { label, classes } = statusConfig[pool.status];
  const { label: tituloLabel, icon: tituloIcon } = tituloConfig[pool.titulo];

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
        <p className="text-sm text-gray-600 leading-relaxed">{pool.descricao}</p>
      </div>
      <footer className="bg-gray-50/70 border-t border-gray-200/80 px-5 py-3 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{new Date(pool.criado_em).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag size={14} />
          <span>ID: {pool.id}</span>
        </div>
      </footer>
    </motion.div>
  );
}
