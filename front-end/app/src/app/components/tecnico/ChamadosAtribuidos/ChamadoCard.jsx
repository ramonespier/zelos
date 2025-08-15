'use client';
import { motion } from 'framer-motion';
import { UserCircleIcon, CalendarIcon, TagIcon, EyeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const formatarData = (dataString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
};

export default function ChamadoCard({ chamado, onVerDetalhes, onAbrirApontamento }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
        >
            <div className="h-48 overflow-hidden cursor-pointer" onClick={onVerDetalhes}>
                <img
                    src={chamado.imagem}
                    alt={chamado.titulo}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{chamado.titulo}</h2>
                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                    <div className="flex items-center gap-3">
                        <UserCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span>{chamado.usuario}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <TagIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="font-semibold">{chamado.patrimonio}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span>{formatarData(chamado.data_abertura)}</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
                    <button onClick={onVerDetalhes} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        <EyeIcon className="w-5 h-5" />
                        Ver Detalhes
                    </button>
                    <button onClick={() => onAbrirApontamento(chamado)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all">
                        <PlusCircleIcon className="w-5 h-5" />
                        Apontamento
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
