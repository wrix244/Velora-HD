import { create } from 'zustand';

const useLikesStore = create((set, get) => ({
  likes: [],

  setLikes: (likesList) => {
    set({ likes: likesList });
  },

  addLike: (wallpaper) => {
    set((state) => ({
      likes: [...state.likes, wallpaper],
    }));
  },

  removeLike: (wallpaperId) => {
    set((state) => ({
      likes: state.likes.filter((like) => like._id !== wallpaperId),
    }));
  },

  isLiked: (wallpaperId) => {
    return get().likes.some((like) => like._id === wallpaperId);
  },

  clearLikes: () => {
    set({ likes: [] });
  },
}));

export default useLikesStore;
