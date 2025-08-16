'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';

export default function Header({
  activeTab,
  setActiveTab,
  notifications,
  marcarComoLida,
  unreadNotificationsCount,
  funcionario,
  getInitials
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const tabs = [
    { id: 'inicio', label: 'Início' },
    { id: 'chamado', label: 'Solicitar chamado' },
    { id: 'meus', label: 'Minhas solicitações' },
    { id: 'contato', label: 'Contato' },
    { id: 'info', label: 'Perfil' },
  ];

  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    <header className="bg-white shadow-md h-20 flex items-center justify-between px-6 lg:px-10 z-50 sticky top-0">
      {/* Esquerda: Botão mobile + título */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
          {tabs.find(t => t.id === activeTab)?.label}
        </h2>
      </div>

      {/* Direita: Notificações + perfil */}
      <div className="flex items-center space-x-6">
        <Notifications
          notifications={notifications}
          marcarComoLida={marcarComoLida}
          unreadNotificationsCount={unreadNotificationsCount}
          isNotificationsOpen={isNotificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          notificationsRef={notificationsRef}
        />
        <ProfileDropdown
          funcionario={funcionario}
          getInitials={getInitials}
          isProfileOpen={isProfileOpen}
          setProfileOpen={setProfileOpen}
          handleSelecao={handleSelecao}
          dropdownRef={dropdownRef}
        />
      </div>

      {/* Menu mobile animado */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-md border-t border-gray-200 z-40"
          >
            <ul className="flex flex-col py-4">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      handleSelecao(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 hover:bg-gray-100 transition ${
                      activeTab === tab.id ? 'bg-red-600 text-white font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
