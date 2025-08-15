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
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6"
        >
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{chamado.titulo}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50/80 rounded-xl p-5 space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800">Solicitante</h3>
                     <div className="flex items-center gap-4">
                        <img src={chamado.usuarioImg} alt={chamado.usuario} className="w-12 h-12 rounded-full shadow-sm"/>
                        <div>
                            <p className="font-semibold text-gray-900">{chamado.usuario}</p>
                            <p className="text-sm text-gray-600">Usuário Solicitante</p>
                        </div>
                     </div>
                     <div className="text-sm space-y-2 pt-2 border-t">
                        <p className="flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-gray-500"/><strong>Localização:</strong> {chamado.localizacao}</p>
                        <p className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-500"/><strong>Abertura:</strong> {formatarData(chamado.data_abertura)}</p>
                     </div>
                </div>
                <div className="bg-gray-50/80 rounded-xl p-5 space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800">Detalhes do Chamado</h3>
                     <div className="text-sm space-y-2">
                         <div>
                             <p className="font-semibold text-gray-800">Nº de Patrimônio:</p>
                             <p className="text-red-600 font-bold">{chamado.patrimonio}</p>
                         </div>
                         <div>
                             <p className="font-semibold text-gray-800">Descrição Completa:</p>
                             <p className="text-gray-600 leading-relaxed">{chamado.descricao}</p>
                         </div>
                     </div>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t">
                <button 
                    onClick={() => onAbrirApontamento(chamado)} 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                    <PlusCircleIcon className="w-5 h-5"/> Criar Apontamento
                </button>
                <button 
                    onClick={solicitarFechamento} 
                    disabled={pedidoEnviado}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${pedidoEnviado ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                    <ArrowUpOnSquareIcon className="w-5 h-5"/>
                    {pedidoEnviado ? 'Pedido Enviado' : 'Solicitar Fechamento'}
                </button>
            </div>
        </motion.div>
    )
}
