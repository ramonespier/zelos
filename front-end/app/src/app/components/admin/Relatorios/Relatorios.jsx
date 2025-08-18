'use client'
import { useRouter } from 'next/navigation'
import {
  HiOutlineChartPie,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineUserAdd,
  HiOutlineDocumentReport
} from 'react-icons/hi'

export default function InicioAdmin() {
  const router = useRouter()

  // Estatísticas
  const stats = [
    { name: 'Total de Chamados', value: '1,287', icon: <HiOutlineChartPie className="w-8 h-8 text-blue-500" /> },
    { name: 'Aguardando Atendimento', value: '32', icon: <HiOutlineClock className="w-8 h-8 text-yellow-500" /> },
    { name: 'Chamados Resolvidos', value: '978', icon: <HiOutlineCheckCircle className="w-8 h-8 text-green-500" /> },
    { name: 'Chamados com Prioridade', value: '8', icon: <HiOutlineExclamationCircle className="w-8 h-8 text-red-500" /> },
  ]

  // Ações Rápidas
  const quickActions = [
    { name: 'Gerenciar Usuários', path: '/admin/usuarios', icon: <HiOutlineUserAdd className="w-7 h-7" /> },
    { name: 'Ver todos os Chamados', path: '/admin/chamados', icon: <HiOutlineDocumentReport className="w-7 h-7" /> },
  ]

  // Atividades Recentes
  const recentActivities = [
    { user: 'Mariana Lima', action: 'abriu um novo chamado de alta prioridade', time: '5m atrás' },
    { user: 'Carlos Souza', action: 'foi cadastrado como novo técnico', time: '45m atrás' },
    { user: 'Chamado #2981', action: 'foi fechado e avaliado com 5 estrelas', time: '2h atrás' },
  ]

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-md">Dashboard do Administrador</h1>
        <p className="mt-2 text-gray-600">Bem-vindo(a) de volta! Aqui está um resumo do seu sistema.</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
            <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-gray-500 font-medium">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ações Rápidas e Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ações Rápidas */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="space-y-4">
            {quickActions.map(action => (
              <button
                key={action.name}
                onClick={() => router.push(action.path)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 bg-gray-50 hover:bg-red-100 hover:text-red-700 transition-all duration-200 ease-in-out font-medium"
              >
                {action.icon}
                <span>{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Atividades Recentes</h3>
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <p className="text-gray-700">
                  <span className="font-semibold">{activity.user}</span> {activity.action}.
                </p>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
