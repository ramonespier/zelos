import React, { useState } from 'react'; // 1. Importar useState

// Dados de exemplo para seus chamados
const chamados = [
    {
        id: 1,
        titulo: "Monitor quebrado",
        status: "em_andamento",
        usuario: "Maria Silva",
        usuarioImg: "https://i.pravatar.cc/150?img=5",
        descricao: "Na sala D2-6 têm 4 monitores que não ligam",
        imagem: "https://s2-techtudo.glbimg.com/ydQHZwG3XpDgagaQ9s7WlSC4HEQ=/0x0:695x391/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2021/s/l/8Efj0lQAyWZ7mPEkTi0w/2014-03-24-mon-031.jpg"
    },
    {
        id: 2,
        titulo: "Teclado não funciona",
        status: "concluido",
        usuario: "João Pereira",
        usuarioImg: "https://i.pravatar.cc/150?img=6",
        descricao: "O teclado do computador da recepção parou de responder.",
        imagem: "https://previews.123rf.com/images/timltv/timltv2111/timltv211100074/177913302-old-keyboard-and-broken-monitor-are-on-wooden-table-and-covered-in-thick-dust-in-a-workshop-top.jpg"
    },
    {
        id: 3,
        titulo: "Problema de conexão",
        status: "aberto",
        usuario: "Ana Costa",
        usuarioImg: "https://i.pravatar.cc/150?img=7",
        descricao: "A internet não está funcionando na sala B3-1.",
        imagem: "https://www.unimedgoiania.coop.br/wps/wcm/connect/f69c4f65-8532-40bf-856f-7209149e9af0/Sala+computador.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-f69c4f65-8532-40bf-856f-7209149e9af0-oxUOo-2"
    },
    {
        id: 4,
        titulo: "Troca de toner",
        status: "em_andamento",
        usuario: "Pedro Santos",
        usuarioImg: "https://i.pravatar.cc/150?img=8",
        descricao: "A impressora da sala C1-2 precisa de um novo toner.",
        imagem: "https://img.olx.com.br/images/35/353559783090166.jpg"
    }
];

// Mapeamento de status para cores e nomes, facilitando a criação dos filtros
const statusInfo = {
    'aberto': { label: 'Aberto', colorClass: 'bg-red-500' },
    'em_andamento': { label: 'Em Andamento', colorClass: 'bg-yellow-500' },
    'concluido': { label: 'Concluído', colorClass: 'bg-green-500' }
};

export default function Historico() {
    // 2. Criar estado para controlar o filtro ativo. 'todos' é o valor inicial.
    const [filtroAtivo, setFiltroAtivo] = useState('todos');

    // 3. Filtrar a lista de chamados ANTES de renderizar
    const chamadosFiltrados = chamados.filter(chamado => {
        // Se o filtro for 'todos', retorna true para todos os itens
        if (filtroAtivo === 'todos') {
            return true;
        }
        // Caso contrário, retorna true apenas se o status do chamado for igual ao filtro ativo
        return chamado.status === filtroAtivo;
    });

    return (
        // Usamos flex-col para organizar os filtros em cima e a lista embaixo
        <div className="h-[42rem] flex flex-col ">
            
            {/* --- SEÇÃO DE FILTROS --- */}
            <div className="p-4 border-b border-gray-200 bg-gray  rounded-3xl shadow-xl border w-full cursor-pointer flex items-center ">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Botão para mostrar Todos */}
                    <button
                        onClick={() => setFiltroAtivo('todos')}
                        className={`px-3 py-1 text-md font-sans rounded-full flex items-center gap-2 transition-all ${
                            filtroAtivo === 'todos'
                                ? 'bg-red-600 text-white shadow'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Todos
                    </button>
                    
                    {/* Botões de filtro gerados dinamicamente */}
                    {Object.keys(statusInfo).map(statusKey => (
                        <button
                            key={statusKey}
                            onClick={() => setFiltroAtivo(statusKey)}
                            className={`px-3 py-1 text-md font-sans rounded-full flex items-center gap-2 transition-all ${
                                filtroAtivo === statusKey
                                    ? 'ring-2 ring-offset-1 ring-blue-500 shadow'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <div className={`${statusInfo[statusKey].colorClass} w-3 h-3 rounded-full`}></div>
                            {statusInfo[statusKey].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- LISTA DE CHAMADOS COM SCROLL --- */}
            <div className="flex-1 overflow-y-auto"> 
                <div className="space-y-5 p-4">
                    {/* Se não houver chamados após filtrar, exibe uma mensagem */}
                    {chamadosFiltrados.length === 0 ? (
                        <div className="text-center py-10">
                            <h3 className="text-xl font-semibold text-gray-500">Nenhum chamado encontrado</h3>
                            <p className="text-gray-400">Não há chamados com o status selecionado.</p>
                        </div>
                    ) : (
                        // Renderiza a lista filtrada
                        chamadosFiltrados.map(chamado => (
                            <div key={chamado.id} className="bg-white p-5 rounded-3xl shadow-xl border w-full border-gray-200 cursor-pointer">
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                            <div className={`${statusInfo[chamado.status]?.colorClass || 'bg-gray-400'} w-3 h-3 rounded-full mr-3 flex-shrink-0`}></div>
                                            <h1 className="text-3xl font-extrabold text-red-600 tracking-wide drop-shadow-sm">{chamado.titulo}</h1>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <img className="w-7 h-7 rounded-full bg-cover bg-center shadow-md shadow-[#b30000]/60" src={chamado.usuarioImg} alt={`Foto de ${chamado.usuario}`} />
                                            <h1 className="font-semibold text-[#b30000]">{chamado.usuario}</h1>
                                        </div>
                                        <h2 className="mt-5 font-sans">{chamado.descricao}</h2>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end">
                                        <img className="max-w-60 rounded-2xl shadow-md" src={chamado.imagem} alt={chamado.titulo} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}