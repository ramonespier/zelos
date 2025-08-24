'use client';

import { motion } from 'framer-motion';
import {
  HomeIcon,
  PlusCircleIcon,
  WrenchScrewdriverIcon,
  FolderArrowDownIcon,
  DocumentCheckIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArchiveBoxIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import Footer from '../../footer/page'; // Ajuste o caminho se necessário

const tabs = [
  { id: 'inicio', label: 'Início', icon: HomeIcon },
  { id: 'abrir', label: 'Abrir Chamado', icon: PlusCircleIcon },
  { id: 'gerenciar', label: 'Painel de Atribuição', icon: WrenchScrewdriverIcon },
  { id: 'atribuidos', label: 'Gerenciar Chamados', icon: ClipboardDocumentCheckIcon },
  { id: 'pedidos', label: 'Gerenciar Pedidos', icon: FolderArrowDownIcon },
  { id: 'fechamento', label: 'Gerenciar Fechamentos', icon: DocumentCheckIcon },
  { id: 'patrimonio', label: 'Patrimonios', icon: ArchiveBoxIcon },
  { id: 'mensagens', label: 'Mensagens', icon: PaperAirplaneIcon },
  { id: 'relatorio', label: 'Relatórios', icon: ChartBarIcon },
  { id: 'info', label: 'Perfil', icon: UserCircleIcon },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    // --- CORREÇÃO APLICADA AQUI ---
    // A largura da sidebar foi aumentada para w-72 (288px)
    <aside className="bg-gradient-to-b from-gray-50 via-white to-gray-50 border-r border-gray-200 flex flex-col w-72 hidden lg:flex h-screen shadow-md">
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-red-600 tracking-tight drop-shadow-sm">
          SENAI CHAMADOS  
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => handleSelecao(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            // O padding original e mais harmonioso (px-4) pode ser mantido
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer text-left ${
              activeTab === id
                ? 'bg-red-600 text-white shadow-md font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Icon className="w-6 h-6 flex-shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
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