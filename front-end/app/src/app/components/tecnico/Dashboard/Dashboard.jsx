'use client';
import { useState } from 'react';
import Sidebar from './Slidebar';
import Header from './Header';
import ContentArea from './ContentArea';
import Footer from '../../footer/page';

export default function DashboardTecnico() {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <ContentArea activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
