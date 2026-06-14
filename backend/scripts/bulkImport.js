import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sizeOf from 'image-size';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';
import cloudinary, { uploadToCloudinary } from '../config/cloudinary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMPORT_DIR = path.join(__dirname, '../bulk-import');
const VELORA_DIR = path.join(IMPORT_DIR, 'VeloraHD');
const METADATA_FILE = path.join(IMPORT_DIR, 'metadata.json');

// Supported extensions (images + videos)
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.jfif', '.mp4', '.webm'];

// Custom uploader using upload_large for large videos
const uploadLargeVideoToCloudinary = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        ...options,
        chunk_size: 10 * 1024 * 1024, // 10MB chunks
        timeout: 240000 // 4 minutes timeout
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};

const runImport = async () => {
  try {
    console.log('=== Starting Upgraded Bulk Wallpaper Import ===');

    // 1. Verify directories
    if (!fs.existsSync(VELORA_DIR)) {
      console.error(`Error: VeloraHD directory not found at ${VELORA_DIR}`);
      process.exit(1);
    }

    // 2. Read metadata JSON file
    let metadataList = [];
    if (fs.existsSync(METADATA_FILE)) {
      try {
        const rawMeta = fs.readFileSync(METADATA_FILE, 'utf8');
        metadataList = JSON.parse(rawMeta);
        console.log(`Loaded metadata mapping for ${metadataList.length} files from metadata.json.`);
      } catch (err) {
        console.warn('Warning: Failed to parse metadata.json.', err.message);
      }
    }

    // 3. Scan files in VeloraHD
    const rawFiles = fs.readdirSync(VELORA_DIR);
    const filesToImport = rawFiles.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    });

    if (filesToImport.length === 0) {
      console.log('No supported images or videos found in the bulk-import/VeloraHD folder.');
      process.exit(0);
    }

    console.log(`Found ${filesToImport.length} files to process.`);

    // 4. Connect to database
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/velorahd';
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully!');

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (const currentFilename of filesToImport) {
      console.log(`\n----------------------------------------`);
      console.log(`Processing file: ${currentFilename}...`);
      
      let currentFilePath = path.join(VELORA_DIR, currentFilename);
      const ext = path.extname(currentFilename).toLowerCase();
      const isVideo = ext === '.mp4' || ext === '.webm';

      try {
        // Find customized metadata: match original name OR match renamed target name
        const userMeta = metadataList.find(m => {
          if (m.filename === currentFilename) return true;
          
          // Compute clean slug filename and check if it matches currentFilename
          const mExt = path.extname(m.filename).toLowerCase();
          const cleanTitle = m.title || m.filename
            .replace(mExt, '')
            .split(/[-_]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          const cleanSlug = cleanTitle
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          return `${cleanSlug}${mExt}` === currentFilename;
        }) || {};

        // Generate clean title & slug
        const cleanTitle = userMeta.title || currentFilename
          .replace(ext, '')
          .split(/[-_]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Check if wallpaper already exists in MongoDB by title and type
        const existingWallpaper = await Wallpaper.findOne({ title: cleanTitle, type: isVideo ? 'live' : 'static' });
        if (existingWallpaper) {
          console.log(`- Wallpaper "${cleanTitle}" (${isVideo ? 'live' : 'static'}) already registered in database (ID: ${existingWallpaper._id}). Skipping upload.`);
          successCount++;
          skipCount++;
          continue;
        }

        const cleanSlug = cleanTitle
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const targetFilename = `${cleanSlug}${ext}`;
        let finalFilePath = path.join(VELORA_DIR, targetFilename);

        // Step 1: Rename file locally on disk first (if not already renamed)
        if (currentFilename !== targetFilename) {
          console.log(`- Renaming local file: "${currentFilename}" -> "${targetFilename}"`);
          fs.renameSync(currentFilePath, finalFilePath);
          currentFilePath = finalFilePath;
        }

        // Step 2: Detect dimensions/resolution
        let resolution = '1920x1080';
        let deviceType = 'desktop';

        try {
          if (!isVideo) {
            const dims = sizeOf(currentFilePath);
            resolution = `${dims.width}x${dims.height}`;
            deviceType = dims.height > dims.width ? 'mobile' : 'desktop';
          }
        } catch (dimErr) {
          console.warn(`- Warning: Could not detect dimensions locally: ${dimErr.message}`);
        }

        const category = userMeta.category || 'Minimal';
        const description = userMeta.description || `Experience this premium high-quality ${deviceType} wallpaper. Beautifully crafted to enhance the layout of your setup.`;
        const tags = userMeta.tags || [category.toLowerCase(), deviceType, 'cinematic'];
        const price = parseFloat(userMeta.price) || 0;
        const isPremium = userMeta.isPremium || price > 0;

        console.log(`- Target Title: "${cleanTitle}"`);
        console.log(`- Category: "${category}" | Pricing: ${isPremium ? `$${price}` : 'FREE'}`);

        // Step 3: Upload to Cloudinary
        console.log('- Uploading to Cloudinary...');
        const uploadOptions = {
          folder: 'velorahd/wallpapers',
          resource_type: isVideo ? 'video' : 'image',
        };

        let cloudResult;
        if (!isVideo) {
          uploadOptions.format = 'webp'; // Force conversion to webp on Cloudinary
          const fileBuffer = fs.readFileSync(currentFilePath);
          cloudResult = await uploadToCloudinary(fileBuffer, uploadOptions);
        } else {
          // Use large video chunked uploader with local file path to prevent timeouts
          cloudResult = await uploadLargeVideoToCloudinary(currentFilePath, uploadOptions);
        }
        
        console.log(`- Cloudinary Upload Successful! URL: ${cloudResult.secure_url}`);

        // Grab dimensions from Cloudinary
        const finalWidth = cloudResult.width || parseInt(resolution.split('x')[0]);
        const finalHeight = cloudResult.height || parseInt(resolution.split('x')[1]);
        resolution = `${finalWidth}x${finalHeight}`;
        deviceType = finalHeight > finalWidth ? 'mobile' : 'desktop';

        // Step 4: Handle Video Covers (preview image) dynamically via Cloudinary
        let previewImage = cloudResult.secure_url;
        if (isVideo) {
          previewImage = cloudResult.secure_url
            .replace(/\.[^/.]+$/, '.jpg')
            .replace('/video/upload/', '/video/upload/f_jpg,so_0/');
          console.log(`- Video preview cover generated: ${previewImage}`);
        }

        // Step 5: Save in MongoDB
        const wallpaperData = {
          title: cleanTitle,
          description,
          category,
          type: isVideo ? 'live' : 'static',
          deviceType,
          resolution,
          previewImage,
          downloadFile: cloudResult.secure_url,
          price,
          isPremium,
          tags,
        };

        const createdWallpaper = await Wallpaper.create(wallpaperData);
        console.log(`- Registered in MongoDB! Document ID: ${createdWallpaper._id}`);
        
        successCount++;
      } catch (fileErr) {
        console.error(`- Failed to import ${currentFilename}:`, fileErr.message);
        failCount++;
      }
    }

    console.log(`\n========================================`);
    console.log(`=== Bulk Import Finished! ===`);
    console.log(`Successfully imported: ${successCount}`);
    console.log(`- Skipped (already imported): ${skipCount}`);
    console.log(`Failed: ${failCount}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error during bulk import:', error);
    process.exit(1);
  }
};

runImport();
