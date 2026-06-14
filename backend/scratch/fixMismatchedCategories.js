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
    console.log(`Connecting to: ${mongoUri.split('@')[1] || mongoUri}`);
    await mongoose.connect(mongoUri);

    const metadataList = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    const wallpapers = await Wallpaper.find({});

    console.log(`Loaded ${metadataList.length} metadata records.`);
    console.log(`Found ${wallpapers.length} wallpapers in database.`);

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

    const characterNames = [
      'luna-everlight', 'luna', 'raizen-kurohiko', 'raizen', 'aria-whisperwind', 'aria',
      'kaelen-frost', 'kaelen', 'seraphina-sunstrike', 'seraphina', 'aiko-sakura', 'aiko',
      'kitsune-hime', 'kitsune', 'mei-lin', 'mei', 'sora-shinohara', 'sora', 'yuki-blossom', 'yuki',
      'kuroko-kage', 'kuroko', 'tatsuya-takahashi', 'tatsuya', 'miyamoto-musashi'
    ];

    let updateCount = 0;

    for (const wp of wallpapers) {
      let correctCategory = wp.category;

      if (explicitOverridesByOriginalTitle[wp.title]) {
        correctCategory = explicitOverridesByOriginalTitle[wp.title];
      } else if (overrideNewTitleToCategory[wp.title]) {
        correctCategory = overrideNewTitleToCategory[wp.title];
      } else {
        const meta = titleToMeta[wp.title];
        if (!meta) continue;

        const filename = meta.targetFilename.toLowerCase();

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

        const isCharacter = characterNames.some(name => filename.includes(name));
        if (isCharacter) {
          correctCategory = 'Anime';
        }

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
        console.log(`Updating "${wp.title}": "${wp.category}" -> "${correctCategory}"`);
        
        // Update category
        wp.category = correctCategory;

        // Clean tags: remove old lowercase category name, add new lowercase category name
        let tags = wp.tags.filter(t => t !== wp.category.toLowerCase());
        tags.push(correctCategory.toLowerCase());
        wp.tags = Array.from(new Set(tags));

        await wp.save();
        updateCount++;
      }
    }

    console.log(`\nSuccessfully updated ${updateCount} wallpapers in MongoDB!`);
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
