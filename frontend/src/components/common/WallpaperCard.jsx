import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Download, Lock, Check } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useFavoritesStore from '../../store/favoritesStore';
import { useToggleFavorite } from '../../hooks/useFavorites';
import { useRecordDownload } from '../../hooks/useDownloads';
import useUIStore from '../../store/uiStore';
import LivePlayer from './LivePlayer';

export default function WallpaperCard({ wallpaper, purchased = false }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isFavorite = useFavoritesStore((state) => state.isFavorite(wallpaper._id));
  const toggleFavMutation = useToggleFavorite();
  const recordDownloadMutation = useRecordDownload();
  const addToast = useUIStore((state) => state.addToast);

  // Check permissions: Admin, or free, or purchased
  const hasAccess = !wallpaper.isPremium || user?.role === 'admin' || purchased;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast('Please log in to add to favorites.', 'info');
      navigate('/login');
      return;
    }
    toggleFavMutation.mutate(wallpaper);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wallpaper.isPremium && !hasAccess) {
      navigate(`/checkout?wallpaperId=${wallpaper._id}`);
      return;
    }
    recordDownloadMutation.mutate(wallpaper);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card aspect-[4/5] flex flex-col justify-end">
      {/* Background Media Container */}
      <Link to={`/wallpaper/${wallpaper.slug}`} className="absolute inset-0 z-0">
        {wallpaper.type === 'live' ? (
          <LivePlayer
            src={wallpaper.downloadFile}
            poster={wallpaper.previewImage}
            hoverToPlay={true}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={wallpaper.previewImage}
            alt={wallpaper.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        
        {/* Soft shadow gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent opacity-80 z-1" />
      </Link>

      {/* Top badges bar */}
      <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1.5">
          {/* Static/Live and device type badges */}
          <div className="flex flex-wrap gap-1">
            {wallpaper.type === 'live' && (
              <span className="text-[10px] font-bold tracking-wide bg-accent/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm uppercase">
                Live
              </span>
            )}
            <span className="text-[10px] font-semibold tracking-wide bg-[#121212]/70 border border-white/10 px-2 py-0.5 rounded-full capitalize backdrop-blur-sm text-gray-300">
              {wallpaper.deviceType}
            </span>
            {wallpaper.isPremium && (
              <span className="text-[10px] font-semibold tracking-wide bg-amber-500/80 text-[#121212] px-2 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-sm">
                <Lock className="w-2.5 h-2.5" />
                Premium
              </span>
            )}
          </div>
        </div>

        {/* Wishlist Like Button */}
        <button
          onClick={handleFavorite}
          disabled={toggleFavMutation.isPending}
          className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition-all ${
            isFavorite
              ? 'bg-rose-500/80 border-rose-500/20 text-white'
              : 'bg-[#121212]/40 text-gray-300 hover:text-white hover:bg-[#121212]/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Details / Action panel at bottom */}
      <div className="p-4 relative z-10 w-full transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
        <Link to={`/wallpaper/${wallpaper.slug}`} className="block mb-1">
          <h3 className="font-display font-semibold text-lg text-white truncate drop-shadow-md group-hover:text-primary transition-colors">
            {wallpaper.title}
          </h3>
          <p className="text-[11px] text-gray-400 font-medium tracking-wide">
            {wallpaper.category} • {wallpaper.resolution}
          </p>
        </Link>

        {/* Interactive Action Bar (revealed on hover) */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-display font-bold text-sm text-white">
            {wallpaper.isPremium ? (hasAccess ? <span className="text-emerald-400 flex items-center gap-0.5 text-xs"><Check className="w-3.5 h-3.5"/> Unlocked</span> : `$${wallpaper.price.toFixed(2)}`) : 'Free'}
          </span>

          <button
            onClick={handleDownload}
            disabled={recordDownloadMutation.isPending}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              wallpaper.isPremium && !hasAccess
                ? 'bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20'
                : 'bg-white hover:bg-gray-100 text-[#121212]'
            }`}
          >
            {wallpaper.isPremium && !hasAccess ? (
              <>
                <Lock className="w-3 h-3" />
                Unlock
              </>
            ) : (
              <>
                <Download className="w-3 h-3 animate-bounce" />
                Get
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
