import { useState, useEffect, useRef } from 'react';
import api from '../../../lib/api';

const PainelChatAdmin = () => {
    const [conversas, setConversas] = useState([]);
    const [conversaAtiva, setConversaAtiva] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Efeito para buscar a lista de conversas
    useEffect(() => {
        const fetchConversas = async () => {
            try {
                const response = await api.get('/mensagens/conversas');
                setConversas(response.data);
            } catch (error) {
                console.error("Erro ao buscar conversas:", error.response?.data || error.message);
            }
        };

        fetchConversas();
        const intervalId = setInterval(fetchConversas, 10000);
        return () => clearInterval(intervalId);
    }, []);

    // Efeito para buscar as mensagens da conversa ativa
    useEffect(() => {
        if (!conversaAtiva) return;

        const fetchMessages = async () => {
            try {
                const response = await api.get(`/mensagens/usuario/${conversaAtiva.usuario_id}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error.response?.data || error.message);
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 3000);
        return () => clearInterval(intervalId);
    }, [conversaAtiva]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !conversaAtiva) return;
        try {
            const response = await api.post('/mensagens', {
                conteudo: newMessage,
                conversaUsuarioId: conversaAtiva.usuario_id,
            });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error.response?.data || error.message);
        }
    };
    
    return (
        <div className="flex h-[85vh] rounded-xl bg-white shadow-lg overflow-hidden font-sans">
            {/* Painel lateral de conversas */}
            <aside className="w-80 border-r border-gray-200 flex flex-col bg-white">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-600 m-0">Conversas</h2>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {conversas.map(conv => (
                        <div
                            key={conv.usuario_id}
                            className={`flex items-center px-6 py-4 border-b border-gray-200 cursor-pointer transition-colors ${
                                conversaAtiva?.usuario_id === conv.usuario_id 
                                ? 'bg-red-50 border-r-4 border-r-red-600' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setConversaAtiva(conv)}
                        >
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                                {conv.usuario.nome.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <strong className="block text-base text-gray-600">{conv.usuario.nome}</strong>
                                <p className="mt-1 text-sm text-gray-600 truncate">{conv.ultima_mensagem}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Área principal do chat */}
            <main className="flex-1 flex flex-col bg-gray-50">
                {conversaAtiva ? (
                    <>
                        <header className="px-6 py-4 bg-white border-b border-gray-200 z-10">
                            <h3 className="text-lg font-medium m-0">Conversa com {conversaAtiva.usuario.nome}</h3>
                        </header>
                        <div className="flex-1 p-6 overflow-y-auto">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex mb-4 ${
                                        msg.admin_id ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`px-4 py-3 rounded-2xl max-w-[75%] leading-relaxed ${
                                        msg.admin_id 
                                        ? 'bg-red-600 text-white rounded-tr-md' 
                                        : 'bg-white text-gray-600 border border-gray-200 rounded-tl-md'
                                    }`}>
                                        <strong className="block text-sm opacity-90 mb-1">
                                            {msg.admin_id ? 'Você' : msg.usuario.nome}
                                        </strong>
                                        <p className="m-0">{msg.conteudo}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="flex items-center px-6 py-4 border-t border-gray-200 bg-white">
                            <input 
                                type="text" 
                                value={newMessage} 
                                onChange={(e) => setNewMessage(e.target.value)} 
                                placeholder="Digite sua resposta..." 
                                className="flex-1 border border-gray-200 rounded-full px-4 py-3 text-base bg-gray-50 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                            />
                            <button 
                                type="submit" 
                                aria-label="Enviar Mensagem"
                                className="flex items-center justify-center bg-red-600 text-white border-none rounded-full w-12 h-12 text-2xl font-bold cursor-pointer ml-3 transition-colors hover:bg-red-600"
                            >
                                ➤
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-center">
                        <span className="text-5xl text-gray-300 mb-4">←</span>
                        <p>Selecione uma conversa ao lado para visualizar as mensagens.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PainelChatAdmin;