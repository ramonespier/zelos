'use client'
import { useState } from 'react'
import Dashboard from './components/dashboard/page'

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio')

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Dashboard/>
    </div>
  )
}

