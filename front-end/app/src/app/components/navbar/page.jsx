'use client'
import { motion } from 'framer-motion'
import Inicio from '../inicio/page'
import InstrucoesRapidas from '../instrucoes/page'
import Footer from '../footer/page'
import Chamado from '../chamado/page'
import MeusChamados from '../relatorio/page'

export default function Navbar({ activeTab, setActiveTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'chamado':
        return <Chamado />


      case 'meus':
        return <MeusChamados />


      case 'info':
        return (
          <section className="max-w-md w-full mt-12 mb-20 p-8 bg-white rounded-2xl shadow-lg border border-gray-300 mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-red-600 mb-8">Informações do Perfil</h2>

            <div className="flex justify-center mb-8">
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt="Foto do perfil de Maria Silva"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-red-600"
                loading="lazy"
              />
            </div>

            <div className="space-y-10 text-gray-800">
              <div className="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8 8 0 1118.88 6.196 8 8 0 015.12 17.804z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xl font-semibold"><strong>Nome:</strong> Maria Silva</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h.01M12 16h.01M8 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
                <p className="text-xl font-semibold"><strong>Função:</strong> RH</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2l1 5-1 5H5a2 2 0 01-2-2V5zM13 7l7 5-7 5V7z" />
                </svg>
                <p className="text-xl font-semibold"><strong>Número da matrícula:</strong> 1234-5678</p>
              </div>
            </div>
          </section>
        )

      case 'inicio':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Inicio onAbrirChamado={() => setActiveTab('chamado')} />
          </div>
        )
    }
  }

  return (
    <>
      <nav className="bg-red-600 text-white flex gap-6 p-4">
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
            <motion.span
              layoutId="underline"
              className="absolute bottom-0 left-0 h-[2px] w-full bg-white"
              initial={false}
              animate={{
                opacity: activeTab === tab ? 1 : 0,
                y: activeTab === tab ? 0 : 5,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          </motion.button>
        ))}
      </nav>


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
  )
}
