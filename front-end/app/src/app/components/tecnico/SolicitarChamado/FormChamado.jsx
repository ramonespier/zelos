'use client';
import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function FormChamado({ onSubmit }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});

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

    onSubmit({ titulo, descricao });
    setTitulo('');
    setDescricao('');
    setErros({});
  };

  return (
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

      <button type="submit" className="mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg">
        Enviar Solicitação <FaPaperPlane size={20} />
      </button>
    </form>
  );
}
