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

    const query = {};

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
    const wallpapers = await Wallpaper.find({})
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
    const wallpapers = await Wallpaper.find({})
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

    const related = await Wallpaper.find({
      category: wallpaper.category,
      _id: { $ne: wallpaper._id },
    })
      .limit(4);

    res.json({ success: true, data: related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
