'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import api from '../../../lib/api'; 

export default function FormularioContato({ abrirModal, funcionario }) {
  const [titulo, setTitulo] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (funcionario && funcionario.email) {
      setEmail(funcionario.email);
    }
  }, [funcionario]);

  const validarFormulario = () => {
    const newErros = {};
    if (titulo.trim().length < 5) newErros.titulo = 'O título precisa ter ao menos 5 caracteres.';
    if (!email.trim()) newErros.email = 'O email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErros.email = 'Formato de email inválido.';
    if (mensagem.trim().length < 10) newErros.mensagem = 'A mensagem precisa ter ao menos 10 caracteres.';
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    // --- CORREÇÃO ADICIONADA AQUI ---
    // Verifica se o objeto 'funcionario' e seu 'id' existem antes de prosseguir.
    if (!funcionario || !funcionario.id) {
      console.error("Erro: Informações do usuário não carregadas. O submit foi bloqueado.");
      alert("Não foi possível identificar o usuário. Por favor, recarregue a página e tente novamente.");
      return; // Interrompe a execução da função.
    }
    // --- FIM DA CORREÇÃO ---

    const payload = {
      titulo,
      email,
      mensagem,
      remetente_id: funcionario.id // Esta linha agora é segura.
    };
    
    try {
      await api.post('/mensagens', payload);

      abrirModal();
      setTitulo('');
      setEmail(funcionario.email);
      setMensagem('');
      setErros({});
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      const errorMessage = err.response?.data?.error || 'Não foi possível enviar a mensagem.';
      alert(errorMessage);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <h1 className="text-[20px] font-semibold text-gray-700 mb-6 drop-shadow-md flex justify-center">
        Entre em contato com a equipe para obter suporte.
      </h1>
      <div className="max-w-xl mx-auto mt-10 mb-20 bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
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
              placeholder="Assunto principal"
              className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${
                erros.titulo ? 'border-red-500 ring-red-400' : 'border-gray-300'
              }`}
              aria-invalid={!!erros.titulo}
              aria-describedby="error-titulo"
            />
            {erros.titulo && (
              <p id="error-titulo" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">
                {erros.titulo}
              </p>
            )}
          </label>

          <label className="flex flex-col text-gray-800 font-semibold relative">
            <span className="mb-2">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${
                erros.email ? 'border-red-500 ring-red-400' : 'border-gray-300'
              }`}
              aria-invalid={!!erros.email}
              aria-describedby="error-email"
            />
            {erros.email && (
              <p id="error-email" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">
                {erros.email}
              </p>
            )}
          </label>

          <label className="flex flex-col text-gray-800 font-semibold relative">
            <span className="mb-2">Mensagem</span>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua mensagem detalhada aqui"
              rows={6}
              className={`mt-1 p-4 border rounded-lg resize-y focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${
                erros.mensagem ? 'border-red-500 ring-red-400' : 'border-gray-300'
              }`}
              aria-invalid={!!erros.mensagem}
              aria-describedby="error-mensagem"
            />
            {erros.mensagem && (
              <p id="error-mensagem" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">
                {erros.mensagem}
              </p>
            )}
          </label>
          <button
            type="submit"
            className="mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold shadow-xl cursor-pointer hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg"
          >
            Enviar Mensagem <FaPaperPlane size={20} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}