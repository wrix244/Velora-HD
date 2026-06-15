import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useLikesStore from '../store/likesStore';
import useUIStore from '../store/uiStore';

// Get likes
export const useLikes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setLikes = useLikesStore((state) => state.setLikes);

  return useQuery({
    queryKey: ['likes'],
    queryFn: async () => {
      const response = await axios.get('/api/likes');
      setLikes(response.data.data);
      return response.data.data;
    },
    enabled: isAuthenticated,
  });
};

// Toggle like
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToast = useUIStore((state) => state.addToast);
  const addLikeStore = useLikesStore((state) => state.addLike);
  const removeLikeStore = useLikesStore((state) => state.removeLike);

  return useMutation({
    mutationFn: async (wallpaper) => {
      if (!isAuthenticated) {
        throw new Error('Please log in to like wallpapers.');
      }
      const response = await axios.post(`/api/likes/toggle/${wallpaper._id}`);
      return { response: response.data, wallpaper };
    },
    onSuccess: ({ response, wallpaper }) => {
      if (response.liked) {
        addLikeStore(wallpaper);
        addToast('Wallpaper liked!', 'success');
      } else {
        removeLikeStore(wallpaper._id);
        addToast('Wallpaper unliked.', 'info');
      }
      
      // Invalidate queries to update like counters on other pages
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpaper', wallpaper.slug] });
      queryClient.invalidateQueries({ queryKey: ['likes'] });
    },
    onError: (error) => {
      addToast(error.message || 'Failed to toggle like.', 'error');
    },
  });
};
