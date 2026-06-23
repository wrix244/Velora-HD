import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Wallpaper from '../models/Wallpaper.js';

dotenv.config();

// Helper to clean up titles for matching
const cleanTitleForMatch = (title) => {
  return title
    .toLowerCase()
    .replace(/^(nature|space|cyberpunk|anime|cars|gaming|minimal|abstract|fantasy|technology|architecture|ai art)\s*-\s*/, '')
    .trim();
};

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/velorahd';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Load metadata.json
    const metadataRaw = fs.readFileSync('bulk-import/metadata.json', 'utf8');
    const metadataList = JSON.parse(metadataRaw);
    console.log(`Loaded ${metadataList.length} metadata definitions from metadata.json.`);

    // Index metadata by cleaned title
    const metaMap = new Map();
    for (const m of metadataList) {
      if (m.title) {
        const cleaned = cleanTitleForMatch(m.title);
        metaMap.set(cleaned, m);
      }
    }

    const wallpapers = await Wallpaper.find({});
    console.log(`Found ${wallpapers.length} wallpapers in database.`);

    let matchedCount = 0;
    let correctedCount = 0;
    let unmatchedCount = 0;

    const corrections = [];

    for (const w of wallpapers) {
      const dbCleaned = cleanTitleForMatch(w.title);
      let match = metaMap.get(dbCleaned);

      // Try fuzzy match if not exact cleaned match
      if (!match) {
        for (const [key, val] of metaMap.entries()) {
          if (dbCleaned.includes(key) || key.includes(dbCleaned)) {
            match = val;
            break;
          }
        }
      }

      if (match) {
        matchedCount++;
        // Check if database details match metadata.json
        const needsCategoryFix = w.category !== match.category;
        const needsDescriptionFix = w.description !== match.description && match.description;
        const needsTagsFix = JSON.stringify(w.tags) !== JSON.stringify(match.tags) && match.tags;

        if (needsCategoryFix || needsDescriptionFix || needsTagsFix) {
          correctedCount++;
          corrections.push({
            id: w._id,
            title: w.title,
            currentCategory: w.category,
            newCategory: match.category,
            currentDescription: w.description,
            newDescription: match.description,
            currentTags: w.tags,
            newTags: match.tags,
            reason: 'Matched in metadata.json'
          });
        }
      } else {
        unmatchedCount++;
        // Fallback: Smart heuristic corrections for unmatched items
        let newCategory = w.category;
        let reason = '';

        const titleLower = w.title.toLowerCase();
        
        // Character names indicating Anime
        const animeKeywords = [
          'luna everlight', 'raizen kurohiko', 'aria whisperwind', 'mei lin', 
          'aiko sakura', 'seraphina sunstrike', 'musashi', 'kitsune', 'ronin', 
          'samurai', 'anime', 'vagabond', 'kuroko kage', 'tatsuya takahashi'
        ];

        const hasAnimeKeyword = animeKeywords.some(kw => titleLower.includes(kw));

        if (hasAnimeKeyword && w.category !== 'Anime') {
          newCategory = 'Anime';
          reason = 'Title contains anime character or style keyword';
        } else if (titleLower.includes('cyberpunk') && w.category !== 'Cyberpunk') {
          newCategory = 'Cyberpunk';
          reason = 'Title contains "cyberpunk"';
        } else if (titleLower.includes('abstract') && w.category !== 'Abstract') {
          newCategory = 'Abstract';
          reason = 'Title contains "abstract"';
        } else if (titleLower.includes('minimal') && w.category !== 'Minimal') {
          newCategory = 'Minimal';
          reason = 'Title contains "minimal"';
        } else if (titleLower.includes('gaming') && w.category !== 'Gaming') {
          newCategory = 'Gaming';
          reason = 'Title contains "gaming"';
        } else if (titleLower.includes('fennec fox') && w.category !== 'Nature') {
          newCategory = 'Nature';
          reason = 'Title contains animal ("fennec fox")';
        } else if (titleLower.includes('misty lake') && w.category !== 'Nature') {
          newCategory = 'Nature';
          reason = 'Title contains natural feature ("misty lake")';
        }

        if (newCategory !== w.category) {
          correctedCount++;
          corrections.push({
            id: w._id,
            title: w.title,
            currentCategory: w.category,
            newCategory: newCategory,
            currentDescription: w.description,
            newDescription: w.description, // no change
            currentTags: w.tags,
            newTags: w.tags, // no change
            reason: `Heuristic: ${reason}`
          });
        }
      }
    }

    console.log(`\n=== Dry Run Results ===`);
    console.log(`Total Wallpapers: ${wallpapers.length}`);
    console.log(`Matched in metadata.json: ${matchedCount}`);
    console.log(`Unmatched (using heuristics): ${unmatchedCount}`);
    console.log(`Proposed corrections: ${correctedCount}`);

    fs.writeFileSync('scratch/proposed_corrections.json', JSON.stringify(corrections, null, 2));
    console.log('\nSaved proposed corrections to scratch/proposed_corrections.json');

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
