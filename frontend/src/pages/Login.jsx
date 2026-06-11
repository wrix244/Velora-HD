import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

export default function Login() {
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Theme-aware auth background */}
      <div className="absolute inset-0 z-0">
        <img src={theme === 'space' ? '/space-bg.png' : '/graffiti-bg.png'} alt="" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${theme === 'space' ? 'bg-[#0B0F19]/70' : 'bg-[#121212]/75'}`} />
        <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'space' ? 'from-[#0B0F19] via-transparent to-[#0B0F19]/80' : 'from-[#121212] via-transparent to-[#121212]/80'}`} />
      </div>

      {/* Neon glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/8 blur-[100px] pointer-events-none z-0" />

      <div className="w-full max-w-md p-8 rounded-3xl glass-panel space-y-6 relative z-10 shadow-2xl">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-1.5 justify-center">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
              <span className="font-display font-black text-white text-xs">DL</span>
            </div>
            <span className="font-display font-black text-lg text-white">
              Dream<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Lens</span>
            </span>
          </Link>
          <h2 className="font-display font-black text-2xl text-white">Welcome Back</h2>
          <p className="text-xs text-gray-400">Log in to manage your favorites, download history, and purchases.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-[#1A1A1A]"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-[#1A1A1A]"
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-primary/10 transition flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Redirect toggle */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/5">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5">
            Register Account
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
