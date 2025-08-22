'use client';

import { Search } from 'lucide-react';

// Adicionamos a nova prop `filtroTipo` e `setFiltroTipo`
export default function PoolFiltros({
  termoBusca, setTermoBusca,
  filtroStatus, setFiltroStatus,
  statusConfig, // Objeto com a configuração de status
  filtroTipo, setFiltroTipo // <<<< NOVAS PROPS AQUI
}) {

  // A lista de tipos de pool que vêm da sua coluna ENUM
  const tiposDePool = ['externo', 'manutencao', 'apoio_tecnico', 'limpeza', 'outro'];

  // Função helper para formatar os nomes para exibição (ex: 'apoio_tecnico' -> 'Apoio Técnico')
  const formatarLabel = (texto) => {
    return texto.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
      {/* Input de Busca (sem alterações) */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por descrição..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      {/* ===== NOVO SELETOR DE TIPO ===== */}
      <select
        value={filtroTipo}
        onChange={(e) => setFiltroTipo(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
      >
        <option value="">Todos os Tipos</option>
        {tiposDePool.map(tipo => (
          <option key={tipo} value={tipo}>
            {formatarLabel(tipo)}
          </option>
        ))}
      </select>

      {/* Seletor de Status (sem alterações) */}
      <select
        value={filtroStatus}
        onChange={(e) => setFiltroStatus(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
      >
        <option value="">Todos os Status</option>
        {Object.entries(statusConfig).map(([value, { label }]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}