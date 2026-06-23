import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, Heart, Bookmark, ShoppingBag, Download, Settings, Lock, Mail, ArrowRight, ShieldAlert, Check, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile, useUpdateProfile, useDeleteProfile } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { usePurchaseHistory } from '../hooks/usePurchases';
import { useDownloadHistory } from '../hooks/useDownloads';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';

const avatarPresets = [
  {
    category: 'Anime / Manga',
    icons: [
      { name: 'Goku Style', url: '/avatars/anime.png' },
      { name: 'Cyberpunk Girl', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&h=150&fit=crop&q=80' },
      { name: 'Synthwave Boy', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&q=80' },
      { name: 'Neon Samurai', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&h=150&fit=crop&q=80' }
    ]
  },
  {
    category: 'DC Characters / Comics',
    icons: [
      { name: 'Dark Knight', url: '/avatars/dc.png' },
      { name: 'Joker Style', url: 'https://images.unsplash.com/photo-1601513525393-8b5e9f1a268a?w=150&h=150&fit=crop&q=80' },
      { name: 'Red Spidermask', url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=150&h=150&fit=crop&q=80' },
      { name: 'Cyber Hero', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&h=150&fit=crop&q=80' }
    ]
  },
  {
    category: '3D Render / Sci-Fi',
    icons: [
      { name: 'Astronaut', url: '/avatars/3d.png' },
      { name: 'Cyber Mech', url: '/avatars/ninja.png' },
      { name: 'Synth Cyborg', url: 'https://images.unsplash.com/photo-1618005198143-e528346d9a59?w=150&h=150&fit=crop&q=80' },
      { name: 'Minimal Render', url: 'https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=150&h=150&fit=crop&q=80' }
    ]
  },
  {
    category: 'Classic / Pop Art',
    icons: [
      { name: 'Pixel Gamer', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&h=150&fit=crop&q=80' },
      { name: 'Minimal Portrait', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80' },
      { name: 'Retro Gamer', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&q=80' },
      { name: 'Statue Art', url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=150&h=150&fit=crop&q=80' }
    ]
  }
];

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToast = useUIStore((state) => state.addToast);

  const activeTab = searchParams.get('tab') || 'favorites';

  // Auth check on mount
  useEffect(() => {
    if (!isAuthenticated) {
      addToast('Please login to view your profile.', 'info');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, addToast]);

  // Queries
  const { data: profile } = useProfile();
  const { data: favorites, isLoading: favsLoading } = useFavorites();
  const { data: purchases, isLoading: purchasesLoading } = usePurchaseHistory();
  const { data: downloads, isLoading: downloadsLoading } = useDownloadHistory();

  // Settings form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const updateProfileMutation = useUpdateProfile();
  const deleteProfileMutation = useDeleteProfile();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleAvatarSelect = (avatarUrl) => {
    updateProfileMutation.mutate(
      { name, email, profilePicture: avatarUrl },
      {
        onSuccess: () => {
          setShowAvatarModal(false);
        }
      }
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeleteConfirmText('');
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText === 'DELETE') {
      deleteProfileMutation.mutate(null, {
        onSuccess: () => {
          setShowDeleteModal(false);
          navigate('/');
        }
      });
    }
  };

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    updateProfileMutation.mutate(
      { name, email, password: password || undefined },
      {
        onSuccess: () => {
          setPassword('');
          setConfirmPassword('');
        },
      }
    );
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'purchases', label: 'Purchases', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'downloads', label: 'Downloads Log', icon: <Download className="w-4 h-4" /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* Profile Banner */}
      <div className="p-8 rounded-3xl bg-surface border border-border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-4">
          {/* Interactive Profile Pic */}
          <div 
            onClick={() => setShowAvatarModal(true)}
            className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border bg-surface-2 flex-shrink-0 cursor-pointer group/banner-avatar shadow-lg animate-fade-in"
            title="Click to change profile icon"
          >
            {profile?.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt={profile.name} 
                className="w-full h-full object-cover transition-transform group-hover/banner-avatar:scale-105 duration-300" 
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center font-display font-black text-black text-2xl uppercase">
                {profile?.name?.slice(0, 2) || 'DL'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/banner-avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold">
              <Camera className="w-4 h-4 mb-0.5" />
              <span>Change</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl text-white">
              {profile?.name || 'User Profile'}
            </h1>
            <p className="text-xs text-text-muted">
              {profile?.email} • Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {profile?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="px-5 py-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/20 text-primary font-semibold rounded-xl text-xs transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <ShieldAlert className="w-4 h-4" />
            Go to Admin Dashboard
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Tab controls */}
        <div className="lg:col-span-3 p-4 rounded-2xl card flex flex-col gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeTab === tab.id
                  ? 'bg-primary text-white font-black shadow-lg shadow-primary/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-lg text-white">My Favorite Wallpapers</h2>
              
              {favsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : !favorites || favorites.length === 0 ? (
                <div className="p-16 rounded-2xl card text-center flex flex-col items-center justify-center space-y-4">
                  <Bookmark className="w-10 h-10 text-gray-600 animate-pulse" />
                  <h3 className="font-display font-bold text-base text-white">Your favorites folder is empty</h3>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Browse the collections and click the bookmark icon on any design to save it here.
                  </p>
                  <button
                    onClick={() => navigate('/explore')}
                    className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl"
                  >
                    <span>Browse Collections</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {favorites.map((wp) => (
                    <WallpaperCard
                      key={`fav-${wp._id}`}
                      wallpaper={wp}
                      purchased={purchases?.some((p) => p.wallpaperId?._id === wp._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Purchases */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-lg text-white">Purchased Premium Licenses</h2>
              
              {purchasesLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : !purchases || purchases.length === 0 ? (
                <div className="p-16 rounded-2xl card text-center flex flex-col items-center justify-center space-y-4">
                  <ShoppingBag className="w-10 h-10 text-gray-600 animate-pulse" />
                  <h3 className="font-display font-bold text-base text-white">No purchased wallpapers</h3>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Premium layouts you buy via mock checkout will show up here for lifetime unlimited downloads.
                  </p>
                  <button
                    onClick={() => navigate('/explore?isPremium=true')}
                    className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl"
                  >
                    <span>Explore Premium Layouts</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {purchases.map((p) =>
                    p.wallpaperId ? (
                      <WallpaperCard key={`purchased-${p._id}`} wallpaper={p.wallpaperId} purchased={true} />
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Downloads Log */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-lg text-white">Downloads History</h2>
              
              {downloadsLoading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-14 bg-surface-2 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : !downloads || downloads.length === 0 ? (
                <div className="p-16 rounded-2xl card text-center flex flex-col items-center justify-center space-y-4">
                  <Download className="w-10 h-10 text-gray-600 animate-pulse" />
                  <h3 className="font-display font-bold text-base text-white">No downloads recorded</h3>
                  <p className="text-xs text-gray-400 max-w-xs">
                    Once you start downloading static or motion loops, they will be logged here.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="bg-white/2 text-gray-400 font-semibold border-b border-white/5">
                        <th className="p-4">Wallpaper</th>
                        <th className="p-4">Resolution</th>
                        <th className="p-4">Format</th>
                        <th className="p-4">Downloaded At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {downloads.map((d) => (
                        <tr key={d._id} className="hover:bg-white/2 transition">
                          <td className="p-4">
                            {d.wallpaperId ? (
                              <Link
                                to={`/wallpaper/${d.wallpaperId.slug}`}
                                className="font-semibold text-white hover:text-primary transition"
                              >
                                {d.wallpaperId.title}
                              </Link>
                            ) : (
                              <span className="text-gray-500 italic">Deleted Wallpaper</span>
                            )}
                          </td>
                          <td className="p-4">{d.wallpaperId?.resolution || 'N/A'}</td>
                          <td className="p-4 capitalize">{d.wallpaperId?.type || 'N/A'}</td>
                          <td className="p-4 text-gray-500">
                            {new Date(d.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Account Settings */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-2xl card space-y-6 max-w-xl">
              <h2 className="font-display font-bold text-lg text-white border-b border-border pb-3 flex items-center gap-1.5">
                <Settings className="w-5 h-5 text-primary" />
                Update Profile Settings
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Avatar Picker Preview */}
                <div className="flex items-center gap-4 border-b border-border pb-4 mb-4">
                  {profile?.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="" 
                      className="w-14 h-14 rounded-xl object-cover border border-border animate-fade-in" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center font-display font-black text-black text-lg uppercase">
                      {profile?.name?.slice(0, 2) || 'DL'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">Profile Icon</p>
                    <button
                      type="button"
                      onClick={() => setShowAvatarModal(true)}
                      className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-wide mt-1 cursor-pointer"
                    >
                      Choose cool character icon →
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm clean-input focus:bg-surface-2"
                      required
                    />
                  </div>
                </div>

                {/* Email (Read Only for safety/mocking or allow change) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm clean-input focus:bg-surface-2"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">New Password (Optional)</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm clean-input focus:bg-surface-2"
                    />
                  </div>
                </div>

                {/* Confirm Password field */}
                {password && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm clean-input focus:bg-surface-2"
                        required={!!password}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition"
                >
                  <span>{updateProfileMutation.isPending ? 'Updating...' : 'Save Settings'}</span>
                </button>
              </form>

              {/* Danger Zone */}
              <div className="border-t border-white/5 pt-6 mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-rose-500">Danger Zone</h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Once you delete your account, your favorites, purchases, and download history will be permanently erased. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteProfileMutation.isPending}
                  className="px-5 py-2.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/25 text-rose-500 hover:text-rose-400 font-bold text-xs tracking-wider uppercase rounded-xl transition cursor-pointer"
                >
                  {deleteProfileMutation.isPending ? 'Deleting...' : 'Delete Account Permanently'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Custom Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-md bg-[#161618] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">Delete Account</h3>
                <p className="text-[10px] text-rose-400 uppercase tracking-widest font-bold">This action cannot be undone</p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="space-y-2 text-xs text-gray-400 leading-relaxed bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="font-semibold text-rose-400">WARNING: You are about to permanently delete your VeloraHD account.</p>
              <p>Once deleted, all of your associated records, including:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] pl-1 font-semibold text-white">
                <li>Saved favorite wallpapers</li>
                <li>Purchase history & transaction logs</li>
                <li>Download history & looping files</li>
              </ul>
              <p className="mt-2 text-gray-500">will be permanently erased from our databases.</p>
            </div>

            {/* Double Confirmation Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                To confirm deletion, please type <span className="text-rose-500 font-black">DELETE</span> below:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-white/[0.03] border border-white/10 focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 outline-none transition-all font-mono tracking-wider text-center"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteConfirmText !== 'DELETE' || deleteProfileMutation.isPending}
                className={`px-4 py-2.5 font-bold text-xs tracking-wider uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                    : 'bg-rose-950/20 border border-rose-950/30 text-rose-500/40 cursor-not-allowed'
                }`}
              >
                {deleteProfileMutation.isPending ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-surface border border-border p-6 rounded-3xl max-w-md w-full space-y-6 shadow-2xl relative max-h-[80vh] overflow-y-auto"
              data-lenis-prevent
            >
              {/* Close button */}
              <button
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:text-white hover:bg-surface-2 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 border-b border-border pb-3">
                <h3 className="text-base font-display font-black text-white">Choose Profile Avatar</h3>
                <p className="text-text-muted text-xs">
                  Pick from our collection of anime, comic book, 3D, and pop culture characters.
                </p>
              </div>

              <div className="space-y-6">
                {avatarPresets.map((group) => (
                  <div key={group.category} className="space-y-3">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">{group.category}</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {group.icons.map((avatar) => {
                        const isSelected = profile?.profilePicture === avatar.url;
                        return (
                          <button
                            key={avatar.name}
                            type="button"
                            onClick={() => handleAvatarSelect(avatar.url)}
                            className={`relative aspect-square rounded-2xl overflow-hidden border transition-all cursor-pointer group/avatar ${
                              isSelected
                                ? 'border-primary scale-98 shadow-md shadow-primary/10'
                                : 'border-border hover:border-gray-500 hover:scale-102'
                            }`}
                          >
                            <img
                              src={avatar.url}
                              alt={avatar.name}
                              className="w-full h-full object-cover"
                            />
                            {/* Hover info badge */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center p-1 text-[8px] font-bold text-white text-center leading-tight">
                              {avatar.name}
                            </div>
                            {/* Selected Indicator */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-black" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
