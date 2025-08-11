'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

export default function Login() {
  const [activeTab, setActiveTab] = useState('adm');
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const welcomeMessages = {
    adm: 'Administrador',
    user: 'Usuário',
    tecnico: 'Técnico',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if(data.token) {
        Cookies.set("token", data.token, {
          path: "/admin/*"
        })
        return;
      }

      if (response.ok) {
        console.log(data.message)
      } else {
        console.log(data.message)
      }
    } catch (err) {
      console.error('Erro na requisição', err)
    }
  }

  return (
    <div className="bg-[url(/bglogin.svg)] bg-cover bg-center h-screen w-full">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-[300px] sm:w-[450px]">

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center absolute -top-7 left-0 right-0 z-10">
            {['adm', 'user', 'tecnico'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 mx-0.5 rounded-t-[10px] text-sm font-semibold transition-all
                  ${activeTab === tab
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                style={{ boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.3)' }}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-5 pt-10 rounded-[10px] w-full relative z-0"
            style={{
              boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div className="mt-2 text-center h-[60px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <span className="block text-base text-black font-medium">
                    Bem-vindo,
                  </span>
                  <span className="block text-[25px] text-red-600 font-semibold">
                    {welcomeMessages[activeTab]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>


            <form onSubmit={handleSubmit}>
              <div className="space-y-4 m-8">
                <input
                  type="text"
                  placeholder="Username"
                  className="block w-full px-4 py-2 border border-gray-400 rounded-full focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="block w-full px-4 py-2 border border-gray-400 rounded-full focus:outline-none"
                />
                <button className="w-full bg-red-600 text-white font-bold mt-5 py-2 rounded-full hover:bg-red-800 transition-colors">
                  Login
                </button>
              </div>
            </form> 
          </motion.div>
        </div>
      </div>
    </div>
  );
}
