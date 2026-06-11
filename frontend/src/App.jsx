import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ToastContainer from './components/common/ToastContainer';

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

export default function App() {
  const location = useLocation();
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

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
