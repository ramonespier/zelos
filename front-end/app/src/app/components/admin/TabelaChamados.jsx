// Este é um componente de cliente para permitir interatividade
'use client';

import { useState } from 'react';
import { FiFilter, FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';

// Dados de exemplo
const chamadosExemplo = [
    { id: '101', titulo: 'PC não liga', tecnico: 'Ana', status: 'Aberto' },
    { id: '102', titulo: 'Impressora sem tinta', tecnico: 'Carlos', status: 'Em Andamento' },
    { id: '103', titulo: 'Erro de software no sistema X', tecnico: 'Ana', status: 'Concluído' },
    { id: '104', titulo: 'Rede instável', tecnico: 'Bia', status: 'Aberto' },
];

export default function TabelaChamados() {
  const [chamados] = useState(chamadosExemplo);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Chamados</h2>
        <button className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            <FiPlusCircle />
            Novo Chamado
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <input type="text" placeholder="Pesquisar por título..." className="border p-2 rounded-md w-1/3" />
        <select className="border p-2 rounded-md">
            <option value="">Todos os Status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluído">Concluído</option>
        </select>
        <button className="flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
            <FiFilter />
            Filtrar
        </button>
      </div>

      {/* Tabela de Chamados */}
      <table className="w-full text-left table-auto">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Técnico Responsável</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {chamados.map(chamado => (
            <tr key={chamado.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{chamado.id}</td>
              <td className="px-4 py-2">{chamado.titulo}</td>
              <td className="px-4 py-2">{chamado.tecnico}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                    chamado.status === 'Aberto' ? 'bg-red-200 text-red-800' :
                    chamado.status === 'Em Andamento' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                }`}>
                    {chamado.status}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700"><FiEdit size={18} /></button>
                  <button className="text-red-500 hover:text-red-700"><FiTrash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}