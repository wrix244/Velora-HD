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
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/velorahd';
  await mongoose.connect(mongoUri);

  const titlesToSearch = [
    'Cyberpunk - Synthwave Gridway',
    'Raizen Kurohiko - Samurai and Dragon Ink Art',
    'Tatsuya Takahashi - Mystic Fairy Forest Walk',
    'Raizen Kurohiko - Silhouette Sunrise Samurai',
    'Technology - Server Rack Terminal Console',
    'Virtuous Treaty - Nier Automata Flower Field',
    'Architecture - Tokyo Skyscraper Intersection',
    'Gargantua Black Hole - Deep Space Accretion Disk',
    'Nature - Golden Hour River',
    'Cherry Blossom Spring Train Sunset',
    'Space - Rings of Saturn gas giant',
    'Futuristic Halo Angel - Cyberpunk Ethereal Girl',
    'Cars - Mountain Pass Sunset Cruise',
    'Raizen Kurohiko - Giant Moon Samurai',
    'Seraphina Sunstrike - Dragon Shrine Entrance',
    'Miyamoto Musashi - Vagabond Samurai Collage',
    'Cyberpunk - Hackers Den Terminal',
    'Starlight Celestial Warrior - Cosmic Entity',
    'Desert Fennec Fox',
    'Horizon Over the Misty Lake'
  ];

  console.log('Searching database...');
  for (const title of titlesToSearch) {
    const wp = await Wallpaper.findOne({ title });
    if (wp) {
      console.log(`Found: "${title}" | ID: ${wp._id} | Cat: "${wp.category}" | Cover: ${wp.previewImage.slice(0, 100)}`);
    } else {
      console.log(`Not Found: "${title}"`);
    }
  }

  await mongoose.disconnect();
}

run();
