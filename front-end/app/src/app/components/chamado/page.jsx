'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

export default function Chamado() {
    const [patrimonio, setPatrimonio] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagens, setImagens] = useState([]);
    const [erros, setErros] = useState({});
    const [modalAberto, setModalAberto] = useState(false);

    const handleImagemChange = (e) => {
        const files = Array.from(e.target.files);
        if (imagens.length + files.length > 5) {
            alert('Você pode anexar até 5 imagens.');
            return;
        }
        setImagens((prev) => [...prev, ...files]);
    };

    const removerImagem = (index) => {
        setImagens((prev) => prev.filter((_, i) => i !== index));
    };

    const validarFormulario = () => {
        const newErros = {};
        if (!patrimonio.trim()) newErros.patrimonio = 'Número do patrimônio é obrigatório.';
        if (titulo.trim().length < 5) newErros.titulo = 'Título precisa ter ao menos 5 caracteres.';
        if (descricao.trim().length < 10) newErros.descricao = 'Descrição precisa ter ao menos 10 caracteres.';
        if (imagens.length === 0) newErros.imagens = 'Por favor, anexe ao menos uma imagem.';
        setErros(newErros);
        return Object.keys(newErros).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        console.log({ patrimonio, titulo, descricao, imagens });
        setModalAberto(true);
        setPatrimonio('');
        setTitulo('');
        setDescricao('');
        setImagens([]);
        setErros({});
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl mx-auto mt-12 mb-20 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
            >
                <h2 className="text-4xl font-extrabold mb-10 text-red-600 text-center tracking-wide drop-shadow-sm">
                    Abrir Novo Chamado
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Número do Patrimônio</span>
                        <input
                            type="number"
                            value={patrimonio}
                            onChange={(e) => setPatrimonio(e.target.value)}
                            required
                            placeholder="Informe o número do patrimônio"
                            className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.patrimonio ? 'border-red-500 ring-red-400' : 'border-gray-300'
                                }`}
                            aria-invalid={!!erros.patrimonio}
                            aria-describedby="error-patrimonio"
                        />
                        {erros.patrimonio && (
                            <p
                                id="error-patrimonio"
                                className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0"
                            >
                                {erros.patrimonio}
                            </p>
                        )}
                    </label>

                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Título do Problema</span>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            placeholder="Descreva brevemente o problema"
                            className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.titulo ? 'border-red-500 ring-red-400' : 'border-gray-300'
                                }`}
                            aria-invalid={!!erros.titulo}
                            aria-describedby="error-titulo"
                        />
                        {erros.titulo && (
                            <p
                                id="error-titulo"
                                className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0"
                            >
                                {erros.titulo}
                            </p>
                        )}
                    </label>

                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Descrição Detalhada</span>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                            placeholder="Explique o problema com detalhes"
                            rows={6}
                            className={`mt-1 p-4 border rounded-lg resize-y focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.descricao ? 'border-red-500 ring-red-400' : 'border-gray-300'
                                }`}
                            aria-invalid={!!erros.descricao}
                            aria-describedby="error-descricao"
                        />
                        {erros.descricao && (
                            <p
                                id="error-descricao"
                                className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0"
                            >
                                {erros.descricao}
                            </p>
                        )}
                    </label>

                    <label className="flex flex-col text-gray-800 font-semibold relative">
                        <span className="mb-2">Anexar Imagens (até 5)</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagemChange}
                            className="mt-1"
                            aria-label="Anexar imagens"
                        />
                        {erros.imagens && (
                            <p className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">
                                {erros.imagens}
                            </p>
                        )}
                    </label>

                    {imagens.length > 0 && (
                        <>
                            <h3 className="text-gray-700 font-semibold mb-3">Imagens selecionadas:</h3>
                            <div className="flex flex-wrap gap-4">
                                {imagens.map((img, i) => (
                                    <div
                                        key={i}
                                        className="relative w-28 h-28 rounded-xl overflow-hidden shadow-lg border border-gray-300 group"
                                    >
                                        <img src={URL.createObjectURL(img)} alt={`Imagem anexada ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removerImagem(i)}
                                            aria-label={`Remover imagem ${i + 1}`}
                                            className="absolute top-1 right-1 bg-red-600 bg-opacity-80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                            title="Remover imagem"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg"
                        aria-label="Enviar chamado"
                    >
                        Enviar Chamado <FaPaperPlane size={20} />
                    </button>
                </form>
            </motion.div>


            <AnimatePresence>
                {modalAberto && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
                        aria-modal="true"
                        role="dialog"
                        aria-labelledby="modal-title"
                        tabIndex={-1}
                        onClick={() => setModalAberto(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center relative shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setModalAberto(false)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition cursor-pointer"
                                aria-label="Fechar modal"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h3 id="modal-title" className="text-2xl font-extrabold text-red-600 mb-4">
                                Chamado Enviado!
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Seu chamado foi enviado com sucesso. Nossa equipe entrará em contato o mais breve possível.
                            </p>

                            <button
                                onClick={() => setModalAberto(false)}
                                className="mt-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow hover:bg-red-700 transition cursor-pointer"
                                aria-label="Fechar modal"
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
