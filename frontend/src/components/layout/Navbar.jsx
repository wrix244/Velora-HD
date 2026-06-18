import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Heart, History, Compass, Sparkles, Monitor, Phone, Film, Activity, Download, Search, Sun, Moon } from 'lucide-react';
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
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Mobile', path: '/explore?deviceType=mobile', icon: <Phone className="w-3.5 h-3.5" /> },
    { name: 'PC', path: '/explore?deviceType=desktop', icon: <Monitor className="w-3.5 h-3.5" /> },
    { name: 'Live', path: '/explore?type=live', icon: <Film className="w-3.5 h-3.5" /> },
    { name: 'Premium', path: '/explore?isPremium=true', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-3.5 h-3.5" /> }] : []),
    ...(!isInstalled ? [{ name: 'Install', onClick: handlePWAInstall, icon: <Download className="w-3.5 h-3.5" /> }] : []),
  ];

  return (
    <nav className="fixed top-0 inset-x-0 h-14 bg-bg-dark/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-black text-white text-xs">VH</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Velora<span className="text-primary">HD</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5 overflow-x-auto py-1 scrollbar-none">
          {navLinks.map((link) => {
            if (link.onClick) {
              return (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer flex-shrink-0"
                >
                  {link.icon}
                  {link.name}
                </button>
              );
            }
            const hasQuery = link.path.includes('?');
            const linkQuery = hasQuery ? link.path.split('?')[1] : '';
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
                    (isActive && location.search.substring(1) === linkQuery) || (isActive && !hasQuery && location.search === '')
                      ? 'text-white bg-surface'
                      : 'text-text-muted hover:text-white hover:bg-surface'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Desktop Search */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search wallpapers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs clean-input"
          />
        </form>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-lg bg-surface border border-border hover:border-zinc-500 transition-colors text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center font-display font-bold text-white uppercase text-[10px]">
                  {user?.name?.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-none max-w-[80px] truncate">
                    {user?.name}
                  </p>
                  <p className="text-[9px] text-text-muted capitalize leading-none mt-0.5">
                    {user?.role}
                  </p>
                </div>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface border border-border shadow-lg py-1.5 z-50 text-sm">
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
                        className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-surface-2 border-t border-border transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-surface-2 border-t border-border transition-colors text-left"
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
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg text-text-muted hover:text-white transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-1.5 text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div className="fixed inset-0 top-14 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-14 right-0 bottom-0 w-64 bg-surface border-l border-border z-50 p-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search wallpapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs clean-input"
                />
              </form>

              {/* Nav links */}
              <div className="flex flex-col gap-0.5">
                {navLinks.map((link) => {
                  if (link.onClick) {
                    return (
                      <button
                        key={link.name}
                        onClick={() => {
                          link.onClick();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-surface-2 transition-colors text-left w-full cursor-pointer"
                      >
                        {link.icon}
                        {link.name}
                      </button>
                    );
                  }
                  const hasQuery = link.path.includes('?');
                  const linkQuery = hasQuery ? link.path.split('?')[1] : '';
                  return (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          (isActive && location.search.substring(1) === linkQuery) || (isActive && !hasQuery && location.search === '')
                            ? 'text-white bg-surface-2'
                            : 'text-text-muted hover:text-white hover:bg-surface-2'
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

            {/* Bottom: Profile / Auth */}
            <div className="border-t border-border pt-4">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center font-display font-bold text-white text-xs">
                      {user?.name?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white max-w-[120px] truncate">{user?.name}</p>
                      <p className="text-[10px] text-text-muted capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-white hover:bg-surface-2 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-primary hover:bg-surface-2 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-surface-2 transition-colors text-left"
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
                    className="w-full py-2.5 rounded-lg text-sm font-medium text-center border border-border text-text-muted hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-lg text-sm font-medium text-center bg-primary hover:bg-primary/90 text-white transition-colors"
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
