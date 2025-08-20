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

// <<< PÁGINAS ESPECÍFICAS DO TÉCNICO >>>
import InicioTecnico from '../Inicio/InicioTecnico';
import Contato from '../Contato/ChatUsuario';
import ChamadosAbertos from '../ChamadosAbertos/ChamadosAbertos';
import ChamadosAtribuidos from '../ChamadosAtribuidos/ChamadosAtribuidos';

export default function Dashboard() {
  // Estados de navegação e autenticação
  const [activeTab, setActiveTab] = useState('inicio');
  const [funcionario, setFuncionario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estado e lógica de notificações (reutilizada da versão do usuário)
  const [notifications, setNotifications] = useState([]);
  
  const router = useRouter();

  // Hooks de autenticação e notificações (sem alterações)
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Garante que o usuário logado é realmente um técnico
        if (decoded.funcao !== 'tecnico') {
          // Poderia redirecionar para um dashboard apropriado ou para o login
          router.push('/login'); 
        }
        setFuncionario(decoded);
      } catch (e) { router.push('/login'); }
    } else { router.push('/login'); }
    setIsLoading(false);
  }, [router]);
  
  useEffect(() => {
    if (!funcionario) return;
    const fetchNotifications = async () => {
      try {
        setNotifications(await api.get('/notificacao').then(res => res.data));
      } catch (e) { console.error("Erro ao buscar notificações", e); }
    };
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, [funcionario]);


  // Função para salvar a especialidade (a ser usada pelo ProfileInfo)
  const handleSaveEspecialidade = async (especialidade) => {
    if (!funcionario || !funcionario.id) return;
    try {
      // Rota PATCH para atualizar o usuário (conforme seu usuarioRoutes.js)
      const response = await api.patch(`/usuarios/${funcionario.id}`, { especialidade });
      // Atualiza o estado local para refletir a mudança instantaneamente
      setFuncionario(prev => ({ ...prev, especialidade: response.data.especialidade }));
    } catch (error) {
      console.error("Falha ao atualizar especialidade:", error);
      // Re-lança o erro para que o componente filho possa saber que falhou
      throw error;
    }
  };

  // Funções de notificações
  const marcarComoLida = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  const limparTodasNotificacoes = () => setNotifications([]); // Implementar chamada à API se necessário
  const getInitials = (name = "") => name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Tela de carregamento
  if (isLoading || !funcionario) {
    return <div>Carregando Dashboard do Técnico...</div>;
  }
  
  // <<< LÓGICA DE RENDERIZAÇÃO ESPECÍFICA DO TÉCNICO >>>
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
          onSaveEspecialidade={handleSaveEspecialidade} // Passa a função para salvar
        />
      );
      default: return null;
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