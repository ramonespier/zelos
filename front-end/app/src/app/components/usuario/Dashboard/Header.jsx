'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Importa os componentes filhos que este Header utiliza
import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';

export default function Header({
  // Props para navegação
  activeTab,
  setActiveTab,

  // Props com os dados do usuário logado
  funcionario,
  getInitials,
  
  // Props para a funcionalidade de notificações
  notifications,
  marcarComoLida,
  limparTodasNotificacoes,
  unreadNotificationsCount,
}) {
  // Estados para controlar a visibilidade dos menus
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  
  // Refs para fechar os menus ao clicar fora
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const router = useRouter();

  // Função para fazer o logout do usuário
  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  const tabs = [
    { id: 'inicio', label: 'Início' },
    { id: 'chamado', label: 'Abrir chamado' },
    { id: 'meus', label: 'Minhas solicitações' },
    { id: 'contato', label: 'Contato' },
    { id: 'info', label: 'Perfil' },
  ];
  
  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    <header className="bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow-md h-20 flex items-center justify-between px-6 lg:px-10 z-50 sticky top-0 backdrop-blur-sm">
      {/* Lado Esquerdo: Botão mobile e Título da Página Ativa */}
      <div className="flex items-center space-x-4">
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-200 transition"
        >
          <Bars3Icon className="w-7 h-7" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
          {tabs.find(t => t.id === activeTab)?.label}
        </h2>
      </div>

      {/* Lado Direito: Notificações e Menu do Perfil */}
      <div className="flex items-center space-x-6">
        
        {/* Componente de Notificações */}
        <Notifications
          notifications={notifications}
          marcarComoLida={marcarComoLida}
          limparTodasNotificacoes={limparTodasNotificacoes}
          unreadNotificationsCount={unreadNotificationsCount}
          isNotificationsOpen={isNotificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          notificationsRef={notificationsRef}
        />

        {/* Separador vertical */}
        <span className="hidden lg:block w-px h-6 bg-gray-300"></span>

        {/* Componente do Perfil do Usuário */}
        <ProfileDropdown
          funcionario={funcionario}
          getInitials={getInitials}
          isProfileOpen={isProfileOpen}
          setProfileOpen={setProfileOpen}
          handleSelecao={handleSelecao}
          dropdownRef={dropdownRef}
          handleLogout={handleLogout}
        />
      </div>

      {/* Menu Mobile Dropdown (renderizado condicionalmente) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40 rounded-b-2xl"
          >
            <ul className="flex flex-col py-4">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleSelecao(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 transition rounded-md ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}