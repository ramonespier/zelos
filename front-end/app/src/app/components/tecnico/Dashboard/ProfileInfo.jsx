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
      await onSaveEspecialidade(especialidade); 
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

      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-4xl">
          {getInitials(funcionario.nome)}
        </div>
      </div>

      <div className="space-y-4 text-gray-800 text-left">
        <p><strong>Nome:</strong> {funcionario.nome}</p>
        <p><strong>Função:</strong> {funcionario.funcao}</p>

    
        </div>
    </section>
  );
}
