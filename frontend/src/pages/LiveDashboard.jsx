import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Activity, Users, Download, Heart, Image, ShoppingBag,
  TrendingUp, Clock, Eye, Zap, Monitor, Smartphone,
  BarChart3, Server
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

// Animated counter hook
function useAnimatedCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!target || started.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = 0;
          const startTime = performance.now();
          
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
            setCount(Math.floor(start + (target - start) * eased));
            
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  const { count, ref } = useAnimatedCounter(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden"
    >
      {/* Top glow bar */}
      <div className={`absolute top-0 left-[15%] w-[70%] h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
      </div>
      <p className="text-3xl font-display text-white tracking-wide">
        {count.toLocaleString()}
      </p>
    </motion.div>
  );
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function LiveDashboard() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['publicStats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/stats/public');
      return data;
    },
    refetchInterval: 15000, // auto-refresh every 15s
  });

  // Track visit on mount
  useEffect(() => {
    axios.post('/api/stats/visit').catch(() => {});
  }, []);

  // Live clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-[#1A1A1A]/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Image, label: 'Total Wallpapers', value: stats?.totalWallpapers || 0, color: 'from-primary to-pink-400' },
    { icon: Download, label: 'Total Downloads', value: stats?.totalDownloads || 0, color: 'from-accent to-cyan-300' },
    { icon: Users, label: 'Registered Users', value: stats?.totalUsers || 0, color: 'from-secondary to-yellow-300' },
    { icon: Heart, label: 'Total Likes', value: stats?.totalLikes || 0, color: 'from-rose-500 to-pink-400' },
    { icon: ShoppingBag, label: 'Purchases', value: stats?.totalPurchases || 0, color: 'from-emerald-500 to-teal-400' },
    { icon: Eye, label: 'Active Users', value: stats?.activeUsers || 0, color: 'from-emerald-400 to-green-300' },
    { icon: Monitor, label: 'Free Wallpapers', value: stats?.freeWallpapers || 0, color: 'from-sky-500 to-blue-400' },
    { icon: Smartphone, label: 'Premium Walls', value: stats?.premiumWallpapers || 0, color: 'from-amber-500 to-orange-400' },
  ];

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Activity className="w-6 h-6 text-primary" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Live Dashboard
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-white leading-tight">
            Velora HD <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Stats</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time platform metrics — auto-refreshes every 15s</p>
        </div>

        {/* Live clock + uptime */}
        <div className="glass-panel rounded-xl px-4 py-3 flex items-center gap-4 border border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-accent font-mono text-sm font-bold tracking-wider">
              {time.toLocaleTimeString()}
            </span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 text-xs">
              Uptime: <span className="text-white font-semibold">{formatUptime(stats?.serverUptime || 0)}</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.08} />
        ))}
      </div>

      {/* Two Column Layout: Category Breakdown + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-white/5 space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-secondary" />
            <h2 className="font-display text-lg text-white">Category Breakdown</h2>
          </div>

          {stats?.categoryStats?.length > 0 ? (
            <div className="space-y-3">
              {stats.categoryStats.map((cat, i) => {
                const maxDownloads = stats.categoryStats[0]?.downloads || 1;
                const pct = Math.max((cat.downloads / maxDownloads) * 100, 4);
                return (
                  <div key={cat._id} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-200">{cat._id}</span>
                      <span className="text-[10px] text-gray-500">
                        {cat.count} walls · {cat.downloads} downloads
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-xs text-center py-8">No category data yet</p>
          )}
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-white/5 space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-accent" />
            <h2 className="font-display text-lg text-white">Recent Activity</h2>
            <span className="ml-auto text-[10px] text-gray-500 uppercase tracking-wider">Live Feed</span>
          </div>

          {stats?.recentDownloads?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentDownloads.map((dl, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] transition group"
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-[#121212]">
                    {dl.wallpaperImage ? (
                      <img src={dl.wallpaperImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{dl.wallpaperTitle}</p>
                    <p className="text-[10px] text-gray-500">
                      <span className="text-gray-400">{dl.userName}</span> downloaded · {dl.category}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="text-[10px] text-gray-500 flex-shrink-0 font-mono">
                    {timeAgo(dl.time)}
                  </span>

                  {/* Activity pulse */}
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs text-center py-8">No recent activity yet — start downloading!</p>
          )}
        </motion.div>
      </div>

      {/* Platform Pulse Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-panel rounded-2xl px-5 py-4 border border-white/5 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs text-gray-400">All systems operational</span>
        </div>
        <div className="flex items-center gap-6 text-[11px] text-gray-500">
          <span>Download Records: <span className="text-white font-semibold">{(stats?.totalDownloadRecords || 0).toLocaleString()}</span></span>
          <span>API: <span className="text-emerald-400 font-semibold">Healthy</span></span>
          <span>Auto-refresh: <span className="text-accent font-semibold">15s</span></span>
        </div>
      </motion.div>
    </div>
  );
}
