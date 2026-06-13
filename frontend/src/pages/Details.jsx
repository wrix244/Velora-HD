import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Download, Lock, Check, Calendar, ArrowLeft, Image, Share2, Info, Monitor, Smartphone, X, Edit, Trash2 } from 'lucide-react';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { useWallpaperBySlug, useRelatedWallpapers } from '../hooks/useWallpapers';
import { useToggleFavorite } from '../hooks/useFavorites';
import { useRecordDownload } from '../hooks/useDownloads';
import { usePurchaseHistory } from '../hooks/usePurchases';
import { useDeleteWallpaper } from '../hooks/useAdmin';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';
import useUIStore from '../store/uiStore';
import LivePlayer from '../components/common/LivePlayer';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';

const Wallpaper = registerPlugin('Wallpaper');

export default function Details() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const addRecentlyViewed = useUIStore((state) => state.addRecentlyViewed);
  const addToast = useUIStore((state) => state.addToast);

  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedOS, setSelectedOS] = useState('windows');

  const detectOS = () => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
    if (/android/i.test(ua)) return 'android';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'mac';
    if (/Windows/i.test(ua)) return 'windows';
    return 'windows';
  };

  const handleOpenInstructions = () => {
    setSelectedOS(detectOS());
    setShowInstructions(true);
  };

  const [settingWallpaper, setSettingWallpaper] = useState(false);

  const handleSetNativeWallpaper = async (location) => {
    setSettingWallpaper(true);
    addToast('Downloading image stream...', 'info');

    try {
      const response = await fetch(wallpaper.downloadFile);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          addToast('Applying design natively...', 'info');
          const res = await Wallpaper.setWallpaper({ base64, location });
          if (res.success) {
            addToast('Wallpaper applied successfully!', 'success');
          }
        } catch (err) {
          console.error(err);
          addToast(err.message || 'Failed to apply wallpaper.', 'error');
        } finally {
          setSettingWallpaper(false);
          setShowInstructions(false);
        }
      };
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch wallpaper image.', 'error');
      setSettingWallpaper(false);
    }
  };

  // Queries
  const { data: wallpaper, isLoading, error } = useWallpaperBySlug(slug);
  const { data: related, isLoading: relatedLoading } = useRelatedWallpapers(wallpaper?._id);
  const { data: purchases } = usePurchaseHistory();

  // Favoriting & Downloading Mutations
  const isFavorite = useFavoritesStore((state) => state.isFavorite(wallpaper?._id));
  const toggleFavMutation = useToggleFavorite();
  const recordDownloadMutation = useRecordDownload();
  const deleteMutation = useDeleteWallpaper();

  // Synced purchases check
  const purchased = purchases ? purchases.some((p) => p.wallpaperId?._id === wallpaper?._id) : false;
  const hasAccess = !wallpaper?.isPremium || user?.role === 'admin' || purchased;

  // Add to recently viewed on mount/successful wallpaper fetch
  useEffect(() => {
    if (wallpaper) {
      addRecentlyViewed(wallpaper);
    }
  }, [wallpaper, addRecentlyViewed]);

  const handleFavorite = () => {
    if (!isAuthenticated) {
      addToast('Please login to like wallpapers.', 'info');
      navigate('/login');
      return;
    }
    toggleFavMutation.mutate(wallpaper);
  };

  const handleAction = () => {
    if (!isAuthenticated && wallpaper.isPremium) {
      addToast('Please register or login to purchase premium wallpapers.', 'info');
      navigate('/login');
      return;
    }

    if (wallpaper.isPremium && !hasAccess) {
      navigate(`/checkout?wallpaperId=${wallpaper._id}`);
      return;
    }

    // Free or purchased
    recordDownloadMutation.mutate(wallpaper);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  const handleEdit = () => {
    navigate('/admin', { state: { editWallpaper: wallpaper } });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this wallpaper?')) {
      deleteMutation.mutate(wallpaper._id, {
        onSuccess: () => {
          navigate('/explore');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-6 w-24 bg-[#1A1A1A] rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 aspect-video rounded-3xl bg-[#1A1A1A]" />
          <div className="lg:col-span-4 h-96 rounded-3xl bg-[#1A1A1A]" />
        </div>
      </div>
    );
  }

  if (error || !wallpaper) {
    return (
      <div className="pt-20 pb-16 text-center max-w-md mx-auto space-y-4">
        <Info className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-display font-bold text-xl text-white">Wallpaper Not Found</h2>
        <p className="text-xs text-gray-400">
          The requested wallpaper does not exist or has been removed by the administrator.
        </p>
        <Link to="/explore" className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl inline-block">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Large Preview Frame */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden glass-panel border-white/10 relative shadow-2xl flex items-center justify-center bg-[#121212]">
          {wallpaper.type === 'live' ? (
            <div className="w-full aspect-[16/10] max-h-[70vh]">
              <LivePlayer
                src={wallpaper.downloadFile}
                poster={wallpaper.previewImage}
                autoplay={true}
                hoverToPlay={false}
                className="w-full h-full"
              />
            </div>
          ) : (
            <img
              src={wallpaper.downloadFile}
              alt={wallpaper.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}

          {/* Absolute labels */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2.5 py-1 text-[10px] font-bold bg-[#121212]/80 text-white rounded-full tracking-wide backdrop-blur-sm border border-white/5 uppercase">
              {wallpaper.type}
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-[#121212]/80 text-white rounded-full tracking-wide backdrop-blur-sm border border-white/5 uppercase">
              {wallpaper.deviceType}
            </span>
          </div>
        </div>

        {/* Right: Info Sidebar Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
              {wallpaper.category}
            </span>
            <h1 className="font-display font-black text-2xl md:text-3xl text-white leading-tight">
              {wallpaper.title}
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed pt-2 whitespace-pre-wrap break-words">
              {wallpaper.description || 'No description provided for this artwork.'}
            </p>
            {user?.role === 'admin' && (
              <div className="flex gap-2 pt-4 border-t border-white/5 mt-2">
                <button
                  onClick={handleEdit}
                  className="flex-grow py-2.5 px-4 bg-primary/10 hover:bg-primary/25 border border-primary/20 hover:border-primary/40 text-primary text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Wallpaper
                </button>
                <button
                  onClick={handleDelete}
                  className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Asset Stats details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 text-center">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Downloads</p>
              <p className="font-display font-bold text-lg text-white mt-0.5">{wallpaper.downloads || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Likes</p>
              <p className="font-display font-bold text-lg text-white mt-0.5">{wallpaper.likes || 0}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <div className="flex gap-2">
              {/* Primary Download/Buy Button */}
              <button
                onClick={handleAction}
                disabled={recordDownloadMutation.isPending}
                className={`flex-grow py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
                  wallpaper.isPremium && !hasAccess
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary/10'
                    : 'bg-white hover:bg-gray-100 text-[#121212]'
                }`}
              >
                {wallpaper.isPremium && !hasAccess ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Unlock for ${wallpaper.price.toFixed(2)}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Instantly
                  </>
                )}
              </button>

              {/* Like/Favorite Button */}
              <button
                onClick={handleFavorite}
                disabled={toggleFavMutation.isPending}
                className={`p-3.5 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-rose-500/80 border-rose-500/20 text-white'
                    : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {hasAccess && (
              <button
                onClick={handleOpenInstructions}
                className="w-full py-3.5 px-6 rounded-xl border border-accent/30 hover:border-accent text-accent hover:bg-accent/5 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent/5"
              >
                <Monitor className="w-4.5 h-4.5" />
                Set as Wallpaper
              </button>
            )}

            {/* Share and Info options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/2 text-[10px] font-bold tracking-wider uppercase text-gray-400 hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Link
              </button>
              <div className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/2 text-[10px] font-bold tracking-wider uppercase text-gray-400 flex items-center justify-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                {wallpaper.resolution}
              </div>
            </div>
          </div>

          {/* Technical Metadata */}
          <div className="space-y-3 pt-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Dimensions</span>
              <span className="font-semibold text-gray-300">{wallpaper.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Format</span>
              <span className="font-semibold text-gray-300 capitalize">{wallpaper.type} wallpaper</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Device Layout</span>
              <span className="font-semibold text-gray-300 capitalize">{wallpaper.deviceType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Released</span>
              <span className="font-semibold text-gray-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(wallpaper.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Tags cloud */}
          {wallpaper.tags && wallpaper.tags.length > 0 && (
            <div className="pt-4 border-t border-white/5 space-y-2">
              <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((t) => (
                  <Link
                    key={t}
                    to={`/explore?search=${t}`}
                    className="px-2.5 py-1 text-[10px] font-semibold tracking-wide bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/25 rounded-md text-gray-300 hover:text-primary transition"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Wallpapers */}
      {related && related.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-white/5">
          <div>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
              Recommendation Engine
            </span>
            <h3 className="font-display font-bold text-2xl text-white mt-0.5">
              Related Designs
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => <SkeletonCard key={i} />)
              : related.map((wp) => (
                  <WallpaperCard
                    key={wp._id}
                    wallpaper={wp}
                    purchased={purchases?.some((p) => p.wallpaperId?._id === wp._id)}
                  />
                ))}
          </div>
        </section>
      )}

      {/* Set as Wallpaper Picker Modal for Native App Wrapper */}
      {showInstructions && Capacitor.isNativePlatform() && (
        <div className="fixed inset-0 bg-[#121212]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-3xl glass-panel-glow border-white/10 p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200 text-center">
            {/* Header */}
            <div className="flex flex-col items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20">
                <Monitor className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white">Apply Wallpaper</h3>
                <p className="text-xs text-gray-400">Choose where to set this design</p>
              </div>
            </div>

            {/* Loading state or picker actions */}
            {settingWallpaper ? (
              <div className="py-6 space-y-3 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                <p className="text-xs text-gray-300 font-semibold animate-pulse">Applying to system settings...</p>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSetNativeWallpaper('home')}
                  className="w-full py-3 px-5 rounded-xl bg-white hover:bg-gray-100 text-[#121212] font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md"
                >
                  Home Screen
                </button>
                <button
                  onClick={() => handleSetNativeWallpaper('lock')}
                  className="w-full py-3 px-5 rounded-xl bg-white hover:bg-gray-100 text-[#121212] font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md"
                >
                  Lock Screen
                </button>
                <button
                  onClick={() => handleSetNativeWallpaper('both')}
                  className="w-full py-3 px-5 rounded-xl bg-accent hover:bg-accent/90 text-[#121212] font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md shadow-accent/10"
                >
                  Home & Lock Screen
                </button>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full py-3 px-5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Set as Wallpaper Instructions Modal (Web Browser fallback) */}
      {showInstructions && !Capacitor.isNativePlatform() && (
        <div className="fixed inset-0 bg-[#121212]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel-glow border-white/10 p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Close */}
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                <Monitor className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white">Set as Wallpaper</h3>
                <p className="text-xs text-gray-400">Step-by-step setup guide for your device</p>
              </div>
            </div>

            {/* OS Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/5">
              {[
                { id: 'windows', label: 'Windows' },
                { id: 'mac', label: 'macOS' },
                { id: 'ios', label: 'iOS' },
                { id: 'android', label: 'Android' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedOS(tab.id)}
                  className={`py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                    selectedOS === tab.id
                      ? 'bg-accent/10 border-accent/25 text-accent shadow-sm'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Step Guide List */}
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              {selectedOS === 'windows' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Click the <strong className="text-white">Download Artwork</strong> button below to save the high-res file to your computer.</li>
                  <li>Open your File Explorer and navigate to the file (usually located in your <strong className="text-white">Downloads</strong> folder).</li>
                  <li>Right-click the image and select <strong className="text-white">"Set as desktop background"</strong> from the menu.</li>
                </ol>
              )}
              {selectedOS === 'mac' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Click the <strong className="text-white">Download Artwork</strong> button below to save the high-res file to your Mac.</li>
                  <li>Open Finder, locate the file, and right-click (or Control-click) it.</li>
                  <li>Choose <strong className="text-white">"Set Desktop Picture"</strong> (or go to <strong className="text-white">System Settings → Wallpaper</strong>).</li>
                </ol>
              )}
              {selectedOS === 'ios' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Tap the <strong className="text-white">Download Artwork</strong> button below, and confirm download to save it to your iOS device.</li>
                  <li>Launch your iOS <strong className="text-white">Photos</strong> app and tap the downloaded image.</li>
                  <li>Tap the <strong className="text-white">Share button</strong> (box with upward arrow) in the bottom left corner.</li>
                  <li>Scroll down the options list and select <strong className="text-white">"Use as Wallpaper"</strong>.</li>
                </ol>
              )}
              {selectedOS === 'android' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Tap the <strong className="text-white">Download Artwork</strong> button below to download the high-res file to your device gallery.</li>
                  <li>Open your <strong className="text-white">Gallery</strong> or <strong className="text-white">Google Photos</strong> app.</li>
                  <li>Tap the <strong className="text-white">three dots menu</strong> (options) in the top-right corner.</li>
                  <li>Select <strong className="text-white">"Set as wallpaper"</strong> and choose Home screen, Lock screen, or both.</li>
                </ol>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  handleAction();
                  addToast('Downloading wallpaper...', 'info');
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent/90 text-[#121212] font-bold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Artwork
              </button>
              <div className="flex gap-2 items-start text-[10px] text-gray-500 leading-relaxed">
                <Info className="w-4 h-4 flex-shrink-0 text-accent animate-pulse" />
                <p>
                  Security sandbox rule: Web applications cannot directly modify system settings. Doing this download-and-apply step ensures maximum security for your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
