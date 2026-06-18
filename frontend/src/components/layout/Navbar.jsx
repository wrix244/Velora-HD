import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Heart, History, Sparkles, Monitor, Phone, Film, Activity, Download, Search, Sun, Moon } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import usePWAStore from '../../store/pwaStore';
import useThemeStore from '../../store/themeStore';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);
  const { isInstalled, installApp, deferredPrompt } = usePWAStore();
  const { theme, setTheme } = useThemeStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'PC', path: '/explore?deviceType=desktop', icon: <Monitor className="w-3.5 h-3.5" /> },
    { name: 'Mobile', path: '/explore?deviceType=mobile', icon: <Phone className="w-3.5 h-3.5" /> },
    { name: 'Live', path: '/explore?type=live', icon: <Film className="w-3.5 h-3.5" /> },
    { name: 'Premium', path: '/explore?isPremium=true', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-3.5 h-3.5" /> }] : []),
    ...(!isInstalled ? [{ name: 'App', onClick: handlePWAInstall, icon: <Download className="w-3.5 h-3.5" /> }] : []),
  ];

  return (
    <nav className="fixed top-0 inset-x-0 h-16 bg-surface border-b border-border z-50 transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-6">
        
        {/* Branding Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <img 
            src="/favicon.png" 
            alt="VeloraHD Logo" 
            className="w-8 h-8 rounded-lg object-contain bg-black border border-border transition-transform duration-300 group-hover:scale-105" 
          />
          <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-primary transition-colors">
            Velora<span className="text-primary">HD</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 py-1">
          {navLinks.map((link) => {
            if (link.onClick) {
              return (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-primary hover:text-primary/80 transition-all cursor-pointer flex-shrink-0"
                >
                  {link.icon}
                  {link.name}
                </button>
              );
            }
            const hasQuery = link.path.includes('?');
            const linkQuery = hasQuery ? link.path.split('?')[1] : '';
            const isActive = (location.pathname + location.search).includes(link.path);
            
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive: matchesPath }) => {
                  const active = matchesPath && ((hasQuery && location.search.substring(1) === linkQuery) || (!hasQuery && location.search === ''));
                  return `flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-all flex-shrink-0 ${
                    active
                      ? 'text-primary'
                      : 'text-text-muted hover:text-white'
                  }`;
                }}
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Desktop Search */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search art..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs clean-input"
          />
        </form>

        {/* Right side CTA / Actions */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-2 text-text-muted hover:text-white transition cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              {/* Profile dropdown trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-surface-2 border border-border hover:border-gray-500 transition-all text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center font-display font-bold text-white uppercase text-xs">
                  {user?.name?.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-none max-w-[80px] truncate">
                    {user?.name}
                  </p>
                  <p className="text-[9px] text-text-muted capitalize leading-none mt-0.5">
                    {user?.role}
                  </p>
                </div>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface border border-border shadow-xl py-1.5 z-50 text-xs">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-white hover:bg-surface-2 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/profile?tab=favorites"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-white hover:bg-surface-2 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>
                    <Link
                      to="/profile?tab=purchases"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-white hover:bg-surface-2 transition-colors"
                    >
                      <History className="w-4 h-4" />
                      Purchases
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-active hover:bg-primary/5 border-t border-border transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/5 border-t border-border transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-text-muted hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg text-text-muted hover:text-white transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="p-1 text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <>
          <div className="fixed inset-0 top-16 bg-black/60 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-surface border-l border-border z-50 p-4 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Mobile Search input */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search art..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs clean-input"
                />
              </form>

              {/* Nav links */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Browse Collections</h4>
                {navLinks.map((link) => {
                  if (link.onClick) {
                    return (
                      <button
                        key={link.name}
                        onClick={() => {
                          link.onClick();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2.5 text-xs font-semibold text-text-muted hover:text-white text-left w-full cursor-pointer py-1"
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
                      className={({ isActive: matchesPath }) => {
                        const active = matchesPath && (!link.path.includes('?') || location.search.substring(1) === link.path.split('?')[1]);
                        return `flex items-center gap-2.5 text-xs font-semibold transition-all py-1 ${
                          active ? 'text-primary' : 'text-text-muted hover:text-white'
                        }`;
                      }}
                    >
                      {link.icon}
                      {link.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Profile / Account actions in footer of drawer */}
            <div className="border-t border-border pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 px-1 py-1.5">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display font-bold text-white text-xs">
                      {user?.name?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white max-w-[120px] truncate">{user?.name}</p>
                      <p className="text-[10px] text-text-muted capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-xs text-text-muted hover:text-white py-1"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-xs text-primary hover:text-primary-active py-1 font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors text-left py-1"
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
                    className="w-full py-2 rounded-lg text-xs font-semibold text-center border border-border text-text-muted hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 rounded-lg text-xs font-semibold text-center bg-primary hover:bg-primary/90 text-white"
                  >
                    <span>Register</span>
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
