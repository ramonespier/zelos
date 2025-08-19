'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CardChamado({ chamado, pedidosEnviados, onAtribuir, onAbrirImagem }) {
  // A prop agora se chama pedidosEnviados, mais descritivo
  const pedidoJaEnviado = pedidosEnviados.includes(chamado.id);

  const ImagemComponente = () => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
      onClick={() => onAbrirImagem(chamado.img_url)} // Usa a prop correta do backend
    >
      <Image
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        src={chamado.img_url || '/placeholder.png'} // Usa a URL da API ou um placeholder
        alt={chamado.titulo}
        width={300}
        height={200}
        // Em caso de erro, exibe um placeholder
        onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
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
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800 line-clamp-2">{chamado.titulo}</h1>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
              {/* O objeto usuario está aninhado e tem a prop 'nome' */}
              {chamado.usuario?.nome.charAt(0) || '?'} 
            </div>
            <div>
              <p className="font-medium text-gray-700 text-sm">{chamado.usuario?.nome || 'Usuário desconhecido'}</p>
              <p className="text-xs text-gray-500">
                {new Date(chamado.criado_em).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-3 mt-3">{chamado.descricao}</p>

          {chamado.img_url && (
            <div className="mt-4 sm:hidden">
              <ImagemComponente />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 mt-auto border-t border-gray-200/80 gap-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              Patrimônio: {chamado.numero_patrimonio} 
            </span>

            {chamado.img_url && (
              <button
                onClick={() => onAbrirImagem(chamado.img_url)}
                className="hidden sm:inline text-xs font-semibold cursor-pointer text-blue-600 hover:underline"
              >
                Ver imagem
              </button>
            )}
          </div>

          <button
            onClick={() => onAtribuir(chamado.id)}
            disabled={pedidoJaEnviado} // Usa a nova variável
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto ${
              pedidoJaEnviado
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95 cursor-pointer'
            }`}
          >
            {pedidoJaEnviado ? 'Pedido Enviado' : 'Enviar pedido'} 
          </button>
        </div>
      </div>
    </motion.div>
  );
}