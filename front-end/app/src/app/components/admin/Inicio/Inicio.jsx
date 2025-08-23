'use client';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaTicketAlt,
    FaUserCheck,
    FaWrench,
} from 'react-icons/fa';

// O componente agora recebe 'setActiveTab' como uma propriedade
export default function InicioAdmin({ setActiveTab }) {
    
    const stats = [
        { icon: <FaUsers size={40} className="text-red-600" />, title: 'Total de Usuários', description: 'Gerencie todos os técnicos e solicitantes cadastrados.' },
        { icon: <FaTicketAlt size={40} className="text-red-600" />, title: 'Chamados Abertos Hoje', description: 'Acompanhe em tempo real a entrada de novos chamados.' },
        { icon: <FaUserCheck size={40} className="text-red-600" />, title: 'Técnicos Online', description: 'Veja quais técnicos estão ativos e disponíveis para tarefas.' },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto flex-grow flex flex-col justify-center px-6 text-center"
        >
            <h1 className="text-5xl mt-20 font-extrabold text-red-600 mb-6 drop-shadow-md">
                Painel do Administrador
            </h1>

            <p className="text-gray-700 text-lg italic mb-12 max-w-xl mx-auto">
                Visão geral do sistema e atalhos para as principais áreas de gerenciamento.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-12 mb-16">
                {stats.map(({ icon, title, description }, i) => (
                    <motion.div
                        key={i}
                        className="bg-red-50 rounded-lg p-6 shadow-md flex flex-col items-center text-red-700 hover:shadow-xl transition-shadow"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="mb-4">{icon}</div>
                        <h3 className="font-semibold text-xl mb-2">{title}</h3>
                        <p className="text-sm max-w-xs">{description}</p>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-8 mb-20">
                <button
                    onClick={() => setActiveTab('gerenciar')}
                    className="bg-red-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-3 cursor-pointer"
                >
                    Atribuir chamados <FaWrench size={20} />
                </button>
                <button
                    onClick={() => setActiveTab('gerenciar')}
                    className="bg-red-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-3 cursor-pointer"
                >
                    Gerenciar Chamados <FaWrench size={20} />
                </button>
                <button
                    onClick={() => setActiveTab('relatorio')}
                    className="bg-red-600 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-3 cursor-pointer"
                >
                    Relatorios <FaWrench size={20} />
                </button>
            </div>
        </motion.section>
    );
}