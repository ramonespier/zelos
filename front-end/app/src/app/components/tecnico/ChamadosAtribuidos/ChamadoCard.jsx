'use client';
import { motion } from 'framer-motion';
import { UserCircleIcon, CalendarIcon, EyeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const formatarData = (dataString) => {
    if (!dataString) return 'Data indisponível';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formatted = new Date(dataString).toLocaleDateString('pt-BR', options);
    return formatted.replace(',', ' às');
};

export default function ChamadoCard({ chamado, onVerDetalhes, onAbrirApontamento }) {
    const usuarioNome = chamado.usuario?.nome || "Solicitante anônimo";
    const imagemUrl = chamado.img_url || "/placeholder-image.png"; 
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -6, boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-md border border-slate-200/60 overflow-hidden flex flex-col w-full h-full transition-shadow duration-300"
        >
            <div className="h-48 overflow-hidden cursor-pointer" onClick={onVerDetalhes}>
                <img
                    src={imagemUrl}
                    alt={chamado.titulo}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "/placeholder-image.png"; }} 
                />
            </div>

            <div className="p-5 flex flex-col flex-1">
                <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">
                    Patrimônio: {chamado.numero_patrimonio}
                </span>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{chamado.titulo}</h2>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4 flex-grow">
                    <div className="flex items-center gap-3">
                        <UserCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{usuarioNome}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{formatarData(chamado.criado_em)}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
                    <button 
                        onClick={onVerDetalhes} 
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold rounded-lg transition-colors text-sm"
                    >
                        <EyeIcon className="w-5 h-5" />
                        <span>Detalhes</span>
                    </button>
                    <button 
                        onClick={() => onAbrirApontamento(chamado)} 
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold rounded-lg shadow shadow-red-500/20 hover:from-red-600 hover:to-red-700 transition-all text-sm"
                    >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>Apontamento</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}