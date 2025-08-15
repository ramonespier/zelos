'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsDropdown({ notifications, unreadCount, isOpen, setIsOpen }) {

  const marcarComoLida = (id) => {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  };

  return (
    <div className="relative">
      <motion.button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100" 
        whileTap={{ scale: 0.9 }}
      >
        <span className="relative">
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-xs font-bold text-white bg-yellow-500 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800">Notificações</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? notifications.map(n => (
                <div key={n.id} onClick={() => marcarComoLida(n.id)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}>
                  <p className="font-semibold text-gray-700">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500">Nenhuma notificação nova</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
