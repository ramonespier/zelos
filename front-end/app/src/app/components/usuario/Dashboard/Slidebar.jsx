'use client';

import { motion } from 'framer-motion';
import {
  HomeIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import Footer from '../../footer/page';

const tabs = [
  { id: 'inicio', label: 'Início', icon: HomeIcon },
  { id: 'chamado', label: 'Abrir chamado', icon: PlusCircleIcon },
  { id: 'meus', label: 'Minhas solicitações', icon: ClipboardDocumentListIcon },
  { id: 'info', label: 'Perfil', icon: UserCircleIcon },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    <aside className="bg-gradient-to-b from-gray-50 via-white to-gray-50 border-r border-gray-200 flex flex-col w-64 hidden lg:flex h-screen shadow-md">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-red-600 tracking-tight drop-shadow-sm">
          SENAI Chamados
        </h1>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => handleSelecao(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer ${
              activeTab === id
                ? 'bg-red-600 text-white shadow-md font-semibold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon className="w-6 h-6 flex-shrink-0" />
            <span>{label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="mt-auto">
        <div className="border-t border-gray-200">
          <Footer />
        </div>
      </div>
    </aside>
  );
}
