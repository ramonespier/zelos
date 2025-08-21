import { useState, useEffect, useRef } from 'react';
import api from '../../../lib/api'; // Certifique-se de que o caminho está correto

// --- Ícones ---
const ExpandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

const MinimizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

// --- Componente do Chat ---
const ChatFixoIntegrado = () => {
    // States do novo estilo
    const [isOpen, setIsOpen] = useState(false);
    
    // States e Refs do chat original
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Funções de controle
    const toggleChat = () => setIsOpen(!isOpen);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // Efeito para rolar para baixo quando novas mensagens chegam (se o chat estiver aberto)
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Efeito para buscar mensagens da API (APENAS QUANDO O CHAT ESTÁ ABERTO)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Busca somente se o chat estiver expandido
                if (isOpen) { 
                    const response = await api.get('/mensagens/minhas');
                    setMessages(response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error.response?.data || error.message);
            }
        };

        fetchMessages();
        
        // Configura um intervalo para buscar novas mensagens a cada 5 segundos
        const intervalId = setInterval(fetchMessages, 5000);
        
        // Limpa o intervalo quando o componente for desmontado para evitar vazamentos de memória
        return () => clearInterval(intervalId);
    }, [isOpen]); // Dependência crucial: Roda o efeito quando 'isOpen' muda

    // Função para enviar mensagem (lógica da API do componente original)
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            const response = await api.post('/mensagens', {
                conteudo: newMessage,
            });
            // Adiciona a nova mensagem (retornada pela API) ao estado
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error.response?.data || error.message);
        }
    };

    return (
        <div className="fixed bottom-0 right-5 z-50 font-sans">
            <div className="w-[350px] bg-white rounded-t-lg shadow-2xl border-x border-t border-gray-200">
                {/* Cabeçalho que abre/fecha o chat */}
                <header
                    onClick={toggleChat}
                    className="flex justify-between items-center p-4 bg-red-600 text-white rounded-t-lg cursor-pointer"
                >
                    <h3 className="text-lg font-semibold m-0">Suporte</h3>
                    <span>
                        {isOpen ? <MinimizeIcon /> : <ExpandIcon />}
                    </span>
                </header>

                {/* Container do conteúdo do chat, controlado pelo 'isOpen' */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[450px]' : 'max-h-0'}`}>
                    
                    {/* Área de Mensagens */}
                    <div className="h-[380px] p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.length === 0 && (
                            <p className="h-full flex items-center justify-center text-gray-400 text-sm">
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
                                    <strong className="text-sm font-bold opacity-90">
                                        {msg.admin_id ? msg.admin?.nome || 'Suporte' : 'Você'}
                                    </strong>
                                    <p className="text-base break-words">{msg.conteudo}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Formulário de Envio */}
                    <form onSubmit={handleSendMessage} className="flex items-center p-3 bg-white border-t border-gray-200">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua dúvida aqui..."
                            autoComplete="off"
                            className="flex-1 px-4 py-2 text-base bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button
                            type="submit"
                            aria-label="Enviar"
                            className="ml-3 flex-shrink-0 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:bg-gray-300"
                            disabled={!newMessage.trim()}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatFixoIntegrado;