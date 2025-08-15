'use client';
import { statusCores } from './MeusChamados'; // exporte o objeto statusCores do MeusChamados

export default function CardChamado({ chamado, onAbrirModal }) {
    return (
        <div className="bg-white mb-5 p-5 rounded-3xl shadow-xl border w-full border-gray-200">
            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-4 h-4 rounded-full ${statusCores[chamado.status]}`}></div>
                        <h1 className="text-3xl font-extrabold text-red-600 tracking-wide drop-shadow-sm">{chamado.titulo}</h1>
                    </div>
                    <div className="flex gap-3 items-center">
                        <img className="w-7 h-7 rounded-full bg-cover bg-center shadow-md shadow-[#b30000]/60" src={chamado.usuarioImg} alt={`Foto de ${chamado.usuario}`} />
                        <h1 className="font-semibold text-[#b30000]">{chamado.usuario}</h1>
                    </div>
                    <h2 className='py-3 font-bold text-gray-800'>N. Patrimônio: {chamado.patrimonio}</h2>
                    <h2 className="font-sans">{chamado.descricao}</h2>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                    <div
                        className="w-60 h-40 rounded-2xl shadow-md overflow-hidden cursor-pointer"
                        onClick={() => onAbrirModal(chamado.imagem)}
                    >
                        <img
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            src={chamado.imagem}
                            alt={chamado.titulo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
