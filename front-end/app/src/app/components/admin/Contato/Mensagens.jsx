'use client';

import { useEffect, useState, useRef } from 'react';
import { FiInbox, FiMessageSquare, FiSend, FiLoader, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../../lib/api' // <-- IMPORTANDO A INSTÂNCIA DO AXIOS

export default function AdminContato() {
    const [pool, setPool] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Formatar data para exibição
    const formatDate = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString('pt-BR', options);
    };

    // Buscar mensagens pendentes (usando axios)
    const fetchPendingMessages = async () => {
        try {
            setError(null);
            const response = await api.get('/mensagens/pool');
            setPool(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao buscar mensagens pendentes.';
            setError(errorMessage);
            console.error('Erro:', err);
        }
    };

    // Buscar histórico de mensagens (usando axios)
    const fetchChatHistory = async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/mensagens/usuario/${userId}`);
            setMessages(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao buscar histórico do chat.';
            setError(errorMessage);
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    // Pegar mensagem da pool (usando axios)
    const claimMessage = async (messageId, userId) => {
        try {
            setLoading(true);
            setError(null);
            await api.patch(`/mensagens/${messageId}/pegar`);
            
            setActiveChat(userId);
            await fetchChatHistory(userId); // Carrega o histórico
            await fetchPendingMessages(); // Atualiza a lista da pool
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao pegar mensagem da pool.';
            setError(errorMessage);
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    // Enviar resposta (usando axios)
    const sendReply = async () => {
        if (!newMessage.trim() || !activeChat) return;
        
        try {
            const lastUserMessage = messages.filter(m => !m.admin_id).pop();
            if (!lastUserMessage) {
                setError('Não há uma mensagem do usuário para responder.');
                return;
            }

            const response = await api.post(`/mensagens/${lastUserMessage.id}/responder`, {
                conteudo: newMessage
            });
            
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao enviar resposta.';
            setError(errorMessage);
            console.error('Erro:', err);
        }
    };

    // Rolagem automática para o final do chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Efeitos
    useEffect(() => {
        fetchPendingMessages();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // O JSX (return) permanece o mesmo
    return (
        <div className="flex h-[80vh] bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Sidebar - Lista de conversas */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <FiInbox /> Conversas Pendentes
                    </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {error && (
                        <div className="p-4 text-red-500 text-sm">{error}</div>
                    )}
                    
                    {pool.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                            <FiMessageSquare className="mx-auto text-4xl mb-2" />
                            <p>Nenhuma conversa pendente</p>
                        </div>
                    ) : (
                        pool.map(msg => (
                            <div
                                key={msg.id}
                                className={`p-3 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${
                                    activeChat === msg.usuario_id ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => claimMessage(msg.id, msg.usuario_id)}
                            >
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <FiUser className="text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">
                                        {msg.usuario?.nome || 'Usuário'}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {msg.conteudo}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Área principal do chat */}
            <div className="flex-1 flex flex-col">
                {!activeChat ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <FiMessageSquare className="text-5xl mb-4" />
                        <h3 className="font-bold text-lg">Selecione uma conversa</h3>
                        <p className="text-sm">Escolha uma mensagem na lista ao lado</p>
                    </div>
                ) : (
                    <>
                        {/* Cabeçalho do chat */}
                        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <FiUser className="text-blue-600" />
                            </div>
                            <h3 className="font-bold">
                                {messages.find(m => m.usuario_id === activeChat)?.usuario?.nome || 'Usuário'}
                            </h3>
                        </div>

                        {/* Mensagens */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <FiLoader className="animate-spin text-gray-400 text-2xl" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map(msg => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.admin_id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                                                    msg.admin_id
                                                        ? 'bg-blue-600 text-white rounded-br-none'
                                                        : 'bg-white border border-gray-200 rounded-bl-none'
                                                }`}
                                            >
                                                <p>{msg.conteudo}</p>
                                                <p className={`text-xs mt-1 text-right ${msg.admin_id ? 'text-blue-200' : 'text-gray-500'}`}>
                                                    {formatDate(msg.criado_em)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input de mensagem */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                                />
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                                    onClick={sendReply}
                                    disabled={!newMessage.trim() || loading}
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}