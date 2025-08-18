'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

export default function Chamado() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erros, setErros] = useState({});
    const [modalAberto, setModalAberto] = useState(false);

    const usuario_id = 'ID_DO_USUARIO_ATUAL'; // ajustar login
    const created_by = usuario_id;
    const updated_by = usuario_id;

    const validarFormulario = () => {
        const newErros = {};
        if (titulo.trim().length < 5) newErros.titulo = 'Título precisa ter ao menos 5 caracteres.';
        if (descricao.trim().length < 10) newErros.descricao = 'Descrição precisa ter ao menos 10 caracteres.';
        setErros(newErros);
        return Object.keys(newErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        try {
            const res = await fetch('/api/pool', { // ajustar p rota
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, descricao, usuario_id, created_by, updated_by })
            });

            if (!res.ok) throw new Error('Erro ao criar chamado');

            setModalAberto(true);
            setTitulo('');
            setDescricao('');
            setErros({});
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar chamado, tente novamente.');
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl mx-auto mt-10 mb-20 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
            >
                <h2 className="text-3xl font-extrabold mb-10 text-red-600 text-center drop-shadow-sm">
                    Abrir novo chamado              
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                    {/* Título */}
                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Título do Problema</span>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            placeholder="Descreva brevemente o problema"
                            className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.titulo ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
                            aria-invalid={!!erros.titulo}
                            aria-describedby="error-titulo"
                        />
                        {erros.titulo && <p id="error-titulo" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.titulo}</p>}
                    </label>

                    {/* Descrição */}
                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Descrição Detalhada</span>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                            placeholder="Explique o problema com detalhes"
                            rows={6}
                            className={`mt-1 p-4 border rounded-lg resize-y focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.descricao ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
                            aria-invalid={!!erros.descricao}
                            aria-describedby="error-descricao"
                        />
                        {erros.descricao && <p id="error-descricao" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.descricao}</p>}
                    </label>

                    <button type="submit" className="mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg cursor-pointer">
                        Enviar Solicitação <FaPaperPlane size={20} />
                    </button>
                </form>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {modalAberto && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center relative shadow-lg">
                            <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition cursor-pointer"><FaTimes size={24} /></button>
                            <h3 className="text-2xl font-extrabold text-red-600 mb-4">Chamado Enviado!</h3>
                            <p className="text-gray-700 mb-6">Seu chamado foi enviado com sucesso. Nossa equipe entrará em contato o mais breve possível.</p>
                            <button onClick={() => setModalAberto(false)} className="mt-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow hover:bg-red-700 transition cursor-pointer">Fechar</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
