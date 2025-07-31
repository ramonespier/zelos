'use client'
import { useState } from 'react'

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('inicio')

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
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
      case 'sobre':
        return <p className="text-center text-xl mt-10">Essa é a seção Meus chamados.</p>
      case 'contato':
        return <p className="text-center text-xl mt-10">Aqui estarão os comunicados importantes!</p>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-600 text-white flex justify-center gap-10 p-4">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`hover:underline ${activeTab === 'inicio' ? 'font-bold underline' : ''}`}
        >
          Abrir chamado
        </button>
        <button
          onClick={() => setActiveTab('sobre')}
          className={`hover:underline ${activeTab === 'sobre' ? 'font-bold underline' : ''}`}
        >
          Meus chamados
        </button>
        <button
          onClick={() => setActiveTab('contato')}
          className={`hover:underline ${activeTab === 'contato' ? 'font-bold underline' : ''}`}
        >
          Comunicados
        </button>
      </nav>

      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  )
}
