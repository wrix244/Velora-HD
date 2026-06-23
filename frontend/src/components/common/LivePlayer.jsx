import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

export default function LivePlayer({ src, poster, autoplay = false, hoverToPlay = false, className = '' }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented:', err.message);
        setIsPlaying(false);
      });
    }
  }, [autoplay, src]);

  const handlePlayToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    }
  };

  const handleHoverStart = () => {
    setIsHovered(true);
    if (hoverToPlay && videoRef.current && !isPlaying) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (hoverToPlay && videoRef.current && isPlaying) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // reset
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden dark-card ${className}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {/* Video Stream */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted={isMuted}
        playsInline
        preload="none"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        className="w-full h-full object-cover"
      />

      {/* Loading Overlay — Only render if loading AND user is hovering or autoplay is active */}
      {isLoading && (autoplay || isHovered) && (
        <div className="absolute inset-0 bg-[#121212]/40 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Play/Pause Control (only visible on large details page play, not hover cards) */}
      {!hoverToPlay && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-[#1A1A1A]/60 backdrop-blur-md text-white border border-white/10 hover:bg-slate-800 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePlayToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A]/60 backdrop-blur-md text-white border border-white/10 hover:bg-slate-800 transition text-xs font-semibold cursor-pointer"
          >
            <Play className={`w-3 h-3 fill-current ${isPlaying ? 'rotate-90' : ''}`} />
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
    </div>
  );
}
