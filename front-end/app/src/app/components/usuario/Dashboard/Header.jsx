'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';

export default function Header({ activeTab, setActiveTab, notifications, marcarComoLida, unreadNotificationsCount, funcionario, getInitials }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const tabs = [
    { id: 'inicio', label: 'Início' },
    { id: 'chamado', label: 'Abrir chamado' },
    { id: 'meus', label: 'Meus chamados' },
    { id: 'contato', label: 'Contato' },
    { id: 'info', label: 'Perfil' },
  ];

  const handleSelecao = (opcao) => setActiveTab(opcao);

  return (
    <header className="bg-white shadow-sm h-20 flex items-center justify-between px-6 z-10">
      <div className="flex items-center space-x-4">
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">{tabs.find(t => t.id === activeTab)?.label}</h2>
      </div>
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
    </header>
  );
}
