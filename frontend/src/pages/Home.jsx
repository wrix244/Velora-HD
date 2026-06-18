import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { Compass, Sparkles, TrendingUp, Clock, Layers, ArrowRight } from 'lucide-react';
import { useTrendingWallpapers, useLatestWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { optimiseUrl } from '../utils/cloudinary';

// 4 main premium curated collections with unsplash backgrounds
const curatedCollections = [
  { name: 'Minimal', label: 'Minimal Art', photo: 'https://res.cloudinary.com/dqiimxtb3/image/upload/v1781458559/velorahd/wallpapers/muppxj5pqepjvompm8xz.webp', description: 'Clean lines, negative space, and absolute zen.' },
  { name: 'Space', label: 'Cosmic Scenery', photo: 'https://res.cloudinary.com/dqiimxtb3/image/upload/v1781458529/velorahd/wallpapers/anqpqtghrhztlevyvyag.webp', description: 'Deep nebulas, alien stars, and dark voids.' },
  { name: 'Nature', label: 'Nature Film', photo: 'https://res.cloudinary.com/dqiimxtb3/image/upload/v1781459484/velorahd/wallpapers/i6oeefufwc6op5tmbegq.webp', description: 'Cinematic vistas, misty rivers, and raw wilderness.' },
  { name: 'Cyberpunk', label: 'Cyberpunk Neon', photo: 'https://res.cloudinary.com/dqiimxtb3/image/upload/v1781458599/velorahd/wallpapers/u1po69hcao5odyavbqvw.webp', description: 'Rain-soaked alleyways, holograms, and neon lights.' }
];

export default function Home() {
  const navigate = useNavigate();
  const { data: trending, isLoading: trendingLoading } = useTrendingWallpapers();
  const { data: latest, isLoading: latestLoading } = useLatestWallpapers();

  // Find daily spotlight wallpaper from trending
  const dailySpotlight = trending && trending.length > 0 ? trending[new Date().getDate() % trending.length] : null;

  return (
    <div className="pt-16 pb-16 overflow-hidden">
      <SEO
        title="Premium 4K & Live Wallpapers Marketplace"
        description="Velora HD — Premium wallpaper marketplace. Discover loop-ready live video motion wallpapers, high resolution 4K desktop themes, and mobile backgrounds. Transform every screen into art."
        keywords={["wallpapers", "4k wallpapers", "live wallpapers", "desktop setups", "mobile wallpapers", "velora hd"]}
      />

      {/* 1. Hero Art Showcase (Split Screen Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 border-b border-border">
        {/* Left Side: Dynamic Showcase Poster */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-4 select-none group/spotlight mb-2">
            {/* Viewfinder + Animated Glyph */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 group-hover/spotlight:border-primary transition-colors duration-300" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/40 group-hover/spotlight:border-primary transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/40 group-hover/spotlight:border-primary transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 group-hover/spotlight:border-primary transition-colors duration-300" />
              
              {/* Radar pulse */}
              <div className="absolute w-6 h-6 rounded-full border border-primary/20 animate-ping opacity-40" />
              
              {/* Spinning dashboard outer */}
              <svg className="w-8 h-8 text-primary/50 animate-[spin_8s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
              
              {/* Spinning dashboard inner (reverse) */}
              <svg className="absolute w-6 h-6 text-primary/70 animate-[spin_4s_linear_infinite_reverse]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="6" strokeWidth="1" strokeDasharray="5 2" />
              </svg>

              {/* Core emblem (user's logo symbol) */}
              <img 
                src="/favicon.png" 
                alt="" 
                className="absolute w-3.5 h-3.5 object-contain opacity-85 group-hover/spotlight:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            {/* Vertical separator line */}
            <div className="h-8 w-px bg-border" />
            
            {/* Minimalist geometric data bars & grid indicator */}
            <div className="flex flex-col gap-1.5">
              {/* Animated visual waves */}
              <div className="flex items-center gap-1 h-3">
                <div className="w-1 h-2 bg-primary/40 rounded-full group-hover/spotlight:h-3 group-hover/spotlight:bg-primary transition-all duration-300" />
                <div className="w-1 h-3 bg-primary/80 rounded-full group-hover/spotlight:h-1 group-hover/spotlight:bg-primary transition-all duration-300 delay-75" />
                <div className="w-1 h-1 bg-primary/60 rounded-full group-hover/spotlight:h-2 group-hover/spotlight:bg-primary transition-all duration-300 delay-100" />
                <div className="w-1 h-2.5 bg-primary/50 rounded-full group-hover/spotlight:h-3 group-hover/spotlight:bg-primary transition-all duration-300 delay-150" />
                <div className="w-1 h-1 bg-primary/30 rounded-full group-hover/spotlight:h-2 group-hover/spotlight:bg-primary transition-all duration-300 delay-200" />
              </div>
              
              {/* Tech grid system icons (circles and squares) */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 bg-primary/20 rounded-sm" />
                  <span className="w-1 h-1 bg-primary/40 rounded-sm" />
                  <span className="w-1 h-1 bg-primary/60 rounded-sm" />
                  <span className="w-1 h-1 bg-primary rounded-sm" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight text-white leading-[1.05]">
            Screens<br />
            <span className="text-primary">Elevated as Art.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-lg leading-relaxed">
            Discover a curated collection of ultra-high-resolution 4K static graphics and cinematically styled loop-ready live motion wallpapers.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/explore"
              className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-primary/10"
            >
              Browse Collections
            </Link>
            <Link
              to="/explore?isPremium=true"
              className="px-6 py-3 rounded-lg border border-border bg-surface hover:bg-surface-2 text-white font-semibold text-xs tracking-wider uppercase transition"
            >
              Exclusive Art
            </Link>
          </div>
        </div>

        {/* Right Side: Huge visual card overlaying search capability */}
        <div className="w-full lg:w-1/2 aspect-[1.8/1] rounded-2xl overflow-hidden border border-border bg-surface relative group dark-card shadow-2xl">
          {dailySpotlight ? (
            <Link to={`/wallpaper/${dailySpotlight.slug}`} className="absolute inset-0 block">
              <img
                src={optimiseUrl(dailySpotlight.previewImage, { width: 800 })}
                alt={dailySpotlight.title}
                loading="eager"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-primary">Daily Selection</span>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-white">{dailySpotlight.title}</h2>
                  <p className="text-[10px] text-text-muted">{dailySpotlight.category} • {dailySpotlight.resolution}</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
                  View Space <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Curated Collections Visual Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
        <div className="mb-10 text-center space-y-2">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Editor Picks</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Curated Collections</h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">Explore handpicked backgrounds organized by atmospheric style preferences.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedCollections.map((col) => (
            <Link
              key={col.name}
              to={`/explore?category=${col.name}`}
              className="group dark-card h-80 rounded-2xl overflow-hidden border border-border bg-surface relative flex flex-col justify-end p-6 hover:border-gray-500 transition-all duration-300"
            >
              <img
                src={optimiseUrl(col.photo, { width: 400 })}
                alt={col.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 space-y-2">
                <h3 className="font-display font-bold text-lg text-white group-hover:text-primary transition-colors">
                  {col.label}
                </h3>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[10px] font-semibold text-primary uppercase tracking-wider">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Trending Creations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Popular Downloads
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
              Trending Creations
            </h2>
          </div>
          <Link to="/explore?sort=downloads" className="text-xs font-semibold text-text-muted hover:text-white transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : trending?.slice(0, 4).map((wp) => (
                <WallpaperCard key={wp._id} wallpaper={wp} />
              ))}
        </div>
      </section>

      {/* 4. Latest Releases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Fresh Additions
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
              Latest Releases
            </h2>
          </div>
          <Link to="/explore?sort=latest" className="text-xs font-semibold text-text-muted hover:text-white transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : latest?.slice(0, 4).map((wp) => (
                <WallpaperCard key={wp._id} wallpaper={wp} />
              ))}
        </div>
      </section>
    </div>
  );
}
