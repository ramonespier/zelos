'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaTicketAlt,
    FaUserClock,
    FaRegListAlt,
    FaBook,
    FaChevronDown,
    FaChevronUp,
    FaClipboardList,
} from 'react-icons/fa';


export default function InicioTecnico({ onVerChamados }) {
    const [modalConhecimentoAberto, setModalConhecimentoAberto] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);

    const toggleOpen = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    const painelTecnico = [
        {
            icon: <FaTicketAlt size={40} className="text-red-600" />,
            title: 'Novos Chamados',
            description: 'Visualize e atribua os chamados que acabaram de chegar na fila.',
            action: () => console.log("Navegar para novos chamados"), 
        },
        {
            icon: <FaRegListAlt size={40} className="text-red-600" />,
            title: 'Meus Chamados Atribuídos',
            description: 'Acesse a lista de chamados que estão sob sua responsabilidade.',
            action: () => console.log("Navegar para meus chamados"), 
        },
        {
            icon: <FaUserClock size={40} className="text-red-600" />,
            title: 'Chamados Pendentes',
            description: 'Acompanhe os chamados que aguardam resposta do usuário ou de terceiros.',
            action: () => console.log("Navegar para chamados pendentes"), 
        },
    ];


    const faqsTecnico = [
        {
            question: 'Como atribuo um chamado para mim?',
            answer: 'Na aba "Chamados abertos", clique no chamado desejado e use o botão "Atribuir chamado". Um pedido de atribuição srá enviado para a administração.',
        },
        {
            question: 'Como eu sei que um chamado foi atribuído?',
            answer: 'Assim que a administração aprovar o pedido, o chamado estará disponível na aba "Chamados atribuídos.'
         },
        
    
    ];

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto flex-grow flex flex-col justify-center px-6 text-center"
                aria-label="Painel de Controle do Técnico"
            >
                <h1 className="text-5xl mt-20 font-extrabold text-red-600 mb-6 leading-tight drop-shadow-md">
                    Painel do Técnico
                </h1>

                <p className="text-gray-700 text-lg italic mb-12 max-w-xl mx-auto">
                    Gerencie os chamados de forma eficiente, acompanhe suas tarefas e resolva os problemas com agilidade.
                </p>

   
                <div className="flex flex-col sm:flex-row justify-center gap-12 mb-16">
                    {painelTecnico.map(({ icon, title, description, action }, i) => (
                        <motion.div
                            key={i}
                            className="bg-red-50 rounded-lg p-6 shadow-md flex flex-col items-center text-red-700 hover:shadow-xl transition-transform duration-300"
                            whileHover={{ scale: 1.07 }}
                            onClick={action}
                            title={title}
                            role="region"
                            aria-label={title}
                            tabIndex={0}
                        >
                            <div className="mb-4">{icon}</div>
                            <h3 className="font-semibold text-xl mb-2">{title}</h3>
                            <p className="text-sm max-w-xs">{description}</p>
                        </motion.div>
                    ))}
                </div>

             
                <div className="flex flex-col sm:flex-row justify-center gap-8 mb-20">
                    <button
                        onClick={onVerChamados} 
                        className="bg-red-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-3 cursor-pointer"
                        aria-label="Ver todos os chamados"
                    >
                        Ver Todos os Chamados <FaClipboardList size={20} />
                    </button>

                    <button
                        onClick={() => setModalConhecimentoAberto(true)}
                        className="border-2 border-red-600 text-red-600 px-10 py-4 rounded-xl shadow-md hover:bg-red-600 hover:text-white transition-colors font-semibold flex items-center justify-center gap-3 cursor-pointer"
                        aria-label="Acessar base de conhecimento"
                    >
                        Meus chamado atribuídos <FaBook size={20} />
                    </button>
                </div>

            </motion.section>

       
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto p-8 bg-red-50 rounded-2xl shadow-lg my-20"
                aria-label="Perguntas Frequentes do Técnico"
            >
                <h2 className="text-4xl font-extrabold text-red-600 text-center mb-12">Dúvidas Comuns da Equipe</h2>

                <div className="space-y-4">
                    {faqsTecnico.map(({ question, answer }, i) => {
                        const isOpen = openIndex === i;

                        return (
                            <div
                                key={i}
                                className="bg-white rounded-xl shadow-md border border-red-100 cursor-pointer focus-within:ring-2 focus-within:ring-red-400"
                                onClick={() => toggleOpen(i)}
                                aria-expanded={isOpen}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') toggleOpen(i);
                                }}
                            >
                                <div className="flex items-center justify-between px-4 py-3">
                                    <h3 className="font-semibold text-lg text-red-700">{question}</h3>
                                    <span className="text-red-600">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
                                </div>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        maxHeight: isOpen ? 200 : 0,
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.15, ease: 'linear' }}
                                    className="px-4 pb-4 text-gray-700 text-md overflow-hidden whitespace-normal break-words"
                                    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                                >
                                    <p>{answer}</p>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </motion.section>
        </>
    );
}