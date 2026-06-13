import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Heart, History, Compass, Sparkles, Monitor, Phone, Film, Activity, Download } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import usePWAStore from '../../store/pwaStore';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);
  const { isInstalled, installApp, deferredPrompt } = usePWAStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      await installApp();
    } else {
      addToast("To install, tap your browser's share/menu button, then select 'Add to Home Screen'.", "info");
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/');
    setDropdownOpen(false);
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Mobile', path: '/explore?deviceType=mobile', icon: <Phone className="w-3.5 h-3.5" /> },
    { name: 'PC', path: '/explore?deviceType=desktop', icon: <Monitor className="w-3.5 h-3.5" /> },
    { name: 'Live', path: '/explore?type=live', icon: <Film className="w-3.5 h-3.5" /> },
    { name: 'Premium', path: '/explore?isPremium=true', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-3.5 h-3.5" /> }] : []),
    ...(!isInstalled ? [{ name: 'Add to Home Screen', onClick: handlePWAInstall, icon: <Download className="w-3.5 h-3.5" /> }] : []),
  ];

  return (
    <nav className="fixed top-0 inset-x-0 h-16 glass-panel border-b border-white/5 z-50 transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Branding Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            <span className="font-display font-black text-white text-base">VH</span>
          </div>
          <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-primary transition-colors">
            Velora<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">HD</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.onClick) {
              return (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all text-accent hover:text-accent-active border border-accent/20 bg-accent/5 hover:bg-accent/10 cursor-pointer"
                >
                  {link.icon}
                  {link.name}
                </button>
              );
            }
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    (isActive && location.search === link.path.split('?')[1]) || (isActive && !link.path.includes('?'))
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-300 hover:text-white border border-transparent hover:bg-white/5'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Right side CTA / Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              {/* Profile dropdown trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-[#1A1A1A] border border-white/5 hover:border-white/15 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center font-display font-bold text-[#121212] uppercase text-xs">
                  {user?.name?.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-none max-w-[80px] truncate">
                    {user?.name}
                  </p>
                  <p className="text-[9px] text-gray-400 capitalize leading-none mt-0.5">
                    {user?.role}
                  </p>
                </div>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel-glow border-white/10 shadow-xl py-1.5 z-50 text-sm">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/profile?tab=favorites"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>
                    <Link
                      to="/profile?tab=purchases"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <History className="w-4 h-4" />
                      Purchases
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-active hover:bg-primary/5 border-t border-white/5 transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/5 border-t border-white/5 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/10 transition-colors btn-glow"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div className="fixed inset-0 top-16 bg-[#121212]/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 right-0 bottom-0 w-64 glass-panel border-l border-white/10 z-50 p-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Nav links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  if (link.onClick) {
                    return (
                      <button
                        key={link.name}
                        onClick={() => {
                          link.onClick();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-accent hover:text-accent-active border border-accent/20 bg-accent/5 hover:bg-accent/10 text-left w-full cursor-pointer"
                      >
                        {link.icon}
                        {link.name}
                      </button>
                    );
                  }
                  return (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          (isActive && location.search === link.path.split('?')[1]) || (isActive && !link.path.includes('?'))
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      {link.icon}
                      {link.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Profile / CTAs */}
            <div className="border-t border-white/5 pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display font-bold text-white text-xs">
                      {user?.name?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white max-w-[120px] truncate">{user?.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-primary hover:bg-primary/5 transition-colors font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/5 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-center border border-white/10 text-gray-300 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-primary hover:bg-primary/90 text-white shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
