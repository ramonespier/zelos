'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('inicio')

  const renderContent = () => {
    switch (activeTab) {
      case 'chamado':
        return (
          <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold text-center text-red-600 mb-6">Abrir novo chamado</h2>
            <form className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nome do responsável:</label>
                <input type="text" placeholder="Seu nome" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium mb-1">Número do patrimônio:</label>
                <input type="text" placeholder="Ex: 123456" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium mb-1">Tipo de problema:</label>
                <select className="w-full border border-gray-300 p-2 rounded">
                  <option>Elétrico</option>
                  <option>Hidráulico</option>
                  <option>Informática</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Descrição do problema:</label>
                <textarea placeholder="Descreva o problema com detalhes..." className="w-full border border-gray-300 p-2 rounded h-24" />
              </div>
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Enviar chamado
              </button>
            </form>
          </div>
        )
      case 'inicio':
        return <p className="text-center text-xl mt-10">Aqui estarão os comunicados importantes!</p>
      case 'meus':
        return <p className="text-center text-xl mt-10">Essa é a seção Meus chamados.</p>
      default:
        return null
    }
  }

  const AnimatedButton = ({ tab, children }) => (
    <motion.button
      onClick={() => setActiveTab(tab)}
      className="relative text-white font-medium text-lg pb-1 overflow-hidden cursor-pointer"
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-white block"
        initial={{ width: 0 }}
        animate={{ width: activeTab === tab ? '100%' : '0%' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </motion.button>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-600 text-white flex gap-6 p-4">
        <AnimatedButton tab="inicio">Início</AnimatedButton>
        <AnimatedButton tab="chamado">Abrir chamado</AnimatedButton>
        <AnimatedButton tab="meus">Meus chamados</AnimatedButton>
      </nav>

      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  )
}
