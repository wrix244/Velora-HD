import express from 'express';
import Wallpaper from '../models/Wallpaper.js';
import User from '../models/User.js';
import Download from '../models/Download.js';
import Purchase from '../models/Purchase.js';

const router = express.Router();

// In-memory visit counter (resets on server restart — lightweight, no DB overhead)
let visitCount = 0;

// ─── Active Users Heartbeat Tracker ────────────────────────────────────
// Each client sends a heartbeat every 10s. If no heartbeat for 30s, they're considered gone.
const activeUsers = new Map(); // sessionId → { lastSeen, userAgent }
const HEARTBEAT_TIMEOUT = 30000; // 30 seconds

// Clean up stale sessions every 15s
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of activeUsers) {
    if (now - data.lastSeen > HEARTBEAT_TIMEOUT) {
      activeUsers.delete(id);
    }
  }
}, 15000);

// @route   POST /api/stats/heartbeat
// @desc    Client heartbeat — registers/updates active session
// @access  Public
router.post('/heartbeat', (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: 'sessionId required' });

  activeUsers.set(sessionId, {
    lastSeen: Date.now(),
    page: req.body.page || '/',
  });

  res.json({ activeUsers: activeUsers.size });
});

// @route   POST /api/stats/visit
// @desc    Increment page visit counter
// @access  Public
router.post('/visit', (req, res) => {
  visitCount++;
  res.json({ visits: visitCount });
});

// @route   GET /api/stats/public
// @desc    Get public live dashboard stats
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const [
      totalWallpapers,
      totalUsers,
      totalDownloads,
      totalPurchases,
      freeWallpapers,
      premiumWallpapers,
      categoryStats,
      recentDownloads,
    ] = await Promise.all([
      Wallpaper.countDocuments(),
      User.countDocuments(),
      Download.countDocuments(),
      Purchase.countDocuments(),
      Wallpaper.countDocuments({ isPremium: false }),
      Wallpaper.countDocuments({ isPremium: true }),
      Wallpaper.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, downloads: { $sum: '$downloads' } } },
        { $sort: { downloads: -1 } },
      ]),
      Download.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('wallpaperId', 'title previewImage category')
        .populate('userId', 'name')
        .lean(),
    ]);

    // Sum total downloads from wallpaper model (cumulative field)
    const totalDownloadCount = await Wallpaper.aggregate([
      { $group: { _id: null, total: { $sum: '$downloads' } } },
    ]);

    // Sum total likes
    const totalLikeCount = await Wallpaper.aggregate([
      { $group: { _id: null, total: { $sum: '$likes' } } },
    ]);

    res.json({
      totalWallpapers,
      totalUsers,
      totalDownloads: totalDownloadCount[0]?.total || 0,
      totalDownloadRecords: totalDownloads,
      totalPurchases,
      totalLikes: totalLikeCount[0]?.total || 0,
      freeWallpapers,
      premiumWallpapers,
      currentVisits: visitCount,
      activeUsers: activeUsers.size,
      categoryStats,
      recentDownloads: recentDownloads.map((d) => ({
        wallpaperTitle: d.wallpaperId?.title || 'Unknown',
        wallpaperImage: d.wallpaperId?.previewImage || '',
        category: d.wallpaperId?.category || '',
        userName: d.userId?.name || 'Anonymous',
        time: d.createdAt,
      })),
      serverUptime: Math.floor(process.uptime()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

export default router;
