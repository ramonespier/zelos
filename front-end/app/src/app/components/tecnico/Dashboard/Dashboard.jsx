'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Slidebar';
import Header from './Header';
import Inicio from '../Inicio/InicioTecnico';
import InstrucoesRapidas from '../Instrucoes/page';
import Contato from '../Contato/FormularioContato';
import ProfileInfo from './ProfileInfo';
import ChamadosAbertos from '../ChamadosAbertos/ChamadosAbertos';
import ChamadosAtribuidos from '../ChamadosAtribuidos/ChamadosAtribuidos';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [notifications, setNotifications] = useState([]);
  const funcionario = { nome: 'Ramon Coelho Melo', funcao: 'Técnico', matricula: '24250000' };

  // Mock notificações
  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: 'Novo chamado criado', message: 'Você abriu o chamado #1024.', time: '10 min atrás', read: false },
      { id: 2, title: 'Chamado atualizado', message: 'O chamado #1001 está "Em Andamento".', time: '2 horas atrás', read: true },
    ];
    setNotifications(mockNotifications);
  }, []);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const renderContent = () => {
    switch(activeTab) {
      case 'inicio': return <><Inicio onAbrirChamado={() => setActiveTab('chamado')} /><InstrucoesRapidas /></>;
      case 'contato': return <Contato />;
      case 'atribuidos': return <ChamadosAtribuidos />;
      case 'abertos': return <ChamadosAbertos />;
      case 'info': return <ProfileInfo funcionario={funcionario} getInitials={getInitials} />;
      default: return null;
    }
  };

  const marcarComoLida = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notifications={notifications}
          marcarComoLida={marcarComoLida}
          unreadNotificationsCount={unreadNotificationsCount}
          funcionario={funcionario}
          getInitials={getInitials}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
