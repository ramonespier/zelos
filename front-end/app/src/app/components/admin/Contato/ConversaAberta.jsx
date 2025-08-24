'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import api from '../../../lib/api';
import { toast } from 'sonner';

export default function ConversaAberta({ conversaAtiva, onVoltar, usuarioLogado }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        setTimeout(scrollToBottom, 100);
    }, [messages]);

    useEffect(() => {
        if (!conversaAtiva?.usuario_id) return;

        const fetchMessages = async () => {
            try {
                const response = await api.get(`/mensagens/usuario/${conversaAtiva.usuario_id}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
                toast.error("Não foi possível carregar as mensagens.");
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 3000);
        return () => clearInterval(intervalId);
    }, [conversaAtiva]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        try {
            const response = await api.post('/mensagens', {
                conteudo: newMessage,
                conversaUsuarioId: conversaAtiva.usuario_id,
            });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            toast.error("Falha ao enviar mensagem.");
        }
    };

    return (
        <main className="flex-1 flex flex-col bg-gray-50 h-full">
            <header className="flex items-center px-4 py-3 bg-white border-b border-gray-200 z-10">
                <button onClick={onVoltar} className="lg:hidden p-2 rounded-full hover:bg-gray-100 mr-2">
                    <FiArrowLeft size={20} />
                </button>
                <h3 className="text-lg font-semibold text-gray-800 m-0">
                    Conversa com {conversaAtiva.usuario.nome}
                </h3>
            </header>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.admin_id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-2xl max-w-[80%] leading-relaxed ${
                            msg.admin_id ? 'bg-red-600 text-white rounded-br-lg' : 'bg-white text-gray-800 border rounded-bl-lg'
                        }`}>
                            <strong className={`block text-xs font-bold mb-1 ${msg.admin_id ? 'text-red-100' : 'text-gray-500'}`}>
                                {msg.admin_id ? (msg.admin.id === usuarioLogado.id ? 'Você' : msg.admin.nome) : msg.usuario.nome}
                            </strong>
                            <p className="m-0 text-sm">{msg.conteudo}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center px-4 py-3 border-t bg-white">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="flex-1 bg-zinc-100 border-2 border-transparent p-3 rounded-full focus:bg-white focus:border-red-500 transition outline-none"/>
                <button type="submit" aria-label="Enviar" className="flex items-center justify-center bg-red-600 text-white rounded-full w-12 h-12 ml-3 transition hover:bg-red-700">
                    <FiSend size={20} />
                </button>
            </form>
        </main>
    );
}