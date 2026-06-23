import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

// Submit Become a Creator Application
export const useBecomeCreator = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post('/api/creator/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      addToast('Application submitted successfully! Admins have been notified.', 'success');
      queryClient.invalidateQueries({ queryKey: ['creator', 'application-status'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to submit application.';
      addToast(message, 'error');
    },
  });
};

// Cancel/Retract Become a Creator Application
export const useCancelCreatorApplication = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete('/api/creator/apply');
      return response.data;
    },
    onSuccess: (data) => {
      addToast(data.message || 'Application canceled successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['creator', 'application-status'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to cancel application.';
      addToast(message, 'error');
    },
  });
};

// Get Creator Application Status
export const useCreatorApplicationStatus = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['creator', 'application-status'],
    queryFn: async () => {
      const response = await axios.get('/api/creator/application-status');
      return response.data.data;
    },
    enabled: isAuthenticated,
  });
};

// Creator Upload Wallpaper
export const useCreatorUpload = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post('/api/creator/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      addToast('Wallpaper uploaded successfully and queued for review!', 'success');
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to upload wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Get Creator Wallpapers list
export const useCreatorWallpapers = () => {
  const user = useAuthStore((state) => state.user);
  const isCreator = user?.role === 'creator';

  return useQuery({
    queryKey: ['creator', 'wallpapers'],
    queryFn: async () => {
      const response = await axios.get('/api/creator/wallpapers');
      return response.data.data;
    },
    enabled: isCreator,
  });
};

// Creator Edit Wallpaper Details
export const useUpdateCreatorWallpaper = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const headers = formData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

      const response = await axios.put(`/api/creator/wallpapers/${id}`, formData, { headers });
      return response.data;
    },
    onSuccess: () => {
      addToast('Wallpaper updated successfully and queued for review.', 'success');
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Creator Delete Wallpaper
export const useDeleteCreatorWallpaper = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/creator/wallpapers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      addToast('Wallpaper deleted successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['creator', 'wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Fetch User Notifications
export const useNotifications = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications');
      return response.data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Check for alerts every 30s
  });
};

// Mark Notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(`/api/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
