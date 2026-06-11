import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, Sparkles, Monitor, FileCheck } from 'lucide-react';
import { useWallpaperBySlug } from '../hooks/useWallpapers';
import { useRecordDownload } from '../hooks/useDownloads';
import useUIStore from '../store/uiStore';

export default function Success() {
  const { slug } = useParams();
  const addToast = useUIStore((state) => state.addToast);

  // Queries
  const { data: wallpaper, isLoading } = useWallpaperBySlug(slug);
  const recordDownloadMutation = useRecordDownload();

  const handleDownload = () => {
    if (!wallpaper) return;
    recordDownloadMutation.mutate(wallpaper);
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 text-center max-w-sm mx-auto space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-gray-400">Loading purchase validation...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 max-w-md mx-auto px-4 text-center space-y-8 relative">
      {/* Decorative background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

      {/* Animated Success Checkmark */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
      >
        <CheckCircle className="w-16 h-16 stroke-[1.5]" />
      </motion.div>

      {/* Title / Description */}
      <div className="space-y-3">
        <h1 className="font-display font-black text-3xl text-white">Purchase Complete!</h1>
        <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
          Your payment has been simulated successfully. The premium license for this design is now unlocked on your account.
        </p>
      </div>

      {/* Unlocked Item Summary Box */}
      {wallpaper && (
        <div className="p-4 rounded-2xl glass-panel border-emerald-500/15 flex items-center gap-4 text-left">
          <div className="w-16 aspect-[4/5] rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-slate-950">
            <img src={wallpaper.previewImage} alt={wallpaper.title} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Unlocked
            </span>
            <h3 className="font-display font-bold text-sm text-white pt-1">{wallpaper.title}</h3>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5" />
              {wallpaper.resolution} • {wallpaper.type}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={handleDownload}
          disabled={recordDownloadMutation.isPending}
          className="w-full py-3.5 bg-white hover:bg-gray-100 text-slate-950 font-bold text-xs tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
        >
          <Download className="w-4 h-4" />
          {recordDownloadMutation.isPending ? 'Downloading...' : 'Download High-Res Now'}
        </button>

        <Link
          to="/profile?tab=purchases"
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase rounded-xl border border-white/5 hover:border-white/10 transition flex items-center justify-center gap-1.5"
        >
          <FileCheck className="w-4 h-4" />
          View Purchases History
        </Link>
      </div>

      <div className="pt-2">
        <Link
          to="/explore"
          className="text-xs font-semibold text-primary hover:text-primary-hover transition flex items-center justify-center gap-1"
        >
          Continue Browsing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
