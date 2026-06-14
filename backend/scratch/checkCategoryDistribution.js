import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);

    const wallpapers = await Wallpaper.find({}, 'title category tags previewImage');

    const counts = {};
    const items = {};

    wallpapers.forEach(w => {
      counts[w.category] = (counts[w.category] || 0) + 1;
      if (!items[w.category]) items[w.category] = [];
      items[w.category].push({
        id: w._id,
        title: w.title,
        tags: w.tags,
        previewImage: w.previewImage
      });
    });

    let out = '--- CATEGORY COUNTS ---\n';
    Object.keys(counts).sort().forEach(cat => {
      out += `${cat}: ${counts[cat]}\n`;
    });

    out += '\n--- DETAILED BREAKDOWN ---\n';
    Object.keys(items).sort().forEach(cat => {
      out += `\n========================================\n`;
      out += `CATEGORY: ${cat} (${items[cat].length} items)\n`;
      out += `========================================\n`;
      items[cat].forEach((w, i) => {
        out += `${i+1}. [${w.id}] Title: "${w.title}"\n`;
        out += `   Tags: [${w.tags.join(', ')}]\n`;
        out += `   URL: ${w.previewImage}\n`;
      });
    });

    fs.writeFileSync(path.join(__dirname, 'distribution.txt'), out, 'utf8');
    console.log('Saved distribution details to scratch/distribution.txt');

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
