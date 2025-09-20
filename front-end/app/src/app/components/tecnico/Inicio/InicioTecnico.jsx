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
    },
    {
      icon: <FaRegListAlt size={40} className="text-red-600" />,
      title: 'Meus Chamados Atribuídos',
      description: 'Acesse a lista de chamados que estão sob sua responsabilidade.',
    },
    {
      icon: <FaUserClock size={40} className="text-red-600" />,
      title: 'Histórico de chamados',
      description: 'Visualize seus chamados concluídos.',
    },
  ];

  const faqsTecnico = [
    {
      question: 'Como atribuo um chamado para mim?',
      answer: 'Na aba "Chamados abertos", clique no chamado desejado e use o botão "Enviar pedido".',
    },
    {
      question: 'Como eu sei que um chamado foi atribuído?',
      answer: 'Assim que a administração aprovar o pedido, o chamado estará disponível na aba "Chamados atribuídos."'
    },
    {
      question: 'Como faço apontamentos?',
      answer: 'Na aba "Chamados Atribuídos", você pode enviar seus apontamentos diretamente no chamado.'
    },
    {
      question: 'Como fecho um chamado resolvido?',
      answer: 'Na aba "Chamados Atribuídos", clique em "Detalhes" no chamado e selecione "Solicitar Fechamento". A solicitação será enviada para a administração.'
    },
    {
      question: 'Como envio uma mensagem para a administração?',
      answer: 'Na aba "Contato", você pode enviar sua mensagem, e nossa equipe irá respondê-la.'
    },
    {
      question: 'Como atribuo minhas especialidades no meu perfil?',
      answer: 'Na aba "Perfil", clique no ícone de lápis no campo "Especialidade" para adicionar suas especialidades.'
    }

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
