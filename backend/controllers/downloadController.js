import Download from '../models/Download.js';
import Wallpaper from '../models/Wallpaper.js';
import Purchase from '../models/Purchase.js';

// @desc    Record a new download
// @route   POST /api/downloads/:wallpaperId
// @access  Public (Optional JWT via conditional auth check)
export const recordDownload = async (req, res) => {
  try {
    const { wallpaperId } = req.params;
    const userId = req.user ? req.user._id : null;

    const wallpaper = await Wallpaper.findById(wallpaperId);
    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    // Security Check: If it is a premium wallpaper, verify the user has purchased it.
    if (wallpaper.isPremium) {
      if (!userId) {
        return res.status(403).json({ success: false, message: 'Authentication required for premium wallpapers' });
      }

      const purchased = await Purchase.findOne({ userId, wallpaperId });
      if (!purchased) {
        return res.status(403).json({ success: false, message: 'You must purchase this wallpaper before downloading' });
      }
    }

    // Log the download
    await Download.create({ userId, wallpaperId });

    // Increment downloads count on Wallpaper
    wallpaper.downloads = (wallpaper.downloads || 0) + 1;
    await wallpaper.save();

    res.json({
      success: true,
      message: 'Download registered successfully',
      downloads: wallpaper.downloads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user download history
// @route   GET /api/downloads/history
// @access  Private
export const getDownloadHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const downloads = await Download.find({ userId })
      .populate('wallpaperId')
      .sort({ createdAt: -1 });

    // Filter out deleted wallpapers
    const filteredDownloads = downloads.filter((d) => d.wallpaperId !== null);

    res.json({ success: true, data: filteredDownloads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
