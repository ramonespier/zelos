'use client';
import { motion } from 'framer-motion';

export default function CardChamado({ chamado, atribuidos, onAtribuir, onAbrirImagem }) {
  const estaAtribuido = atribuidos.includes(chamado.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-5 rounded-3xl shadow-xl w-240 border border-gray-200"
    >
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-red-600 mb-3">{chamado.titulo}</h1>
          <div className="flex gap-3 items-center mb-3">
            <img className="w-7 h-7 rounded-full shadow-md" src={chamado.usuarioImg} alt={`Foto de ${chamado.usuario}`} />
            <h2 className="font-semibold text-red-600">{chamado.usuario}</h2>
          </div>
          <p className='font-bold text-gray-800 mb-2'>N. Patrimônio: {chamado.patrimonio}</p>
          <p className="text-gray-700 mb-4">{chamado.descricao}</p>
          <button
            onClick={() => onAtribuir(chamado.id)}
            className={`px-6 py-2 rounded-lg font-bold shadow-md transition duration-300 ease-in-out 
              ${estaAtribuido 
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            {estaAtribuido ? 'Pedido Enviado' : 'Atribuir Chamado'}
          </button>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <div
            className="w-70 h-47 rounded-2xl shadow-md overflow-hidden cursor-pointer"
            onClick={() => onAbrirImagem(chamado.imagem)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              src={chamado.imagem}
              alt={chamado.titulo}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
