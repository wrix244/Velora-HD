import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

// Fetch download history
export const useDownloadHistory = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['downloads'],
    queryFn: async () => {
      const response = await axios.get('/api/downloads/history');
      return response.data.data;
    },
    enabled: isAuthenticated,
  });
};

// Record download & initiate download stream/save file
export const useRecordDownload = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (wallpaper) => {
      const response = await axios.post(`/api/downloads/${wallpaper._id}`);
      return { data: response.data, wallpaper };
    },
    onSuccess: async ({ data, wallpaper }) => {
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpaper', wallpaper.slug] });

      addToast('Preparing download...', 'info');

      try {
        const response = await fetch(wallpaper.downloadFile);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}-${wallpaper.resolution}.${
          wallpaper.type === 'live' ? 'mp4' : 'jpg'
        }`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        
        addToast('Download started successfully!', 'success');
      } catch (err) {
        addToast('Download registered. Opening file in new tab.', 'info');
        window.open(wallpaper.downloadFile, '_blank');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Download failed. Please try again.';
      addToast(message, 'error');
    },
  });
};
