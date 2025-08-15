'use client';
import { motion } from 'framer-motion';
import PainelTecnicoCards from './PainelTecnicoCards';
import PainelAcoes from './PainelAcoes';
import FaqTecnico from './FaqTecnico';
import { FaTicketAlt, FaUserClock, FaRegListAlt } from 'react-icons/fa';

export default function InicioTecnico({ setActiveTab }) {
  const painelTecnico = [
    {
      icon: <FaTicketAlt size={40} className="text-red-600" />,
      title: 'Novos Chamados',
      description: 'Visualize e atribua os chamados que acabaram de chegar na fila.',
      action: () => setActiveTab('abertos'),
    },
    {
      icon: <FaRegListAlt size={40} className="text-red-600" />,
      title: 'Meus Chamados Atribuídos',
      description: 'Acesse a lista de chamados que estão sob sua responsabilidade.',
      action: () => setActiveTab('atribuidos'),
    },
    {
      icon: <FaUserClock size={40} className="text-red-600" />,
      title: 'Chamados Pendentes',
      description: 'Acompanhe os chamados que aguardam resposta do usuário ou de terceiros.',
      action: () => setActiveTab('meus'),
    },
  ];

  const faqsTecnico = [
    {
      question: 'Como atribuo um chamado para mim?',
      answer: 'Na aba "Chamados abertos", clique no chamado desejado e use o botão "Atribuir chamado".',
    },
    {
      question: 'Como eu sei que um chamado foi atribuído?',
      answer: 'Assim que a administração aprovar o pedido, o chamado estará disponível na aba "Chamados atribuídos."'
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

        <PainelTecnicoCards cards={painelTecnico} setActiveTab={setActiveTab} />
        <PainelAcoes setActiveTab={setActiveTab} />
      </motion.section>

      <FaqTecnico faqs={faqsTecnico} />
    </>
  );
}
