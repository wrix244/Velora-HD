import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);

  const keywords = [
    'Gridway', 'Terminal Console', 'Skyscraper', 'River', 'Saturn', 
    'Mountain Pass', 'Dragon Shrine', 'Hackers Den', 'Fairy Forest', 
    'Samurai', 'Ronin', 'Nier', 'Gargantua', 'Cherry Blossom', 'Fennec',
    'Misty Lake', 'Void', 'Ethereal Girl'
  ];

  console.log('Searching database by keywords...');
  for (const kw of keywords) {
    const matches = await Wallpaper.find({ title: new RegExp(kw, 'i') });
    if (matches.length > 0) {
      console.log(`\nKeyword: "${kw}" (${matches.length} matches)`);
      matches.forEach(wp => {
        console.log(`  - [${wp._id}] Title: "${wp.title}" | Category: "${wp.category}" | Cover: ${wp.previewImage.slice(0, 80)}...`);
      });
    }
  }

  await mongoose.disconnect();
}

run();
