import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const explicitOverridesByTitle = {
  // Key Samurai / Fantasy / Space JPG overrides matched by original title
  'Cyberpunk - Synthwave Gridway': {
    title: 'Raizen Kurohiko - Samurai and Dragon Ink Art',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'dragon', 'ink', 'japanese', 'anime']
  },
  'Tatsuya Takahashi - Mystic Fairy Forest Walk': {
    title: 'Raizen Kurohiko - Silhouette Sunrise Samurai',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'sunset', 'sun', 'mountain', 'anime']
  },
  'Technology - Server Rack Terminal Console': {
    title: 'Virtuous Treaty - Nier Automata Flower Field',
    category: 'Fantasy',
    tags: ['nier', 'sword', 'flower', 'white', 'red', 'fantasy', 'anime']
  },
  'Architecture - Tokyo Skyscraper Intersection': {
    title: 'Gargantua Black Hole - Deep Space Accretion Disk',
    category: 'Space',
    tags: ['space', 'black hole', 'stargazing', 'interstellar']
  },
  'Nature - Golden Hour River': {
    title: 'Cherry Blossom Spring Train Sunset',
    category: 'Anime',
    tags: ['anime', 'train', 'cherry blossom', 'sakura', 'sunset']
  },
  'Space - Rings of Saturn gas giant': {
    title: 'Futuristic Halo Angel - Cyberpunk Ethereal Girl',
    category: 'Anime',
    tags: ['anime', 'girl', 'cyberpunk', 'halo', 'angel', 'ethereal']
  },
  'Cars - Mountain Pass Sunset Cruise': {
    title: 'Raizen Kurohiko - Giant Moon Samurai',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'warrior', 'moon', 'maple', 'japanese', 'anime']
  },
  'Seraphina Sunstrike - Dragon Shrine Entrance': {
    title: 'Miyamoto Musashi - Vagabond Samurai Collage',
    category: 'Anime',
    tags: ['samurai', 'vagabond', 'miyamoto musashi', 'manga', 'ink', 'anime']
  },
  'Cyberpunk - Hackers Den Terminal': {
    title: 'Starlight Celestial Warrior - Cosmic Entity',
    category: 'Space',
    tags: ['space', 'warrior', 'stars', 'cosmic', 'fantasy']
  }
};

const runFix = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri.split('@')[1] || mongoUri}`);
    await mongoose.connect(mongoUri);

    // Read metadata mapping file (links title to original filename)
    const metadataFile = path.join(__dirname, '../bulk-import/metadata.json');
    let metadataList = [];
    if (fs.existsSync(metadataFile)) {
      metadataList = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
      console.log(`Loaded ${metadataList.length} metadata records from metadata.json.`);
    }

    // Read classification results from Python analysis
    const classFilePath = path.join(__dirname, 'classification_results.json');
    let classData = {};
    if (fs.existsSync(classFilePath)) {
      classData = JSON.parse(fs.readFileSync(classFilePath, 'utf8'));
      console.log(`Loaded color-based classification results for ${Object.keys(classData).length} files.`);
    }

    const wallpapers = await Wallpaper.find({});
    console.log(`Found ${wallpapers.length} wallpapers in database to review.`);

    let updatedCount = 0;

    for (const wp of wallpapers) {
      let shouldUpdate = false;
      let newTitle = wp.title;
      let newCategory = wp.category;
      let newTags = [...wp.tags];

      // 1. Check if there is an explicit override matching by current database title
      if (explicitOverridesByTitle[wp.title]) {
        const override = explicitOverridesByTitle[wp.title];
        newTitle = override.title;
        newCategory = override.category;
        newTags = Array.from(new Set([...newTags, ...override.tags]));
        shouldUpdate = true;
        console.log(`\nApplying Explicit Override for: "${wp.title}"`);
        console.log(`  - Title: "${wp.title}" -> "${newTitle}"`);
        console.log(`  - Category: "${wp.category}" -> "${newCategory}"`);
      } 
      // 2. Otherwise, check the color-analysis classification
      else {
        // Find the original filename in metadata.json matching the current database title
        const metaEntry = metadataList.find(m => m.title === wp.title);
        if (metaEntry) {
          const originalFilename = metaEntry.filename;
          
          // Look up original filename in the color classification results
          if (classData[originalFilename]) {
            const stats = classData[originalFilename];
            const suggested = stats.suggested_category;

            // If the suggested category differs from the database category
            if (suggested !== wp.category) {
              newCategory = suggested;
              shouldUpdate = true;

              // Update title prefix if it has "Category - Theme"
              if (wp.title.includes(' - ')) {
                const theme = wp.title.split(' - ')[1];
                newTitle = `${newCategory} - ${theme}`;
              }

              // Update tags
              newTags = newTags.filter(t => t !== wp.category.toLowerCase());
              newTags.push(newCategory.toLowerCase());
              newTags = Array.from(new Set(newTags));

              console.log(`\nCorrecting category for: "${wp.title}" (${originalFilename})`);
              console.log(`  - Suggested: ${suggested} (Neon: ${stats.p_neon}%, Nature: ${stats.p_nature}%, Saturation: ${100 - stats.p_low_sat}%)`);
              console.log(`  - Category: "${wp.category}" -> "${newCategory}"`);
              console.log(`  - Title: "${wp.title}" -> "${newTitle}"`);
            }
          }
        }
      }

      if (shouldUpdate) {
        wp.title = newTitle;
        wp.category = newCategory;
        wp.tags = newTags;
        await wp.save();
        updatedCount++;
      }
    }

    console.log(`\n========================================`);
    console.log(`Successfully updated ${updatedCount} wallpapers in MongoDB!`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during database update:', error);
  }
};

runFix();
