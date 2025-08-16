'use client';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Usando next/image para otimização

export default function CardChamado({ chamado, atribuidos, onAtribuir, onAbrirImagem }) {
  const estaAtribuido = atribuidos.includes(chamado.id);

  // Componente reutilizável para a imagem, para não repetir código (Princípio DRY)
  const ImagemComponente = () => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="h-48 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
      onClick={() => onAbrirImagem(chamado.imagem)}
    >
      <Image
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        src={`/${chamado.imagem}`} // Assumindo que a imagem está na pasta /public
        alt={chamado.titulo}
        width={300}
        height={200}
      />
    </motion.div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-5 rounded-xl shadow-md border border-gray-200/80 w-full flex flex-col"
    >
      <div className="flex flex-col md:flex-row md:gap-x-6 h-full">
        
        {/* --- COLUNA DE CONTEÚDO (Esquerda no Desktop) --- */}
        <div className="flex flex-col flex-1">
          {/* Título */}
          <h1 className="text-xl font-bold text-gray-800 line-clamp-2">
            {chamado.titulo}
          </h1>

          {/* Usuário e data */}
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
              {chamado.usuario.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm">{chamado.usuario}</p>
              <p className="text-xs text-gray-500">
                {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-gray-600 text-sm line-clamp-3 mt-3">
            {chamado.descricao}
          </p>

          {/* IMAGEM (Aparece aqui no fluxo para mobile) */}
          {chamado.imagem && (
            <div className="mt-4 md:hidden"> {/* Esconde em telas médias ou maiores */}
              <ImagemComponente />
            </div>
          )}

          {/* Espaçador: empurra o botão para baixo no desktop */}
          <div className="flex-grow hidden md:block"></div>

          {/* Rodapé: Patrimônio e Botão */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 mt-4 border-t border-gray-200/80 md:border-t-0 md:pt-2 md:mt-0 gap-3">
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              Patrimônio: #{chamado.patrimonio}
            </span>
            <button
              onClick={() => onAtribuir(chamado.id)}
              disabled={estaAtribuido}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto cursor-pointer ${
                estaAtribuido
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
              }`}
            >
              {estaAtribuido ? 'Pendente' : 'Enviar pedido'}
            </button>
          </div>
        </div>

        {/* --- COLUNA DA IMAGEM (Aparece apenas no Desktop) --- */}
        {chamado.imagem && (
          <div className="hidden md:flex md:w-1/3 flex-shrink-0 items-center"> {/* Escondido por padrão, visível em telas médias ou maiores */}
            <ImagemComponente />
          </div>
        )}
      </div>
    </motion.div>
  );
}