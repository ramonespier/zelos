'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialTickets = [
    { id: '1', title: 'Falha crítica no servidor de autenticação', description: 'Ninguém consegue fazer login no sistema principal. A tela de login retorna erro 503.', name: 'Juliana Paiva', assetId: 'SRV-AUTH-01', status: 'aberto', assignedTo: null },
    { id: '2', title: 'Impressora fiscal parou de emitir cupons', description: 'A impressora do caixa 1, modelo Bematech MP-4200, não responde.', name: 'Marcos Oliveira', assetId: 'PAT-789123', status: 'aberto', assignedTo: null },
    { id: '3', title: 'Lentidão extrema ao gerar relatórios', description: 'Relatórios de vendas mensais estão demorando mais de 10 minutos para carregar no ERP.', name: 'Carla Souza', assetId: 'DESK-FIN-05', status: 'aberto', assignedTo: null },
    { id: '4', title: 'Acesso à rede bloqueado', description: 'Usuário do financeiro não consegue acessar a pasta compartilhada do setor.', name: 'Ricardo Mendes', assetId: 'NOTE-FIN-12', status: 'em_andamento', assignedTo: 'tech-1' },
];

const technicians = [
    { id: 'tech-1', name: 'Ana Silva' },
    { id: 'tech-2', name: 'Bruno Costa' },
    { id: 'tech-3', name: 'Carlos Dias' },
];

export default function AssignTicketPage() {
    const [tickets, setTickets] = useState(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleAssignTicket = () => {
        if (!selectedTicket || !selectedTechnician) return;

        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === selectedTicket.id
                    ? { ...ticket, assignedTo: selectedTechnician, status: 'em_andamento' }
                    : ticket
            )
        );

        const technicianName = technicians.find(t => t.id === selectedTechnician)?.name;
        setModalMessage(`O chamado "${selectedTicket.title}" foi atribuído com sucesso a ${technicianName}.`);
        setIsModalOpen(true);

        setSelectedTicket(null);
        setSelectedTechnician('');
    };

    const openTickets = tickets.filter(ticket => ticket.status === 'aberto');

    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    const panelVariants = {
        hidden: { x: 20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
        exit: { x: 20, opacity: 0, transition: { duration: 0.2 } },
    };

    return (
        <div className="min-h-screen bg-slate-100/70 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl sm:text-4xl font-extrabold mb-10 text-red-600 drop-shadow-sm">
                        Painel de atribuição
                    </h1>
                    <p className="text-gray-500 mt-2">Selecione um chamado e atribua a um técnico disponível.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/80"
                        initial="hidden"
                        animate="visible"
                        variants={listVariants}
                    >
                        <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-5 border-b pb-3 drop-shadow-sm ">Chamados em Aberto</h2>
                        <div className="space-y-4">
                            {openTickets.length > 0 ? (
                                openTickets.map(ticket => (
                                    <motion.div
                                        key={ticket.id}
                                        variants={itemVariants}
                                        layout
                                        onClick={() => setSelectedTicket(ticket)}
                                        className="p-5 rounded-xl border-2 transition-shadow duration-300 cursor-pointer"
                                        animate={{
                                            borderColor: selectedTicket?.id === ticket.id ? '#dc2626' : '#e5e7eb',
                                            boxShadow: selectedTicket?.id === ticket.id ? '0 4px 14px 0 rgba(220, 38, 38, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                                        }}
                                        whileHover={{ scale: 1.02, borderColor: '#ef4444' }}
                                    >
                                        <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                                            <p className="text-sm font-medium text-red-600">{ticket.name}</p>
                                            <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{ticket.assetId}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-800">{ticket.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1 break-words">{ticket.description}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tudo em ordem!</h3>
                                    <p className="mt-1 text-sm text-gray-500">Não há chamados abertos no momento.</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/80 lg:sticky top-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-5 border-b pb-3">Detalhes da Atribuição</h2>
                            <AnimatePresence mode="wait">
                                {selectedTicket ? (
                                    <motion.div key={selectedTicket.id} variants={panelVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 mb-2">{selectedTicket.title}</h3>
                                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                                                <p><strong>Solicitante:</strong> {selectedTicket.name}</p>
                                                <p><strong>Patrimônio:</strong> <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{selectedTicket.assetId}</span></p>
                                            </div>
                                            <p className="text-sm text-gray-700 bg-slate-50 p-3 rounded-lg break-words">{selectedTicket.description}</p>
                                        </div>
                                        <div className="border-t pt-5">
                                            <label htmlFor="technician" className="block text-sm font-medium text-gray-700 mb-2">Atribuir ao técnico:</label>
                                            <select id="technician" value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer">
                                                <option value="" disabled>Selecione um profissional</option>
                                                {technicians.map(tech => (<option key={tech.id} value={tech.id}>{tech.name}</option>))}
                                            </select>
                                        </div>
                                        <motion.button onClick={handleAssignTicket} disabled={!selectedTechnician} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-500/20 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer">
                                            Confirmar Atribuição
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="placeholder" variants={panelVariants} initial="hidden" animate="visible" exit="exit" className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                                        <p className="text-gray-500">Selecione um chamado da lista para visualizar os detalhes aqui.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl cursor-default"
                            role="dialog"
                            aria-modal="true"
                        >
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-bold text-gray-800 mt-4">Sucesso!</h3>
                            <p className="text-gray-600 my-4">{modalMessage}</p>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-red-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                            >
                                Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}