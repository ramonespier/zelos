'use client';
import { Search } from 'lucide-react';

export default function PoolFiltros({ termoBusca, setTermoBusca, filtroStatus, setFiltroStatus, statusConfig }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por descrição ou tipo..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      <select
        value={filtroStatus}
        onChange={(e) => setFiltroStatus(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
      >
        <option value="Todos">Todos os status</option>
        {Object.entries(statusConfig).map(([value, { label }]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
