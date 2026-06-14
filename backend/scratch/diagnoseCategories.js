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
    const wallpapers = await Wallpaper.find({});

    console.log(`Analyzing database wallpapers against metadata...`);

    // Helper to get clean target filename
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

    // Build map of original titles to meta, and target filenames
    const titleToMeta = {};
    metadataList.forEach(m => {
      const targetFilename = getTargetFilename(m);
      titleToMeta[m.title] = { ...m, targetFilename };
      // Also map clean title if title is empty or parsed
      const ext = path.extname(m.filename).toLowerCase();
      const cleanTitle = m.title || m.filename
        .replace(ext, '')
        .split(/[-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      titleToMeta[cleanTitle] = { ...m, targetFilename };
    });

    // Map explicit overrides categories
    const explicitOverridesByOriginalTitle = {
      'Cyberpunk - Synthwave Gridway': 'Anime',
      'Tatsuya Takahashi - Mystic Fairy Forest Walk': 'Anime',
      'Technology - Server Rack Terminal Console': 'Fantasy',
      'Architecture - Tokyo Skyscraper Intersection': 'Space',
      'Nature - Golden Hour River': 'Anime',
      'Space - Rings of Saturn gas giant': 'Anime',
      'Cars - Mountain Pass Sunset Cruise': 'Anime',
      'Seraphina Sunstrike - Dragon Shrine Entrance': 'Anime',
      'Cyberpunk - Hackers Den Terminal': 'Space'
    };

    const overrideNewTitleToCategory = {
      'Raizen Kurohiko - Samurai and Dragon Ink Art': 'Anime',
      'Raizen Kurohiko - Silhouette Sunrise Samurai': 'Anime',
      'Virtuous Treaty - Nier Automata Flower Field': 'Fantasy',
      'Gargantua Black Hole - Deep Space Accretion Disk': 'Space',
      'Cherry Blossom Spring Train Sunset': 'Anime',
      'Futuristic Halo Angel - Cyberpunk Ethereal Girl': 'Anime',
      'Raizen Kurohiko - Giant Moon Samurai': 'Anime',
      'Miyamoto Musashi - Vagabond Samurai Collage': 'Anime',
      'Starlight Celestial Warrior - Cosmic Entity': 'Space'
    };

    let mismatchedCount = 0;
    const mismatches = [];

    const characterNames = [
      'luna-everlight', 'luna', 'raizen-kurohiko', 'raizen', 'aria-whisperwind', 'aria',
      'kaelen-frost', 'kaelen', 'seraphina-sunstrike', 'seraphina', 'aiko-sakura', 'aiko',
      'kitsune-hime', 'kitsune', 'mei-lin', 'mei', 'sora-shinohara', 'sora', 'yuki-blossom', 'yuki',
      'kuroko-kage', 'kuroko', 'tatsuya-takahashi', 'tatsuya', 'miyamoto-musashi'
    ];

    for (const wp of wallpapers) {
      let correctCategory = wp.category;

      // 1. Check if it's an explicit override (by original title or new title)
      if (explicitOverridesByOriginalTitle[wp.title]) {
        correctCategory = explicitOverridesByOriginalTitle[wp.title];
      } else if (overrideNewTitleToCategory[wp.title]) {
        correctCategory = overrideNewTitleToCategory[wp.title];
      } else {
        // 2. Otherwise map to metadata
        const meta = titleToMeta[wp.title];
        if (!meta) {
          console.log(`[Warning] No metadata match found for database wallpaper: "${wp.title}"`);
          continue;
        }

        const filename = meta.targetFilename.toLowerCase();

        // Determine correct category from filename prefix
        if (filename.startsWith('abstract-')) {
          correctCategory = 'Abstract';
        } else if (filename.startsWith('anime-')) {
          correctCategory = 'Anime';
        } else if (filename.startsWith('architecture-')) {
          correctCategory = 'Architecture';
        } else if (filename.startsWith('cars-')) {
          correctCategory = 'Cars';
        } else if (filename.startsWith('cyberpunk-')) {
          correctCategory = 'Cyberpunk';
        } else if (filename.startsWith('gaming-')) {
          correctCategory = 'Gaming';
        } else if (filename.startsWith('minimal-') || filename.startsWith('minimalist-')) {
          correctCategory = 'Minimal';
        } else if (filename.startsWith('nature-') || filename.startsWith('traditional-kyoto-') || filename.startsWith('sunset-horizon-')) {
          correctCategory = 'Nature';
        } else if (filename.startsWith('space-') || filename.startsWith('milky-way-') || filename.startsWith('gargantua-')) {
          correctCategory = 'Space';
        } else if (filename.startsWith('technology-') || filename.startsWith('futuristic-cyber-')) {
          correctCategory = 'Technology';
        }

        // Check if it's a character wallpaper
        const isCharacter = characterNames.some(name => filename.includes(name));
        if (isCharacter) {
          correctCategory = 'Anime';
        }

        // Special overrides
        if (filename.includes('virtuous-treaty')) {
          correctCategory = 'Fantasy';
        }
        if (filename.includes('gargantua')) {
          correctCategory = 'Space';
        }
        if (filename.includes('miyamoto-musashi')) {
          correctCategory = 'Anime';
        }
        if (filename.includes('starlight-celestial-warrior')) {
          correctCategory = 'Space';
        }
      }

      if (wp.category !== correctCategory) {
        mismatchedCount++;
        mismatches.push({
          id: wp._id,
          title: wp.title,
          currentCategory: wp.category,
          correctCategory: correctCategory
        });
      }
    }

    console.log(`\nFound ${mismatchedCount} mismatched wallpapers in database.`);
    mismatches.forEach((m, idx) => {
      console.log(`${idx + 1}. Title: "${m.title}"`);
      console.log(`   Filename: ${m.filename}`);
      console.log(`   Category: "${m.currentCategory}" -> "${m.correctCategory}"`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
