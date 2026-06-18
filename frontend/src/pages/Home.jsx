import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { Compass, Sparkles, TrendingUp, Clock, Eye, Layers, ShieldCheck, Download, Award, Heart, CheckCircle } from 'lucide-react';
import { useTrendingWallpapers, useLatestWallpapers, useRecommendedWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';

// 11 Categories with curated preview backgrounds (low res Unsplash thumbnails)
const categories = [
  { name: 'Nature', photo: '1501785888041-af3ef285b470', gradient: 'from-emerald-500 to-lime-400' },
  { name: 'Space', photo: '1451187580459-43490279c0fa', gradient: 'from-violet-500 to-fuchsia-400' },
  { name: 'Cyberpunk', photo: '1515621061946-eff1c2a352bd', gradient: 'from-pink-500 to-rose-400' },
  { name: 'Anime', photo: 'local:/wallpapers/anime/category-thumb.webp', gradient: 'from-orange-500 to-yellow-400' },
  { name: 'Cars', photo: '1525609004556-c46c7d6cf0a3', gradient: 'from-red-500 to-orange-400' },
  { name: 'Gaming', photo: '1538481199705-c710c4e965fc', gradient: 'from-fuchsia-500 to-purple-400' },
  { name: 'Minimal', photo: '1507525428034-b723cf961d3e', gradient: 'from-zinc-500 to-zinc-300' },
  { name: 'Abstract', photo: '1541701494587-cb58502866ab', gradient: 'from-cyan-400 to-teal-300' },
  { name: 'Fantasy', photo: '1518709268805-4e9042af9f23', gradient: 'from-pink-400 to-amber-300' },
  { name: 'Technology', photo: '1518770660439-4636190af475', gradient: 'from-sky-400 to-cyan-300' },
  { name: 'Architecture', photo: '1486406146926-c627a92ad1ab', gradient: 'from-blue-400 to-indigo-300' },
];

// Theme managed globally via CSS data-theme attribute

const stats = [
  { value: '15,000+', label: 'Total Wallpapers', icon: <Layers className="w-5 h-5 text-primary" /> },
  { value: '4.8M+', label: 'Downloads', icon: <Download className="w-5 h-5 text-accent" /> },
  { value: '1,200+', label: 'Creators', icon: <Award className="w-5 h-5 text-secondary" /> },
  { value: '3,800+', label: 'Premium Assets', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
];

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'iOS Designer',
    comment: 'Velora HD has completely replaced where I find layouts for my device mocks. The quality of resolution and live motion renders is spectacular!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    name: 'Marcus V.',
    role: 'Setup Enthusiast',
    comment: 'The glassmorphic dark design of the site matches my desk setup vibe perfectly. The PC live wallpapers run smooth and loop without any hitch.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
  },
  {
    name: 'Elena R.',
    role: 'Creative Director',
    comment: 'Finding high-resolution 4K technology and space art that actually matches premium displays was impossible until I found Velora HD.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: trending, isLoading: trendingLoading } = useTrendingWallpapers();
  const { data: latest, isLoading: latestLoading } = useLatestWallpapers();
  const { data: recommended, isLoading: recommendedLoading } = useRecommendedWallpapers();


  return (
    <div className="pt-16 pb-12 overflow-hidden">
      <SEO
        title="Premium 4K & Live Wallpapers Marketplace"
        description="Velora HD — Premium wallpaper marketplace. Discover loop-ready live video motion wallpapers, high resolution 4K desktop themes, and mobile backgrounds. Transform every screen into art."
        keywords={["wallpapers", "4k wallpapers", "live wallpapers", "desktop setups", "mobile wallpapers", "velora hd"]}
      />
      
      {/* 1. Hero Section — Minimalist */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-24 px-4 overflow-hidden">
        {/* Subtle gradient orbs — no image dependency */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.07] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/[0.05] blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <h1 className="font-display font-black text-5xl md:text-7xl tracking-tight text-white leading-[1.08] animate-slide-up-hero-title">
            Your Screen,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Elevated.
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-lg mx-auto leading-relaxed animate-fade-in-hero-para">
            Curated 4K wallpapers, live motion backgrounds, and premium digital art — all in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4 animate-slide-up-hero-buttons">
            <Link
              to="/explore"
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all flex items-center gap-2 btn-glow"
            >
              <Compass className="w-4 h-4" />
              Browse Collection
            </Link>
            <Link
              to="/explore?isPremium=true"
              className="px-8 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm border border-white/10 hover:border-white/15 transition-all"
            >
              View Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Wallpaper of the Day Spotlight Section */}
      {trending && trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="relative rounded-3xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 border border-white/5 shadow-2xl">
            {/* Spotlight badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full bg-primary/25 text-white border border-primary/20 text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Daily Spotlight
              </span>
            </div>

            {(() => {
              const day = new Date().getDate();
              // Pick deterministically from trending list
              const dailyWp = trending[day % trending.length];
              if (!dailyWp) return null;

              return (
                <>
                  {/* Left side: Preview screen with modern zoom effect */}
                  <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden bg-slate-950/40 border border-white/5 relative group flex-shrink-0">
                    <img
                      src={dailyWp.previewImage}
                      alt={dailyWp.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {dailyWp.type === 'live' && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold tracking-widest uppercase text-white border border-white/10">
                        Live Motion
                      </span>
                    )}
                  </div>

                  {/* Right side: Info and CTA */}
                  <div className="w-full lg:w-1/2 space-y-4 text-left pt-6 lg:pt-0">
                    <div>
                      <span className="text-[10px] font-bold text-accent tracking-widest uppercase">
                        Spotlight Feature
                      </span>
                      <h3 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
                        {dailyWp.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-lg">
                        {dailyWp.description || "Transform your device setup with today's community spotlight. Featuring stunning detail, curated gradients, and optimized layouts."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {dailyWp.tags?.slice(0, 4).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-medium text-gray-400 capitalize">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-6">
                      <Link
                        to={`/wallpaper/${dailyWp.slug}`}
                        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase shadow-xl hover:shadow-primary/20 transition-all cursor-pointer"
                      >
                        View Spotlight
                      </Link>
                      <div className="text-[10px] text-gray-500 font-medium">
                        Category: <strong className="text-gray-300 capitalize">{dailyWp.category}</strong>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      )}

      {/* 2. Featured/Trending Wallpapers Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Hot Right Now
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
              Trending Wallpapers
            </h2>
          </div>
          <Link to="/explore?sort=downloads" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {trendingLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : trending?.slice(0, 4).map((wp) => (
                <WallpaperCard key={wp._id} wallpaper={wp} />
              ))}
        </div>
      </section>

      {/* Recommended For You Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-accent tracking-widest uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Tailored For You
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
              Recommended For You
            </h2>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
            Explore More
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {recommendedLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : recommended?.slice(0, 4).map((wp) => (
                <WallpaperCard key={wp._id} wallpaper={wp} />
              ))}
        </div>
      </section>

      {/* 3. Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-accent tracking-widest uppercase">
            Curated Themes
          </span>
          <h2 className="font-display font-bold text-3xl text-white mt-1">
            Browse by Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={`/explore?category=${cat.name}`}
              className="group relative h-28 rounded-2xl overflow-hidden flex items-center justify-center text-center p-4 border border-white/5 transition-all"
            >
              {/* Category Image Overlay */}
              <img
                src={cat.photo.startsWith('local:') ? cat.photo.replace('local:', '') : `https://images.unsplash.com/photo-${cat.photo}?auto=format&fit=crop&w=150&q=50`}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-300 z-0"
              />
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-20 group-hover:opacity-40 transition-opacity z-1`} />
              
              <span className="font-display font-bold text-sm text-white relative z-10 group-hover:text-shadow group-hover:scale-105 transition-all">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Latest Uploads Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-secondary tracking-widest uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Fresh Drops
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
              Latest Releases
            </h2>
          </div>
          <Link to="/explore?sort=latest" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {latestLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : latest?.slice(0, 4).map((wp) => (
                <WallpaperCard key={wp._id} wallpaper={wp} />
              ))}
        </div>
      </section>

      {/* 5. Premium Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden glass-panel-glow p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle colored background shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
          
          <div className="space-y-4 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Premium Assets
            </span>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white">
              Unlock Masterpiece Live & Static Designs
            </h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Gain access to ultra-high-resolution 4K and 8K cinematic photography, custom anime animations, and looping 3D live wallpapers to make your setup look premium and alive.
            </p>
            <ul className="grid grid-cols-2 gap-2 pt-2 text-xs text-gray-300">
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary"/> Loop-Ready Video</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary"/> Crystal Clear 4K/8K</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary"/> Infinite Downloads</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary"/> Lifetime Access</li>
            </ul>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/explore?isPremium=true"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm hover:scale-[1.02] transition-all inline-flex items-center gap-2"
            >
              Explore Premium Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((item, index) => (
            <div key={item.label} className="p-6 rounded-2xl glass-panel flex flex-col items-center">
              <div className="p-3 bg-white/5 rounded-xl mb-4">{item.icon}</div>
              <h4 className="font-display font-black text-2xl md:text-3xl text-white">
                {item.value}
              </h4>
              <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Community Feedback
          </span>
          <h2 className="font-display font-bold text-3xl text-white mt-1">
            Loved by Setup Creators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={t.name} className="p-6 rounded-2xl glass-card flex flex-col justify-between">
              <p className="text-xs text-gray-300 italic leading-relaxed">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h5 className="font-display font-semibold text-xs text-white">{t.name}</h5>
                  <p className="text-[10px] text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
