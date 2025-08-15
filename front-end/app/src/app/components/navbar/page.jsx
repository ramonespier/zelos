'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Inicio from '../inicio/page';
import InstrucoesRapidas from '../instrucoes/page';
import Footer from '../footer/page';
import Chamado from '../chamado/page';
import MeusChamados from '../meus-chamados/page';
import { ChevronDownIcon, UserCircleIcon, IdentificationIcon, BriefcaseIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar({ activeTab, setActiveTab }) {
  const [isProfileOpen, setProfileOpen] = useState(false);

  // Dados do funcionário (idealmente, viriam de uma API ou de um estado global)
  const funcionario = {
    nome: 'Maria Silva',
    funcao: 'RH',
    matricula: '1234-5678',
  };

  // Função para obter as iniciais do nome
  const getInitials = (name) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chamado':
        return <Chamado />;
      case 'meus':
        return <MeusChamados />;
      case 'inicio':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Inicio onAbrirChamado={() => setActiveTab('chamado')} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <header className="bg-red-600 text-white shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* Lado Esquerdo: Links de Navegação */}
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">SENAI Chamados</h1>
            <div className="flex gap-6">
              {[
                { tab: 'inicio', label: 'Início' },
                { tab: 'chamado', label: 'Abrir chamado' },
                { tab: 'meus', label: 'Meus chamados' },
              ].map(({ tab, label }) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative text-white font-medium text-lg pb-1 overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-current={activeTab === tab ? 'page' : undefined}
                >
                  {label}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="underline"
                      className="absolute bottom-0 left-0 h-[3px] w-full bg-white rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Lado Direito: Perfil do Funcionário */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center font-bold text-lg">
                {getInitials(funcionario.nome)}
              </div>
              <span className="hidden md:block font-semibold">{funcionario.nome}</span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown do Perfil */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {getInitials(funcionario.nome)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{funcionario.nome}</p>
                        <p className="text-sm text-gray-500">{funcionario.funcao}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 text-gray-700">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="w-6 h-6 text-red-600" />
                      <span>{funcionario.nome}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BriefcaseIcon className="w-6 h-6 text-red-600" />
                      <span>{funcionario.funcao}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <IdentificationIcon className="w-6 h-6 text-red-600" />
                      <span>Matrícula: {funcionario.matricula}</span>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Sair
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>

      <main className="flex-grow p-6 flex flex-col items-center justify-center space-y-10">
        {renderContent()}
        {activeTab === 'inicio' && (
          <div className="max-w-4xl w-full mx-auto flex justify-center">
            <InstrucoesRapidas />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}