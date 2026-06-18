import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useLogin, useGoogleLogin } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();

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
            text: 'signin_with',
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md p-8 card rounded-3xl space-y-6 relative z-10 shadow-lg">
        
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
          <h2 className="font-display font-black text-2xl text-white">Welcome Back</h2>
          <p className="text-xs text-gray-400">Log in to manage your favorites, download history, and purchases.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
                className="w-full pl-10 pr-4 py-2.5 text-sm clean-input focus:bg-surface-2"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm clean-input focus:bg-surface-2"
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* OR separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Google Sign-In button container */}
        <div className="flex justify-center w-full">
          <div id="google-signin-button" className="w-full min-h-[44px]"></div>
        </div>

        {/* Redirect toggle */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-border">
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
