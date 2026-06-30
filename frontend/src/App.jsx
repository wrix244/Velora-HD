import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import usePWAStore from './store/pwaStore';
import useThemeStore from './store/themeStore';
import useUIStore from './store/uiStore';
import useAuthStore from './store/authStore';
import useFavoritesStore from './store/favoritesStore';
import useLikesStore from './store/likesStore';
import { getCookie } from './utils/cookies';

// Synchronous Page Import (for instant LCP rendering)
import Home from './pages/Home';

// Lazy Loaded Pages (Chunk split for speed)
const Explore = lazy(() => import('./pages/Explore'));
const Details = lazy(() => import('./pages/Details'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LiveDashboard = lazy(() => import('./pages/LiveDashboard'));
const BecomeCreator = lazy(() => import('./pages/BecomeCreator'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const About = lazy(() => import('./pages/About'));
const Refunds = lazy(() => import('./pages/Refunds'));
const AiPolicy = lazy(() => import('./pages/AiPolicy'));
const Copyright = lazy(() => import('./pages/Copyright'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Contact = lazy(() => import('./pages/Contact'));
const Faq = lazy(() => import('./pages/Faq'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Loaded Overlays
const ToastContainer = lazy(() => import('./components/common/ToastContainer'));
const InstallPrompt = lazy(() => import('./components/common/InstallPrompt'));
const CookieConsent = lazy(() => import('./components/common/CookieConsent'));

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

  // Defer Google Tag Manager loading by 3 seconds to ensure page interactivity first
  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-B6DKVHT422';
      document.body.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'G-B6DKVHT422');
    }, 3000);

    return () => clearTimeout(timer);
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
    <ReactLenis 
      root 
      options={{
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
        lerp: 0.12, // slightly higher value makes scroll catch up faster and feel snappier
        smoothWheel: true,
        wheelMultiplier: 1.0,
      }}
    >
      <div className="flex flex-col min-h-screen bg-bg-dark">
        {/* Route state scroll restorer */}
        <ScrollToTop />

        {/* Global Header Navigation */}
        <Navbar />

        {/* Primary Page Layout Portal */}
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/mobile" element={<Explore />} />
              <Route path="/pc" element={<Explore />} />
              <Route path="/premium" element={<Explore />} />
              <Route path="/wallpaper/:slug" element={<Details />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success/:slug" element={<Success />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<LiveDashboard />} />
              <Route path="/become-creator" element={<BecomeCreator />} />
              <Route path="/creator-dashboard" element={<CreatorDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/ai-policy" element={<AiPolicy />} />
              <Route path="/copyright" element={<Copyright />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Toast Notification Container */}
        <Suspense fallback={null}>
          <ToastContainer />
        </Suspense>

        {/* PWA Install Bottom Sheet */}
        <Suspense fallback={null}>
          <InstallPrompt />
        </Suspense>

        {/* Cookie Preferences Banner */}
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>

        {/* Global Footer */}
        <Footer />
      </div>
    </ReactLenis>
  );
}
