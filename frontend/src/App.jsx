import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ToastContainer from './components/common/ToastContainer';
import InstallPrompt from './components/common/InstallPrompt';
import usePWAStore from './store/pwaStore';

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
import useThemeStore from './store/themeStore';

export default function App() {
  const location = useLocation();
  const initTheme = useThemeStore((s) => s.initTheme);
  const setDeferredPrompt = usePWAStore((s) => s.setDeferredPrompt);
  const setIsInstalled = usePWAStore((s) => s.setIsInstalled);
  const setShowInstallBanner = usePWAStore((s) => s.setShowInstallBanner);

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('dl_pwa_dismissed');
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
      axios.post('/api/stats/heartbeat', {
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
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* PWA Install Bottom Sheet */}
      <InstallPrompt />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
