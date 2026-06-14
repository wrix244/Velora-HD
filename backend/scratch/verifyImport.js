import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const runVerify = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri.split('@')[1] || mongoUri}`);
    await mongoose.connect(mongoUri);
    
    const count = await Wallpaper.countDocuments({});
    console.log(`\nTotal Wallpapers in MongoDB: ${count}`);

    const dirPath = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
    const files = fs.readdirSync(dirPath);
    console.log(`Total Files in VeloraHD directory: ${files.length}`);

    // Let's print out the list of files and check which ones exist in database
    const dbWallpapers = await Wallpaper.find({}, 'title previewImage downloadFile');

    console.log(`\nSample database entries (first 5):`);
    dbWallpapers.slice(0, 5).forEach((w, i) => {
      console.log(`${i+1}. Title: "${w.title}" | Type: ${w.previewImage === w.downloadFile ? 'static' : 'live'}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Verification failed:', error);
  }
};

runVerify();
