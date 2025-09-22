import { useState, useEffect, useRef } from 'react';
import api from '../../../lib/api'; 

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);


const ChatUsuario = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get('/mensagens/minhas');
                setMessages(response.data);
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error.response?.data || error.message);
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        try {
            const response = await api.post('/mensagens', {
                conteudo: newMessage,
            });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error.response?.data || error.message);
        }
    };

    return (
    
        <div className="flex flex-col font-sans max-w-md h-[600px] bg-white rounded-xl shadow-lg border border-gray-200">
    
            <header className="px-6 py-4 bg-red-600 text-white rounded-t-xl">
                <h3 className="text-lg font-semibold m-0">Suporte ao vivo</h3>
            </header>
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                {messages.length === 0 && (
                    <p className="h-full flex items-center justify-center text-gray-500">
                        Envie uma mensagem para iniciar a conversa.
                    </p>
                )}
                {messages.map((msg) => (
                
                    <div key={msg.id} className={`flex ${msg.admin_id ? 'justify-start' : 'justify-end'}`}>
                     
                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                            msg.admin_id
                                ? 'bg-white text-gray-800 rounded-bl-lg border' 
                                : 'bg-red-600 text-white rounded-br-lg'      
                        }`}>
                            <strong className="text-sm font-bold opacity-90">{msg.admin_id ? msg.admin.nome : 'Você'}</strong>
                            <p className="text-base break-words">{msg.conteudo}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center p-4 bg-white border-t border-gray-200">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua dúvida aqui..."
                    autoComplete="off"
                    className="flex-1 px-5 py-3 text-base bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                    type="submit"
                    aria-label="Enviar"
                    className="ml-3 flex-shrink-0 w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:bg-gray-300"
                    disabled={!newMessage.trim()}
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatUsuario;