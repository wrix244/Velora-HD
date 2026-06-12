import { create } from 'zustand';
import axios from 'axios';
import { getCookie, setCookie, eraseCookie } from '../utils/cookies';

// Get initial values from cookies
const initialToken = getCookie('token') || null;
const initialUser = JSON.parse(getCookie('user') || 'null');

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
    // Cookie expires in 7 days
    setCookie('token', token, 7);
    setCookie('user', JSON.stringify(userData), 7);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    set({
      user: userData,
      token,
      isAuthenticated: true,
      loading: false,
    });
  },

  logout: () => {
    eraseCookie('token');
    eraseCookie('user');
    delete axios.defaults.headers.common['Authorization'];
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  },

  updateUser: (userData) => {
    setCookie('user', JSON.stringify(userData), 7);
    set({ user: userData });
  },

  setLoading: (isLoading) => {
    set({ loading: isLoading });
  },
}));

export default useAuthStore;
