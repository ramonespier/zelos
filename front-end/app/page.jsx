'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticlesFundo from '../components/particulas/particulas';

export default function Login() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const handleClick = () => {
    if (loading) return;
    if (step === 1) {
      if (!username.trim()) return;
      setStep(2);
    } else {
      if (!password.trim()) return;
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const handleBack = () => {
    if (loading) return;
    if (step === 2) setStep(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <>
      <ParticlesFundo />
      <div className="bg-cover bg-center h-screen w-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/30 p-6 rounded-lg w-full max-w-md shadow-inner shadow-black/20 relative z-10 backdrop-blur-xs"
          role="form"
          aria-labelledby="login-header"
        >
          <div
            id="login-header"
            className="text-center h-[55px] relative overflow-hidden mb-6"
          >
            <AnimatePresence mode="wait">
              <motion.h2
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="text-white font-extrabold text-3xl flex items-center justify-center h-full"
                aria-live="polite"
              >
                {step === 1 ? 'Bem-vindo' : 'Digite sua senha'}
              </motion.h2>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.input
                key="username"
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="block w-full px-4 py-3 border border-white rounded-full bg-white focus:outline-none transition"
                aria-label="Campo de usuário"
                autoComplete="username"
                spellCheck={false}
              />
            )}

            {step === 2 && (
              <motion.input
                key="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="block w-full px-4 py-3 border border-white rounded-full bg-white focus:outline-none transition"
                aria-label="Campo de senha"
                autoComplete="current-password"
                spellCheck={false}
              />
            )}
          </AnimatePresence>

          <div className="flex justify-end mt-6">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="w-20 bg-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-400 transition-colors mr-3 cursor-pointer"
                aria-label="Voltar para usuário"
              >
                ←
              </button>
            )}

            <button
              onClick={handleClick}
              disabled={loading}
              className={`${step === 1 ? 'w-16 cursor-pointer' : 'w-24 cursor-pointer'
                } bg-white text-red-600 font-bold py-3 rounded-full hover:bg-red-300 transition-colors focus:outline-none focus:ring-4 focus:ring-red-400`}
              aria-live="polite"
              aria-busy={loading}
              aria-label={step === 1 ? 'Próximo' : 'Entrar'}
            >
              {loading ? (
                <span className="inline-flex gap-2 text-3xl">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              ) : step === 1 ? (
                '>'
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
