'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import InstrucoesRapidas from '../instrucoes-tec/page';
import {
    FaHeadset,
    FaClock,
    FaShieldAlt,
    FaQuestionCircle,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
} from 'react-icons/fa';

export default function Inicio({ onAbrirChamado }) {
    const [modalAberto, setModalAberto] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);

    const toggleOpen = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const features = [
        {
            icon: <FaHeadset size={40} className="text-red-600" />,
            title: 'Suporte 24/7',
            description: 'Nossa equipe está sempre disponível para te ajudar, a qualquer hora do dia.',
        },
        {
            icon: <FaClock size={40} className="text-red-600" />,
            title: 'Resolução Rápida',
            description: 'Atendimento ágil para minimizar seu tempo de espera e resolver problemas rápido.',
        },
        {
            icon: <FaShieldAlt size={40} className="text-red-600" />,
            title: 'Segurança',
            description: 'Seus dados e chamados estão protegidos com criptografia e boas práticas.',
        },
    ];

    const faqs = [
        {
            question: 'Como abrir um chamado?',
            answer: 'Clique no botão "Abrir Novo Chamado", preencha o formulário com os detalhes do problema e envie.',
        },
        {
            question: 'Posso anexar documentos?',
            answer: 'Sim, é possível anexar imagens e documentos para ajudar na análise do problema.',
        },
        {
            question: 'Qual o tempo médio de resposta?',
            answer: 'Nosso tempo médio de resposta é de até 24 horas úteis.',
        },
        {
            question: 'Como acompanhar meu chamado?',
            answer: 'Você pode ver seus chamados na seção "Meus chamados" após fazer login.',
        },
    ];

    return (
        <>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto flex-grow flex flex-col justify-center px-6 text-center"
                aria-label="Seção de boas-vindas"
            >
                <h1 className="text-5xl mt-20 font-extrabold text-red-600 mb-6 leading-tight drop-shadow-md">
                    Bem-vindo ao Sistema de Chamados!
                </h1>

                <p className="text-gray-700 text-lg italic mb-12 max-w-xl mx-auto">
                    Gerencie seus chamados com agilidade, segurança e total suporte para que seus problemas sejam resolvidos rapidamente.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-12 mb-16">
                    {features.map(({ icon, title, description }, i) => (
                        <motion.div
                            key={i}
                            className="bg-red-50 rounded-lg p-6 shadow-md flex flex-col items-center text-red-700 cursor-default hover:shadow-xl transition-transform duration-300"
                            whileHover={{ scale: 1.07 }}
                            title={title}
                            role="region"
                            aria-label={title}
                            tabIndex={-1}
                        >
                            <div className="mb-4">{icon}</div>
                            <h3 className="font-semibold text-xl mb-2">{title}</h3>
                            <p className="text-sm max-w-xs">{description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-8 mb-20">
                    <button
                        onClick={onAbrirChamado}
                        className="bg-red-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-3 cursor-pointer"
                        aria-label="Abrir novo chamado"
                    >
                        Abrir Novo Chamado <FaCheckCircle size={20} />
                    </button>

                    <button
                        onClick={() => setModalAberto(true)}
                        className="border-2 border-red-600 text-red-600 px-10 py-4 rounded-xl shadow-md hover:bg-red-600 hover:text-white transition-colors font-semibold flex items-center justify-center gap-3 cursor-pointer"
                        aria-label="Ver instruções rápidas"
                    >
                        Instruções Rápidas <FaQuestionCircle size={20} />
                    </button>
                </div>

                <InstrucoesRapidas isOpen={modalAberto} onClose={() => setModalAberto(false)} />
            </motion.section>

            {/* Seção Perguntas Frequentes */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto p-8 bg-red-50 rounded-2xl shadow-lg my-20"
                aria-label="Perguntas Frequentes"
            >
                <h2 className="text-4xl font-extrabold text-red-600 text-center mb-12">Perguntas Frequentes</h2>

                <div className="space-y-4">
                    {faqs.map(({ question, answer }, i) => {
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
