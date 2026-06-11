import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Search, SlidersHorizontal, RefreshCw, X, EyeOff } from 'lucide-react';
import { useWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/common/WallpaperCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useUIStore from '../store/uiStore';
import { usePurchaseHistory } from '../hooks/usePurchases';

const categories = ['All', 'Nature', 'Space', 'Cyberpunk', 'Anime', 'Cars', 'Gaming', 'Minimal', 'Abstract', 'Fantasy', 'Technology', 'Architecture'];
const resolutions = ['All', '3840x2160', '1920x1080', '1440x3200', '1080x1920'];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const recentlyViewed = useUIStore((state) => state.recentlyViewed);
  const clearRecentlyViewed = useUIStore((state) => state.clearRecentlyViewed);
  const { data: purchases } = usePurchaseHistory();

  // Extract purchased wallpaper ids to pass to card rendering
  const purchasedIds = purchases ? purchases.map((p) => p.wallpaperId?._id) : [];

  // Filter States synced with URL SearchParams
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [resolution, setResolution] = useState(searchParams.get('resolution') || 'All');
  const [isPremium, setIsPremium] = useState(searchParams.get('isPremium') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [deviceType, setDeviceType] = useState(searchParams.get('deviceType') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');

  // Trigger filters update when URL query params change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'All');
    setResolution(searchParams.get('resolution') || 'All');
    setIsPremium(searchParams.get('isPremium') || 'All');
    setType(searchParams.get('type') || 'All');
    setDeviceType(searchParams.get('deviceType') || 'All');
    setSort(searchParams.get('sort') || 'latest');
  }, [searchParams]);

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
    refetch,
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

  return (
    <div className="pt-20 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Discovery Engine
          </span>
          <h1 className="font-display font-black text-3xl text-white mt-1">
            Explore Wallpapers
          </h1>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm glass-input"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  handleFilterChange('search', '');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-primary/10"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Advanced Filters Bar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl glass-panel space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h2 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Refine Search
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
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 text-xs glass-input focus:bg-[#1A1A1A]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#121212] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Device Screen */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Device Layout</label>
              <div className="grid grid-cols-3 gap-1">
                {['All', 'desktop', 'mobile'].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleFilterChange('deviceType', d)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wide border uppercase transition ${
                      deviceType === d
                        ? 'bg-primary border-primary text-white font-black'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10 text-gray-300'
                    }`}
                  >
                    {d === 'desktop' ? 'PC' : d === 'mobile' ? 'Mobile' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Wallpaper Form (Static/Live) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Format</label>
              <div className="grid grid-cols-3 gap-1">
                {['All', 'static', 'live'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleFilterChange('type', t)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wide border uppercase transition ${
                      type === t
                        ? 'bg-accent border-accent text-slate-950 font-black'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10 text-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Price (Free/Premium) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Access</label>
              <div className="grid grid-cols-3 gap-1">
                {['All', 'false', 'true'].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleFilterChange('isPremium', p)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wide border uppercase transition ${
                      isPremium === p
                        ? 'bg-amber-500 border-amber-500 text-slate-950 font-black'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10 text-gray-300'
                    }`}
                  >
                    {p === 'true' ? 'Premium' : p === 'false' ? 'Free' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Resolution */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => handleFilterChange('resolution', e.target.value)}
                className="w-full px-3 py-2 text-xs glass-input focus:bg-[#1A1A1A]"
              >
                {resolutions.map((res) => (
                  <option key={res} value={res} className="bg-[#121212] text-white">
                    {res}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Sorting */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Sort By</label>
              <select
                value={sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 text-xs glass-input focus:bg-[#1A1A1A]"
              >
                <option value="latest" className="bg-[#121212] text-white">Latest Uploads</option>
                <option value="downloads" className="bg-[#121212] text-white">Most Downloaded</option>
                <option value="likes" className="bg-[#121212] text-white">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Wallpaper Grid / Infinite Scroll */}
        <div className="lg:col-span-3 space-y-8">
          {isLoading ? (
            // Shimmer Loaders
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : data?.pages[0]?.data?.length === 0 ? (
            // Empty State
            <div className="p-16 rounded-2xl glass-panel text-center flex flex-col items-center justify-center space-y-4">
              <SlidersHorizontal className="w-10 h-10 text-gray-500 animate-pulse" />
              <h3 className="font-display font-bold text-lg text-white">No wallpapers match these filters</h3>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Try widening your search terms, changing screen device layout constraints, or resetting the filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-semibold hover:bg-primary/30 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            // Results Grid
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

              {/* Load More Button / Bottom state */}
              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-8 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 hover:border-white/20 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Loading Next...
                      </>
                    ) : (
                      'Load More Wallpapers'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="mt-20 border-t border-white/5 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase">
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
