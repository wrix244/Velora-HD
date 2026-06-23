import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { Compass, Sparkles, TrendingUp, Clock, Layers, ArrowRight, ShieldCheck, CheckCircle, Users, Award, Shield } from 'lucide-react';
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
            Free 4K & Live<br />
            <span className="text-primary">Wallpapers.</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-lg leading-relaxed">
            VeloraHD is a clean, growing digital backdrop community. Access our curated catalog of <strong className="text-white">free 4K static wallpapers</strong>, <strong className="text-white">free loop live wallpapers</strong>, and original AI-curated content—built today for collectors, and designed tomorrow as a creator-friendly publishing platform.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/explore"
              className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-primary/10"
            >
              <span>Browse Collections</span>
            </Link>
            <Link
              to="/explore?isPremium=true"
              className="px-6 py-3 rounded-lg border border-border bg-surface hover:bg-surface-2 text-white font-semibold text-xs tracking-wider uppercase transition"
            >
              Exclusive Art
            </Link>
          </div>

          {/* Hero Trust Badges */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-6 border-t border-border/60 max-w-md">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Original AI-Generated Art</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Secure HTTPS Experience</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted">
              <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Creator-Friendly Platform</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted">
              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>Free Personal Backdrop Use</span>
            </div>
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
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-primary">Daily Selection</span>
                  <h2 className="font-display font-bold text-base sm:text-xl text-white">{dailySpotlight.title}</h2>
                  <p className="text-[10px] text-text-muted">{dailySpotlight.category} • {dailySpotlight.resolution}</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1 self-start sm:self-auto flex-shrink-0">
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

      {/* Why VeloraHD Value Proposition Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
        <div className="mb-10 text-center space-y-2">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">The VeloraHD Difference</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Why Choose VeloraHD?</h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">We cut through the spam and ads of traditional wallpaper directories to bring you a clean, secure gallery.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 rounded-2xl border border-border bg-surface space-y-2.5">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">01 / Free Access</span>
            <h3 className="font-display font-bold text-base text-white">Always Free Downloads</h3>
            <p className="text-xs text-text-muted leading-relaxed">Download high-definition wallpapers without paywalls or expensive recurring subscription models.</p>
          </div>
          <div className="card p-6 rounded-2xl border border-border bg-surface space-y-2.5">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">02 / Curation</span>
            <h3 className="font-display font-bold text-base text-white">Original AI-Generated Art</h3>
            <p className="text-xs text-text-muted leading-relaxed">Visuals designed and upscaled by our team using modern generative workflows and custom creative touch-ups.</p>
          </div>
          <div className="card p-6 rounded-2xl border border-border bg-surface space-y-2.5">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">03 / Performance</span>
            <h3 className="font-display font-bold text-base text-white">Fast & CDN-Cached</h3>
            <p className="text-xs text-text-muted leading-relaxed">Direct links powered by Cloudinary. Quick asset loading that never slows down your device browser.</p>
          </div>
          <div className="card p-6 rounded-2xl border border-border bg-surface space-y-2.5">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">04 / Clean UI</span>
            <h3 className="font-display font-bold text-base text-white">No Fake Download Buttons</h3>
            <p className="text-xs text-text-muted leading-relaxed">No misleading advertisement popups, cookie loops, or deceptive redirects. Click, get, and set.</p>
          </div>
          <div className="card p-6 rounded-2xl border border-border bg-surface space-y-2.5">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">05 / Safety</span>
            <h3 className="font-display font-bold text-base text-white">Secure HTTPS Encryption</h3>
            <p className="text-xs text-text-muted leading-relaxed">100% encrypted, malware-free direct file distribution. No system installers or executables.</p>
          </div>
          <div className="card p-6 rounded-2xl border border-border bg-surface space-y-2.5">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">06 / Layouts</span>
            <h3 className="font-display font-bold text-base text-white">Desktop & Mobile Support</h3>
            <p className="text-xs text-text-muted leading-relaxed">Art pieces specifically formatted and checked for widescreen monitors and vertical smartphones.</p>
          </div>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
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

      {/* 5. Platform, Mission & Creator Community Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Our Mission & Licensing */}
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Our Core Mission</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
              Making premium art accessible to everyone.
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              We believe high-quality screen backdrops shouldn't be locked behind expensive memberships or buried in spyware-filled directories. VeloraHD operates as a clean repository where curated designs are shared transparently.
            </p>
            
            <div className="pt-4 border-t border-border space-y-3">
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Licensing & Usage Transparency</h4>
              <p className="text-[11px] text-text-muted leading-relaxed">
                All standard downloads on VeloraHD are licensed for <strong className="text-white">personal backdrops</strong> on desktop monitors, laptops, and smartphones. Commercial use, product bundling, or distribution requires explicit consent. Direct copyright ownership details and license types are listed under the "Technical Metadata" on every wallpaper's page. Read our full <Link to="/copyright" className="text-primary hover:underline font-semibold">Copyright Framework</Link> to learn more.
              </p>
            </div>
          </div>

          {/* Right: Creator Program Onboarding */}
          <div className="card p-6 sm:p-8 rounded-3xl border border-border bg-surface space-y-5">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Creator Program</span>
            <h3 className="font-display font-bold text-xl text-white">Join the Creator Circle</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Showcase your digital art, AI illustrations, and motion wallpapers. Apply to join our creator program and start sharing your work with a global community:
            </p>
            <ul className="text-[11px] text-text-muted space-y-2.5 pl-1">
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Upload and publish high-resolution static or live wallpapers directly.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Retain proper credit, display attribution, and manage licensing preferences.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Build your custom creator portfolio page to grow your following.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/become-creator"
                className="inline-flex px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold text-[10px] tracking-wider uppercase rounded-lg transition"
              >
                <span>Hop on Creator Program</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
