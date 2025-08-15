'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../../footer/page'

// Componentes técnico
import InicioTec from '../inicio-tec/page'
import ChamadoTec from '../chamado-tec/page'
import ChamadosAtribuidos from '../chamados-atribuidos-tec/page'
import ChamadosAbertos from '../chamados-abertos-tec/page'
import MeusChamadosTec from '../meus-chamados-tec/page'
import InstrucoesTec from '../instrucoes-tec/page'

// Ícones
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'

import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlinePlusCircle,
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineUser
} from 'react-icons/hi'

export default function DashboardTecnico() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [isProfileOpen, setProfileOpen] = useState(false)
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([])
  const dropdownRef = useRef(null)
  const notificationsRef = useRef(null)

  const funcionario = { nome: 'José Silva', funcao: 'Técnico', matricula: '12345678' }
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const mockNotifications = [
      { id: 1, title: 'Novo chamado atribuído', message: 'Você foi designado para o chamado #2456.', time: '10 min atrás', read: false },
      { id: 2, title: 'Chamado atualizado', message: 'O chamado #1234 está "Em Andamento".', time: '2 horas atrás', read: true },
      { id: 3, title: 'Comentário adicionado', message: 'Um novo comentário foi adicionado ao chamado #2390.', time: '1 dia atrás', read: true },
    ]
    setNotifications(mockNotifications)
  }, [])

  const marcarComoLida = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleSelecao = (opcao) => {
    if (opcao === 'sair') {
      console.log('Logout executado');
    } else {
      setActiveTab(opcao)
    }
    setProfileOpen(false)
    setMobileMenuOpen(false);
  }

  const tabs = [
    { id: 'inicio', label: 'Início', icon: <HiOutlineHome size={22} /> },
    { id: 'abertos', label: 'Chamados Abertos', icon: <HiOutlineClipboardList size={22} /> },
    { id: 'atribuidos', label: 'Chamados Atribuídos', icon: <HiOutlineBriefcase size={22} /> },
    { id: 'meus', label: 'Meus Chamados', icon: <HiOutlineUser size={22} /> },
    { id: 'abrir', label: 'Solicitar chamado', icon: <HiOutlinePlusCircle size={22} /> }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio': return <InicioTec setActiveTab={setActiveTab} />
      case 'atribuidos': return <ChamadosAtribuidos />
      case 'abertos': return <ChamadosAbertos />
      case 'meus': return <MeusChamadosTec />
      case 'abrir': return <ChamadoTec />
      default: return null
    }
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-red-600">SENAI Chamados</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => handleSelecao(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === tab.id ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
        <div>
          <Footer />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-20 flex items-center justify-between px-6 z-10">
          <div className="flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{tabs.find(t => t.id === activeTab)?.label}</h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative" ref={notificationsRef}>
              <motion.button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100" whileTap={{ scale: 0.9 }}>
                <HiOutlineBell size={24} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 text-xs font-bold text-white bg-yellow-500 rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </motion.button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-800">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} onClick={() => marcarComoLida(n.id)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}>
                          <p className="font-semibold text-gray-700">{n.title}</p>
                          <p className="text-sm text-gray-600">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      )) : <div className="p-8 text-center text-gray-500">Nenhuma notificação nova</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={dropdownRef}>
              <motion.button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-1 rounded-full transition-colors hover:bg-gray-100" whileTap={{ scale: 0.95 }}>
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">{getInitials(funcionario.nome)}</div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="font-semibold text-sm text-gray-700">{funcionario.nome}</span>
                  <span className="text-xs text-gray-500">{funcionario.funcao}</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b">
                      <p className="font-semibold text-gray-800">{funcionario.nome}</p>
                      <p className="text-sm text-gray-500">Matrícula: {funcionario.matricula}</p>
                    </div>
                    <button onClick={() => handleSelecao('sair')} className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors">
                      <ArrowRightOnRectangleIcon className="w-5 h-5" /> <span>Sair da Conta</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderContent()}
              {activeTab === 'inicio' && <InstrucoesTec />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
