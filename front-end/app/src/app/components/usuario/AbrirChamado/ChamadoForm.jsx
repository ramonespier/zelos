'use client';

export default function ChamadoForm({ 
  // Props para os campos do formulário
  titulo, setTitulo, 
  descricao, setDescricao, 
  patrimonio, setPatrimonio,
  poolId, setPoolId,

  // Props para as opções e o estado de carregamento do select
  poolOptions,
  isLoadingPools,

  // Props para controle do formulário
  erros, 
  handleSubmit 
}) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      
      {/* Título do Problema (sem alterações) */}
      <label className="flex flex-col text-gray-800 font-semibold relative">
        <span className="mb-2">Título do Problema</span>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          placeholder="Ex: Computador não liga, Lâmpada queimada"
          className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.titulo ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
          aria-invalid={!!erros.titulo}
          aria-describedby="error-titulo"
        />
        {erros.titulo && <p id="error-titulo" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.titulo}</p>}
      </label>

      {/* NOVO CAMPO: Número de Patrimônio */}
      <label className="flex flex-col text-gray-800 font-semibold relative">
        <span className="mb-2">Número de Patrimônio</span>
        <input
          type="text"
          value={patrimonio}
          onChange={(e) => setPatrimonio(e.target.value)}
          required
          placeholder="Digite o número de patrimônio do equipamento"
          className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.patrimonio ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
          aria-invalid={!!erros.patrimonio}
          aria-describedby="error-patrimonio"
        />
        {erros.patrimonio && <p id="error-patrimonio" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.patrimonio}</p>}
      </label>
      
      {/* NOVO CAMPO: Seletor de Tipo de Solicitação (Pool) */}
      <label className="flex flex-col text-gray-800 font-semibold relative">
        <span className="mb-2">Tipo de Solicitação</span>
        <select
          value={poolId}
          onChange={(e) => setPoolId(e.target.value)}
          required
          disabled={isLoadingPools} // Desabilita o campo enquanto as opções estão carregando
          className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${erros.poolId ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
          aria-invalid={!!erros.poolId}
          aria-describedby="error-pool"
        >
          {/* A primeira opção muda de acordo com o estado de carregamento */}
          <option value="" disabled>
            {isLoadingPools ? 'Carregando tipos...' : 'Selecione um tipo...'}
          </option>
          {/* Mapeia as opções que vieram da API */}
          {poolOptions.map(option => (
            <option key={option.id} value={option.id}>
              {/* Usamos 'option.titulo' que é o nome da coluna no seu banco de dados */}
              {option.titulo.charAt(0).toUpperCase() + option.titulo.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
        {erros.poolId && <p id="error-pool" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.poolId}</p>}
      </label>

      {/* Descrição Detalhada (sem alterações) */}
      <label className="flex flex-col text-gray-800 font-semibold relative">
        <span className="mb-2">Descrição Detalhada</span>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          placeholder="Explique o problema com o máximo de detalhes possível"
          rows={6}
          className={`mt-1 p-4 border rounded-lg resize-y focus:outline-none focus:ring-4 focus:ring-red-400 transition shadow-sm ${erros.descricao ? 'border-red-500 ring-red-400' : 'border-gray-300'}`}
          aria-invalid={!!erros.descricao}
          aria-describedby="error-descricao"
        />
        {erros.descricao && <p id="error-descricao" className="text-red-600 mt-1 text-sm font-medium absolute bottom-[-1.5rem] left-0">{erros.descricao}</p>}
      </label>

      {/* Botão de Envio (sem alterações) */}
      <button type="submit" className="mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg cursor-pointer">
        Enviar Chamado
      </button>
    </form>
  );
}