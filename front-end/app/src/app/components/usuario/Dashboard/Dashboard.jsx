'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// API para fazer requisições
import api from '../../../lib/api'; // Ajuste o caminho se necessário

// Todos os seus componentes de layout e páginas
import Sidebar from './Slidebar';
import Header from './Header';
import Inicio from '../Inicio/Inicio';
import Chamado from '../AbrirChamado/Chamado';
import MeusChamados from '../MeusChamados/MinhasPools';
import InstrucoesRapidas from '../Instrucoes/page';
import Contato from '../Contato/Contato';
import ProfileInfo from './ProfileInfo';

export default function Dashboard() {
  // === ESTADOS DO COMPONENTE ===
  
  // Navegação
  const [activeTab, setActiveTab] = useState('inicio');

  // Autenticação e Dados do Usuário
  const [funcionario, setFuncionario] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Controla o "Carregando..." inicial

  // Notificações
  const [notifications, setNotifications] = useState([]);

  const router = useRouter();

  // === LÓGICA DE AUTENTICAÇÃO === (Seu código original, restaurado)
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setFuncionario({
          id: decodedToken.id,
          nome: decodedToken.nome,
          funcao: decodedToken.funcao,
          email: decodedToken.email,
          matricula: decodedToken.username,
        });
      } catch (error) {
        console.error("Token inválido ou expirado, redirecionando:", error);
        Cookies.remove('token');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setIsLoading(false); // Finaliza o carregamento após verificar o token
  }, [router]);

  // === LÓGICA DE NOTIFICAÇÕES (Polling) ===
  useEffect(() => {
    if (!funcionario) return; // Só busca notificações se o login foi bem-sucedido

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notificacao');
        setNotifications(response.data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchNotifications(); // Busca na primeira vez que o componente carrega
    const intervalId = setInterval(fetchNotifications, 10000); // E busca a cada 10 segundos

    return () => clearInterval(intervalId); // Limpa o intervalo ao sair da página
  }, [funcionario]); // Roda essa lógica sempre que 'funcionario' for definido

  // === FUNÇÕES AUXILIARES ===

  // Função para pegar as iniciais do nome
  const getInitials = (name = '') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Funções para manipular as notificações (passadas para o Header)
  const marcarComoLida = async (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.lida) return;
    setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, lida: true } : n)));
    // (A chamada à API ficaria aqui)
  };

  const limparTodasNotificacoes = async () => {
    const originalNotifications = [...notifications];
    setNotifications([]);
    try {
      await api.delete('/notificacao');
    } catch (error) {
      console.error("Erro ao limpar notificações:", error);
      setNotifications(originalNotifications);
    }
  };

  // === RENDERIZAÇÃO ===

  // Tela de "Carregando..." enquanto o token está sendo verificado
  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Verificando autenticação...</div>;
  }
  
  // Se, após o carregamento, não houver um usuário válido, não renderiza nada (pois o redirect já foi acionado)
  if (!funcionario) {
    return null;
  }

  // Função para renderizar a aba de conteúdo ativa (Seu código original, restaurado)
  const renderContent = () => {
    switch(activeTab) {
      case 'inicio': return <><Inicio onAbrirChamado={() => setActiveTab('chamado')} /><InstrucoesRapidas /></>;
      case 'chamado': return <Chamado funcionario={funcionario} />;
      case 'meus': return <MeusChamados funcionario={funcionario} />;
      case 'contato': return <Contato funcionario={funcionario} />;
      case 'info': return <ProfileInfo funcionario={funcionario} getInitials={getInitials} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Componente da barra lateral */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Componente do Cabeçalho, agora alimentado com todos os dados */}
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
        
        {/* Conteúdo principal da página */}
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