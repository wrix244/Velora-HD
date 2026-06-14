import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

// Fetch user purchases
export const usePurchaseHistory = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await axios.get('/api/purchases/history');
      return response.data.data;
    },
    enabled: isAuthenticated,
  });
};

// Checkout/Purchase Wallpaper
export const useCheckout = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async ({ wallpaperId, cardHolder, cardNumber, expiry, cvv }) => {
      const response = await axios.post('/api/purchases/checkout', {
        wallpaperId,
        cardHolder,
        cardNumber,
        expiry,
        cvv,
      });
      return response.data;
    },
    onSuccess: (data) => {
      addToast('Payment successful! Wallpaper unlocked.', 'success');
      // Invalidate queries to refresh lock statuses and dashboard analytics
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpaper'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Payment failed. Please verify your details.';
      addToast(message, 'error');
    },
  });
};

// Unlock Wallpaper via Ad
export const useAdUnlock = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (wallpaperId) => {
      const response = await axios.post('/api/purchases/ad-unlock', { wallpaperId });
      return response.data;
    },
    onSuccess: (data) => {
      addToast('Ad watched successfully! Wallpaper unlocked.', 'success');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
      queryClient.invalidateQueries({ queryKey: ['wallpaper'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Ad unlock failed. Please try again.';
      addToast(message, 'error');
    },
  });
};
