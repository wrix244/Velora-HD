import { create } from 'zustand';
import { getCookie, setCookie } from '../utils/cookies';

const useThemeStore = create((set) => ({
  theme: getCookie('dl_theme') || 'graffiti',

  setTheme: (theme) => {
    // Only store long-term if not restricted to necessary-only
    const consent = getCookie('dl_cookie_consent');
    if (consent === 'necessary') {
      // Session cookie (no days parameter)
      setCookie('dl_theme', theme);
    } else {
      // 365 days cookie
      setCookie('dl_theme', theme, 365);
    }
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  // Initialize on app load
  initTheme: () => {
    const saved = getCookie('dl_theme') || 'graffiti';
    document.documentElement.setAttribute('data-theme', saved);
    set({ theme: saved });
  },
}));

export default useThemeStore;
