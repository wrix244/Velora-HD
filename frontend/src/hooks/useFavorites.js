import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';
import useUIStore from '../store/uiStore';

// Get favorites
export const useFavorites = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);

  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await axios.get('/api/favorites');
      setFavorites(response.data.data);
      return response.data.data;
    },
    enabled: isAuthenticated,
  });
};

// Toggle favorite
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToast = useUIStore((state) => state.addToast);
  const addFavoriteStore = useFavoritesStore((state) => state.addFavorite);
  const removeFavoriteStore = useFavoritesStore((state) => state.removeFavorite);

  return useMutation({
    mutationFn: async (wallpaper) => {
      if (!isAuthenticated) {
        throw new Error('Please login to like wallpapers');
      }
      const response = await axios.post(`/api/favorites/toggle/${wallpaper._id}`);
      return { response: response.data, wallpaper };
    },
    onSuccess: ({ response, wallpaper }) => {
      if (response.favorited) {
        addFavoriteStore(wallpaper);
        addToast('Added to favorites!', 'success');
      } else {
        removeFavoriteStore(wallpaper._id);
        addToast('Removed from favorites.', 'info');
      }
      
      // Invalidate queries to update like counters on other pages
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpaper', wallpaper.slug] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      addToast(error.message || 'Failed to toggle favorite.', 'error');
    },
  });
};
