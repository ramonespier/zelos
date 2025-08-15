'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { HiOutlineBell } from 'react-icons/hi';
import NotificationsDropdown from './Notifications';
import ProfileDropdown from './ProfileDropdown';

const funcionario = { nome: 'José Silva', funcao: 'Técnico', matricula: '12345678' };
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

export default function Header({ activeTab, setActiveTab }) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // mock notifications
  if (notifications.length === 0) {
    setNotifications([
      { id: 1, title: 'Novo chamado', message: 'Chamado #2456', time: '10 min atrás', read: false },
      { id: 2, title: 'Chamado atualizado', message: 'Chamado #1234', time: '2h atrás', read: true },
    ]);
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm h-20 flex items-center justify-between px-6 z-10">
      <div className="flex items-center space-x-4">
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">{activeTab}</h2>
      </div>

      <div className="flex items-center space-x-6">
        <NotificationsDropdown 
          notifications={notifications} 
          unreadCount={unreadNotificationsCount} 
          isOpen={isNotificationsOpen} 
          setIsOpen={setNotificationsOpen} 
        />
        <ProfileDropdown 
          funcionario={funcionario} 
          isOpen={isProfileOpen} 
          setIsOpen={setProfileOpen} 
          setActiveTab={setActiveTab} 
        />
      </div>
    </header>
  );
}
