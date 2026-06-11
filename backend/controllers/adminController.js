import Wallpaper from '../models/Wallpaper.js';

// @desc    Create a new wallpaper
// @route   POST /api/admin/wallpapers
// @access  Private/Admin
export const createWallpaper = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      deviceType,
      resolution,
      price,
      isPremium,
      tags,
      previewImage,
      downloadFile,
    } = req.body;

    // Build wallpaper data
    const wallpaperData = {
      title,
      description,
      category,
      type,
      deviceType,
      resolution,
      price: parseFloat(price) || 0,
      isPremium: isPremium === 'true' || isPremium === true,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
    };

    // If files uploaded via multer
    if (req.files) {
      if (req.files.previewImage) {
        wallpaperData.previewImage = `/uploads/${req.files.previewImage[0].filename}`;
      }
      if (req.files.downloadFile) {
        wallpaperData.downloadFile = `/uploads/${req.files.downloadFile[0].filename}`;
      }
    }

    // fallback to text fields if no file uploads
    if (!wallpaperData.previewImage && previewImage) {
      wallpaperData.previewImage = previewImage;
    }
    if (!wallpaperData.downloadFile && downloadFile) {
      wallpaperData.downloadFile = downloadFile;
    }

    // Final checks
    if (!wallpaperData.title || !wallpaperData.category || !wallpaperData.resolution || !wallpaperData.previewImage || !wallpaperData.downloadFile) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, category, resolution, preview image, download file)',
      });
    }

    const wallpaper = await Wallpaper.create(wallpaperData);

    res.status(201).json({
      success: true,
      message: 'Wallpaper created successfully',
      data: wallpaper,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a wallpaper
// @route   PUT /api/admin/wallpapers/:id
// @access  Private/Admin
export const updateWallpaper = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      deviceType,
      resolution,
      price,
      isPremium,
      tags,
      previewImage,
      downloadFile,
    } = req.body;

    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    wallpaper.title = title !== undefined ? title : wallpaper.title;
    wallpaper.description = description !== undefined ? description : wallpaper.description;
    wallpaper.category = category !== undefined ? category : wallpaper.category;
    wallpaper.type = type !== undefined ? type : wallpaper.type;
    wallpaper.deviceType = deviceType !== undefined ? deviceType : wallpaper.deviceType;
    wallpaper.resolution = resolution !== undefined ? resolution : wallpaper.resolution;
    wallpaper.price = price !== undefined ? parseFloat(price) : wallpaper.price;
    wallpaper.isPremium = isPremium !== undefined ? (isPremium === 'true' || isPremium === true) : wallpaper.isPremium;
    
    if (tags !== undefined) {
      wallpaper.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }

    // Check if new files uploaded via multer
    if (req.files) {
      if (req.files.previewImage) {
        wallpaper.previewImage = `/uploads/${req.files.previewImage[0].filename}`;
      }
      if (req.files.downloadFile) {
        wallpaper.downloadFile = `/uploads/${req.files.downloadFile[0].filename}`;
      }
    } else {
      // update via text fields if no file uploads
      if (previewImage !== undefined) wallpaper.previewImage = previewImage;
      if (downloadFile !== undefined) wallpaper.downloadFile = downloadFile;
    }

    const updatedWallpaper = await wallpaper.save();

    res.json({
      success: true,
      message: 'Wallpaper updated successfully',
      data: updatedWallpaper,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a wallpaper
// @route   DELETE /api/admin/wallpapers/:id
// @access  Private/Admin
export const deleteWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    await Wallpaper.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Wallpaper deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
