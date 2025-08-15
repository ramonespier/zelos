'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalAtribuicao({ aberto, onClose }) {
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-extrabold text-red-600 mb-4">Permissão necessária!</h3>
            <p className="text-gray-700 mb-6">
              O seu pedido de atribuição de chamado foi enviado para a administração e está em análise. Nossa equipe entrará em contato em breve.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow hover:bg-red-700 transition cursor-pointer"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
