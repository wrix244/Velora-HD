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
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/velorahd';
    await mongoose.connect(mongoUri);
    
    const wallpapers = await Wallpaper.find({ type: 'live' }, 'title slug type category deviceType');
    console.log(JSON.stringify(wallpapers, null, 2));

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
