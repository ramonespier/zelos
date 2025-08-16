'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import InputField from './InputField';
import TextareaField from './TextareaField';
import ModalMensagem from './ModalMensagem';

export default function FormularioContato() {
    const [titulo, setTitulo] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erros, setErros] = useState({});
    const [modalAberto, setModalAberto] = useState(false);

    const validarFormulario = () => {
        const newErros = {};
        if (titulo.trim().length < 5) newErros.titulo = 'O título precisa ter ao menos 5 caracteres.';
        if (!email.trim()) newErros.email = 'O email é obrigatório.';
        else if (!/\S+@\S+\.\S+/.test(email)) newErros.email = 'O formato do email é inválido.';
        if (mensagem.trim().length < 10) newErros.mensagem = 'A mensagem precisa ter ao menos 10 caracteres.';
        setErros(newErros);
        return Object.keys(newErros).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            console.log("Formulário válido. Dados:", { titulo, email, mensagem });
            setModalAberto(true);
            setTitulo('');
            setEmail('');
            setMensagem('');
            setErros({});
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
                        <InputField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Assunto principal" error={erros.titulo} id="titulo" />
                        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.email@exemplo.com" error={erros.email} id="email" />
                        <TextareaField label="Mensagem" value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Digite sua mensagem detalhada aqui" error={erros.mensagem} id="mensagem" />
                        <button type="submit" className="mt-6 bg-red-600 cursor-pointer text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg">
                            Enviar Mensagem <FaPaperPlane size={20} />
                        </button>
                    </form>
                </div>
            </motion.div>

            <ModalMensagem aberto={modalAberto} onClose={() => setModalAberto(false)} />
        </>
    );
}
