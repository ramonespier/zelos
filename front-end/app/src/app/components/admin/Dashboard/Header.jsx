'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Adicionando o ícone de 'X'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';

export default function Header({
  activeTab,
  setActiveTab,
  notifications,
  marcarComoLida,
  limparTodasNotificacoes,
  unreadNotificationsCount,
  funcionario,
  getInitials
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const router = useRouter();

  // Trava o scroll da página quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);


  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  // Lógica de abas separada
  const tabs = [
    { id: 'inicio', label: 'Início' },
    { id: 'abrir', label: 'Abrir Chamado' },
    { id: 'gerenciar', label: 'Gerenciar Chamados' },
    { id: 'atribuidos', label: 'Chamados Atribuídos' },
    { id: 'pedidos', label: 'Solicitação de Atribuição' },
    { id: 'fechamento', label: 'Solicitação de Fechamento' },
    { id: 'patrimonio', label: 'Patrimonios' },
    { id: 'mensagens', label: 'Mensagens' },
    { id: 'relatorio', label: 'Relatórios' },
  ];
  const profileTab = { id: 'info', label: 'Meu Perfil' };

  const handleSelecao = (opcao) => {
    setActiveTab(opcao);
    setMobileMenuOpen(false); // Fecha o menu ao selecionar uma opção
  };

  const getActiveTabLabel = () => {
    const active = tabs.find(t => t.id === activeTab) || (activeTab === 'info' ? profileTab : { label: 'Dashboard Admin' });
    return active.label;
  };

  return (
    <header className="bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow-md h-20 flex items-center justify-between px-6 z-30 sticky top-0 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        {/* ===== BOTÃO DO MENU MOBILE CORRIGIDO ===== */}
        {/*
          Por padrão, este botão é 'block' (visível).
          A partir do breakpoint 'lg' em diante, ele se torna 'hidden' (escondido).
        */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-200 transition lg:hidden"
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </motion.button>
        {/* =========================================== */}
        
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
          {getActiveTabLabel()}
        </h2>
      </div>

      <div className="flex items-center space-x-6">
        <Notifications
          notifications={notifications}
          marcarComoLida={marcarComoLida}
          limparTodasNotificacoes={limparTodasNotificacoes}
          unreadNotificationsCount={unreadNotificationsCount}
          isNotificationsOpen={isNotificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          notificationsRef={notificationsRef}
        />
        <span className="hidden lg:block w-px h-6 bg-gray-300"></span>
        <ProfileDropdown
          funcionario={funcionario}
          getInitials={getInitials}
          isProfileOpen={isProfileOpen}
          setProfileOpen={setProfileOpen}
          handleSelecao={() => handleSelecao('info')} // Simplificado para ir sempre para 'info'
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
        />
      </div>

      {/* PAINEL DO MENU MOBILE */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-20"
                onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 w-full bg-white shadow-lg border-t z-20 rounded-b-2xl overflow-hidden"
            >
                <ul className="flex flex-col p-2">
                {tabs.map(tab => (
                    <li key={tab.id}>
                    <button
                        onClick={() => handleSelecao(tab.id)}
                        className={`w-full text-left px-4 py-3 transition rounded-lg text-base ${
                        activeTab === tab.id
                            ? 'bg-red-600 text-white font-semibold shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                    </li>
                ))}
                </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}