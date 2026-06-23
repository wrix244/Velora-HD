import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, Check, AlertTriangle, ShieldCheck, Mail, Globe, User, Clock, ArrowRight, FileImage, LayoutDashboard } from 'lucide-react';
import { useBecomeCreator, useCreatorApplicationStatus } from '../hooks/useCreator';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';

export default function BecomeCreator() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);

  const { data: appStatus, isLoading: statusLoading } = useCreatorApplicationStatus();
  const becomeCreatorMutation = useBecomeCreator();

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [files, setFiles] = useState([]);
  
  // Checkbox States
  const [areOwnWallpapers, setAreOwnWallpapers] = useState(false);
  const [ownRights, setOwnRights] = useState(false);
  const [soldElsewhere, setSoldElsewhere] = useState(false);
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);

  // Auto-fill user email/name on mount if logged in
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate image format
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        addToast(`File ${file.name} is not an image. Only image uploads are allowed.`, 'error');
      }
      return isImage;
    });

    const totalFiles = [...files, ...validFiles];
    if (totalFiles.length > 5) {
      addToast('You can upload a maximum of 5 wallpapers.', 'warning');
      setFiles(totalFiles.slice(0, 5));
    } else {
      setFiles(totalFiles);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Cooldown calculation helper
  const getCooldownTimeRemaining = (cooldownUntil) => {
    if (!cooldownUntil) return null;
    const diff = new Date(cooldownUntil) - new Date();
    if (diff <= 0) return null;

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  // Validation Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isFormValid =
    fullName.trim() !== '' &&
    isEmailValid &&
    files.length >= 3 &&
    files.length <= 5 &&
    areOwnWallpapers &&
    ownRights &&
    copyrightConfirmed;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('portfolioLink', portfolioLink);
    
    // Append checkboxes as JSON string
    formData.append('answers', JSON.stringify({
      areOwnWallpapers,
      ownRights,
      soldElsewhere,
      copyrightConfirmed
    }));

    // Append files
    files.forEach((file) => {
      formData.append('wallpapers', file);
    });

    becomeCreatorMutation.mutate(formData);
  };

  // Guest view
  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 text-center min-h-[80vh] flex flex-col justify-center items-center space-y-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/20">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white leading-tight">
            Share Art. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Get Recognized.</span>
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            Become a creator on VeloraHD. Showcase your unique wallpapers to millions of users worldwide and earn premium payouts.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login?redirect=/become-creator"
            className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-2xl shadow-lg transition btn-glow flex items-center gap-2"
          >
            Sign In to Apply <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register?redirect=/become-creator"
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-2xl transition"
          >
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  // Already a Creator view
  if (user?.role === 'creator') {
    return (
      <div className="pt-28 pb-20 max-w-xl mx-auto px-4 text-center min-h-[80vh] flex flex-col justify-center items-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white">You are already a Creator!</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Welcome to the creative inner circle! You can upload, edit, and publish wallpapers directly from your dashboard.
          </p>
        </div>
        <Link
          to="/creator-dashboard"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" /> Go to Creator Dashboard
        </Link>
      </div>
    );
  }

  // Loading state
  if (statusLoading) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Pending Status View
  if (appStatus && appStatus.status === 'pending') {
    return (
      <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 min-h-[85vh] flex flex-col justify-center">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-white/5 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Application Status: Pending
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white mt-4">We are reviewing your request</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Thank you for applying! Our moderation team is currently reviewing your uploaded wallpapers. We will send an email update to <span className="text-primary font-semibold">{appStatus.email}</span> once a decision is made.
            </p>
          </div>
          
          <div className="border-t border-white/5 pt-6 text-left space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Submitted Artworks:</h4>
            <div className="grid grid-cols-3 gap-4">
              {appStatus.wallpapers?.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                  <img src={url} alt={`Submission ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rejected Active Cooldown View
  const cooldownDays = appStatus ? getCooldownTimeRemaining(user?.cooldownUntil) : null;
  if (appStatus && appStatus.status === 'rejected' && cooldownDays && cooldownDays > 0) {
    return (
      <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 min-h-[85vh] flex flex-col justify-center">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-rose-500/10 space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Application Status: Rejected
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white mt-4">Application Not Approved</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Our review team carefully checked your request, and unfortunately, it does not meet our guidelines at this time.
            </p>
          </div>

          {appStatus.rejectionNotes && (
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left max-w-md mx-auto">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Reviewer Feedback:</p>
              <p className="text-xs text-rose-200 mt-1 italic font-medium">"{appStatus.rejectionNotes}"</p>
            </div>
          )}

          <div className="border-t border-white/5 pt-6 max-w-md mx-auto flex items-center justify-center gap-2.5 text-xs text-gray-400">
            <Clock className="w-4 h-4 text-primary" />
            <span>You can reapply in <strong className="text-white">{cooldownDays} days</strong> (cooldown until {new Date(user?.cooldownUntil).toLocaleDateString()}).</span>
          </div>
        </div>
      </div>
    );
  }

  // Default Form View (User role = user, no pending app, and no active cooldown)
  return (
    <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 min-h-screen">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white">
          Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Creator</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Share your high-quality wallpapers with our community. Upload sample works and fill in the details below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-10 border-white/5 space-y-8">
        
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" /> Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. jane@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Portfolio */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" /> Portfolio Link <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="url"
            placeholder="e.g. https://behance.net/username"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* File upload */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileImage className="w-3.5 h-3.5 text-primary" /> Upload 3–5 Wallpaper Files <span className="text-rose-500">*</span>
          </label>

          <div className="relative border-2 border-dashed border-white/10 hover:border-primary/40 rounded-2xl p-8 text-center transition-all bg-white/2 cursor-pointer group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="w-8 h-8 text-gray-500 group-hover:text-primary transition-colors mx-auto mb-3" />
            <p className="text-xs font-bold text-white">Click or Drag & Drop to upload images</p>
            <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, WEBP formats up to 10MB each</p>
          </div>

          {/* Uploaded File Previews */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-4">Selected Files ({files.length}/5):</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate text-white font-medium">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-rose-400 hover:text-rose-300 font-bold px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && files.length < 3 && (
            <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Please upload at least 3 wallpapers (currently {files.length}).
            </p>
          )}
        </div>

        {/* Declarations */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Artistic Declarations</h3>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={areOwnWallpapers}
              onChange={(e) => setAreOwnWallpapers(e.target.checked)}
              className="mt-0.5 rounded border-white/10 text-primary focus:ring-primary focus:ring-offset-[#121212] bg-white/5"
            />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
              Are these wallpapers 100% created by you? <span className="text-rose-500">*</span>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={ownRights}
              onChange={(e) => setOwnRights(e.target.checked)}
              className="mt-0.5 rounded border-white/10 text-primary focus:ring-primary focus:ring-offset-[#121212] bg-white/5"
            />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
              Do you own the rights to upload these wallpapers? <span className="text-rose-500">*</span>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={soldElsewhere}
              onChange={(e) => setSoldElsewhere(e.target.checked)}
              className="mt-0.5 rounded border-white/10 text-primary focus:ring-primary focus:ring-offset-[#121212] bg-white/5"
            />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
              Have you sold or published them elsewhere? <span className="text-gray-500">(Disclosure only)</span>
            </span>
          </label>

          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl mt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={copyrightConfirmed}
                onChange={(e) => setCopyrightConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-white/10 text-primary focus:ring-primary focus:ring-offset-[#121212] bg-white/5"
              />
              <span className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors">
                I confirm that I own or have the legal rights to upload these artworks. Copyright violations may result in account suspension. <span className="text-rose-500">*</span>
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid || becomeCreatorMutation.isPending}
          className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center transition-all ${
            isFormValid && !becomeCreatorMutation.isPending
              ? 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 btn-glow cursor-pointer'
              : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
          }`}
        >
          {becomeCreatorMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Submitting Application...</span>
            </div>
          ) : (
            'Submit Creator Application'
          )}
        </button>

      </form>
    </div>
  );
}
