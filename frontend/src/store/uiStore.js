import { create } from 'zustand';
import { getCookie, setCookie, eraseCookie } from '../utils/cookies';

const useUIStore = create((set, get) => ({
  toasts: [],
  
  // Add a premium custom toast
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // Auto-remove after 4 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Recently Viewed Wallpapers (Zustand memory + Cookie based)
  recentlyViewed: [],

  setRecentlyViewed: (wallpapers) => {
    set({ recentlyViewed: wallpapers || [] });
  },

  addRecentlyViewed: (wallpaper) => {
    if (!wallpaper || !wallpaper._id) return;
    
    set((state) => {
      // Remove duplicate if it already exists, then place at beginning
      const filtered = state.recentlyViewed.filter((item) => item._id !== wallpaper._id);
      const updated = [wallpaper, ...filtered].slice(0, 10); // Keep last 10
      
      // Update cookie if consent is granted or not explicitly rejected
      const consent = getCookie('dl_cookie_consent');
      if (consent !== 'necessary') {
        const ids = updated.map((wp) => wp._id);
        // Save cookie for 30 days
        setCookie('recentlyViewed', JSON.stringify(ids), 30);
      } else {
        // If necessary-only, ensure cookie is erased
        eraseCookie('recentlyViewed');
      }
      
      return { recentlyViewed: updated };
    });
  },

  clearRecentlyViewed: () => {
    eraseCookie('recentlyViewed');
    set({ recentlyViewed: [] });
  },
}));

export default useUIStore;
