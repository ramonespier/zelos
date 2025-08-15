'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

export default function FormularioContato() {
    const [titulo, setTitulo] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erros, setErros] = useState({});
    const [modalAberto, setModalAberto] = useState(false);

    const validarFormulario = () => {
        const newErros = {};
        if (titulo.trim().length < 5) {
            newErros.titulo = 'O título precisa ter ao menos 5 caracteres.';
        }
        if (!email.trim()) {
            newErros.email = 'O email é obrigatório.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErros.email = 'O formato do email é inválido.';
        }
        if (mensagem.trim().length < 10) {
            newErros.mensagem = 'A mensagem precisa ter ao menos 10 caracteres.';
        }
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
        } else {
            console.log("Formulário inválido.");
        }
    };

    return (
        <>
 
  
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
    <h1 className='text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center'> Entre em contato com a equipe para obter suporte.</h1>
                
                <div className='max-w-xl mx-auto mt-10 mb-20 bg-white p-8 rounded-3xl shadow-xl border border-gray-200'>
                <h2 className="text-4xl font-extrabold mb-10 text-red-600 text-center tracking-wide drop-shadow-sm">
                    Formulário de Contato
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                  
                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Título</span>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            placeholder="Assunto principal da sua mensagem"
                            className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.titulo ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
                            aria-invalid={!!erros.titulo}
                            aria-describedby="error-titulo"
                        />
                        {erros.titulo && <p id="error-titulo" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.titulo}</p>}
                    </label>

            
                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu.email@exemplo.com"
                            className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.email ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
                            aria-invalid={!!erros.email}
                            aria-describedby="error-email"
                        />
                        {erros.email && <p id="error-email" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.email}</p>}
                    </label>

      
                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Mensagem</span>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            required
                            placeholder="Digite sua mensagem detalhada aqui"
                            rows={6}
                            className={`mt-1 p-4 border rounded-lg resize-y focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.mensagem ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
                            aria-invalid={!!erros.mensagem}
                            aria-describedby="error-mensagem"
                        />
                        {erros.mensagem && <p id="error-mensagem" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.mensagem}</p>}
                    </label>

                    <button type="submit" className="mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg">
                        Enviar Mensagem <FaPaperPlane size={20} />
                    </button>
                </form>
                </div>
            </motion.div>

 
            <AnimatePresence>
                {modalAberto && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 backdrop-blur-sm  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center relative shadow-lg">
                            <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition cursor-pointer"></button>
                            <h3 className="text-2xl font-extrabold text-red-600 mb-4">Mensagem Enviada!</h3>
                            <p className="text-gray-700 mb-6">Sua mensagem foi enviada com sucesso. Entraremos em contato através do email fornecido assim que possível.</p>
                            <button onClick={() => setModalAberto(false)} className="mt-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow hover:bg-red-700 transition cursor-pointer">Fechar</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
        </>
    );
}