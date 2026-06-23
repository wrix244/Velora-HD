import CreatorApplication from '../models/CreatorApplication.js';
import Wallpaper from '../models/Wallpaper.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendEmail } from '../utils/emailHelper.js';

// Helper to scan file buffer for magic bytes validation & malware patterns
const scanBufferForMalice = (buffer, filename) => {
  if (!buffer || buffer.length < 4) {
    return { isMalicious: true, reason: 'Empty or invalid file buffer' };
  }
  
  const hex = buffer.toString('hex', 0, 8).toUpperCase();
  const isJpeg = hex.startsWith('FFD8FF');
  const isPng = hex.startsWith('89504E47');
  const isGif = hex.startsWith('47494638'); // GIF8
  const isWebp = hex.startsWith('52494646'); // RIFF (check WEBP signature in next bytes)
  
  const ext = filename.split('.').pop().toLowerCase();
  
  // Verify magic bytes matches image signatures
  if (!isJpeg && !isPng && !isGif && !isWebp) {
    return { isMalicious: true, reason: 'Invalid file signature (magic bytes verification failed).' };
  }

  // Cross-reference file extension
  if (ext === 'jpg' || ext === 'jpeg') {
    if (!isJpeg) return { isMalicious: true, reason: 'JPEG file extension mismatch.' };
  } else if (ext === 'png') {
    if (!isPng) return { isMalicious: true, reason: 'PNG file extension mismatch.' };
  } else if (ext === 'webp') {
    if (!isWebp) return { isMalicious: true, reason: 'WEBP file extension mismatch.' };
  } else if (ext === 'gif') {
    if (!isGif) return { isMalicious: true, reason: 'GIF file extension mismatch.' };
  }

  // Basic script/HTML injection check
  const headStr = buffer.toString('ascii', 0, Math.min(buffer.length, 2048));
  if (
    headStr.includes('<script') || 
    headStr.includes('javascript:') || 
    headStr.includes('onload=') || 
    headStr.includes('onerror=') ||
    headStr.includes('<?php')
  ) {
    return { isMalicious: true, reason: 'Malicious HTML, script, or server execution pattern detected.' };
  }

  return { isMalicious: false };
};

