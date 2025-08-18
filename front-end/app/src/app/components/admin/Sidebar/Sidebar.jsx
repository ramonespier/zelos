'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '../footer/page';
import { HiOutlineHome, HiOutlineClipboardList, HiOutlinePlusCircle, HiOutlineBriefcase, HiOutlineUser, HiOutlineTicket, HiOutlineChartBar } from 'react-icons/hi';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname(); // para destacar a aba ativa

  const tabs = [
    { label: 'Início', icon: <HiOutlineHome size={22} />, path: '/admin' },
    { label: 'Gerenciar Chamados', icon: <HiOutlineClipboardList size={22} />, path: '/admin/tecnicos' },
    { label: 'Chamados Atribuídos', icon: <HiOutlineBriefcase size={22} />, path: '/admin/chamados' },
    { label: 'Meus Chamados', icon: <HiOutlineUser size={22} />, path: '/admin/historico' },
    { label: 'Abrir Chamado', icon: <HiOutlinePlusCircle size={22} />, path: '/admin/abrirchamado' },
    { label: 'Solicitar Chamado', icon: <HiOutlineTicket size={22} />, path: '/admin/solicitarchamado' },
    { label: 'Relatórios', icon: <HiOutlineChartBar size={22} />, path: '/admin/relatorios' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-red-600">SENAI Chamados</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link key={tab.label} href={tab.path} passHref>
              <motion.a
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-medium ${
                  isActive ? 'text-gray-600' : 'text-gray-600 hover:bg-red-600 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </motion.a>
            </Link>
          );
        })}
      </nav>

      <Footer />
    </aside>
  );
}
