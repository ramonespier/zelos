'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, PlusCircleIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

const formatarData = (dataString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
};

export default function ChamadoDetailView({ chamado, tecnicoId, onGoBack, onAbrirApontamento }) {
    const [pedidoEnviado, setPedidoEnviado] = useState(false);

    const solicitarFechamento = async () => {
        setPedidoEnviado(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-4 sm:p-6"
        >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{chamado.titulo}</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50/80 rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Solicitante</h3>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <img 
                            src={chamado.usuarioImg} 
                            alt={chamado.usuario} 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm"
                            loading="lazy"
                        />
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{chamado.usuario}</p>
                            <p className="text-xs sm:text-sm text-gray-600">Usuário Solicitante</p>
                        </div>
                    </div>
                    <div className="text-xs sm:text-sm space-y-1 sm:space-y-2 pt-2 border-t">
                        <p className="flex items-center gap-2"><MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500"/><strong>Local:</strong> {chamado.localizacao}</p>
                        <p className="flex items-center gap-2"><CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500"/><strong>Abertura:</strong> {formatarData(chamado.data_abertura)}</p>
                    </div>
                </div>
                
                <div className="bg-gray-50/80 rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Detalhes</h3>
                    <div className="text-xs sm:text-sm space-y-1 sm:space-y-2">
                        <div>
                            <p className="font-semibold text-gray-800">Patrimônio:</p>
                            <p className="text-red-600 font-bold">{chamado.patrimonio}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Descrição:</p>
                            <p className="text-gray-600 leading-relaxed">{chamado.descricao}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Imagem em telas pequenas */}
            <div className="mt-4 sm:mt-6 lg:hidden">
                <img
                    src={chamado.imagem}
                    alt={chamado.titulo}
                    className="w-full h-auto rounded-lg border border-gray-200"
                    loading="lazy"
                />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-5 border-t">
                <button 
                    onClick={() => onAbrirApontamento(chamado)} 
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                    <PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5"/> 
                    <span>Criar Apontamento</span>
                </button>
                <button 
                    onClick={solicitarFechamento} 
                    disabled={pedidoEnviado}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                        pedidoEnviado ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-gray-200 cursor-pointer text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    <ArrowUpOnSquareIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                    <span>{pedidoEnviado ? 'Pedido Enviado' : 'Solicitar Fechamento'}</span>
                </button>
            </div>
        </motion.div>
    )
}