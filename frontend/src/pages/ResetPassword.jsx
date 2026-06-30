import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useResetPassword } from '../hooks/useAuth';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const passwordInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    resetPasswordMutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        },
      }
    );
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
          <h2 className="font-display font-black text-2xl text-white">Reset Password</h2>
          <p className="text-xs text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        {resetPasswordMutation.isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Password Updated!</h3>
              <p className="text-xs text-gray-400">
                Your password has been reset successfully. Redirecting you to login...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {validationError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold">
                {validationError}
              </div>
            )}

            {/* New Password input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm clean-input focus:bg-surface-2"
                  required
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    setTimeout(() => passwordInputRef.current?.focus(), 0);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm clean-input focus:bg-surface-2"
                  required
                  disabled={resetPasswordMutation.isPending}
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{resetPasswordMutation.isPending ? 'Resetting Password...' : 'Save New Password'}</span>
            </button>

            {/* Back to Login link */}
            <div className="pt-2 text-center text-xs text-gray-400 border-t border-border">
              Cancel reset?{' '}
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
