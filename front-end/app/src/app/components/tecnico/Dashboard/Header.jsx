'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'; // Importa o hook para redirecionamento
import Cookies from 'js-cookie'; // Importa a biblioteca para remover o cookie

// Componentes filhos do Header
import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';

export default function Header({
  activeTab,
  setActiveTab,
  notifications,
  marcarComoLida,
  limparTodasNotificacoes, // Adicionei a prop aqui caso você precise dela no futuro
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

  // Função de Logout com a lógica correta para remover o cookie e redirecionar
  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  const tabs = [
    { id: 'inicio', label: 'Início' },
    { id: 'abertos', label: 'Chamados abertos' },
    { id: 'atribuidos', label: 'Chamados atribuídos' },
    { id: 'meus', label: 'Minhas solicitações' },
    { id: 'historico', label: 'Historico Chamados' },
    { id: 'chamado', label: 'Solicitar chamado' },
    { id: 'contato', label: 'Contato' },
    { id: 'info', label: 'Perfil' },
  ];

  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    <header className="bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow-md h-20 flex items-center justify-between px-6 lg:px-10 z-50 sticky top-0 backdrop-blur-sm">
      {/* Esquerda: Botão mobile + título */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-200 transition"
        >
          <Bars3Icon className="w-7 h-7" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
          {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
        </h2>
      </div>

      {/* Direita: Notificações + perfil */}
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

        {/* ProfileDropdown agora recebe a função handleLogout como prop */}
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

      {/* Menu mobile animado */}
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