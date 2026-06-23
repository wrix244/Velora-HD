import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ToastContainer from './components/common/ToastContainer';
import InstallPrompt from './components/common/InstallPrompt';
import CookieConsent from './components/common/CookieConsent';
import usePWAStore from './store/pwaStore';
import useThemeStore from './store/themeStore';
import useUIStore from './store/uiStore';
import useAuthStore from './store/authStore';
import useFavoritesStore from './store/favoritesStore';
import useLikesStore from './store/likesStore';
import { getCookie } from './utils/cookies';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Details from './pages/Details';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import LiveDashboard from './pages/LiveDashboard';
import BecomeCreator from './pages/BecomeCreator';
import CreatorDashboard from './pages/CreatorDashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Refunds from './pages/Refunds';
import AiPolicy from './pages/AiPolicy';
import Copyright from './pages/Copyright';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const location = useLocation();
  const initTheme = useThemeStore((s) => s.initTheme);
  const setDeferredPrompt = usePWAStore((s) => s.setDeferredPrompt);
  const setIsInstalled = usePWAStore((s) => s.setIsInstalled);
  const setShowInstallBanner = usePWAStore((s) => s.setShowInstallBanner);
  const setRecentlyViewed = useUIStore((s) => s.setRecentlyViewed);
  const logout = useAuthStore((s) => s.logout);

  // Setup Axios interceptor to catch 401 errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // If server returns 401, clear local stale auth cookies & reset authStore state
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // Initialize theme on app load
  useEffect(() => {
    initTheme();
  }, []);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setFavorites = useFavoritesStore((s) => s.setFavorites);
  const setLikes = useLikesStore((s) => s.setLikes);

  // Pre-load user favorites and likes on page load/mount if already authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated) {
        try {
          const favsRes = await axios.get('/api/favorites');
          setFavorites(favsRes.data.data);
        } catch (err) {
          console.error('Error pre-loading favorites:', err);
        }
        try {
          const likesRes = await axios.get('/api/likes');
          setLikes(likesRes.data.data);
        } catch (err) {
          console.error('Error pre-loading likes:', err);
        }
      }
    };
    loadUserData();
  }, [isAuthenticated, setFavorites, setLikes]);

  // Fetch resolved recently viewed wallpapers from backend if cookie exists
  useEffect(() => {
    const fetchRecentWallpapers = async () => {
      const recentCookie = getCookie('recentlyViewed');
      if (recentCookie) {
        try {
          const ids = JSON.parse(recentCookie);
          if (Array.isArray(ids) && ids.length > 0) {
            const res = await axios.get('/api/wallpapers/recent');
            if (res.data && res.data.success) {
              setRecentlyViewed(res.data.data);
            }
          }
        } catch (err) {
          console.error('Error resolving recently viewed wallpapers:', err);
        }
      }
    };
    fetchRecentWallpapers();
  }, [setRecentlyViewed]);

  // PWA installation prompt controller
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const dismissed = getCookie('dl_pwa_dismissed');
    const wasDismissedRecently = dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!wasDismissedRecently) {
        setTimeout(() => setShowInstallBanner(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [setDeferredPrompt, setIsInstalled, setShowInstallBanner]);

  const sessionId = useRef(
    sessionStorage.getItem('dl_session') || (() => {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('dl_session', id);
      return id;
    })()
  );

  // Global heartbeat — pings every 10s so the server knows this tab is alive
  useEffect(() => {
    const sendHeartbeat = () => {
      axios.post(`${API_URL}/api/stats/heartbeat`, {
        sessionId: sessionId.current,
        page: location.pathname,
      }).catch(() => {});
    };

    sendHeartbeat(); // send immediately
    const interval = setInterval(sendHeartbeat, 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      {/* Route state scroll restorer */}
      <ScrollToTop />

      {/* Global Header Navigation */}
      <Navbar />

      {/* Primary Page Layout Portal */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/wallpaper/:slug" element={<Details />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success/:slug" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<LiveDashboard />} />
          <Route path="/become-creator" element={<BecomeCreator />} />
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/ai-policy" element={<AiPolicy />} />
          <Route path="/copyright" element={<Copyright />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* PWA Install Bottom Sheet */}
      <InstallPrompt />

      {/* Cookie Preferences Banner */}
      <CookieConsent />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
