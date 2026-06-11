import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19]">
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
