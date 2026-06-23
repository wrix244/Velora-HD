import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Compass, Search, SlidersHorizontal, RefreshCw, X, Filter } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useUIStore from '../store/uiStore';
import { usePurchaseHistory } from '../hooks/usePurchases';
import { useCategories } from '../hooks/useCategories';

const resolutions = ['All', '3840x2160', '1920x1080', '1440x3200', '1080x1920'];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const recentlyViewed = useUIStore((state) => state.recentlyViewed);
  const clearRecentlyViewed = useUIStore((state) => state.clearRecentlyViewed);
  const { data: purchases } = usePurchaseHistory();
  const { data: dbCategories } = useCategories();
  const categories = dbCategories ? ['All', ...dbCategories] : ['All', 'Nature', 'Space', 'Cyberpunk', 'Anime', 'Cars', 'Gaming', 'Minimal', 'Abstract', 'Fantasy', 'Technology', 'Architecture'];

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract purchased wallpaper ids to pass to card rendering
  const purchasedIds = purchases ? purchases.map((p) => p.wallpaperId?._id) : [];

  const isMobilePath = location.pathname === '/mobile';
  const isPcPath = location.pathname === '/pc';
  const isPremiumPath = location.pathname === '/premium';

  // Helper to derive filter states from URL or path default values
  const getInitialValue = (key, fallback) => {
    const fromParam = searchParams.get(key);
    if (fromParam !== null) return fromParam;
    
    if (key === 'deviceType') {
      if (isMobilePath) return 'mobile';
      if (isPcPath) return 'desktop';
    }
    if (key === 'isPremium') {
      if (isPremiumPath) return 'true';
    }
    return fallback;
  };

  // Filter States synced with URL SearchParams & Path defaults
  const [search, setSearch] = useState(getInitialValue('search', ''));
  const [category, setCategory] = useState(getInitialValue('category', 'All'));
  const [resolution, setResolution] = useState(getInitialValue('resolution', 'All'));
  const [isPremium, setIsPremium] = useState(getInitialValue('isPremium', 'All'));
  const [type, setType] = useState(getInitialValue('type', 'All'));
  const [deviceType, setDeviceType] = useState(getInitialValue('deviceType', 'All'));
  const [sort, setSort] = useState(getInitialValue('sort', 'latest'));

  // Trigger filters update when URL query params or path change
  useEffect(() => {
    setSearch(getInitialValue('search', ''));
    setCategory(getInitialValue('category', 'All'));
    setResolution(getInitialValue('resolution', 'All'));
    setIsPremium(getInitialValue('isPremium', 'All'));
    setType(getInitialValue('type', 'All'));
    setDeviceType(getInitialValue('deviceType', 'All'));
    setSort(getInitialValue('sort', 'latest'));
  }, [searchParams, location.pathname]);

  // Combined filters object for query keys
  const filters = {
    search,
    category,
    resolution,
    isPremium: isPremium === 'true' ? 'true' : isPremium === 'false' ? 'false' : '',
    type,
    deviceType,
    sort,
  };

  // React Query Infinite Scroll Hook
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useWallpapers(filters);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange('search', search);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSearch('');
  };

  let pageTitle = "Explore Wallpapers (4K) | Velora HD";
  let displayTitle = "Explore Wallpapers";
  let seoDesc = "Browse and search our entire collection of high resolution 4K wallpapers. Filter by category, resolution, device, format, and price.";

  if (isMobilePath) {
    pageTitle = "Mobile Wallpapers (4K) | Velora HD";
    displayTitle = "Mobile Wallpapers";
    seoDesc = "Download premium mobile wallpapers in high resolution 4K quality. Curated vertical backgrounds for iPhone and Android devices.";
  } else if (isPcPath) {
    pageTitle = "PC Wallpapers (4K) | Velora HD";
    displayTitle = "PC Wallpapers";
    seoDesc = "Download premium 4K desktop setups and PC wallpapers in ultra-high resolution. Curated widescreen layouts and backgrounds.";
  } else if (isPremiumPath) {
    pageTitle = "Premium Wallpapers (4K) | Velora HD";
    displayTitle = "Premium Wallpapers";
    seoDesc = "Explore exclusive premium wallpapers and motion assets in 4K resolution. Unlock elite backgrounds on Velora HD.";
  }

  const renderFiltersList = () => (
    <div className="space-y-6">
      {/* Search query tag feedback */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h2 className="font-display font-bold text-xs text-white flex items-center gap-2 uppercase tracking-widest">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter options
        </h2>
        <button
          onClick={handleClearFilters}
          className="text-[10px] font-bold tracking-wider text-rose-400 uppercase hover:text-rose-300 transition"
        >
          Reset
        </button>
      </div>

      {/* Filter: Categories */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Category</label>
        <div className="flex flex-col gap-1.5">
          {categories.slice(0, 10).map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', cat)}
              className={`text-left text-xs transition-colors py-1 cursor-pointer ${
                category === cat ? 'text-primary font-bold' : 'text-text-muted hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter: Device Screen */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Device Type</label>
        <div className="flex flex-col gap-1.5">
          {['All', 'desktop', 'mobile'].map((d) => (
            <button
              key={d}
              onClick={() => handleFilterChange('deviceType', d)}
              className={`text-left text-xs transition-colors py-1 cursor-pointer capitalize ${
                deviceType === d ? 'text-primary font-bold' : 'text-text-muted hover:text-white'
              }`}
            >
              {d === 'desktop' ? 'PC Setup' : d === 'mobile' ? 'Mobile Phone' : 'All Formats'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter: Wallpaper Form (Static/Live) */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Format</label>
        <div className="flex flex-col gap-1.5">
          {['All', 'static', 'live'].map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange('type', t)}
              className={`text-left text-xs transition-colors py-1 cursor-pointer capitalize ${
                type === t ? 'text-primary font-bold' : 'text-text-muted hover:text-white'
              }`}
            >
              {t === 'All' ? 'All Mediums' : t === 'static' ? 'Static Art' : 'Live loop'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter: Access (Free/Premium) */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Access Mode</label>
        <div className="flex flex-col gap-1.5">
          {['All', 'false', 'true'].map((p) => (
            <button
              key={p}
              onClick={() => handleFilterChange('isPremium', p)}
              className={`text-left text-xs transition-colors py-1 cursor-pointer capitalize ${
                isPremium === p ? 'text-primary font-bold' : 'text-text-muted hover:text-white'
              }`}
            >
              {p === 'true' ? 'Premium (Locked)' : p === 'false' ? 'Free (Open)' : 'All Access'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter: Resolution */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Resolution</label>
        <select
          value={resolution}
          onChange={(e) => handleFilterChange('resolution', e.target.value)}
          className="w-full px-3 py-1.5 text-xs clean-input bg-surface"
        >
          {resolutions.map((res) => (
            <option key={res} value={res} className="bg-surface text-white">
              {res}
            </option>
          ))}
        </select>
      </div>

      {/* Filter: Sorting */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Sort By</label>
        <select
          value={sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="w-full px-3 py-1.5 text-xs clean-input bg-surface"
        >
          <option value="latest" className="bg-surface text-white">Latest Uploads</option>
          <option value="downloads" className="bg-surface text-white">Most Downloaded</option>
          <option value="likes" className="bg-surface text-white">Most Liked</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="pt-20 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title={pageTitle}
        description={seoDesc}
        keywords={[
          isMobilePath ? "mobile wallpapers" : isPcPath ? "pc wallpapers" : isPremiumPath ? "premium wallpapers" : "explore wallpapers",
          "4k wallpapers",
          "live wallpapers",
          "velora hd"
        ]}
      />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-border">
        <div>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Discovery Engine
          </span>
          <h1 className="font-display font-black text-3xl text-white mt-1">
            {displayTitle}
          </h1>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by title, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs clean-input"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  handleFilterChange('search', '');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-xs transition"
          >
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Main split display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Desktop Left Sidebar: Sticky Console */}
        <aside 
          data-lenis-prevent
          className="hidden lg:block lg:col-span-3 sticky top-24 self-start p-6 rounded-2xl bg-surface border border-border max-h-[calc(100vh-120px)] overflow-y-auto pr-3"
        >
          {renderFiltersList()}
        </aside>

        {/* Right Side Canvas (Art Grid) */}
        <main className="col-span-1 lg:col-span-9 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : data?.pages[0]?.data?.length === 0 ? (
            <div className="p-16 rounded-2xl bg-surface border border-border text-center flex flex-col items-center justify-center space-y-4">
              <SlidersHorizontal className="w-10 h-10 text-text-muted animate-pulse" />
              <h3 className="font-display font-bold text-lg text-white">No wallpapers match these filters</h3>
              <p className="text-xs text-text-muted max-w-sm leading-relaxed">
                Try widening your search terms, changing screen device layout constraints, or resetting the filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2 bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary/30 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {data?.pages.map((page) =>
                  page.data.map((wp) => (
                    <WallpaperCard
                      key={wp._id}
                      wallpaper={wp}
                      purchased={purchasedIds.includes(wp._id)}
                    />
                  ))
                )}
              </div>

              {/* Load More Trigger */}
              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-8 py-3 rounded-lg bg-surface border border-border hover:bg-surface-2 text-white font-semibold text-xs transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Loading Next...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sticky floating Filter button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs tracking-wider uppercase shadow-2xl transition"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Drawer (Bottom Sheet) */}
      {mobileFiltersOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setMobileFiltersOpen(false)} />
          <div 
            data-lenis-prevent
            className="lg:hidden fixed bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto bg-surface border-t border-border rounded-t-3xl z-50 p-6 space-y-6 transition-transform duration-300"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-widest">Filter parameters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded bg-surface-2 text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {renderFiltersList()}

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              <span>Show Results</span>
            </button>
          </div>
        </>
      )}

      {/* Recently Viewed Session */}
      {recentlyViewed.length > 0 && (
        <section className="mt-24 border-t border-border pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                Your Browsing Session
              </span>
              <h3 className="font-display font-bold text-xl text-white mt-0.5">
                Recently Viewed
              </h3>
            </div>
            <button
              onClick={clearRecentlyViewed}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition uppercase tracking-wide"
            >
              Clear History
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {recentlyViewed.map((wp) => (
              <WallpaperCard
                key={`recent-${wp._id}`}
                wallpaper={wp}
                purchased={purchasedIds.includes(wp._id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
