'use client';
import { useState, useMemo, useCallback } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaFilter } from 'react-icons/fa';

const ITENS_POR_PAGINA = 5;
const STATUS_OPTIONS = ['todos', 'aberto', 'em andamento', 'fechado'];

export default function MeusChamados({ chamados = [], loading }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);

  const chamadosFiltrados = useMemo(() => {
    const buscaLower = busca.toLowerCase();
    return chamados.filter(({ titulo, patrimonio, status }) => {
      const statusMatch = filtroStatus === 'todos' || status === filtroStatus;
      const buscaMatch =
        titulo.toLowerCase().includes(buscaLower) ||
        patrimonio.toLowerCase().includes(buscaLower);
      return statusMatch && buscaMatch;
    });
  }, [chamados, filtroStatus, busca]);

  const chamadosPaginados = useMemo(() => {
    return chamadosFiltrados.slice(0, pagina * ITENS_POR_PAGINA);
  }, [chamadosFiltrados, pagina]);

  const toggleOpen = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleFiltroChange = (e) => {
    setFiltroStatus(e.target.value);
    setPagina(1);
    setOpenIndex(null);
  };

  return (
    <section className="max-w-6xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-gray-200 mb-12">
      <h2 className="text-4xl font-bold text-red-600 mb-10 text-center drop-shadow-sm">Meus Chamados</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-5">
        {/* Campo de busca */}
        <div className="relative flex items-center w-full sm:w-1/2">
          <FaSearch className="absolute left-3 text-gray-400 text-sm" />
          <input
            type="search"
            placeholder="Buscar por título ou patrimônio..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
              setOpenIndex(null);
            }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            aria-label="Buscar chamados"
          />
        </div>

        {/* Filtro de status */}
        <div className="flex items-center gap-3">
          <FaFilter className="text-gray-600 text-lg" />
          <select
            aria-label="Filtrar por status"
            value={filtroStatus}
            onChange={handleFiltroChange}
            className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition cursor-pointer"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exibição dos chamados */}
      {loading ? (
        <p className="text-center text-red-600 font-semibold animate-pulse">Carregando chamados...</p>
      ) : chamadosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 font-medium">Nenhum chamado encontrado.</p>
      ) : (
        <>
          <div className="space-y-5">
            {chamadosPaginados.map(({ id, titulo, patrimonio, descricao, status, data }, i) => {
              const isOpen = openIndex === i;
              const statusClasses = {
                aberto: 'bg-green-100 text-green-800',
                'em andamento': 'bg-yellow-100 text-yellow-800',
                fechado: 'bg-gray-200 text-gray-600',
              };

              return (
                <article
                  key={id}
                  className="border border-red-300 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer select-none"
                  onClick={() => toggleOpen(i)}
                  aria-expanded={isOpen}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleOpen(i);
                  }}
                >
                  <header className="flex flex-wrap justify-between items-center px-6 py-4 bg-red-50 rounded-t-xl gap-2">
                    <h3 className="font-semibold text-xl text-red-700 flex-grow min-w-[200px]">
                      {titulo}
                    </h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses[status] || ''}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span className="text-gray-500 text-sm">{data}</span>
                      <span className="text-red-600 text-xl">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>
                  </header>

                  <div
                    className={`px-6 pt-3 pb-5 text-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-screen' : 'max-h-0'
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <p>
                      <strong>Patrimônio:</strong> {patrimonio}
                    </p>
                    <p className="mt-3 whitespace-pre-line">{descricao}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {pagina * ITENS_POR_PAGINA < chamadosFiltrados.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setPagina(pagina + 1)}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-700 transition"
                aria-label="Carregar mais chamados"
              >
                Carregar mais
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
