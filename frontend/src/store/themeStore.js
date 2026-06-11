import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('dl_theme') || 'graffiti',

  setTheme: (theme) => {
    localStorage.setItem('dl_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  // Initialize on app load
  initTheme: () => {
    const saved = localStorage.getItem('dl_theme') || 'graffiti';
    document.documentElement.setAttribute('data-theme', saved);
    set({ theme: saved });
  },
}));

export default useThemeStore;
