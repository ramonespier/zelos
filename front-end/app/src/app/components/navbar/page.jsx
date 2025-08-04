'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import Inicio from '../inicio/page'
import InstrucoesRapidas from '../instrucoes/page'
import Footer from '../footer/page'
import Chamado from '../chamado/page'

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('inicio')

  useEffect(() => {
    const tabSalva = localStorage.getItem('activeTab');
    if (tabSalva) setActiveTab(tabSalva);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'chamado':
        return (
          <Chamado />
        )
      case 'inicio':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Inicio onVerInstrucoes={() => setActiveTab('inicio')} />
          </div>
        )
      case 'meus':
        return <p className="text-center text-xl mt-10">Essa é a seção Meus chamados.</p>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-red-600 text-white flex gap-6 p-4">
        <motion.button
          onClick={() => setActiveTab('inicio')}
          className="relative text-white font-medium text-lg pb-1 overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Início
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('chamado')}
          className="relative text-white font-medium text-lg pb-1 overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Abrir chamado
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('meus')}
          className="relative text-white font-medium text-lg pb-1 overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Meus chamados
        </motion.button>
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
    </div>
  )
}
