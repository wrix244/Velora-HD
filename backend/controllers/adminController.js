import Wallpaper from '../models/Wallpaper.js';
import User from '../models/User.js';
import CreatorApplication from '../models/CreatorApplication.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import { sendEmail } from '../utils/emailHelper.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// Helper to safely delete from Cloudinary only if no other wallpaper references the URL
const safeDeleteCloudinaryAsset = async (url, currentWallpaperId) => {
  if (!url) return;
  try {
    const referenceCount = await Wallpaper.countDocuments({
      $or: [
        { previewImage: url },
        { downloadFile: url }
      ],
      _id: { $ne: currentWallpaperId }
    });

    if (referenceCount === 0) {
      await deleteFromCloudinary(url);
    } else {
      console.log(`Cloudinary asset preservation: URL "${url}" is referenced by ${referenceCount} other wallpaper(s). Not deleting.`);
    }
  } catch (error) {
    console.error(`Failed during safe Cloudinary delete check for url "${url}":`, error.message);
  }
};

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
          await safeDeleteCloudinaryAsset(wallpaper.previewImage, wallpaper._id);
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
          await safeDeleteCloudinaryAsset(wallpaper.downloadFile, wallpaper._id);
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
            await safeDeleteCloudinaryAsset(wallpaper.previewImage, wallpaper._id);
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
          await safeDeleteCloudinaryAsset(wallpaper.previewImage, wallpaper._id);
        }
        wallpaper.previewImage = previewImage;
      }
      if (downloadFile !== undefined) {
        // If the URL changed, clean up the old one
        if (downloadFile !== wallpaper.downloadFile && wallpaper.downloadFile) {
          await safeDeleteCloudinaryAsset(wallpaper.downloadFile, wallpaper._id);
        }
        wallpaper.downloadFile = downloadFile;

        // If high-res URL was updated but previewImage was not provided in request
        if (previewImage === undefined) {
          // Delete old preview image from Cloudinary
          if (wallpaper.previewImage) {
            await safeDeleteCloudinaryAsset(wallpaper.previewImage, wallpaper._id);
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
      await safeDeleteCloudinaryAsset(wallpaper.previewImage, wallpaper._id);
    }
    if (wallpaper.downloadFile) {
      await safeDeleteCloudinaryAsset(wallpaper.downloadFile, wallpaper._id);
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

// @desc    Get all creator applications
// @route   GET /api/admin/applications
// @access  Private/Admin
export const getCreatorApplications = async (req, res) => {
  try {
    const applications = await CreatorApplication.find({})
      .populate('user', 'name email role isBanned cooldownUntil')
      .sort({ submissionDate: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve creator application
// @route   PUT /api/admin/applications/:id/approve
// @access  Private/Admin
export const approveCreatorApplication = async (req, res) => {
  try {
    const application = await CreatorApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application is already ${application.status}` });
    }

    // 1. Update Application status
    application.status = 'approved';
    application.reviewer = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    // 2. Update User's role to creator
    const user = await User.findById(application.user);
    if (user) {
      user.role = 'creator';
      user.cooldownUntil = null; // clear cooldown
      await user.save();
    }

    // 3. Create Audit Log
    await AuditLog.create({
      action: 'APPROVE_CREATOR',
      performedBy: req.user._id,
      targetUser: application.user,
      targetItem: application._id,
      details: `Approved creator application for ${application.fullName} (${application.email})`,
    });

    // 4. Create Notification for the creator
    await Notification.create({
      user: application.user,
      title: 'Application Approved! 🎉',
      message: 'Congratulations! Your creator application has been approved. You now have access to the Creator Upload system.',
      type: 'success',
    });

    // 5. Send email notification to creator
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; color: #333333;">
        <div style="background-color: #4f46e5; padding: 15px; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">Welcome to VeloraHD Creators!</h2>
        </div>
        <div style="padding: 20px; line-height: 1.6;">
          <p>Hi ${application.fullName},</p>
          <p>We are thrilled to inform you that your application to become a creator on VeloraHD has been <strong>approved</strong>!</p>
          <p>You can now log in to your account and access your new <strong>Creator Dashboard</strong> from the navigation bar. You'll be able to upload your wallpapers, set pricing (for premium licenses), and track downloads.</p>
          <p>Welcome aboard, and we can't wait to see your amazing artworks on our platform!</p>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding: 15px; text-align: center; font-size: 11px; color: #888888; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
          This email was sent from the VeloraHD Creator Moderation team.
        </div>
      </div>
    `;

    await sendEmail({
      to: application.email,
      subject: 'Creator Application Approved! - VeloraHD',
      html: emailHtml,
    });

    res.json({ success: true, message: 'Application approved successfully.', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject creator application
// @route   PUT /api/admin/applications/:id/reject
// @access  Private/Admin
export const rejectCreatorApplication = async (req, res) => {
  try {
    const { rejectionNotes, cooldownDays } = req.body;
    const application = await CreatorApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application is already ${application.status}` });
    }

    // 1. Update Application status
    application.status = 'rejected';
    application.rejectionNotes = rejectionNotes || 'Application did not meet our quality guidelines.';
    application.reviewer = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    // 2. Set cooldown on User
    const days = parseInt(cooldownDays) !== undefined && !isNaN(parseInt(cooldownDays)) ? parseInt(cooldownDays) : 30;
    const cooldownDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    
    const user = await User.findById(application.user);
    if (user) {
      user.cooldownUntil = cooldownDate;
      await user.save();
    }

    // 3. Create Audit Log
    await AuditLog.create({
      action: 'REJECT_CREATOR',
      performedBy: req.user._id,
      targetUser: application.user,
      targetItem: application._id,
      details: `Rejected creator application for ${application.fullName}. Cooldown: ${days} days. Notes: ${application.rejectionNotes}`,
    });

    // 4. Create Notification for user
    await Notification.create({
      user: application.user,
      title: 'Application Update',
      message: `Your creator application was not approved. Reapply cooldown until ${cooldownDate.toLocaleDateString()}.`,
      type: 'error',
    });

    // 5. Send email notification to applicant
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; color: #333333;">
        <div style="background-color: #dc2626; padding: 15px; border-top-left-radius: 8px; border-top-right-radius: 8px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">Creator Application Status Update</h2>
        </div>
        <div style="padding: 20px; line-height: 1.6;">
          <p>Hi ${application.fullName},</p>
          <p>Thank you for your interest in becoming a creator on VeloraHD. We have carefully reviewed your application, including your sample wallpapers and portfolio link.</p>
          <p>Unfortunately, your application has not been approved at this time.</p>
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">Reviewer Notes:</p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d; font-style: italic;">"${application.rejectionNotes}"</p>
          </div>
          <p>You can submit a new application after the cooldown period has passed on <strong>${cooldownDate.toLocaleDateString()}</strong>.</p>
          <p>We appreciate your effort and encourage you to continue refining your artwork!</p>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding: 15px; text-align: center; font-size: 11px; color: #888888; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
          This email was sent from the VeloraHD Creator Moderation team.
        </div>
      </div>
    `;

    await sendEmail({
      to: application.email,
      subject: 'Creator Application Status Update - VeloraHD',
      html: emailHtml,
    });

    res.json({ success: true, message: 'Application rejected successfully.', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all creator uploaded wallpapers
// @route   GET /api/admin/creator-uploads
// @access  Private/Admin
export const getCreatorUploads = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find({ uploadedBy: { $ne: null } })
      .populate('uploadedBy', 'name email role isBanned')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: wallpapers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve creator uploaded wallpaper
// @route   PUT /api/admin/creator-uploads/:id/approve
// @access  Private/Admin
export const approveCreatorWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    wallpaper.status = 'approved';
    wallpaper.rejectionNotes = '';
    await wallpaper.save();

    // Create Audit Log
    await AuditLog.create({
      action: 'APPROVE_WALLPAPER',
      performedBy: req.user._id,
      targetUser: wallpaper.uploadedBy,
      targetItem: wallpaper._id,
      details: `Approved wallpaper upload: "${wallpaper.title}"`,
    });

    // Notify creator
    if (wallpaper.uploadedBy) {
      await Notification.create({
        user: wallpaper.uploadedBy,
        title: 'Wallpaper Approved! 🌟',
        message: `Your wallpaper "${wallpaper.title}" has been approved and is now live on the platform.`,
        type: 'success',
      });

      const creator = await User.findById(wallpaper.uploadedBy);
      if (creator) {
        const emailHtml = `
          <p>Hi ${creator.name},</p>
          <p>Great news! Your uploaded wallpaper <strong>"${wallpaper.title}"</strong> has been approved by our moderation team and is now published on VeloraHD!</p>
          <p>Thank you for contributing to our platform!</p>
        `;
        await sendEmail({
          to: creator.email,
          subject: 'Wallpaper Approved! - VeloraHD',
          html: emailHtml,
        });
      }
    }

    res.json({ success: true, message: 'Wallpaper approved successfully.', data: wallpaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject creator uploaded wallpaper
// @route   PUT /api/admin/creator-uploads/:id/reject
// @access  Private/Admin
export const rejectCreatorWallpaper = async (req, res) => {
  try {
    const { rejectionNotes } = req.body;
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    wallpaper.status = 'rejected';
    wallpaper.rejectionNotes = rejectionNotes || 'Does not match our quality guidelines.';
    await wallpaper.save();

    // Create Audit Log
    await AuditLog.create({
      action: 'REJECT_WALLPAPER',
      performedBy: req.user._id,
      targetUser: wallpaper.uploadedBy,
      targetItem: wallpaper._id,
      details: `Rejected wallpaper upload: "${wallpaper.title}". Reason: ${wallpaper.rejectionNotes}`,
    });

    // Notify creator
    if (wallpaper.uploadedBy) {
      await Notification.create({
        user: wallpaper.uploadedBy,
        title: 'Wallpaper Rejected ❌',
        message: `Your wallpaper "${wallpaper.title}" was rejected: ${wallpaper.rejectionNotes}`,
        type: 'error',
      });

      const creator = await User.findById(wallpaper.uploadedBy);
      if (creator) {
        const emailHtml = `
          <p>Hi ${creator.name},</p>
          <p>We regret to inform you that your wallpaper <strong>"${wallpaper.title}"</strong> was not approved for publication.</p>
          <p><strong>Reason:</strong> ${wallpaper.rejectionNotes}</p>
          <p>Please review our quality guidelines and try uploading a different design.</p>
        `;
        await sendEmail({
          to: creator.email,
          subject: 'Wallpaper Status Update - VeloraHD',
          html: emailHtml,
        });
      }
    }

    res.json({ success: true, message: 'Wallpaper rejected successfully.', data: wallpaper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend creator account
// @route   PUT /api/admin/users/:id/suspend-creator
// @access  Private/Admin
export const suspendCreator = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend admin users' });
    }

    user.isBanned = true;
    await user.save();

    // Reject all their wallpapers
    await Wallpaper.updateMany(
      { uploadedBy: user._id },
      { status: 'rejected', rejectionNotes: 'Account suspended for copyright or terms violations.' }
    );

    // Create Audit Log
    await AuditLog.create({
      action: 'SUSPEND_CREATOR',
      performedBy: req.user._id,
      targetUser: user._id,
      details: `Suspended creator account for ${user.name} (${user.email}) and set all uploads to rejected.`,
    });

    const emailHtml = `
      <p>Hi ${user.name},</p>
      <p>Your creator account on VeloraHD has been <strong>suspended</strong> due to copyright violations or breaching platform terms.</p>
      <p>All your uploaded wallpapers have been removed from the public gallery. If you believe this is an error, please contact our support team.</p>
    `;
    await sendEmail({
      to: user.email,
      subject: 'Account Suspension Notice - VeloraHD',
      html: emailHtml,
    });

    res.json({ success: true, message: 'Creator suspended and all uploads rejected.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
