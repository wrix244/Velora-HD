import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Wallpaper from '../models/Wallpaper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri.split('@')[1] || mongoUri}`);
    await mongoose.connect(mongoUri);

    // 1. Fix the tree-under-red-moon wallpaper (Architecture - Monolithic Archway Design)
    const treeMoon = await Wallpaper.findOne({ title: 'Architecture - Monolithic Archway Design', type: 'live' });
    if (treeMoon) {
      console.log(`Updating Monolithic Archway (Tree & Moon) wallpaper...`);
      treeMoon.title = 'Nature - Red Moon Silhouette Tree';
      treeMoon.category = 'Nature';
      treeMoon.tags = ['nature', 'silhouette', 'moon', 'tree', 'peaceful', 'live-wallpaper', 'video', 'mobile'];
      await treeMoon.save();
      console.log(`  [Success] Updated title, category, and tags.`);
    }

    // 2. Fix the boat-on-lake wallpaper (Technology - Holographic Data Cube)
    const boatLake = await Wallpaper.findOne({ title: 'Technology - Holographic Data Cube', type: 'live' });
    if (boatLake) {
      console.log(`Updating Holographic Data Cube (Sunset Lake Boat) wallpaper...`);
      boatLake.title = 'Nature - Sunset Lake Boat Cruise';
      boatLake.category = 'Nature';
      boatLake.tags = ['nature', 'lake', 'boat', 'sunset', 'mountains', 'peaceful', 'live-wallpaper', 'video', 'mobile'];
      await boatLake.save();
      console.log(`  [Success] Updated title, category, and tags.`);
    }

    // 3. Update preview offset from so_0 to so_3 for ALL live wallpapers
    console.log(`Updating preview offsets for all live wallpapers from so_0 to so_3...`);
    const liveWallpapers = await Wallpaper.find({ type: 'live' });
    let updatedPreviewsCount = 0;

    for (const wp of liveWallpapers) {
      if (wp.previewImage && wp.previewImage.includes('so_0')) {
        const newPreview = wp.previewImage.replace('so_0', 'so_3');
        console.log(`Updating preview for "${wp.title}":`);
        console.log(`  Old: ${wp.previewImage}`);
        console.log(`  New: ${newPreview}`);
        wp.previewImage = newPreview;
        await wp.save();
        updatedPreviewsCount++;
      }
    }

    console.log(`Successfully updated ${updatedPreviewsCount} live wallpaper preview offsets to 3-second frames.`);
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

run();
