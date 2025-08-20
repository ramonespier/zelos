'use client'

import { motion } from 'framer-motion';
import Link from 'next/link'; 

export default function Naoencontrada() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="font-extrabold text-7xl text-center">Ops!</h1>
            <h2 className="font-bold text-6xl text-center mt-9">404</h2>
            <p className="text-center text-lg mt-10">Desculpe, essa página não foi encontrada.</p>
            <p className="text-center text-lg mt-5">O endereço abaixo pode estar quebrado ou a página pode ter sido removida.</p>
            <div className="flex justify-center">
                <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer mt-5"
                    >
                        Ir para o Login
                    </motion.button>
                </Link>
            </div>
        </div>
    )
}