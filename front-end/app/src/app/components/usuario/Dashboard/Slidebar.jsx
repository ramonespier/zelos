'use client';

import { motion } from 'framer-motion';
import Footer from '../../footer/page';

const tabs = [
  { id: 'inicio', label: 'Início' },
  { id: 'chamado', label: 'Solicitar chamado' },
  { id: 'meus', label: 'Minhas solicitações' },
  { id: 'contato', label: 'Contato' },
  { id: 'info', label: 'Perfil' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    <aside className="bg-white border-r border-gray-200 flex flex-col w-64 hidden lg:flex h-screen">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-red-600 tracking-wide">SENAI Chamados</h1>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => handleSelecao(tab.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="border-t border-gray-200">
          <Footer />
        </div>
      </div>
    </aside>
  );
}
