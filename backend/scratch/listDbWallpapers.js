import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    
    const wallpapers = await Wallpaper.find({}, 'title category type previewImage downloadFile');
    
    const byCategory = {};
    wallpapers.forEach(w => {
      if (!byCategory[w.category]) byCategory[w.category] = [];
      byCategory[w.category].push({
        id: w._id,
        title: w.title,
        type: w.type,
        previewImage: w.previewImage
      });
    });

    console.log(`--- WALLPAPERS BY CATEGORY ---`);
    for (const [cat, list] of Object.entries(byCategory)) {
      console.log(`\nCategory: ${cat} (${list.length} items)`);
      list.forEach((w, i) => {
        console.log(`  ${i+1}. [${w.id}] Title: "${w.title}" | Cover: ${w.previewImage.slice(0, 80)}...`);
      });
    }

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