// @desc    Apply to become a creator
// @route   POST /api/creator/apply
// @access  Private
export const applyToBecomeCreator = async (req, res) => {
  try {
    const { fullName, email, portfolioLink, answers } = req.body;

    // 1. Checks
    if (req.user.role === 'creator' || req.user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'You are already a creator or admin.' });
    }

    if (req.user.cooldownUntil && new Date(req.user.cooldownUntil) > new Date()) {
      const cooldownDate = new Date(req.user.cooldownUntil).toLocaleDateString();
      return res.status(400).json({
        success: false,
        message: `You are in a cooldown period. You can reapply after ${cooldownDate}.`,
      });
    }

    const pendingApp = await CreatorApplication.findOne({ user: req.user._id, status: 'pending' });
    if (pendingApp) {
      return res.status(400).json({ success: false, message: 'You already have a pending application.' });
    }

    // Parse answers object
    let parsedAnswers;
    try {
      parsedAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid format for checkbox answers.' });
    }

    if (!fullName || !email || !parsedAnswers) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    // Validate affirmative checkboxes
    if (!parsedAnswers.areOwnWallpapers || !parsedAnswers.ownRights || !parsedAnswers.copyrightConfirmed) {
      return res.status(400).json({ success: false, message: 'You must confirm ownership and copyright terms.' });
    }

    // Validate files list
    if (!req.files || req.files.length < 3 || req.files.length > 5) {
      return res.status(400).json({ success: false, message: 'You must upload between 3 and 5 wallpapers.' });
    }

    // 2. Scan uploads for malicious content
    for (const file of req.files) {
      const scanResult = scanBufferForMalice(file.buffer, file.originalname);
      if (scanResult.isMalicious) {
        return res.status(400).json({
          success: false,
          message: `Security threat detected in file ${file.originalname}: ${scanResult.reason}`,
        });
      }
    }

    // 3. Upload files to Cloudinary
    const uploadedUrls = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, {
        folder: 'velorahd/applications',
        resource_type: 'image',
      });
      uploadedUrls.push(result.secure_url);
    }

    // 4. Save to database
    const application = await CreatorApplication.create({
      user: req.user._id,
      fullName,
      email,
      portfolioLink: portfolioLink || '',
      wallpapers: uploadedUrls,
      answers: {
        areOwnWallpapers: !!parsedAnswers.areOwnWallpapers,
        ownRights: !!parsedAnswers.ownRights,
        soldElsewhere: !!parsedAnswers.soldElsewhere,
        copyrightConfirmed: !!parsedAnswers.copyrightConfirmed,
      },
      status: 'pending',
    });

    // 5. Send Email to creator@velorahd.in
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; border: 1px solid #222; border-radius: 12px; background-color: #121212; color: #e0e0e0;">
        <div style="background-color: #6366f1; padding: 20px; border-top-left-radius: 12px; border-top-right-radius: 12px; color: #ffffff; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">New Creator Application</h2>
        </div>
        <div style="padding: 25px; line-height: 1.6;">
          <p style="margin-top: 0; font-size: 15px;">A new applicant is requesting to join the VeloraHD Creator network.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 8px 0; font-weight: bold; color: #888; width: 35%;">Applicant Name:</td>
              <td style="padding: 8px 0; color: #fff;">${fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 8px 0; font-weight: bold; color: #888;">Applicant Email:</td>
              <td style="padding: 8px 0; color: #fff;"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 8px 0; font-weight: bold; color: #888;">Portfolio Link:</td>
              <td style="padding: 8px 0; color: #fff;">${portfolioLink ? `<a href="${portfolioLink}" target="_blank" style="color: #6366f1; text-decoration: none;">${portfolioLink}</a>` : 'Not Provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 8px 0; font-weight: bold; color: #888;">User Account ID:</td>
              <td style="padding: 8px 0; font-mono; font-size: 13px; color: #fff;">${req.user._id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 8px 0; font-weight: bold; color: #888;">Submission Time:</td>
              <td style="padding: 8px 0; color: #fff;">${new Date(application.submissionDate).toLocaleString()}</td>
            </tr>
          </table>

          <h3 style="font-size: 16px; color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 5px; margin-top: 25px;">Declarations</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin: 8px 0; font-size: 14px;">
              ${parsedAnswers.areOwnWallpapers ? '✅' : '❌'} 100% created by applicant
            </li>
            <li style="margin: 8px 0; font-size: 14px;">
              ${parsedAnswers.ownRights ? '✅' : '❌'} Owns distribution rights
            </li>
            <li style="margin: 8px 0; font-size: 14px;">
              ${parsedAnswers.soldElsewhere ? '✅' : '❌'} Sold/Published elsewhere
            </li>
            <li style="margin: 8px 0; font-size: 14px;">
              ${parsedAnswers.copyrightConfirmed ? '✅' : '❌'} Copyright legal terms accepted
            </li>
          </ul>

          <h3 style="font-size: 16px; color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 5px; margin-top: 25px;">Uploaded Wallpapers (${uploadedUrls.length})</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
            ${uploadedUrls.map((url, idx) => `
              <div style="flex: 1 1 120px; text-align: center; margin-bottom: 15px;">
                <a href="${url}" target="_blank" style="text-decoration: none;">
                  <img src="${url}" alt="Preview ${idx + 1}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #333;" />
                  <div style="font-size: 11px; color: #6366f1; margin-top: 5px;">View Full Size</div>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="border-top: 1px solid #222; padding: 15px 20px; text-align: center; font-size: 11px; color: #666; background-color: #0b0b0b; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
          This application request was automatically generated by the VeloraHD submission portal.
        </div>
      </div>
    `;

    await sendEmail({
      to: 'creator@velorahd.in',
      subject: `New Creator Application - ${fullName}`,
      html: emailHtml,
    });

    res.status(201).json({
      success: true,
      message: 'Creator application submitted successfully. Admins have been notified.',
      data: application,
    });
  } catch (error) {
    console.error('Creator application error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's creator application status
// @route   GET /api/creator/application-status
// @access  Private
export const getApplicationStatus = async (req, res) => {
  try {
    const app = await CreatorApplication.findOne({ user: req.user._id }).sort({ submissionDate: -1 });
    if (!app) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: app });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload wallpaper as creator
// @route   POST /api/creator/upload
// @access  Private/Creator
export const creatorUploadWallpaper = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== 'creator') {
      return res.status(403).json({ success: false, message: 'Only approved creators can upload wallpapers.' });
    }

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
      copyrightConfirmed,
    } = req.body;

    // Validate copyright acceptance
    if (copyrightConfirmed !== 'true' && copyrightConfirmed !== true) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the copyright terms before publishing wallpapers.',
      });
    }

    // Require files
    if (!req.files || !req.files.downloadFile) {
      return res.status(400).json({
        success: false,
        message: 'High-resolution download file is required.',
      });
    }

    // Security scan on uploaded files
    if (req.files.previewImage) {
      const scanPreview = scanBufferForMalice(req.files.previewImage[0].buffer, req.files.previewImage[0].originalname);
      if (scanPreview.isMalicious) {
        return res.status(400).json({
          success: false,
          message: `Security threat detected in preview image: ${scanPreview.reason}`,
        });
      }
    }

    const scanDownload = scanBufferForMalice(req.files.downloadFile[0].buffer, req.files.downloadFile[0].originalname);
    if (scanDownload.isMalicious) {
      return res.status(400).json({
        success: false,
        message: `Security threat detected in wallpaper file: ${scanDownload.reason}`,
      });
    }

    // Build details
    const wallpaperData = {
      title,
      description: description || '',
      category,
      type: type || 'static',
      deviceType: deviceType || 'desktop',
      resolution: resolution || '1920x1080',
      price: parseFloat(price) || 0,
      isPremium: isPremium === 'true' || isPremium === true,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      uploadedBy: req.user._id,
      status: 'pending', // Creator uploads are always pending admin review
      creatorAcceptedCopyright: true,
      copyrightAcceptedAt: new Date(),
    };

    // Upload to Cloudinary
    if (req.files.previewImage) {
      const previewResult = await uploadToCloudinary(req.files.previewImage[0].buffer, {
        folder: 'velorahd/previews',
        resource_type: 'image',
      });
      wallpaperData.previewImage = previewResult.secure_url;
    }

    const isVideo = req.files.downloadFile[0].mimetype.startsWith('video') || type === 'live';
    const downloadResult = await uploadToCloudinary(req.files.downloadFile[0].buffer, {
      folder: 'velorahd/downloads',
      resource_type: isVideo ? 'video' : 'image',
    });
    wallpaperData.downloadFile = downloadResult.secure_url;

    // Auto-generate preview image if not uploaded
    if (!wallpaperData.previewImage) {
      if (isVideo) {
        wallpaperData.previewImage = downloadResult.secure_url
          .replace(/\.[^/.]+$/, '.jpg')
          .replace('/video/upload/', '/video/upload/f_jpg,so_3/');
      } else {
        wallpaperData.previewImage = downloadResult.secure_url;
      }
    }

    // Extra fields validation
    if (!wallpaperData.title || !wallpaperData.category || !wallpaperData.resolution) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: title, category, and resolution are required.',
      });
    }

    const wallpaper = await Wallpaper.create(wallpaperData);

    res.status(201).json({
      success: true,
      message: 'Wallpaper uploaded and queued for admin review successfully.',
      data: wallpaper,
    });
  } catch (error) {
    console.error('Wallpaper upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get creator's uploaded wallpapers
// @route   GET /api/creator/wallpapers
// @access  Private/Creator
export const getCreatorWallpapers = async (req, res) => {
  try {
    if (req.user.role !== 'creator') {
      return res.status(403).json({ success: false, message: 'Only creators can access this section.' });
    }

    const wallpapers = await Wallpaper.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: wallpapers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update creator's wallpaper
// @route   PUT /api/creator/wallpapers/:id
// @access  Private/Creator
export const updateCreatorWallpaper = async (req, res) => {
  try {
    if (req.user.role !== 'creator') {
      return res.status(403).json({ success: false, message: 'Only creators can access this section.' });
    }

    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found.' });
    }

    // Ownership check
    if (wallpaper.uploadedBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this wallpaper.' });
    }

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
    } = req.body;

    // Apply updates
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

    // Reset status to pending for review when edited
    wallpaper.status = 'pending';

    // Handle new uploads if any
    if (req.files) {
      if (req.files.previewImage) {
        const scanPreview = scanBufferForMalice(req.files.previewImage[0].buffer, req.files.previewImage[0].originalname);
        if (scanPreview.isMalicious) {
          return res.status(400).json({ success: false, message: `Security threat: ${scanPreview.reason}` });
        }
        
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
        const scanDownload = scanBufferForMalice(req.files.downloadFile[0].buffer, req.files.downloadFile[0].originalname);
        if (scanDownload.isMalicious) {
          return res.status(400).json({ success: false, message: `Security threat: ${scanDownload.reason}` });
        }

        if (wallpaper.downloadFile) {
          await deleteFromCloudinary(wallpaper.downloadFile);
        }
        const isVideo = req.files.downloadFile[0].mimetype.startsWith('video') || (type !== undefined ? type === 'live' : wallpaper.type === 'live');
        const downloadResult = await uploadToCloudinary(req.files.downloadFile[0].buffer, {
          folder: 'velorahd/downloads',
          resource_type: isVideo ? 'video' : 'image',
        });
        wallpaper.downloadFile = downloadResult.secure_url;

        // Auto regenerate preview if no new preview uploaded
        if (!req.files.previewImage) {
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
    }

    const updated = await wallpaper.save();
    res.json({
      success: true,
      message: 'Wallpaper details updated and queued for review.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete creator's wallpaper
// @route   DELETE /api/creator/wallpapers/:id
// @access  Private/Creator
export const deleteCreatorWallpaper = async (req, res) => {
  try {
    if (req.user.role !== 'creator') {
      return res.status(403).json({ success: false, message: 'Only creators can access this section.' });
    }

    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found.' });
    }

    // Ownership check
    if (wallpaper.uploadedBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this wallpaper.' });
    }

    // Clean files from Cloudinary
    if (wallpaper.previewImage) {
      await deleteFromCloudinary(wallpaper.previewImage);
    }
    if (wallpaper.downloadFile) {
      await deleteFromCloudinary(wallpaper.downloadFile);
    }

    await Wallpaper.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Wallpaper deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
