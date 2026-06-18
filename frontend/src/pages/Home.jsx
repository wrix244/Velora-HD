import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { Compass, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useTrendingWallpapers, useLatestWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';

const categories = [
  'Nature', 'Space', 'Cyberpunk', 'Anime', 'Cars',
  'Gaming', 'Minimal', 'Abstract', 'Fantasy', 'Technology', 'Architecture',
];

export default function Home() {
  const { data: trending, isLoading: trendingLoading } = useTrendingWallpapers();
  const { data: latest, isLoading: latestLoading } = useLatestWallpapers();

  return (
    <div className="pt-16 pb-12">
      <SEO
        title="Premium 4K & Live Wallpapers Marketplace"
        description="Velora HD — Premium wallpaper marketplace. Discover loop-ready live video motion wallpapers, high resolution 4K desktop themes, and mobile backgrounds. Transform every screen into art."
        keywords={["wallpapers", "4k wallpapers", "live wallpapers", "desktop setups", "mobile wallpapers", "velora hd"]}
      />

      {/* ─── Hero ─── */}
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="font-display font-black text-5xl md:text-7xl tracking-tight text-white leading-[1.05] animate-slide-up-hero-title">
            Your Screen,{' '}
            <span className="text-primary">Elevated.</span>
          </h1>

          <p className="text-base md:text-lg text-text-muted max-w-md mx-auto leading-relaxed animate-fade-in-hero-para">
            Curated 4K wallpapers, live motion backgrounds, and premium digital art.
          </p>

          <div className="pt-2 animate-slide-up-hero-buttons">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors"
            >
              <Compass className="w-4 h-4" />
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trending ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-semibold text-primary tracking-wider uppercase flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Trending
            </span>
            <h2 className="font-display font-bold text-2xl text-white mt-1">
              Popular Right Now
            </h2>
          </div>
          <Link to="/explore?sort=downloads" className="text-xs font-medium text-text-muted hover:text-white transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {trendingLoading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : trending?.slice(0, 4).map((wp) => (
                <WallpaperCard key={wp._id} wallpaper={wp} />
              ))}
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display font-bold text-lg text-white mb-4">
          Browse by Category
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/explore?category=${cat}`}
              className="px-4 py-2 rounded-lg bg-surface border border-border text-sm text-text-muted hover:text-white hover:border-zinc-500 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Daily Spotlight ─── */}
      {trending && trending.length > 0 && (() => {
        const day = new Date().getDate();
        const dailyWp = trending[day % trending.length];
        if (!dailyWp) return null;

        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="card rounded-2xl p-5 md:p-8 flex flex-col lg:flex-row items-center gap-6">
              {/* Preview */}
              <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden bg-surface-2 relative group flex-shrink-0">
                <img
                  src={dailyWp.previewImage}
                  alt={dailyWp.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                {dailyWp.type === 'live' && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-bold tracking-widest uppercase text-white">
                    Live
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="w-full lg:w-1/2 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">
                  <Sparkles className="w-3 h-3" /> Daily Spotlight
                </span>
                <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                  {dailyWp.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                  {dailyWp.description || "Today's featured wallpaper — curated for quality and visual impact."}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dailyWp.tags?.slice(0, 4).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-surface-2 border border-border rounded text-[10px] text-text-muted capitalize">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    to={`/wallpaper/${dailyWp.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ─── Latest ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-semibold text-text-muted tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> New
            </span>
            <h2 className="font-display font-bold text-2xl text-white mt-1">
              Latest Releases
            </h2>
          </div>
          <Link to="/explore?sort=latest" className="text-xs font-medium text-text-muted hover:text-white transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {latestLoading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : latest?.slice(0, 4).map((wp) => (
                <WallpaperCard key={wp._id} wallpaper={wp} />
              ))}
        </div>
      </section>
    </div>
  );
}
