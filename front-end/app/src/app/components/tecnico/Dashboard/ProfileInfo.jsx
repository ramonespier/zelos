'use client';
import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function ProfileInfo({ funcionario, getInitials, onSaveEspecialidade }) {
  const [especialidade, setEspecialidade] = useState(funcionario.especialidade || '');
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!especialidade.trim()) return;
    setLoading(true);
    try {
      await onSaveEspecialidade(especialidade); // função passada via props para atualizar banco
      setEditando(false);
    } catch (error) {
      console.error('Erro ao salvar especialidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setEspecialidade(funcionario.especialidade || '');
    setEditando(false);
  };

  return (
    <section className="max-w-md w-full mt-12 mb-20 p-8 bg-white rounded-2xl shadow-lg border border-gray-300 mx-auto text-center">
      <h2 className="text-3xl font-extrabold text-red-600 mb-8">Informações do Perfil</h2>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-4xl">
          {getInitials(funcionario.nome)}
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-4 text-gray-800 text-left">
        <p><strong>Nome:</strong> {funcionario.nome}</p>
        <p><strong>Função:</strong> {funcionario.funcao}</p>
        <p><strong>Matrícula:</strong> {funcionario.matricula}</p>

        {/* Especialidade editável apenas ao clicar no lápis */}
        <div>
          <label className="block font-medium mb-1" htmlFor="especialidade">
            Especialidade:
          </label>
          {!editando ? (
            <div className="flex items-center justify-between border px-4 py-2 rounded-lg border-gray-300 bg-gray-50">
              <span>{especialidade || 'Nenhuma especialidade adicionada'}</span>
              <button onClick={() => setEditando(true)}>
                <PencilIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                id="especialidade"
                type="text"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                placeholder="Adicione sua especialidade"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleSave}
                disabled={loading || !especialidade.trim()}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancelar}
                className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
