import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import https from 'https';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const PREVIEWS_DIR = path.join(__dirname, 'temp_previews');
if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: Status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);

    const wallpapers = await Wallpaper.find({ type: 'live' });
    console.log(`Downloading 3-second offset preview frames for ${wallpapers.length} videos...`);

    for (const wp of wallpapers) {
      // Replace so_0 with so_3 in the Cloudinary URL to get the frame at 3 seconds
      const originalPreviewUrl = wp.previewImage;
      const offsetPreviewUrl = originalPreviewUrl.replace('so_0', 'so_3');
      
      // Slugify title to use as local filename
      const cleanTitle = wp.title;
      const slug = cleanTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
        
      const destPath = path.join(PREVIEWS_DIR, `${slug}.jpg`);
      console.log(`Downloading: "${cleanTitle}" -> ${destPath}`);
      
      try {
        await downloadFile(offsetPreviewUrl, destPath);
        console.log(`  [Success]`);
      } catch (err) {
        console.error(`  [Failed] Error downloading: ${err.message}`);
      }
    }

    console.log('All downloads completed!');
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
