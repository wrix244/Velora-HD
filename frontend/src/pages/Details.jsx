import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Download, Lock, Check, Calendar, ArrowLeft, Image, Share2, Info, Monitor, Smartphone, X, Edit, Trash2, Play, Globe, Link2 } from 'lucide-react';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { useLenis } from 'lenis/react';
import SEO from '../components/common/SEO';
import { optimiseUrl } from '../utils/cloudinary';
import { useWallpaperBySlug, useRelatedWallpapers } from '../hooks/useWallpapers';
import { useToggleFavorite } from '../hooks/useFavorites';
import { useToggleLike } from '../hooks/useLikes';
import { useRecordDownload } from '../hooks/useDownloads';
import { usePurchaseHistory, useAdUnlock } from '../hooks/usePurchases';
import { useDeleteWallpaper } from '../hooks/useAdmin';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';
import useLikesStore from '../store/likesStore';
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

  // Queries (Declared at top to avoid Temporal Dead Zone ReferenceError)
  const { data: wallpaper, isLoading, error } = useWallpaperBySlug(slug);
  const { data: related, isLoading: relatedLoading } = useRelatedWallpapers(wallpaper?._id);
  const { data: purchases } = usePurchaseHistory();

  // Favoriting & Liking & Downloading Mutations
  const isFavorite = useFavoritesStore((state) => state.isFavorite(wallpaper?._id));
  const toggleFavMutation = useToggleFavorite();
  const isLiked = useLikesStore((state) => state.isLiked(wallpaper?._id));
  const toggleLikeMutation = useToggleLike();
  const recordDownloadMutation = useRecordDownload();
  const deleteMutation = useDeleteWallpaper();
  const adUnlockMutation = useAdUnlock();

  // Synced purchases check
  const purchased = purchases ? purchases.some((p) => p.wallpaperId?._id === wallpaper?._id) : false;
  const hasAccess = !wallpaper?.isPremium || user?.role === 'admin' || purchased;

  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedOS, setSelectedOS] = useState('windows');
  const [playingAd, setPlayingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(8);

  // Custom Confirmation Modal States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmOnApprove, setConfirmOnApprove] = useState(null);

  // Custom Share & Preview Modal States
  const [shareOpen, setShareOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  const requestConfirmation = (title, message, onApprove) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmOnApprove(() => onApprove);
    setConfirmOpen(true);
  };

  const lenis = useLenis();

  // Disable body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = showInstructions || confirmOpen || shareOpen || previewOpen || playingAd;
    if (lenis) {
      if (isAnyModalOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
    if (isAnyModalOpen) {
      document.documentElement.classList.add('lenis-stopped');
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('lenis-stopped');
      document.body.style.overflow = '';
    }
    return () => {
      if (lenis) lenis.start();
      document.documentElement.classList.remove('lenis-stopped');
      document.body.style.overflow = '';
    };
  }, [showInstructions, confirmOpen, shareOpen, previewOpen, playingAd, lenis]);

  useEffect(() => {
    let timer;
    if (playingAd && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (playingAd && adCountdown === 0) {
      if (wallpaper?._id) {
        setAdCountdown(-1); // Transition out of 0 to prevent mutate loop
        adUnlockMutation.mutate(wallpaper._id, {
          onSuccess: () => {
            setPlayingAd(false);
          },
          onError: () => {
            setPlayingAd(false);
          }
        });
      } else {
        setPlayingAd(false);
        addToast('Error: Wallpaper context not found.', 'error');
      }
    }
    return () => clearTimeout(timer);
  }, [playingAd, adCountdown, wallpaper, adUnlockMutation, addToast]);

  const handleWatchAd = () => {
    if (!isAuthenticated) {
      addToast('Please login to unlock premium wallpapers.', 'info');
      navigate('/login');
      return;
    }
    setAdCountdown(8);
    setPlayingAd(true);
  };

  const detectOS = () => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
    if (/android/i.test(ua)) return 'android';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'mac';
    if (/Windows/i.test(ua)) return 'windows';
    return 'windows';
  };

  // Disable body scroll when instructions modal is open
  useEffect(() => {
    if (showInstructions) {
      document.documentElement.classList.add('lenis-stopped');
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('lenis-stopped');
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('lenis-stopped');
      document.body.style.overflow = '';
    };
  }, [showInstructions]);

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

  // Add to recently viewed on mount/successful wallpaper fetch
  useEffect(() => {
    if (wallpaper) {
      addRecentlyViewed(wallpaper);
    }
  }, [wallpaper, addRecentlyViewed]);

  const handleFavorite = () => {
    if (!isAuthenticated) {
      addToast('Please log in to add to favorites.', 'info');
      navigate('/login');
      return;
    }
    toggleFavMutation.mutate(wallpaper);
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      addToast('Please log in to like wallpapers.', 'info');
      navigate('/login');
      return;
    }
    toggleLikeMutation.mutate(wallpaper);
  };

  const handleAction = () => {
    if (!isAuthenticated) {
      addToast('Please register or login to download wallpapers.', 'info');
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
    requestConfirmation(
      'Delete Wallpaper Artwork',
      'Are you sure you want to permanently delete this wallpaper artwork? It will be removed from the library and users will no longer be able to discover or download it. This action is irreversible.',
      () => {
        deleteMutation.mutate(wallpaper._id, {
          onSuccess: () => {
            navigate('/explore');
          },
        });
      }
    );
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <SEO title="Loading..." />
        <div className="h-6 w-24 bg-surface rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 aspect-video rounded-3xl bg-surface" />
          <div className="lg:col-span-4 h-96 rounded-3xl bg-surface" />
        </div>
      </div>
    );
  }

  if (error || !wallpaper) {
    return (
      <div className="pt-20 pb-16 text-center max-w-md mx-auto space-y-4">
        <SEO is404={true} />
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

  const ogImage = optimiseUrl(wallpaper.previewImage, { width: 1200, height: 630 });
  const seoDesc = wallpaper.description
    ? `${wallpaper.description}. Download in high resolution for desktop and mobile.`
    : `Download ${wallpaper.title} wallpaper in high resolution for desktop and mobile devices.`;

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": wallpaper.title,
    "description": seoDesc,
    "image": wallpaper.previewImage,
    "url": `https://velorahd.in/wallpaper/${wallpaper.slug}`,
    "author": {
      "@type": "Organization",
      "name": "Velora HD",
      "url": "https://velorahd.in"
    }
  };

  return (
    <div className="pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <SEO
        title={wallpaper.title}
        description={wallpaper.description}
        keywords={wallpaper.tags}
        image={ogImage}
        schema={schemaOrg}
      />
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
        <div className="lg:col-span-8 rounded-3xl overflow-hidden card border-border relative shadow-lg flex items-center justify-center bg-bg-dark">
          {wallpaper.type === 'live' ? (
            <div className="w-full aspect-[16/10] max-h-[70vh]">
              <LivePlayer
                src={optimiseUrl(wallpaper.downloadFile, { width: 1200 })}
                poster={optimiseUrl(wallpaper.previewImage, { width: 1200 })}
                autoplay={true}
                hoverToPlay={false}
                className="w-full h-full"
              />
            </div>
          ) : (
            <img
              src={optimiseUrl(wallpaper.previewImage, { width: 1200 })}
              alt={wallpaper.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}

          {/* Absolute labels */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2.5 py-1 text-[10px] font-bold bg-black/70 text-white rounded-full tracking-wide border border-border uppercase">
              {wallpaper.type}
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-black/70 text-white rounded-full tracking-wide border border-border uppercase">
              {wallpaper.deviceType}
            </span>
          </div>
        </div>

        {/* Right: Info Sidebar Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl card space-y-6">
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
              <div className="flex gap-2 pt-4 border-t border-border mt-2">
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
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-border text-center">
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
            <div className="flex flex-col gap-2">
              {wallpaper.isPremium && !hasAccess ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {/* Buy Button */}
                    <button
                      onClick={handleAction}
                      className="flex-grow py-3.5 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Unlock for ${wallpaper.price.toFixed(2)}
                    </button>

                    {/* Like Button */}
                    <button
                      onClick={handleLike}
                      disabled={toggleLikeMutation.isPending}
                      aria-label="Like wallpaper"
                      className={`p-3.5 rounded-xl border transition-all ${
                        isLiked
                          ? 'bg-rose-500/80 border-rose-500/20 text-white'
                          : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      title="Like this artwork"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Favorite Button */}
                    <button
                      onClick={handleFavorite}
                      disabled={toggleFavMutation.isPending}
                      aria-label="Save wallpaper"
                      className={`p-3.5 rounded-xl border transition-all ${
                        isFavorite
                          ? 'bg-amber-500/80 border-amber-500/20 text-white'
                          : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      title="Add to Favorites"
                    >
                      <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Watch Ad to Unlock */}
                  <button
                    onClick={handleWatchAd}
                    disabled={adUnlockMutation.isPending}
                    className="w-full py-3.5 px-6 bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Play className="w-4 h-4 text-accent fill-accent/20" />
                    Watch Ad to Unlock Free
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  {/* Download Button */}
                  <button
                    onClick={handleAction}
                    disabled={recordDownloadMutation.isPending}
                    className="flex-grow py-3.5 px-6 bg-white hover:bg-gray-100 text-bg-dark rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Instantly
                  </button>

                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    disabled={toggleLikeMutation.isPending}
                    aria-label="Like wallpaper"
                    className={`p-3.5 rounded-xl border transition-all ${
                      isLiked
                        ? 'bg-rose-500/80 border-rose-500/20 text-white'
                        : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Like this artwork"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>

                  {/* Favorite Button */}
                  <button
                    onClick={handleFavorite}
                    disabled={toggleFavMutation.isPending}
                    aria-label="Save wallpaper"
                    className={`p-3.5 rounded-xl border transition-all ${
                      isFavorite
                        ? 'bg-amber-500/80 border-amber-500/20 text-white'
                        : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    title="Add to Favorites"
                  >
                    <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {hasAccess ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenInstructions}
                    className="flex-grow py-3.5 px-4 rounded-xl border border-accent/30 hover:border-accent text-accent hover:bg-accent/5 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-accent/5"
                  >
                    <Monitor className="w-4 h-4" />
                    Set as Wallpaper
                  </button>
                  <button
                    onClick={() => {
                      setPreviewDevice(wallpaper.deviceType === 'mobile' ? 'mobile' : 'desktop');
                      setPreviewOpen(true);
                    }}
                    className="py-3.5 px-4 rounded-xl border border-white/10 hover:border-white/20 text-gray-300 hover:text-white bg-white/2 hover:bg-white/5 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPreviewDevice(wallpaper.deviceType === 'mobile' ? 'mobile' : 'desktop');
                    setPreviewOpen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl border border-accent/25 hover:border-accent/50 text-accent hover:bg-accent/5 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Smartphone className="w-4.5 h-4.5" />
                  Preview On Device
                </button>
              )}

              {/* Share and Info options */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShare}
                  className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/2 text-[10px] font-bold tracking-wider uppercase text-gray-400 hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 cursor-pointer"
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
            <div className="pt-4 border-t border-border space-y-2">
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
        <section className="space-y-6 pt-8 border-t border-border">
          <div>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
              Recommendation Engine
            </span>
            <h3 className="font-display font-bold text-2xl text-text-light mt-0.5">
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
        <div 
          data-lenis-prevent
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-sm rounded-3xl card border-border p-6 md:p-8 space-y-6 shadow-lg animate-in fade-in-50 zoom-in-95 duration-200 text-center">
            {/* Header */}
            <div className="flex flex-col items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20">
                <Monitor className="w-8 h-8 text-accent" />
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
                  className="w-full py-3 px-5 rounded-xl bg-white hover:bg-gray-100 text-bg-dark font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md"
                >
                  Home Screen
                </button>
                <button
                  onClick={() => handleSetNativeWallpaper('lock')}
                  className="w-full py-3 px-5 rounded-xl bg-white hover:bg-gray-100 text-bg-dark font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md"
                >
                  Lock Screen
                </button>
                <button
                  onClick={() => handleSetNativeWallpaper('both')}
                  className="w-full py-3 px-5 rounded-xl bg-accent hover:bg-accent/90 text-bg-dark font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md"
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
        <div 
          data-lenis-prevent
          className="fixed inset-0 bg-black/70 z-[100] overflow-y-auto"
        >
          <div className="flex min-h-full items-center justify-center p-4 py-8">
            <div className="relative w-full max-w-lg rounded-3xl card border-border p-6 md:p-8 space-y-6 shadow-lg animate-in fade-in-50 zoom-in-95 duration-200">
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
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/[0.02] border border-border">
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
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-border">
              {/* Windows Instructions */}
              {selectedOS === 'windows' && wallpaper.type === 'live' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3 text-left">
                    <div className="flex gap-2.5 items-start">
                      <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-white">Lively Wallpaper Required</h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed mt-1">
                          Windows does not support live video wallpapers natively. You need a third-party application like <strong className="text-white">Lively Wallpaper</strong> to apply this animated design.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <a
                        href="https://apps.microsoft.com/detail/9ntm2qc6qws7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-primary/15"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Microsoft Store
                      </a>
                      <a
                        href="https://rocksdanister.github.io/lively/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300 hover:text-white font-bold text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Official Website
                      </a>
                    </div>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                    <li>Click the <strong className="text-white">Download Artwork</strong> button below to download the video wallpaper (`.mp4` / `.mov`).</li>
                    <li>Install <strong className="text-white">Lively Wallpaper</strong> using either of the links above.</li>
                    <li>Open Lively Wallpaper, click <strong className="text-white">+ Add Wallpaper</strong> (or drag and drop the downloaded video file).</li>
                    <li>Select the video file and apply it to set it as your interactive live desktop background!</li>
                  </ol>
                </div>
              )}
              {selectedOS === 'windows' && wallpaper.type !== 'live' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Click the <strong className="text-white">Download Artwork</strong> button below to save the high-res file to your computer.</li>
                  <li>Open your File Explorer and navigate to the file (usually located in your <strong className="text-white">Downloads</strong> folder).</li>
                  <li>Right-click the image and select <strong className="text-white">"Set as desktop background"</strong> from the menu.</li>
                </ol>
              )}

              {/* Mac Instructions */}
              {selectedOS === 'mac' && wallpaper.type === 'live' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Click the <strong className="text-white">Download Artwork</strong> button below to download the video wallpaper (`.mp4` / `.mov`).</li>
                  <li>Install a third-party video wallpaper player for macOS (such as <strong className="text-white">Plaster</strong>, <strong className="text-white">VLC</strong>, or search for video wallpaper players on the Mac App Store).</li>
                  <li>Open the live wallpaper app, import the downloaded video, and apply it to your desktop display.</li>
                </ol>
              )}
              {selectedOS === 'mac' && wallpaper.type !== 'live' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Click the <strong className="text-white">Download Artwork</strong> button below to save the high-res file to your Mac.</li>
                  <li>Open Finder, locate the file, and right-click (or Control-click) it.</li>
                  <li>Choose <strong className="text-white">"Set Desktop Picture"</strong> (or go to <strong className="text-white">System Settings → Wallpaper</strong>).</li>
                </ol>
              )}

              {/* iOS Instructions */}
              {selectedOS === 'ios' && wallpaper.type === 'live' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Tap the <strong className="text-white">Download Artwork</strong> button below to save the video wallpaper.</li>
                  <li>Use a free App Store converter (such as <strong className="text-white">intoLive</strong>) to convert the video to a <strong className="text-white">Live Photo</strong>.</li>
                  <li>Go to iOS <strong className="text-white">Settings → Wallpaper → Add New Wallpaper</strong> and select the converted Live Photo.</li>
                  <li>Ensure the live playback feature is enabled and apply.</li>
                </ol>
              )}
              {selectedOS === 'ios' && wallpaper.type !== 'live' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Tap the <strong className="text-white">Download Artwork</strong> button below, and confirm download to save it to your iOS device.</li>
                  <li>Launch your iOS <strong className="text-white">Photos</strong> app and tap the downloaded image.</li>
                  <li>Tap the <strong className="text-white">Share button</strong> (box with upward arrow) in the bottom left corner.</li>
                  <li>Scroll down the options list and select <strong className="text-white">"Use as Wallpaper"</strong>.</li>
                </ol>
              )}

              {/* Android Instructions */}
              {selectedOS === 'android' && wallpaper.type === 'live' && (
                <ol className="list-decimal list-inside text-xs text-gray-300 space-y-3">
                  <li>Tap the <strong className="text-white">Download Artwork</strong> button below to save the video.</li>
                  <li>Open your phone's default Gallery app, select the video, and tap the options (three dots).</li>
                  <li>Select <strong className="text-white">"Set as wallpaper"</strong> (on Samsung/Xiaomi, it will automatically loop).</li>
                  <li>If your launcher does not support direct video wallpapers, download the free <strong className="text-white">Video Live Wallpaper</strong> app from the Google Play Store to apply it.</li>
                </ol>
              )}
              {selectedOS === 'android' && wallpaper.type !== 'live' && (
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
                onClick={handleAction}
                disabled={recordDownloadMutation.isPending}
                className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent/90 text-bg-dark font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Artwork
              </button>
              <div className="flex gap-2 items-start text-[10px] text-gray-500 leading-relaxed">
                <Info className="w-4 h-4 flex-shrink-0 text-accent" />
                <p>
                  Security sandbox rule: Web applications cannot directly modify system settings. Doing this download-and-apply step ensures maximum security for your device.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Simulated Ad Player Modal Overlay */}
      {playingAd && (
        <div className="fixed inset-0 bg-black/90 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl card border-border p-6 md:p-8 space-y-6 shadow-lg text-center relative overflow-hidden animate-in zoom-in-95 duration-200">


            <div className="space-y-4">
              <span className="px-3 py-1 text-[10px] font-black tracking-widest bg-white/5 border border-white/10 text-accent uppercase rounded-full">
                Sponsor Advertisement
              </span>
              <h3 className="font-display font-black text-xl text-white">
                Unlocking Premium Wallpaper
              </h3>
              <p className="text-xs text-gray-400">
                Please wait while we prepare your high-resolution download link.
              </p>
            </div>

            <div className="w-full aspect-video rounded-2xl bg-bg-dark border border-border relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center filter brightness-50 opacity-40 animate-pulse" style={{ backgroundImage: `url(${optimiseUrl(wallpaper.previewImage, { width: 600 })})` }} />
              
              <div className="relative z-10 space-y-4 flex flex-col items-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-accent animate-spin" />
                  <span className="font-display font-black text-[10px] text-white uppercase tracking-wider">
                    {adCountdown > 0 ? `${adCountdown}s` : 'Processing'}
                  </span>
                </div>
                <p className="text-[10px] font-bold tracking-widest text-accent uppercase animate-pulse">
                  {adCountdown > 0 ? 'Watching Advertisement...' : 'Unlocking Artwork...'}
                </p>
              </div>
            </div>

            <div className="text-[10px] text-gray-500 italic leading-relaxed pt-2">
              Watching this short ad helps us keep the servers running and pay the original artists. Thank you for your support!
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-6 relative shadow-lg">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-white">
                {confirmTitle}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {confirmMessage}
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 border border-border bg-surface/50 hover:bg-surface text-gray-300 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmOnApprove) confirmOnApprove();
                  setConfirmOpen(false);
                }}
                className="px-5 py-2 text-white font-bold text-xs rounded-xl shadow-lg bg-rose-600 hover:bg-rose-500 shadow-rose-600/10 transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL SHARING MODAL */}
      {shareOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 space-y-6 relative shadow-lg">
            <button
              type="button"
              onClick={() => setShareOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-white">Share Artwork</h3>
              <p className="text-xs text-gray-400">Share this masterpiece wallpaper design with your friends.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-grow px-3 py-2 text-xs clean-input select-all"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('Link copied to clipboard!', 'success');
                }}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1"
              >
                <Link2 className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20wallpaper%20on%20VeloraHD!&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/2 text-[10px] font-bold tracking-wider uppercase text-gray-300 hover:text-white hover:bg-slate-900 transition flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter / X
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=Check%20out%20this%20amazing%20wallpaper%20on%20VeloraHD!%20${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/2 text-[10px] font-bold tracking-wider uppercase text-gray-300 hover:text-white hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-[#25D366] fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/2 text-[10px] font-bold tracking-wider uppercase text-gray-300 hover:text-white hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
                Facebook
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(wallpaper.previewImage)}&description=${encodeURIComponent(wallpaper.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl border border-white/5 bg-white/2 text-[10px] font-bold tracking-wider uppercase text-gray-300 hover:text-white hover:bg-[#BD081C]/10 hover:border-[#BD081C]/30 transition flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-[#BD081C] fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.906 2.17-2.906 1.024 0 1.517.769 1.517 1.693 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.162 0 7.397 2.965 7.397 6.93 0 4.136-2.607 7.464-6.227 7.464-1.215 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.639 0 12.017 0z" />
                </svg>
                Pinterest
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DEVICE PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-surface border border-border rounded-3xl p-6 space-y-6 relative shadow-lg flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-white">Device Live Preview</h3>
              <p className="text-xs text-gray-400">See how this artwork fits on your desktop and phone screens.</p>
            </div>

            {/* Toggle Preview device */}
            <div className="inline-flex p-1 rounded-full bg-white/5 border border-border">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>

            {/* Preview Frame Area */}
            <div className="w-full min-h-[350px] flex items-center justify-center py-4 bg-slate-950/20 rounded-2xl border border-border relative overflow-hidden">
              {previewDevice === 'desktop' ? (
                /* Desktop Monitor Frame */
                <div className="flex flex-col items-center">
                  <div className="w-[380px] md:w-[480px] aspect-[16/10] border-[6px] border-neutral-800 bg-neutral-950 rounded-t-2xl shadow-lg relative overflow-hidden">
                    <img
                      src={wallpaper.previewImage}
                      alt={wallpaper.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-1 flex justify-center opacity-60">
                      <div className="px-4 py-1 rounded bg-black/60 backdrop-blur-md flex gap-2.5">
                        <div className="w-2.5 h-2.5 rounded bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded bg-white/20" />
                      </div>
                    </div>
                  </div>
                  {/* Laptop Base Stand */}
                  <div className="w-[100px] h-[24px] bg-neutral-800 border-t border-neutral-700 shadow-md animate-in slide-in-from-bottom" />
                  <div className="w-[180px] h-[6px] bg-neutral-700 rounded-full shadow-lg" />
                </div>
              ) : (
                /* Mobile Phone Frame */
                <div className="w-[200px] h-[390px] rounded-[36px] border-[6px] border-neutral-800 bg-neutral-950 shadow-lg relative overflow-hidden flex flex-col justify-between p-4 animate-in zoom-in-95">
                  {/* Dynamic Island Notcher */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black z-20" />
                  
                  {/* Wallpaper */}
                  <img
                    src={wallpaper.previewImage}
                    alt={wallpaper.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Lock Screen UI widgets */}
                  <div className="relative z-10 text-center text-white mt-4 space-y-0.5 pointer-events-none drop-shadow-md">
                    <div className="text-[9px] font-bold uppercase tracking-wider opacity-85">
                      {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-4xl font-black tracking-tight leading-none">09:41</div>
                  </div>

                  {/* Bottom Home indicator */}
                  <div className="relative z-10 mx-auto w-24 h-1 bg-white/80 rounded-full mb-1 drop-shadow" />
                </div>
              )}
            </div>

            <div className="text-[10px] text-gray-500 max-w-sm text-center leading-relaxed">
              Resolution shown: {wallpaper.resolution} ({wallpaper.deviceType} optimized). Drag-and-zoom previews represent simulated setups.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
