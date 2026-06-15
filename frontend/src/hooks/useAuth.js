import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import useFavoritesStore from '../store/favoritesStore';

// User Login Hook
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const addToast = useUIStore((state) => state.addToast);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post('/api/auth/login', { email, password });
      return response.data;
    },
    onSuccess: async (data) => {
      login(data.data, data.data.token);
      addToast(`Welcome back, ${data.data.name}!`, 'success');
      
      // Load user favorites on success
      try {
        const favsRes = await axios.get('/api/favorites');
        setFavorites(favsRes.data.data);
      } catch (err) {
        console.warn('Failed to pre-load favorites on login:', err.message);
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(message, 'error');
    },
  });
};

// Google Login Hook
export const useGoogleLogin = () => {
  const login = useAuthStore((state) => state.login);
  const addToast = useUIStore((state) => state.addToast);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);

  return useMutation({
    mutationFn: async ({ idToken }) => {
      const response = await axios.post('/api/auth/google', { idToken });
      return response.data;
    },
    onSuccess: async (data) => {
      login(data.data, data.data.token);
      addToast(`Welcome back, ${data.data.name}!`, 'success');
      
      // Load user favorites on success
      try {
        const favsRes = await axios.get('/api/favorites');
        setFavorites(favsRes.data.data);
      } catch (err) {
        console.warn('Failed to pre-load favorites on login:', err.message);
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Google authentication failed. Please try again.';
      addToast(message, 'error');
    },
  });
};

// User Registration Hook
export const useRegister = () => {
  const login = useAuthStore((state) => state.login);
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const response = await axios.post('/api/auth/register', { name, email, password });
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data, data.data.token);
      addToast(`Account created! Welcome, ${data.data.name}.`, 'success');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Registration failed. Try again.';
      addToast(message, 'error');
    },
  });
};

// Profile Update Hook
export const useUpdateProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const login = useAuthStore((state) => state.login);
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const response = await axios.put('/api/auth/profile', { name, email, password });
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data.data);
      // Re-trigger token settings if new token returned
      if (data.data.token) {
        login(data.data, data.data.token);
      }
      addToast('Profile updated successfully!', 'success');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update profile.';
      addToast(message, 'error');
    },
  });
};

// Get current profile hook
export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios.get('/api/auth/me');
      return response.data.data;
    },
    enabled: isAuthenticated,
  });
};

// Delete profile/account hook
export const useDeleteProfile = () => {
  const logout = useAuthStore((state) => state.logout);
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete('/api/auth/profile');
      return response.data;
    },
    onSuccess: (data) => {
      logout();
      addToast(data.message || 'Account deleted successfully.', 'success');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete account.';
      addToast(message, 'error');
    },
  });
};
