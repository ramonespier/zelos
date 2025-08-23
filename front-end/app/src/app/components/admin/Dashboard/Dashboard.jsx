'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import api from '../../../lib/api';

import Sidebar from './Slidebar';
import Header from './Header';
import ProfileInfo from './ProfileInfo';

import Inicio from '../Inicio/Inicio';
import GerenciarChamados from '../GerenciarChamados/GerenciarChamados';
import ChamadosAtribuidos from '../ChamadosAtribuidos/ChamadosAtribuidos';
import GerenciarFechamentos from '../GerenciarFechamento/GerenciarFechamento';
import Relatorio from '../Relatorios/Relatorios';
import AbrirChamado from '../AbrirChamado/Chamado';
import Mensagens from '../Contato/PainelChatAdmin';
import GerenciarPedidos from '../GerenciarPedidos/GerenciarPedidos';
import GerenciarPatrimonios from '../GerenciasPatrimonios/GerenciarPatrimonios';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('inicio');
    const [funcionario, setFuncionario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();


    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.funcao !== 'admin') {
                    router.push('/login');
                    return;
                }
                setFuncionario(decodedToken);
            } catch (error) {
                console.error("Token inválido, redirecionando:", error);
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
            } catch (error) {
                console.error("Erro ao buscar notificações:", error.response?.data || error.message);
            }
        };
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 15000);
        return () => clearInterval(intervalId);
    }, [funcionario]);

    const getInitials = (name = '') => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const marcarComoLida = async (notificationId) => {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification || notification.lida) return;
        setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, lida: true } : n)));
        try {
            await api.patch(`/notificacao/${notificationId}/lida`);
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
            setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, lida: false } : n)));
        }
    };

    const limparTodasNotificacoes = async () => {
        const backupNotifications = [...notifications];
        setNotifications([]);
        try {
            await api.delete('/notificacao');
        } catch (error) {
            console.error("Erro ao limpar notificações no servidor:", error);
            setNotifications(backupNotifications);
            alert("Não foi possível limpar as notificações. Tente novamente.");
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center text-lg text-gray-600">Verificando autenticação...</div>;
    }

    if (!funcionario) {
        return null;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'inicio': return <Inicio setActiveTab={setActiveTab} />;
            case 'abrir': return <AbrirChamado funcionario={funcionario} />;
            case 'gerenciar': return <GerenciarChamados funcionario={funcionario} />;
            case 'atribuidos': return <ChamadosAtribuidos funcionario={funcionario} setActiveTab={setActiveTab} />;
            case 'pedidos': return <GerenciarPedidos funcionario={funcionario} />;
            case 'fechamento': return <GerenciarFechamentos funcionario={funcionario} />;
            case 'patrimonio': return <GerenciarPatrimonios funcionario={funcionario} />;
            case 'mensagens': return <Mensagens funcionario={funcionario} />;
            case 'relatorio': return <Relatorio />;
            case 'info': return <ProfileInfo funcionario={funcionario} getInitials={getInitials} />;
            default: return <Inicio setActiveTab={setActiveTab} />;
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