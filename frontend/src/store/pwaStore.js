import { create } from 'zustand';

const usePWAStore = create((set, get) => ({
  deferredPrompt: null,
  isInstalled: window.matchMedia('(display-mode: standalone)').matches,
  showInstallBanner: false,

  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setIsInstalled: (status) => set({ isInstalled: status }),
  setShowInstallBanner: (show) => set({ showInstallBanner: show }),

  installApp: async () => {
    const { deferredPrompt } = get();
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        set({ isInstalled: true, deferredPrompt: null, showInstallBanner: false });
        return true;
      }
    } catch (err) {
      console.error('PWA Installation failed:', err);
    }
    set({ deferredPrompt: null, showInstallBanner: false });
    return false;
  }
}));

export default usePWAStore;
