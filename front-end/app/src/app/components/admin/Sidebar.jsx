'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiChevronLeft, FiGrid, FiUsers, FiTag, FiFileText, FiHome } from 'react-icons/fi';

// Itens de navegação para o menu
const navItems = [
  { href: '/admin/chamados', icon: FiGrid, label: 'Chamados' },
  { href: '/admin/tecnicos', icon: FiUsers, label: 'Técnicos' },
  { href: '/admin/tipos-chamados', icon: FiTag, label: 'Tipos de Chamados' },
  { href: '/admin/relatorios', icon: FiFileText, label: 'Relatórios' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`relative bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Botão para recolher/expandir a sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-3 bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-full z-10"
      >
        <FiChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      <div className="flex flex-col h-full">
        {/* Logo/Título */}
        <div className="p-4 border-b border-gray-700">
          <Link href="/admin">
            <div className="flex items-center gap-2">
                <FiHome size={28} />
                <h2 className={`text-2xl font-bold whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
                    Admin
                </h2>
            </div>
          </Link>
        </div>

        {/* Itens de Navegação */}
        <nav className="flex-1 px-2 py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link href={item.href}>
                  <div
                    className={`flex items-center p-3 hover:bg-gray-700 rounded-md cursor-pointer ${
                      pathname === item.href ? 'bg-gray-900' : ''
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <item.icon size={22} />
                    <span className={`ml-4 text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}