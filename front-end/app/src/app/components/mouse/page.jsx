'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export default function Particulas() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Centro do cursor (rápido)
  const centerX = useSpring(x, { stiffness: 1000, damping: 60 });
  const centerY = useSpring(y, { stiffness: 1000, damping: 60 });

  // Anel externo (suave)
  const ringX = useSpring(x, { stiffness: 120, damping: 20 });
  const ringY = useSpring(y, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const updateMouse = (e) => {
      x.set(e.clientX - 8);
      y.set(e.clientY - 8);
    };
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, [x, y]);

  return (
    <>
      <motion.div
        className="w-16 h-16 rounded-full fixed top-0 left-0 z-0 pointer-events-none border border-white/30 backdrop-blur-md"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ponto central com glow */}
      <motion.div
        className="w-4 h-4 rounded-full fixed top-0 left-0 z-0 pointer-events-none bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        style={{ x: centerX, y: centerY }}
      />
    </>
  );
}
