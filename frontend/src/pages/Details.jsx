import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Download, Lock, Check, Calendar, ArrowLeft, Image, Share2, Info } from 'lucide-react';
import { useWallpaperBySlug, useRelatedWallpapers } from '../hooks/useWallpapers';
import { useToggleFavorite } from '../hooks/useFavorites';
import { useRecordDownload } from '../hooks/useDownloads';
import { usePurchaseHistory } from '../hooks/usePurchases';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';
import useUIStore from '../store/uiStore';
import LivePlayer from '../components/common/LivePlayer';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';

export default function Details() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const addRecentlyViewed = useUIStore((state) => state.addRecentlyViewed);
  const addToast = useUIStore((state) => state.addToast);

  // Queries
  const { data: wallpaper, isLoading, error } = useWallpaperBySlug(slug);
  const { data: related, isLoading: relatedLoading } = useRelatedWallpapers(wallpaper?._id);
  const { data: purchases } = usePurchaseHistory();

  // Favoriting & Downloading Mutations
  const isFavorite = useFavoritesStore((state) => state.isFavorite(wallpaper?._id));
  const toggleFavMutation = useToggleFavorite();
  const recordDownloadMutation = useRecordDownload();

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

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-6 w-24 bg-slate-900 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 aspect-video rounded-3xl bg-slate-900" />
          <div className="lg:col-span-4 h-96 rounded-3xl bg-slate-900" />
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
        <div className="lg:col-span-8 rounded-3xl overflow-hidden glass-panel border-white/10 relative shadow-2xl flex items-center justify-center bg-slate-950">
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
            <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-950/80 text-white rounded-full tracking-wide backdrop-blur-sm border border-white/5 uppercase">
              {wallpaper.type}
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-950/80 text-white rounded-full tracking-wide backdrop-blur-sm border border-white/5 uppercase">
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
            <p className="text-xs text-gray-400 leading-relaxed pt-2">
              {wallpaper.description || 'No description provided for this artwork.'}
            </p>
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
                    : 'bg-white hover:bg-gray-100 text-slate-950'
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

    </div>
  );
}
