'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiInbox, FiLoader } from 'react-icons/fi';
import api from '../../../lib/api';
import { toast } from 'sonner';
import ConversaAberta from './ConversaAberta'; 

export default function PainelChatAdmin({ funcionario }) { 
    const [conversas, setConversas] = useState([]);
    const [conversaAtiva, setConversaAtiva] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversas = async () => {
            setLoading(true);
            try {
                const response = await api.get('/mensagens/conversas');
                setConversas(response.data);
            } catch (error) {
                console.error("Erro ao buscar conversas:", error);
                toast.error("Não foi possível carregar as conversas.");
            } finally {
                setLoading(false);
            }
        };

        fetchConversas();
        // polling
        const intervalId = setInterval(fetchConversas, 10000); 
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div className="p-8 text-center"><FiLoader className="animate-spin text-2xl mx-auto"/></div>;

    return (
        <div className="flex h-[calc(100vh-10rem)] rounded-2xl bg-white shadow-subtle border border-gray-200/80 overflow-hidden font-sans">
            
            <aside className={`w-full lg:w-80 border-r border-gray-200 flex-col flex-shrink-0 transition-transform duration-300
                ${conversaAtiva ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
                
                <header className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2"><FiMessageSquare /> Conversas</h2>
                </header>
                
                <div className="overflow-y-auto flex-grow">
                    {conversas.length > 0 ? (
                        conversas.map(conv => (
                            <div key={conv.usuario_id} onClick={() => setConversaAtiva(conv)}
                                className={`flex items-center px-6 py-4 border-b cursor-pointer transition-colors ${
                                conversaAtiva?.usuario_id === conv.usuario_id ? 'bg-red-50 border-r-4 border-red-600' : 'hover:bg-gray-50'}`}>
                                
                                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                                    {conv.usuario.nome.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <strong className="block text-base font-semibold text-gray-800">{conv.usuario.nome}</strong>
                                    <p className="mt-1 text-sm text-gray-500 truncate">{conv.ultima_mensagem}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <FiInbox className="mx-auto text-4xl mb-2"/>
                            <p className="font-semibold">Nenhuma conversa.</p>
                        </div>
                    )}
                </div>
            </aside>

            <div className={`flex-1 flex-col h-full absolute w-full lg:static transition-transform duration-300
                 ${conversaAtiva ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                {conversaAtiva ? (
                    <ConversaAberta 
                        conversaAtiva={conversaAtiva} 
                        onVoltar={() => setConversaAtiva(null)} 
                        usuarioLogado={funcionario}
                    />
                ) : (
                    <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-gray-500 text-center">
                        <span className="text-5xl text-gray-300 mb-4">←</span>
                        <p className="font-semibold">Selecione uma conversa</p>
                        <p className="text-sm">Escolha um item da lista ao lado para começar a responder.</p>
                    </div>
                )}
            </div>

        </div>
    );
};  