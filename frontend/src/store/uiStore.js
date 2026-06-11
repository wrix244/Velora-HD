import { create } from 'zustand';

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

  // Recently Viewed Wallpapers (Local Storage based)
  recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed') || '[]'),

  addRecentlyViewed: (wallpaper) => {
    if (!wallpaper || !wallpaper._id) return;
    
    set((state) => {
      // Remove duplicate if it already exists, then place at beginning
      const filtered = state.recentlyViewed.filter((item) => item._id !== wallpaper._id);
      const updated = [wallpaper, ...filtered].slice(0, 10); // Keep last 10
      
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return { recentlyViewed: updated };
    });
  },

  clearRecentlyViewed: () => {
    localStorage.removeItem('recentlyViewed');
    set({ recentlyViewed: [] });
  },
}));

export default useUIStore;
