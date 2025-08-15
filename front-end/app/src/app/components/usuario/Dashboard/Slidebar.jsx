'use client';

import { motion } from 'framer-motion';
import Footer from '../../footer/page';

const tabs = [
  { id: 'inicio', label: 'Início' },
  { id: 'chamado', label: 'Abrir chamado' },
  { id: 'meus', label: 'Meus chamados' },
  { id: 'contato', label: 'Contato' },
  { id: 'info', label: 'Perfil' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    <aside className="bg-white border-r border-gray-200 flex-col w-64 hidden lg:flex">
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-red-600">SENAI Chamados</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => handleSelecao(tab.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === tab.id ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </nav>
      <Footer />
    </aside>
  );
}
