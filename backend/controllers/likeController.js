import Like from '../models/Like.js';
import Wallpaper from '../models/Wallpaper.js';

// @desc    Toggle like status of a wallpaper
// @route   POST /api/likes/toggle/:wallpaperId
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const { wallpaperId } = req.params;
    const userId = req.user._id;

    // Check if wallpaper exists
    const wallpaper = await Wallpaper.findById(wallpaperId);
    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ userId, wallpaperId });

    if (existingLike) {
      // Remove like
      await Like.findByIdAndDelete(existingLike._id);
      // Decrement likes counter
      wallpaper.likes = Math.max(0, (wallpaper.likes || 0) - 1);
      await wallpaper.save();

      return res.json({
        success: true,
        liked: false,
        message: 'Wallpaper unliked',
      });
    } else {
      // Add like
      await Like.create({ userId, wallpaperId });
      // Increment likes counter
      wallpaper.likes = (wallpaper.likes || 0) + 1;
      await wallpaper.save();

      return res.json({
        success: true,
        liked: true,
        message: 'Wallpaper liked',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's liked wallpapers
// @route   GET /api/likes
// @access  Private
export const getLikes = async (req, res) => {
  try {
    const userId = req.user._id;
    const likes = await Like.find({ userId }).populate('wallpaperId');
    
    // Filter out entries where wallpaper might have been deleted
    const filteredLikes = likes
      .filter((l) => l.wallpaperId !== null)
      .map((l) => l.wallpaperId);

    res.json({ success: true, data: filteredLikes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
