import Favorite from '../models/Favorite.js';
import Wallpaper from '../models/Wallpaper.js';

// @desc    Toggle favorite status of a wallpaper
// @route   POST /api/favorites/toggle/:wallpaperId
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { wallpaperId } = req.params;
    const userId = req.user._id;

    // Check if wallpaper exists
    const wallpaper = await Wallpaper.findById(wallpaperId);
    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    // Check if already favorited
    const existingFav = await Favorite.findOne({ userId, wallpaperId });

    if (existingFav) {
      // Remove favorite
      await Favorite.findByIdAndDelete(existingFav._id);

      return res.json({
        success: true,
        favorited: false,
        message: 'Wallpaper removed from favorites',
      });
    } else {
      // Add favorite
      await Favorite.create({ userId, wallpaperId });

      return res.json({
        success: true,
        favorited: true,
        message: 'Wallpaper added to favorites',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await Favorite.find({ userId }).populate('wallpaperId');
    
    // Filter out entries where wallpaper might have been deleted
    const filteredFavs = favorites
      .filter((fav) => fav.wallpaperId !== null)
      .map((fav) => fav.wallpaperId);

    res.json({ success: true, data: filteredFavs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
