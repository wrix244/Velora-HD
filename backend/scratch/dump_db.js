import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);

  const wallpapers = await Wallpaper.find({});
  console.log(`Dumping ${wallpapers.length} wallpapers from database...`);

  fs.writeFileSync(path.join(__dirname, 'db_dump.json'), JSON.stringify(wallpapers, null, 2));
  console.log('Dump completed successfully.');

  await mongoose.disconnect();
}

run();
