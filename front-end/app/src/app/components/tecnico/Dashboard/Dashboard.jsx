'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '../../../lib/api'; // Ajuste o caminho se necessário

// Componentes do Dashboard
import Sidebar from './Slidebar';
import Header from './Header';
import ProfileInfo from './ProfileInfo';

// Páginas específicas do Técnico
import InicioTecnico from '../Inicio/InicioTecnico';
import Contato from '../Contato/ChatUsuario'; // Renomeie se necessário
import ChamadosAbertos from '../ChamadosAbertos/ChamadosAbertos';
import ChamadosAtribuidos from '../ChamadosAtribuidos/ChamadosAtribuidos';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [funcionario, setFuncionario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // Hooks de autenticação e busca inicial de notificações
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.funcao !== 'tecnico') {
          router.push('/login');
          return;
        }
        setFuncionario(decoded);
      } catch (e) {
        Cookies.remove('token');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (!funcionario) return;
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notificacao');
        setNotifications(response.data);
      } catch (e) { console.error("Erro ao buscar notificações", e); }
    };
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, [funcionario]);


  // Função para salvar a especialidade
  const handleSaveEspecialidade = async (especialidade) => {
    if (!funcionario || !funcionario.id) return;
    try {
      const response = await api.patch(`/usuarios/${funcionario.id}`, { especialidade });
      setFuncionario(prev => ({ ...prev, especialidade: response.data.especialidade }));
    } catch (error) {
      console.error("Falha ao atualizar especialidade:", error);
      throw error;
    }
  };

  // ==========================================================
  // <<< INÍCIO DAS CORREÇÕES DAS FUNÇÕES DE NOTIFICAÇÃO >>>
  // ==========================================================

  const marcarComoLida = async (notificationId) => {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification || notification.lida) return;

      // 1. Atualização Otimista: Muda a UI imediatamente
      setNotifications(prev => 
          prev.map(n => (n.id === notificationId ? { ...n, lida: true } : n))
      );

      try {
          // 2. Chamada à API para salvar a mudança no banco de dados
          await api.patch(`/notificacao/${notificationId}/lida`);
      } catch (error) {
          console.error("Erro ao marcar notificação como lida:", error);
          // 3. Rollback: Se a API falhar, desfaz a mudança na UI
          setNotifications(prev => 
              prev.map(n => (n.id === notificationId ? { ...n, lida: false } : n))
          );
          alert("Não foi possível marcar a notificação como lida. Tente novamente.");
      }
  };

  const limparTodasNotificacoes = async () => {
      const backup = [...notifications];
      setNotifications([]);
      try {
          // A rota DELETE /notificacao já remove todas as do usuário logado
          await api.delete('/notificacao');
      } catch (error) {
          console.error("Erro ao limpar notificações:", error);
          setNotifications(backup); // Restaura em caso de erro
          alert("Não foi possível limpar as notificações.");
      }
  };

  // ==========================================================
  // <<< FIM DAS CORREÇÕES >>>
  // ==========================================================
  
  const getInitials = (name = "") => name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Renderização
  if (isLoading || !funcionario) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando Dashboard do Técnico...</div>;
  }
  
  const renderContent = () => {
    switch(activeTab) {
      case 'inicio': return <InicioTecnico />;
      case 'abertos': return <ChamadosAbertos funcionario={funcionario} />;
      case 'atribuidos': return <ChamadosAtribuidos funcionario={funcionario} />;
      case 'contato': return <Contato funcionario={funcionario} />;
      case 'info': return (
        <ProfileInfo 
          funcionario={funcionario} 
          getInitials={getInitials}
          onSaveEspecialidade={handleSaveEspecialidade}
        />
      );
      default: return <InicioTecnico />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notifications={notifications}
          marcarComoLida={marcarComoLida}
          limparTodasNotificacoes={limparTodasNotificacoes}
          unreadNotificationsCount={notifications.filter(n => !n.lida).length}
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