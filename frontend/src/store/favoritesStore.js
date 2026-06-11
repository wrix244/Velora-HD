import { create } from 'zustand';

const useFavoritesStore = create((set, get) => ({
  favorites: [],

  setFavorites: (favoritesList) => {
    set({ favorites: favoritesList });
  },

  addFavorite: (wallpaper) => {
    set((state) => ({
      favorites: [...state.favorites, wallpaper],
    }));
  },

  removeFavorite: (wallpaperId) => {
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav._id !== wallpaperId),
    }));
  },

  isFavorite: (wallpaperId) => {
    return get().favorites.some((fav) => fav._id === wallpaperId);
  },

  clearFavorites: () => {
    set({ favorites: [] });
  },
}));

export default useFavoritesStore;
