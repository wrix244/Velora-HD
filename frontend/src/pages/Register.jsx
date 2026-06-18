import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRegister, useGoogleLogin } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

export default function Register() {
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleCredentialResponse = (response) => {
    const idToken = response.credential;
    googleLoginMutation.mutate({ idToken });
  };

  useEffect(() => {
    // Dynamically inject the Google Sign-in client library when page mounts
    let script = document.getElementById('google-gsi-client');
    if (!script) {
      script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1085223847253-k1v38d4njs78a08dhnjg9854k41n926j.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
        });

        const container = document.getElementById('google-signin-button');
        const width = container ? Math.min(container.offsetWidth || 382, 382) : 382;

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'filled_black',
            size: 'large',
            width: width,
            text: 'signup_with', // Changed to signup_with for register page
            shape: 'rectangular',
          }
        );
        return true;
      }
      return false;
    };

    if (initGoogleSignIn()) return;

    const interval = setInterval(() => {
      if (initGoogleSignIn()) {
        clearInterval(interval);
      }
    }, 500);

    window.addEventListener('resize', initGoogleSignIn);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', initGoogleSignIn);
    };
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Theme-aware auth background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={theme === 'space' ? '/space-bg.webp' : '/graffiti-bg.webp'} 
          srcSet={
            theme === 'space'
              ? '/space-bg-mobile.webp 640w, /space-bg.webp 1024w'
              : '/graffiti-bg-mobile.webp 640w, /graffiti-bg.webp 1024w'
          }
          sizes="(max-width: 640px) 640px, 1024px"
          alt="" 
          className="w-full h-full object-cover" 
        />
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
              <span className="font-display font-black text-white text-xs">VH</span>
            </div>
            <span className="font-display font-black text-lg text-white">
              Velora<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">HD</span>
            </span>
          </Link>
          <h2 className="font-display font-black text-2xl text-white">Create Account</h2>
          <p className="text-xs text-gray-400">Join Velora HD and start organizing your wallpaper collections.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-[#1A1A1A]"
                required
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                id="email"
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
            <label htmlFor="password" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                id="password"
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
            disabled={registerMutation.isPending}
            className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-primary/10 transition flex items-center justify-center gap-2"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* OR separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Google Sign-In button container */}
        <div className="flex justify-center w-full">
          <div id="google-signin-button" className="w-full min-h-[44px]"></div>
        </div>

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
