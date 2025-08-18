'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie'; // Importa a biblioteca para ler cookies. [1]
import { jwtDecode } from 'jwt-decode'; // Importa a biblioteca para decodificar o token. [3]
import Sidebar from './Slidebar';
import Header from './Header';
import Inicio from '../Inicio/Inicio';
import Chamado from '../AbrirChamado/Chamado';
import MeusChamados from '../MeusChamados/MinhasPools';
import InstrucoesRapidas from '../Instrucoes/page';
import Contato from '../Contato/Contato';
import ProfileInfo from './ProfileInfo';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [notifications, setNotifications] = useState([]);
  // O estado 'funcionario' agora começa como null e será preenchido com os dados do token.
  const [funcionario, setFuncionario] = useState(null); 
  const router = useRouter();

  // Efeito para ler o token do cookie e definir as informações do usuário
  useEffect(() => {
    const token = Cookies.get('token'); // Busca o token no cookie. [2, 4]

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decodifica o token. [3]
        
        // Mapeia os dados do token para o formato esperado pelo estado 'funcionario'
        setFuncionario({
          nome: decodedToken.nome,
          funcao: decodedToken.funcao,
          matricula: decodedToken.username, // Assumindo que o 'username' do token é a matrícula
        });
        
      } catch (error) {
        console.error("Token inválido ou expirado:", error);
        // Se o token for inválido, redireciona para a página de login
        router.push('/login');
      }
    } else {
      // Se não houver token, redireciona para o login
      console.log("Nenhum token encontrado, redirecionando para login.");
      router.push('/login');
    }
  }, [router]); // Adiciona 'router' como dependência

  // Mock de notificações (mantido como estava)
  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: 'Novo chamado criado', message: 'Você abriu o chamado #1024.', time: '10 min atrás', read: false },
      { id: 2, title: 'Chamado atualizado', message: 'O chamado #1001 está "Em Andamento".', time: '2 horas atrás', read: true },
    ];
    setNotifications(mockNotifications);
  }, []);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Enquanto os dados do funcionário não são carregados, exibe uma mensagem ou tela de loading.
  if (!funcionario) {
    return <div>Carregando informações do usuário...</div>;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'inicio': return <><Inicio onAbrirChamado={() => setActiveTab('chamado')} /><InstrucoesRapidas /></>;
      case 'chamado': return <Chamado />;
      case 'meus': return <MeusChamados />;
      case 'contato': return <Contato />;
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
          // Os dados do funcionário agora vêm do estado
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