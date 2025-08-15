'use client';
export default function FiltroStatus({ filtroStatus, setFiltroStatus }) {
  const opcoes = ['Todos', 'Aberto', 'Em Andamento', 'Concluído'];
  const cores = {
    'Todos': ['bg-gray-200', 'bg-gray-600'],
    'Aberto': ['bg-gray-200', 'bg-red-500'],
    'Em Andamento': ['bg-gray-200', 'bg-yellow-500'],
    'Concluído': ['bg-gray-200', 'bg-green-500'],
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="font-semibold text-gray-600">Status:</span>
      {opcoes.map(opcao => (
        <button
          key={opcao}
          onClick={() => setFiltroStatus(opcao)}
          className={`px-3 py-1 text-sm rounded-full transition-all cursor-pointer ${filtroStatus === opcao ? `${cores[opcao][1]} text-white` : `${cores[opcao][0]} text-gray-700`}`}
        >
          {opcao}
        </button>
      ))}
    </div>
  );
}
