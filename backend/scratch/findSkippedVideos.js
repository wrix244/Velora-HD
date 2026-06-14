import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const VELORA_DIR = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
const METADATA_FILE = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\metadata.json';

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);

    const localFiles = fs.readdirSync(VELORA_DIR).filter(f => f.toLowerCase().endsWith('.mp4'));
    const metadataList = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    const wallpapers = await Wallpaper.find({ type: 'live' });

    console.log(`Local video files: ${localFiles.length}`);
    console.log(`Database video records: ${wallpapers.length}`);

    // Helper to get target filename for metadata
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

    // Check which local files exist in database
    const dbUrls = wallpapers.map(w => w.downloadFile.toLowerCase());

    const skipped = [];
    localFiles.forEach(f => {
      // Find in database by target filename or title or checking if URL contains the slug
      const slug = f.replace('.mp4', '');
      const matchedInDb = wallpapers.find(w => {
        const dbSlug = w.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return dbSlug === slug || w.downloadFile.includes(slug);
      });

      if (!matchedInDb) {
        // Find in metadata to see what original name was
        const meta = metadataList.find(m => {
          if (m.filename === f) return true;
          return getTargetFilename(m) === f;
        });
        skipped.push({ filename: f, meta });
      }
    });

    console.log(`\nFound ${skipped.length} skipped videos:`);
    skipped.forEach((s, idx) => {
      console.log(`${idx + 1}. Filename: ${s.filename}`);
      if (s.meta) {
        console.log(`   Metadata Title: "${s.meta.title}"`);
        console.log(`   Metadata Category: "${s.meta.category}"`);
      } else {
        console.log(`   No metadata found!`);
      }
    });

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
