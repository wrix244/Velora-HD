import Wallpaper from '../models/Wallpaper.js';

// @desc    Get all wallpapers with filters (search, category, resolution, price, type, deviceType, sorting)
// @route   GET /api/wallpapers
// @access  Public
export const getWallpapers = async (req, res) => {
  try {
    const {
      search,
      category,
      resolution,
      isPremium,
      type,
      deviceType,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: { $nin: ['pending', 'rejected'] } };

    // 1. Search Query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // 2. Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // 3. Resolution Filter
    if (resolution && resolution !== 'All') {
      query.resolution = resolution;
    }

    // 4. Free / Premium Filter
    if (isPremium !== undefined && isPremium !== '') {
      query.isPremium = isPremium === 'true';
    }

    // 5. Static / Live Filter
    if (type && type !== 'All') {
      query.type = type;
    }

    // 6. Device Type Filter
    if (deviceType && deviceType !== 'All') {
      query.deviceType = deviceType;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    let sortQuery = {};
    if (sort === 'downloads') {
      sortQuery = { downloads: -1, createdAt: -1 };
    } else if (sort === 'likes') {
      sortQuery = { likes: -1, createdAt: -1 };
    } else if (sort === 'latest') {
      sortQuery = { createdAt: -1 };
    } else {
      // Default: Latest
      sortQuery = { createdAt: -1 };
    }

    const total = await Wallpaper.countDocuments(query);
    const wallpapers = await Wallpaper.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: wallpapers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + wallpapers.length < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single wallpaper by slug
// @route   GET /api/wallpapers/slug/:slug
// @access  Public
export const getWallpaperBySlug = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findOne({ slug: req.params.slug });

    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    // Hide if pending or rejected (only visible to uploader or admin)
    if (wallpaper.status && wallpaper.status !== 'approved') {
      const isOwner = req.user && wallpaper.uploadedBy && req.user._id.toString() === wallpaper.uploadedBy.toString();
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(404).json({ success: false, message: 'Wallpaper not found' });
      }
    }

    res.json({ success: true, data: wallpaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trending wallpapers (Trending algorithm: combination of downloads and likes)
// @route   GET /api/wallpapers/trending
// @access  Public
export const getTrendingWallpapers = async (req, res) => {
  try {
    // Top 8 sorted by downloads + likes desc
    const wallpapers = await Wallpaper.find({ status: { $nin: ['pending', 'rejected'] } })
      .sort({ downloads: -1, likes: -1, createdAt: -1 })
      .limit(8);

    res.json({ success: true, data: wallpapers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get latest wallpapers
// @route   GET /api/wallpapers/latest
// @access  Public
export const getLatestWallpapers = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find({ status: { $nin: ['pending', 'rejected'] } })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({ success: true, data: wallpapers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get related wallpapers (by category or tags, excluding current)
// @route   GET /api/wallpapers/:id/related
// @access  Public
export const getRelatedWallpapers = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    // Find wallpapers in the same category OR with matching tags, excluding current
    const candidates = await Wallpaper.find({
      _id: { $ne: wallpaper._id },
      status: { $nin: ['pending', 'rejected'] },
      $or: [
        { category: wallpaper.category },
        { tags: { $in: wallpaper.tags || [] } }
      ]
    }).limit(20);

    // Score candidates based on:
    // 1. Same category: +5 points
    // 2. Tag overlap count: +3 points per overlapping tag
    const scored = candidates.map(candidate => {
      let score = 0;
      if (candidate.category === wallpaper.category) {
        score += 5;
      }
      if (candidate.tags && wallpaper.tags) {
        const overlap = candidate.tags.filter(t => wallpaper.tags.includes(t)).length;
        score += overlap * 3;
      }
      return { candidate, score };
    });

    // Sort by score descending and return top 8 related wallpapers
    scored.sort((a, b) => b.score - a.score);
    const related = scored.slice(0, 8).map(s => s.candidate);

    res.json({ success: true, data: related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recently viewed wallpapers from cookie
// @route   GET /api/wallpapers/recent
// @access  Public
export const getRecentWallpapers = async (req, res) => {
  try {
    const parseCookies = (cookieHeader) => {
      const list = {};
      if (!cookieHeader) return list;
      cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
      });
      return list;
    };

    const cookies = parseCookies(req.headers.cookie);
    const recentlyViewedStr = cookies.recentlyViewed;

    if (!recentlyViewedStr) {
      return res.json({ success: true, data: [] });
    }

    let ids = [];
    try {
      ids = JSON.parse(recentlyViewedStr);
    } catch (e) {
      return res.json({ success: true, data: [] });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch wallpapers matching those IDs
    const wallpapers = await Wallpaper.find({ _id: { $in: ids }, status: { $nin: ['pending', 'rejected'] } });

    // Preserve viewed order
    const orderMap = {};
    ids.forEach((id, index) => {
      orderMap[id.toString()] = index;
    });

    const sortedWallpapers = wallpapers.sort((a, b) => {
      return (orderMap[a._id.toString()] ?? 0) - (orderMap[b._id.toString()] ?? 0);
    });

    res.json({ success: true, data: sortedWallpapers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get personalized recommendations based on browsing history cookie
// @route   GET /api/wallpapers/recommendations
// @access  Public
export const getRecommendedWallpapers = async (req, res) => {
  try {
    const parseCookies = (cookieHeader) => {
      const list = {};
      if (!cookieHeader) return list;
      cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
      });
      return list;
    };

    const cookies = parseCookies(req.headers.cookie);
    const recentlyViewedStr = cookies.recentlyViewed;
    let recentlyViewedIds = [];

    if (recentlyViewedStr) {
      try {
        const parsed = JSON.parse(recentlyViewedStr);
        if (Array.isArray(parsed)) {
          recentlyViewedIds = parsed;
        }
      } catch (e) {
        console.error('Error parsing recentlyViewed cookie:', e);
      }
    }

    // If we have history, recommend similar wallpapers
    if (recentlyViewedIds.length > 0) {
      // Fetch viewed wallpapers to analyze categories and tags
      const viewedWallpapers = await Wallpaper.find({ _id: { $in: recentlyViewedIds } });

      if (viewedWallpapers.length > 0) {
        // Collect categories and tags
        const categories = viewedWallpapers.map((wp) => wp.category).filter(Boolean);
        let tags = [];
        viewedWallpapers.forEach((wp) => {
          if (Array.isArray(wp.tags)) {
            tags = [...tags, ...wp.tags];
          }
        });

        // Find other wallpapers matching the same categories or tags, excluding viewed ones
        const recommendations = await Wallpaper.find({
          _id: { $not: { $in: recentlyViewedIds } },
          status: { $nin: ['pending', 'rejected'] },
          $or: [
            { category: { $in: categories } },
            { tags: { $in: tags } }
          ]
        })
          .limit(8);

        // If we found enough recommendations, return them
        if (recommendations.length >= 4) {
          return res.json({ success: true, data: recommendations });
        }

        // If not enough, fill the rest with trending wallpapers
        const existingIds = [...recentlyViewedIds, ...recommendations.map(r => r._id.toString())];
        const filler = await Wallpaper.find({
          _id: { $not: { $in: existingIds } },
          status: { $nin: ['pending', 'rejected'] }
        })
          .sort({ downloads: -1, likes: -1, createdAt: -1 })
          .limit(8 - recommendations.length);

        return res.json({ success: true, data: [...recommendations, ...filler] });
      }
    }

    // Default Fallback: If no history, recommend trending wallpapers
    const trending = await Wallpaper.find({ status: { $nin: ['pending', 'rejected'] } })
      .sort({ downloads: -1, likes: -1, createdAt: -1 })
      .limit(8);

    res.json({ success: true, data: trending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
