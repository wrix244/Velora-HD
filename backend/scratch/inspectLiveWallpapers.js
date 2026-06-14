import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const METADATA_FILE = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\metadata.json';

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);

    const metadataList = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    const wallpapers = await Wallpaper.find({ type: 'live' });

    console.log(`=== LIVE WALLPAPERS IN DATABASE (${wallpapers.length}) ===`);

    const getTargetFilename = (meta) => {
      const ext = path.extname(meta.filename).toLowerCase();
      const cleanTitle = meta.title || meta.filename
        .replace(ext, '')
        .split(/[-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const cleanSlug = cleanTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      return `${cleanSlug}${ext}`;
    };

    const titleToMeta = {};
    metadataList.forEach(m => {
      const targetFilename = getTargetFilename(m);
      titleToMeta[m.title] = { ...m, targetFilename };
      const ext = path.extname(m.filename).toLowerCase();
      const cleanTitle = m.title || m.filename
        .replace(ext, '')
        .split(/[-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      titleToMeta[cleanTitle] = { ...m, targetFilename };
    });

    wallpapers.forEach((wp, idx) => {
      let meta = titleToMeta[wp.title];
      if (!meta) {
        meta = Object.values(titleToMeta).find(m => m.title === wp.title || getTargetFilename(m) === getTargetFilename(wp));
      }

      console.log(`\n${idx + 1}. Title: "${wp.title}"`);
      console.log(`   Category: "${wp.category}"`);
      console.log(`   Tags: [${wp.tags.join(', ')}]`);
      console.log(`   Original Filename: ${meta ? meta.filename : 'Unknown'}`);
      console.log(`   Target Filename: ${meta ? meta.targetFilename : 'Unknown'}`);
      console.log(`   Download URL: ${wp.downloadFile}`);
      console.log(`   Preview URL: ${wp.previewImage}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
