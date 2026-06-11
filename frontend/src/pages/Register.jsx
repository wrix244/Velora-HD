import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRegister } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const registerMutation = useRegister();

  const [name, setName] = useState('');
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
    if (!name || !email || !password) return;
    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] flex items-center justify-center px-4 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

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
          <h2 className="font-display font-black text-2xl text-white">Create Account</h2>
          <p className="text-xs text-gray-400">Join Dream Lens and start organizing your wallpaper collections.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-slate-900"
                required
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-slate-900"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-slate-900"
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-primary/10 transition flex items-center justify-center gap-2"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* Redirect toggle */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5">
            Log In here
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
