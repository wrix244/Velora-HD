import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import useUIStore from '../../store/uiStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center gap-3 p-4 rounded-xl glass-panel-glow border-white/10 shadow-lg"
          >
            <div className="flex-shrink-0">{getIcon(toast.type)}</div>
            <div className="flex-grow text-sm font-medium text-gray-100">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
