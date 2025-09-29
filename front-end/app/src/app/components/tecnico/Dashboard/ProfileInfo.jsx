'use client';
import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { FiBriefcase, FiUserCheck } from 'react-icons/fi'; // Importe ícones úteis

// Função auxiliar para capitalizar a primeira letra
const capitalize = (s = '') => {
    if (!s) return '';
    const str = s.replace(/_/g, ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProfileInfo({ funcionario, getInitials, onSaveEspecialidade }) {
  const [especialidade, setEspecialidade] = useState(funcionario.especialidade || '');
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Condição para mostrar o campo de especialidade e permitir edição
  const isTecnico = funcionario.funcao === 'tecnico';

  const handleSave = async () => {
    // Permite salvar se o campo estiver vazio, para limpar a especialidade
    setLoading(true);
    try {
      // O trim() garante que espaços em branco sejam removidos
      await onSaveEspecialidade(especialidade.trim()); 
      setEspecialidade(especialidade.trim()); // Atualiza o estado local
      setEditando(false);
    } catch (error) {
      console.error('Erro ao salvar especialidade:', error);
      // Opcional: Reverter para o valor anterior em caso de falha
      setEspecialidade(funcionario.especialidade || ''); 
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    // Volta o estado local para o valor original do funcionário
    setEspecialidade(funcionario.especialidade || '');
    setEditando(false);
  };

  return (
    <section className="max-w-md w-full mt-12 mb-20 p-8 bg-white rounded-2xl shadow-lg border border-gray-300 mx-auto text-center">
      <h2 className="text-3xl font-extrabold text-red-600 mb-8">Informações do Perfil</h2>
      
      {/* Avatar e Iniciais */}
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-4xl shadow-xl">
          {getInitials(funcionario.nome)}
        </div>
      </div>

      {/* Detalhes do Usuário */}
      <div className="space-y-4 text-gray-800 text-left">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700">Nome:</span>
            <span className="font-medium">{funcionario.nome}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700">Função:</span>
            <span className="font-medium flex items-center gap-1">
                {capitalize(funcionario.funcao)}
                {funcionario.funcao === 'tecnico' ? <FiBriefcase className="text-blue-500" size={16} /> : <FiUserCheck className="text-green-500" size={16} />}
            </span>
        </div>
        
        {/* CAMPO DE ESPECIALIDADE */}
        {isTecnico && (
            <div className={`p-3 rounded-lg border-2 ${editando ? 'border-blue-500 bg-blue-50/50' : 'border-transparent bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                        Especialidade:
                    </span>
                    
                    {/* Botão de Edição/Ações */}
                    {!editando ? (
                        <button
                            onClick={() => setEditando(true)}
                            className="text-gray-500 hover:text-blue-600 p-1 rounded-full transition-colors"
                            aria-label="Editar Especialidade"
                        >
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full transition-colors disabled:opacity-50"
                                aria-label="Salvar"
                            >
                                <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleCancelar}
                                disabled={loading}
                                className="bg-gray-400 hover:bg-gray-500 text-white p-1.5 rounded-full transition-colors disabled:opacity-50"
                                aria-label="Cancelar"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Campo de Visualização/Edição */}
                {editando ? (
                    <input
                        type="text"
                        value={especialidade}
                        onChange={(e) => setEspecialidade(e.target.value)}
                        className="w-full mt-2 p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Ex: Redes, Elétrica, Software"
                        disabled={loading}
                    />
                ) : (
                    <p className={`font-medium text-lg ${especialidade ? 'text-gray-800' : 'text-gray-500 italic'}`}>
                        {especialidade || 'Nenhuma especialidade definida'}
                    </p>
                )}
            </div>
        )}
        
        {!isTecnico && (
             <div className="p-3 text-sm text-gray-500 bg-gray-50 rounded-lg flex items-center gap-2">
                <FiBriefcase size={16} /> A especialidade é aplicável apenas a técnicos.
            </div>
        )}

      </div>
    </section>
  );
}