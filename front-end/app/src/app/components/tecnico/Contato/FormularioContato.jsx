'use client';
import { useState, useEffect } from 'react'; // Adicionamos useEffect
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import api from '../../../lib/api'; // Certifique-se de que o caminho está correto

// Importa os componentes de formulário que você criou
import InputField from './InputField';
import TextareaField from './TextareaField';
import ModalMensagem from './ModalMensagem';

// O componente agora recebe 'funcionario' como prop vindo do Dashboard do técnico
export default function FormularioContato({ funcionario }) {
    const [titulo, setTitulo] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erros, setErros] = useState({});
    
    // Estados para controle de UI
    const [modalAberto, setModalAberto] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useEffect para preencher o e-mail do técnico assim que o componente carregar
    useEffect(() => {
        if (funcionario && funcionario.email) {
            setEmail(funcionario.email);
        }
    }, [funcionario]);

    const validarFormulario = () => {
        const newErros = {};
        if (titulo.trim().length < 5) newErros.titulo = 'O título precisa ter ao menos 5 caracteres.';
        if (!email.trim()) newErros.email = 'O email é obrigatório.';
        else if (!/\S+@\S+\.\S+/.test(email)) newErros.email = 'O formato do email é inválido.';
        if (mensagem.trim().length < 10) newErros.mensagem = 'A mensagem precisa ter ao menos 10 caracteres.';
        setErros(newErros);
        return Object.keys(newErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        // Verifica se os dados do funcionário existem antes de enviar
        if (!funcionario || !funcionario.id) {
            alert("Sua sessão é inválida. Por favor, recarregue a página.");
            return;
        }

        setIsSubmitting(true);

        // O backend espera um campo 'conteudo', então combinamos as informações
        const payload = {
            conteudo: `Assunto: ${titulo}\n\nEnviado por: ${funcionario.nome} (${email})\n\nMensagem:\n${mensagem}`
        };

        try {
            // A chamada de API para a rota POST /mensagens
            await api.post('/mensagens', payload);
            
            setModalAberto(true); // Abre o modal de sucesso
            
            // Limpa o formulário, mas mantém o e-mail do técnico
            setTitulo('');
            setMensagem('');
            setErros({});

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Não foi possível enviar a mensagem.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h1 className='text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center'>
                    Entre em contato com a equipe para obter suporte.
                </h1>
                <div className='max-w-xl mx-auto mt-10 mb-20 bg-white p-8 rounded-3xl shadow-xl border border-gray-200'>
                    <h2 className="text-4xl font-extrabold mb-10 text-red-600 text-center tracking-wide drop-shadow-sm">
                        Formulário de Contato
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                        
                        {/* Seus componentes de input reutilizáveis */}
                        <InputField 
                            label="Título" 
                            value={titulo} 
                            onChange={(e) => setTitulo(e.target.value)} 
                            placeholder="Assunto principal" 
                            error={erros.titulo} 
                            id="titulo" 
                        />
                        <InputField 
                            label="Email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="seu.email@exemplo.com" 
                            error={erros.email} 
                            id="email" 
                        />
                        <TextareaField 
                            label="Mensagem" 
                            value={mensagem} 
                            onChange={(e) => setMensagem(e.target.value)} 
                            placeholder="Digite sua mensagem detalhada aqui" 
                            error={erros.mensagem} 
                            id="mensagem" 
                        />
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="mt-6 bg-red-600 cursor-pointer text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'} 
                            {!isSubmitting && <FaPaperPlane size={20} />}
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* O modal que já existia */}
            <ModalMensagem aberto={modalAberto} onClose={() => setModalAberto(false)} />
        </>
    );
}