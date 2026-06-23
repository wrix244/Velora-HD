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
  console.log(`Checking ${wallpapers.length} wallpapers...`);

  const animeKeywords = [
    'luna everlight', 'raizen kurohiko', 'aria whisperwind', 'mei lin', 
    'aiko sakura', 'seraphina sunstrike', 'musashi', 'kitsune', 'ronin', 
    'samurai', 'anime', 'vagabond', 'kuroko kage', 'tatsuya takahashi', 'sora shinohara',
    'yuki blossom', 'kaelen frost'
  ];

  const mismatches = [];

  for (const wp of wallpapers) {
    const titleLower = wp.title.toLowerCase();
    let correctCategory = wp.category;
    let categoryReason = '';

    // Check Anime character keywords
    const hasAnimeKeyword = animeKeywords.some(kw => titleLower.includes(kw));
    if (hasAnimeKeyword && wp.category !== 'Anime') {
      // Don't override if there is an explicit fantasy override or it's Nier
      if (titleLower.includes('virtuous treaty') || titleLower.includes('starlight celestial warrior')) {
        // Nier/Starlight can be Fantasy/Space
      } else {
        correctCategory = 'Anime';
        categoryReason = 'Title contains anime character or style keyword';
      }
    }

    // Check specific title overrides
    if (titleLower.includes('fennec fox') && wp.category !== 'Nature') {
      correctCategory = 'Nature';
      categoryReason = 'Title contains animal ("fennec fox")';
    } else if (titleLower.includes('misty lake') && wp.category !== 'Nature') {
      correctCategory = 'Nature';
      categoryReason = 'Title contains natural feature ("misty lake")';
    } else if (titleLower.includes('cyberpunk') && wp.category !== 'Cyberpunk' && !hasAnimeKeyword) {
      correctCategory = 'Cyberpunk';
      categoryReason = 'Title contains "cyberpunk"';
    } else if (titleLower.includes('abstract') && wp.category !== 'Abstract') {
      correctCategory = 'Abstract';
      categoryReason = 'Title contains "abstract"';
    } else if (titleLower.includes('minimal') && wp.category !== 'Minimal' && !titleLower.includes('minimalist rgb setup')) {
      correctCategory = 'Minimal';
      categoryReason = 'Title contains "minimal"';
    }

    // Check description device type mismatches
    let newDescription = wp.description;
    let descriptionReason = '';
    if (wp.deviceType === 'mobile' && wp.description.includes('desktop wallpaper')) {
      newDescription = wp.description.replace('desktop wallpaper', 'mobile wallpaper');
      descriptionReason = 'Device type is mobile but description said desktop wallpaper';
    } else if (wp.deviceType === 'desktop' && wp.description.includes('mobile wallpaper')) {
      newDescription = wp.description.replace('mobile wallpaper', 'desktop wallpaper');
      descriptionReason = 'Device type is desktop but description said mobile wallpaper';
    }

    // Check tags: make sure category and deviceType are present in tags
    let newTags = [...wp.tags];
    let tagsReason = '';
    const oldTagsStr = JSON.stringify(newTags.sort());
    
    // Add correct category to tags (lowercase)
    const catTag = correctCategory.toLowerCase();
    if (!newTags.includes(catTag)) {
      newTags.push(catTag);
    }
    // Remove old category tag if changed
    if (correctCategory !== wp.category) {
      newTags = newTags.filter(t => t !== wp.category.toLowerCase());
    }

    // Add deviceType to tags
    if (!newTags.includes(wp.deviceType)) {
      newTags.push(wp.deviceType);
    }

    // Ensure clean unique tags
    newTags = Array.from(new Set(newTags.map(t => t.toLowerCase())));
    const newTagsStr = JSON.stringify([...newTags].sort());
    
    if (oldTagsStr !== newTagsStr) {
      tagsReason = 'Tags mismatch';
    }

    if (correctCategory !== wp.category || newDescription !== wp.description || oldTagsStr !== newTagsStr) {
      mismatches.push({
        id: wp._id,
        title: wp.title,
        currentCategory: wp.category,
        newCategory: correctCategory,
        categoryReason,
        currentDescription: wp.description,
        newDescription,
        descriptionReason,
        currentTags: wp.tags,
        newTags,
        tagsReason
      });
    }
  }

  console.log(`\nFound ${mismatches.length} wallpapers with properties to correct.`);
  mismatches.forEach((m, idx) => {
    console.log(`\n${idx + 1}. [${m.id}] Title: "${m.title}"`);
    if (m.currentCategory !== m.newCategory) {
      console.log(`   Category: "${m.currentCategory}" -> "${m.newCategory}" (${m.categoryReason})`);
    }
    if (m.currentDescription !== m.newDescription) {
      console.log(`   Description: "${m.currentDescription}" -> "${m.newDescription}" (${m.descriptionReason})`);
    }
    if (m.tagsReason) {
      console.log(`   Tags: [${m.currentTags.join(', ')}] -> [${m.newTags.join(', ')}]`);
    }
  });

  fs.writeFileSync(path.join(__dirname, 'proposed_corrections_v2.json'), JSON.stringify(mismatches, null, 2));
  console.log('\nSaved proposed corrections to scratch/proposed_corrections_v2.json');

  await mongoose.disconnect();
}

run();
