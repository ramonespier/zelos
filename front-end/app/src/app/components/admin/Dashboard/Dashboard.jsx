'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// API para fazer requisições
import api from '../../../lib/api'; // Ajuste o caminho se necessário

// Seus componentes de layout e páginas do dashboard de admin
import Sidebar from './Slidebar';
import Header from './Header';
import Inicio from '../Inicio/Inicio';
import GerenciarChamados from '../GerenciarChamados/GerenciarChamados';
import ChamadosAtribuidos from '../ChamadosAtribuidos/ChamadosAtribuidos'
import Relatorio from '../Relatorios/Relatorios'
import AbrirChamado from '../AbrirChamado/Chamado'
import Mensagens from '../Contato/PainelChatAdmin'
import ProfileInfo from './ProfileInfo';

export default function Dashboard() {
    // === ESTADOS DO COMPONENTE ===

    // Navegação
    const [activeTab, setActiveTab] = useState('inicio');

    // Autenticação e Dados do Usuário
    const [funcionario, setFuncionario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Notificações
    const [notifications, setNotifications] = useState([]);

    const router = useRouter();

    // === LÓGICA DE AUTENTICAÇÃO E BUSCA INICIAL ===
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                // Verificação de segurança: redireciona se não for admin ou técnico
                if (!['admin', 'tecnico'].includes(decodedToken.funcao)) {
                    console.error("Acesso não autorizado, redirecionando para o login.");
                    Cookies.remove('token');
                    router.push('/login');
                    return; // Interrompe a execução
                }
                
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
        // Só executa se a verificação de login já foi concluída e foi bem-sucedida
        if (!funcionario) return; 

        const fetchNotifications = async () => {
            try {
                // Supondo que sua rota de notificações já retorna as notificações certas
                const response = await api.get('/notificacao'); 
                setNotifications(response.data);
            } catch (error) {
                console.error("Erro ao buscar notificações:", error.response?.data || error.message);
            }
        };

        fetchNotifications(); // Busca na primeira vez
        const intervalId = setInterval(fetchNotifications, 15000); // Busca a cada 15 segundos

        // Limpa o intervalo quando o componente é desmontado para evitar memory leaks
        return () => clearInterval(intervalId); 
    }, [funcionario]); // Roda essa lógica sempre que 'funcionario' mudar

    // === FUNÇÕES AUXILIARES ===

    const getInitials = (name = '') => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const marcarComoLida = async (notificationId) => {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification || notification.lida) return;
        
        // Atualiza a UI imediatamente para uma melhor experiência do usuário
        setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, lida: true } : n)));
        
        try {
            // Envia a requisição para o back-end para persistir a mudança
            await api.patch(`/notificacao/${notificationId}/lida`); 
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
            // Opcional: Reverte a mudança na UI se a API falhar
            setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, lida: false } : n)));
        }
    };
    
    // Contagem de notificações não lidas para o Header
    const unreadNotificationsCount = notifications.filter(n => !n.lida).length;


    // === RENDERIZAÇÃO ===

    // Tela de carregamento enquanto o token é verificado
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center text-lg text-gray-600">Verificando autenticação...</div>;
    }
    
    // Se o funcionário não for válido, não renderiza nada (pois já está sendo redirecionado)
    if (!funcionario) {
        return null;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'inicio': return <Inicio onAbrirChamado={() => setActiveTab('abrir')} />;
            case 'abrir': return <AbrirChamado />;
            case 'gerenciar': return <GerenciarChamados />;
            case 'atribuidos': return <ChamadosAtribuidos />;
            case 'mensagens': return <Mensagens />;
            case 'relatorio': return <Relatorio />;
            case 'perfil': return <ProfileInfo funcionario={funcionario} getInitials={getInitials} />;
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