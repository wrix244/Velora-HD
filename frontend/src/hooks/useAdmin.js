import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

// Fetch Admin analytics dashboard
export const useAdminAnalytics = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/analytics');
      return response.data.data;
    },
    enabled: isAdmin,
  });
};

// Fetch all users list
export const useAdminUsers = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/users');
      return response.data.data;
    },
    enabled: isAdmin,
  });
};

// Fetch all purchases list
export const useAdminPurchases = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return useQuery({
    queryKey: ['admin', 'purchases'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/purchases');
      return response.data.data;
    },
    enabled: isAdmin,
  });
};

// Fetch all downloads list
export const useAdminDownloads = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return useQuery({
    queryKey: ['admin', 'downloads'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/downloads');
      return response.data.data;
    },
    enabled: isAdmin,
  });
};

// Create Wallpaper Mutation
export const useCreateWallpaper = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (formData) => {
      // formData can be either JSON or Multipart FormData
      const headers = formData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

      const response = await axios.post('/api/admin/wallpapers', formData, { headers });
      return response.data;
    },
    onSuccess: () => {
      addToast('Wallpaper created successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Update Wallpaper Mutation
export const useUpdateWallpaper = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const headers = formData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

      const response = await axios.put(`/api/admin/wallpapers/${id}`, formData, { headers });
      return response.data;
    },
    onSuccess: (data) => {
      addToast('Wallpaper updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpaper', data.data.slug] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Delete Wallpaper Mutation
export const useDeleteWallpaper = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/admin/wallpapers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      addToast('Wallpaper deleted successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Fetch Admin all wallpapers
export const useAdminWallpapers = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return useQuery({
    queryKey: ['admin', 'wallpapers'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/wallpapers');
      return response.data.data;
    },
    enabled: isAdmin,
  });
};

// Delete User Mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      addToast('User deleted successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete user.';
      addToast(message, 'error');
    },
  });
};

// Ban User Mutation
export const useBanUser = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ id, isBanned }) => {
      const response = await axios.put(`/api/admin/users/${id}/ban`, { isBanned });
      return response.data;
    },
    onSuccess: (data) => {
      addToast(data.message || 'User status updated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update user status.';
      addToast(message, 'error');
    },
  });
};

// Fetch all creator applications list
export const useAdminApplications = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return useQuery({
    queryKey: ['admin', 'applications'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/applications');
      return response.data.data;
    },
    enabled: isAdmin,
  });
};

// Approve Creator Application Mutation
export const useApproveApplication = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(`/api/admin/applications/${id}/approve`);
      return response.data;
    },
    onSuccess: (data) => {
      addToast('Application approved successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to approve application.';
      addToast(message, 'error');
    },
  });
};

// Reject Creator Application Mutation
export const useRejectApplication = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ id, rejectionNotes, cooldownDays }) => {
      const response = await axios.put(`/api/admin/applications/${id}/reject`, { rejectionNotes, cooldownDays });
      return response.data;
    },
    onSuccess: () => {
      addToast('Application rejected.', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to reject application.';
      addToast(message, 'error');
    },
  });
};

// Fetch all creator uploaded wallpapers
export const useAdminCreatorUploads = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return useQuery({
    queryKey: ['admin', 'creator-uploads'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/creator-uploads');
      return response.data.data;
    },
    enabled: isAdmin,
  });
};

// Approve Creator Wallpaper Upload Mutation
export const useApproveCreatorWallpaper = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(`/api/admin/creator-uploads/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      addToast('Wallpaper approved successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'creator-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to approve wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Reject Creator Wallpaper Upload Mutation
export const useRejectCreatorWallpaper = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ id, rejectionNotes }) => {
      const response = await axios.put(`/api/admin/creator-uploads/${id}/reject`, { rejectionNotes });
      return response.data;
    },
    onSuccess: () => {
      addToast('Wallpaper rejected.', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'creator-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'wallpapers'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to reject wallpaper.';
      addToast(message, 'error');
    },
  });
};

// Suspend Creator Mutation
export const useSuspendCreator = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(`/api/admin/users/${id}/suspend-creator`);
      return response.data;
    },
    onSuccess: () => {
      addToast('Creator account suspended. All their uploads rejected.', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'creator-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to suspend creator.';
      addToast(message, 'error');
    },
  });
};
