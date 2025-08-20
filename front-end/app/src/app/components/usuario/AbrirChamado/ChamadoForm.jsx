'use client';

import { FiPaperclip, FiXCircle, FiLoader } from 'react-icons/fi';

export default function ChamadoForm({
  titulo, setTitulo,
  descricao, setDescricao,
  patrimonio, setPatrimonio,
  poolId, setPoolId,
  poolOptions, isLoadingPools,
  erros, handleSubmit,
  setImagem, imagemPreview, setImagemPreview,
  isSubmitting,
}) {

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) { 
      setImagem(file);
      setImagemPreview(URL.createObjectURL(file));
    } else if (file) {
      alert("Arquivo muito grande! O limite é de 5MB.");
      e.target.value = '';
    }
  };

  const handleRemoveImagem = () => {
    setImagem(null);
    setImagemPreview('');
    if (document.getElementById('file-upload')) {
        document.getElementById('file-upload').value = ''; 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        {/* Título */}
        <label className="flex flex-col text-gray-800 font-semibold relative">
            <span className="mb-2">Título do Problema</span>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Computador não liga"
                className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 transition shadow-sm ${erros.titulo ? 'border-red-500 ring-red-400/50' : 'border-gray-300 focus:ring-red-400/50'}`} />
            {erros.titulo && <p className="text-red-600 mt-1 text-sm font-medium absolute -bottom-6 left-0">{erros.titulo}</p>}
        </label>
        
        {/* Patrimônio */}
        <label className="flex flex-col text-gray-800 font-semibold relative">
            <span className="mb-2">Número de Patrimônio</span>
            <input type="text" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} required placeholder="Digite o número do equipamento"
                className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 transition shadow-sm ${erros.patrimonio ? 'border-red-500 ring-red-400/50' : 'border-gray-300 focus:ring-red-400/50'}`} />
            {erros.patrimonio && <p className="text-red-600 mt-1 text-sm font-medium absolute -bottom-6 left-0">{erros.patrimonio}</p>}
        </label>

        {/* Tipo de Solicitação (Pool) */}
        <label className="flex flex-col text-gray-800 font-semibold relative">
            <span className="mb-2">Tipo de Solicitação</span>
            <select value={poolId} onChange={(e) => setPoolId(e.target.value)} required disabled={isLoadingPools}
                className={`mt-1 p-4 border rounded-lg focus:outline-none focus:ring-4 transition shadow-sm appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${erros.poolId ? 'border-red-500 ring-red-400/50' : 'border-gray-300 focus:ring-red-400/50'}`} >
                <option value="" disabled>{isLoadingPools ? 'Carregando tipos...' : 'Selecione um tipo...'}</option>
                {poolOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.titulo.charAt(0).toUpperCase() + option.titulo.slice(1).replace('_', ' ')}</option>
                ))}
            </select>
            {erros.poolId && <p className="text-red-600 mt-1 text-sm font-medium absolute -bottom-6 left-0">{erros.poolId}</p>}
        </label>
        
        {/* Descrição */}
        <label className="flex flex-col text-gray-800 font-semibold relative">
            <span className="mb-2">Descrição Detalhada</span>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required placeholder="Explique com o máximo de detalhes possível" rows={6}
                className={`mt-1 p-4 border rounded-lg resize-y focus:outline-none focus:ring-4 transition shadow-sm ${erros.descricao ? 'border-red-500 ring-red-400/50' : 'border-gray-300 focus:ring-red-400/50'}`} />
            {erros.descricao && <p className="text-red-600 mt-1 text-sm font-medium absolute -bottom-6 left-0">{erros.descricao}</p>}
        </label>
        
        {/* Upload de Imagem */}
        <div className="flex flex-col text-gray-800 font-semibold">
            <span className="mb-2">Anexar Imagem (Opcional)</span>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">{imagemPreview ? ( <div className="relative group"> <img src={imagemPreview} alt="Pré-visualização do anexo" className="mx-auto h-32 w-auto rounded-lg object-contain" /> <button type="button" onClick={handleRemoveImagem} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500"> <FiXCircle size={20} /> </button> </div> ) : ( <> <FiPaperclip className="mx-auto h-12 w-12 text-gray-400" /> <div className="flex text-sm text-gray-600"> <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-700 focus-within:outline-none"> <span>Clique para carregar</span> <input id="file-upload" name="imagem" type="file" className="sr-only" onChange={handleImagemChange} accept="image/*" /> </label> <p className="pl-1">ou arraste e solte</p> </div> <p className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p> </> )}</div>
            </div>
        </div>

        {erros.api && <p className="text-red-600 mt-1 text-sm font-medium text-center">{erros.api}</p>}
        
        {/* Botão de Envio */}
        <button type="submit" disabled={isSubmitting} className="mt-6 bg-red-600 text-white py-4 rounded-xl font-semibold shadow-xl hover:bg-red-700 transition flex items-center justify-center gap-3 text-lg cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed">
            {isSubmitting && <FiLoader className="animate-spin" />}
            {isSubmitting ? 'Enviando...' : 'Enviar Chamado'}
        </button>
    </form>
  );
}