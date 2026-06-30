import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useForgotPassword } from '../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md p-8 rounded-3xl card space-y-6 relative z-10 shadow-lg">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-1.5 justify-center">
            <img 
              src="/favicon.png" 
              alt="VeloraHD Logo" 
              className="w-7 h-7 rounded object-contain bg-black border border-border" 
            />
            <span className="font-display font-black text-lg text-white">
              Velora<span className="text-primary">HD</span>
            </span>
          </Link>
          <h2 className="font-display font-black text-2xl text-white">Recover Password</h2>
          <p className="text-xs text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {forgotPasswordMutation.isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Send className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Email Sent!</h3>
              <p className="text-xs text-gray-400">
                Please check your inbox at <span className="font-semibold text-white">{email}</span> for your password reset link.
              </p>
            </div>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Email Address
              </label>
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
                  disabled={forgotPasswordMutation.isPending}
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{forgotPasswordMutation.isPending ? 'Sending Link...' : 'Send Reset Link'}</span>
            </button>

            {/* Back to Login link */}
            <div className="pt-2 text-center text-xs text-gray-400 border-t border-border">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
              >
                Back to Login
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
