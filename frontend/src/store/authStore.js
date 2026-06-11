import { create } from 'zustand';
import axios from 'axios';

// Get initial values from localstorage
const initialToken = localStorage.getItem('token') || null;
const initialUser = JSON.parse(localStorage.getItem('user') || 'null');

// Setup default axios authorization header if token exists
if (initialToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

const useAuthStore = create((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,

  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    set({
      user: userData,
      token,
      isAuthenticated: true,
      loading: false,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  },

  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  setLoading: (isLoading) => {
    set({ loading: isLoading });
  },
}));

export default useAuthStore;
