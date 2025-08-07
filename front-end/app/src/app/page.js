'use client'
import { useState } from 'react'
import Header from './components/header/page'

import Navbar from './components/navbar/page';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio')

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header setActiveTab={setActiveTab} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

