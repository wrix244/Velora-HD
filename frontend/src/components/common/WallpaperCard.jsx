import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Download, Lock } from 'lucide-react';
import { optimiseUrl } from '../../utils/cloudinary';
import useAuthStore from '../../store/authStore';
import useFavoritesStore from '../../store/favoritesStore';
import useLikesStore from '../../store/likesStore';
import { useToggleFavorite } from '../../hooks/useFavorites';
import { useToggleLike } from '../../hooks/useLikes';
import { useRecordDownload } from '../../hooks/useDownloads';
import useUIStore from '../../store/uiStore';
import LivePlayer from './LivePlayer';

export default function WallpaperCard({ wallpaper, purchased = false }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isFavorite = useFavoritesStore((state) => state.isFavorite(wallpaper._id));
  const toggleFavMutation = useToggleFavorite();
  const isLiked = useLikesStore((state) => state.isLiked(wallpaper._id));
  const toggleLikeMutation = useToggleLike();
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

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast('Please log in to like wallpapers.', 'info');
      navigate('/login');
      return;
    }
    toggleLikeMutation.mutate(wallpaper);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast('Please register or login to download wallpapers.', 'info');
      navigate('/login');
      return;
    }
    if (wallpaper.isPremium && !hasAccess) {
      navigate(`/checkout?wallpaperId=${wallpaper._id}`);
      return;
    }
    recordDownloadMutation.mutate(wallpaper);
  };

  const src400 = optimiseUrl(wallpaper.previewImage, { width: 400 });
  const src800 = optimiseUrl(wallpaper.previewImage, { width: 800 });
  const src1200 = optimiseUrl(wallpaper.previewImage, { width: 1200 });

  return (
    <div
      className="group relative rounded-2xl overflow-hidden card dark-card aspect-[4/5] flex flex-col justify-end"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Background Media Container */}
      <Link to={`/wallpaper/${wallpaper.slug}`} className="absolute inset-0 z-0">
        {wallpaper.type === 'live' ? (
          <LivePlayer
            src={optimiseUrl(wallpaper.downloadFile, { width: 800 })}
            poster={optimiseUrl(wallpaper.previewImage, { width: 800 })}
            hoverToPlay={true}
            draggable="false"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-750 pointer-events-none select-none"
          />
        ) : (
          <img
            src={src400}
            srcSet={`${src400} 400w, ${src800} 800w, ${src1200} 1200w`}
            sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
            alt={wallpaper.title}
            loading="lazy"
            width={400}
            height={500}
            draggable="false"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-750 pointer-events-none select-none"
          />
        )}
        
        {/* Soft shadow gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90 z-1 pointer-events-none select-none" />
      </Link>

      {/* Top badges bar */}
      <div className="absolute top-3 inset-x-3 flex justify-between items-start z-20">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-1">
            {wallpaper.type === 'live' && (
              <span className="text-[9px] font-bold tracking-wider bg-primary text-white px-2 py-0.5 rounded uppercase">
                Live
              </span>
            )}
            <span className="text-[9px] font-semibold tracking-wider bg-zinc-950/80 border border-zinc-800/80 px-2 py-0.5 rounded capitalize text-gray-300">
              {wallpaper.deviceType}
            </span>
            {wallpaper.isPremium && (
              <span className="text-[9px] font-semibold tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" />
                Premium
              </span>
            )}
          </div>
        </div>

        {/* Actions panel: Like & Favorite */}
        <div className="flex gap-1.5">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
            aria-label="Like wallpaper"
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isLiked
                ? 'bg-rose-500 border-rose-600 text-white'
                : 'bg-zinc-950/50 border-zinc-800/80 text-gray-300 hover:text-white hover:bg-zinc-900'
            }`}
            title="Like"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={toggleFavMutation.isPending}
            aria-label="Save wallpaper"
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-500 border-amber-600 text-white'
                : 'bg-zinc-950/50 border-zinc-800/80 text-gray-300 hover:text-white hover:bg-zinc-900'
            }`}
            title="Add to Favorites"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Details & Action panel at bottom */}
      <div className="p-4 relative z-10 w-full flex items-end justify-between pointer-events-none">
        {/* Left: Text Details */}
        <div className="block min-w-0 flex-1 pr-2">
          <h3 className="font-display font-semibold text-sm text-white truncate drop-shadow group-hover:text-primary transition-colors">
            {wallpaper.title}
          </h3>
          <p className="text-[10px] text-text-muted font-medium tracking-wide truncate">
            {wallpaper.category} • {wallpaper.resolution}
          </p>
        </div>

        {/* Right: Floating action button for Download/Unlock */}
        <div className="flex-shrink-0 pointer-events-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleDownload}
            disabled={recordDownloadMutation.isPending}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all shadow ${
              wallpaper.isPremium && !hasAccess
                ? 'bg-primary text-white hover:bg-primary/95'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {wallpaper.isPremium && !hasAccess ? (
              <>
                <Lock className="w-3 h-3" />
                <span>${wallpaper.price.toFixed(2)}</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                <span>Get</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
