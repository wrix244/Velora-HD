import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import usePWAStore from '../../store/pwaStore';
import { setCookie } from '../../utils/cookies';

export default function InstallPrompt() {
  const { isInstalled, showInstallBanner, setShowInstallBanner, installApp } = usePWAStore();

  const handleInstall = async () => {
    await installApp();
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setCookie('dl_pwa_dismissed', Date.now().toString(), 7);
  };

  if (isInstalled || !showInstallBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[380px] z-50"
      >
        <div className="glass-panel-glow rounded-2xl p-5 border border-white/10 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            {/* App icon */}
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] shadow-lg shadow-primary/20">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img src="/icon-512.png" alt="Velora HD" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <h3 className="font-display text-white text-base font-bold">Install Velora HD</h3>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Add to home screen for instant access, offline browsing, and a fullscreen experience.
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-primary/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>

          {/* Subtle feature chips */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Works offline
            </span>
            <span className="text-[10px] text-gray-500">•</span>
            <span className="text-[10px] text-gray-500">⚡ Instant launch</span>
            <span className="text-[10px] text-gray-500">•</span>
            <span className="text-[10px] text-gray-500">🔔 No app store</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
