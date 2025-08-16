'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CardChamado({ chamado, atribuidos, onAtribuir, onAbrirImagem }) {
  const estaAtribuido = atribuidos.includes(chamado.id);

  // Componente da imagem, continua o mesmo
  const ImagemComponente = () => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
      onClick={() => onAbrirImagem(chamado.imagem)}
    >
      <Image
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        src={`/${chamado.imagem}`}
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
      {/* ALTERADO: Removida a classe md:flex-row, o card será sempre uma coluna única */}
      <div className="flex flex-col flex-1 h-full">
        {/* --- INÍCIO DO CONTEÚDO PRINCIPAL --- */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800 line-clamp-2">{chamado.titulo}</h1>

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

          <p className="text-gray-600 text-sm line-clamp-3 mt-3">{chamado.descricao}</p>

          {/* IMAGEM MOBILE: Agora só aparece em telas menores que 'sm' (celulares) */}
          {chamado.imagem && (
            <div className="mt-4 sm:hidden">
              <ImagemComponente />
            </div>
          )}
        </div>
        {/* --- FIM DO CONTEÚDO PRINCIPAL --- */}


        {/* --- RODAPÉ DO CARD --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 mt-auto border-t border-gray-200/80 gap-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              Patrimônio: #{chamado.patrimonio}
            </span>

            {/* ADICIONADO: Botão "Ver imagem" que só aparece em telas 'sm' ou maiores */}
            {chamado.imagem && (
              <button
                onClick={() => onAbrirImagem(chamado.imagem)}
                className="hidden sm:inline text-xs font-semibold text-blue-600 hover:underline"
              >
                Ver imagem
              </button>
            )}
          </div>

          <button
            onClick={() => onAtribuir(chamado.id)}
            disabled={estaAtribuido}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto ${
              estaAtribuido
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
            }`}
          >
            {estaAtribuido ? 'Pendente' : 'Enviar pedido'}
          </button>
        </div>
      </div>

      {/* REMOVIDO: A coluna inteira de imagem para desktop foi removida daqui */}
    </motion.div>
  );
}