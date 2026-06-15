import Wallpaper from '../models/Wallpaper.js';
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

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
        const previewResult = await uploadToCloudinary(req.files.previewImage[0].buffer, {
          folder: 'velorahd/previews',
          resource_type: 'image',
        });
        wallpaperData.previewImage = previewResult.secure_url;
      }
      if (req.files.downloadFile) {
        const isVideo = req.files.downloadFile[0].mimetype.startsWith('video') || type === 'live';
        const downloadResult = await uploadToCloudinary(req.files.downloadFile[0].buffer, {
          folder: 'velorahd/downloads',
          resource_type: isVideo ? 'video' : 'image',
        });
        wallpaperData.downloadFile = downloadResult.secure_url;

        // Auto-generate preview image if not uploaded or provided
        if (!wallpaperData.previewImage && !previewImage) {
          if (isVideo) {
            wallpaperData.previewImage = downloadResult.secure_url
              .replace(/\.[^/.]+$/, '.jpg')
              .replace('/video/upload/', '/video/upload/f_jpg,so_3/');
          } else {
            wallpaperData.previewImage = downloadResult.secure_url;
          }
        }
      }
    }

    // fallback to text fields if no file uploads
    if (!wallpaperData.previewImage && previewImage) {
      wallpaperData.previewImage = previewImage;
    }
    if (!wallpaperData.downloadFile && downloadFile) {
      wallpaperData.downloadFile = downloadFile;
      
      // Auto-generate preview image from download URL if download URL is provided but preview is not
      if (!wallpaperData.previewImage) {
        const isVideo = type === 'live' || downloadFile.includes('/video/upload/') || downloadFile.endsWith('.mp4');
        if (isVideo) {
          wallpaperData.previewImage = downloadFile
            .replace(/\.[^/.]+$/, '.jpg')
            .replace('/video/upload/', '/video/upload/f_jpg,so_3/');
        } else {
          wallpaperData.previewImage = downloadFile;
        }
      }
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
    if (req.files && (req.files.previewImage || req.files.downloadFile)) {
      if (req.files.previewImage) {
        // Delete old preview image from Cloudinary
        if (wallpaper.previewImage) {
          await deleteFromCloudinary(wallpaper.previewImage);
        }
        const previewResult = await uploadToCloudinary(req.files.previewImage[0].buffer, {
          folder: 'velorahd/previews',
          resource_type: 'image',
        });
        wallpaper.previewImage = previewResult.secure_url;
      }
      if (req.files.downloadFile) {
        // Delete old high-res file from Cloudinary
        if (wallpaper.downloadFile) {
          await deleteFromCloudinary(wallpaper.downloadFile);
        }
        const isVideo = req.files.downloadFile[0].mimetype.startsWith('video') || (type !== undefined ? type === 'live' : wallpaper.type === 'live');
        const downloadResult = await uploadToCloudinary(req.files.downloadFile[0].buffer, {
          folder: 'velorahd/downloads',
          resource_type: isVideo ? 'video' : 'image',
        });
        wallpaper.downloadFile = downloadResult.secure_url;

        // If no new preview image was uploaded, and we just uploaded a new high-res file
        if (!req.files.previewImage && !previewImage) {
          // Delete old preview image from Cloudinary
          if (wallpaper.previewImage) {
            await deleteFromCloudinary(wallpaper.previewImage);
          }
          if (isVideo) {
            wallpaper.previewImage = downloadResult.secure_url
              .replace(/\.[^/.]+$/, '.jpg')
              .replace('/video/upload/', '/video/upload/f_jpg,so_3/');
          } else {
            wallpaper.previewImage = downloadResult.secure_url;
          }
        }
      }
    } else {
      // update via text fields if no file uploads
      if (previewImage !== undefined) {
        // If the URL changed, clean up the old one
        if (previewImage !== wallpaper.previewImage && wallpaper.previewImage) {
          await deleteFromCloudinary(wallpaper.previewImage);
        }
        wallpaper.previewImage = previewImage;
      }
      if (downloadFile !== undefined) {
        // If the URL changed, clean up the old one
        if (downloadFile !== wallpaper.downloadFile && wallpaper.downloadFile) {
          await deleteFromCloudinary(wallpaper.downloadFile);
        }
        wallpaper.downloadFile = downloadFile;

        // If high-res URL was updated but previewImage was not provided in request
        if (previewImage === undefined) {
          // Delete old preview image from Cloudinary
          if (wallpaper.previewImage) {
            await deleteFromCloudinary(wallpaper.previewImage);
          }
          const isVideo = (type !== undefined ? type === 'live' : wallpaper.type === 'live') || downloadFile.includes('/video/upload/') || downloadFile.endsWith('.mp4');
          if (isVideo) {
            wallpaper.previewImage = downloadFile
              .replace(/\.[^/.]+$/, '.jpg')
              .replace('/video/upload/', '/video/upload/f_jpg,so_3/');
          } else {
            wallpaper.previewImage = downloadFile;
          }
        }
      }
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

    // Delete files from Cloudinary if they exist
    if (wallpaper.previewImage) {
      await deleteFromCloudinary(wallpaper.previewImage);
    }
    if (wallpaper.downloadFile) {
      await deleteFromCloudinary(wallpaper.downloadFile);
    }

    await Wallpaper.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Wallpaper deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all wallpapers for admin view
// @route   GET /api/admin/wallpapers
// @access  Private/Admin
export const getAdminWallpapers = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: wallpapers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ban or unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot ban admin users' });
    }

    const { isBanned } = req.body;
    user.isBanned = isBanned !== undefined ? isBanned : !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: `User has been successfully ${user.isBanned ? 'banned' : 'unbanned'}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
