import { create } from 'zustand';
import { getCookie, setCookie } from '../utils/cookies';

const useThemeStore = create((set) => ({
  theme: getCookie('dl_theme') === 'light' ? 'light' : 'dark',

  setTheme: (theme) => {
    const targetTheme = theme === 'light' ? 'light' : 'dark';
    const consent = getCookie('dl_cookie_consent');
    if (consent === 'necessary') {
      // Session cookie (no days parameter)
      setCookie('dl_theme', targetTheme);
    } else {
      // 365 days cookie
      setCookie('dl_theme', targetTheme, 365);
    }
    document.documentElement.setAttribute('data-theme', targetTheme);
    set({ theme: targetTheme });
  },

  // Initialize on app load
  initTheme: () => {
    const saved = getCookie('dl_theme');
    const targetTheme = saved === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', targetTheme);
    set({ theme: targetTheme });
  },
}));

export default useThemeStore;
