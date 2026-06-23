import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Wallpaper from '../models/Wallpaper.js';

dotenv.config();

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not defined in your .env file!");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    // Find all wallpapers where previewImage ends with .png and is a local mock path
    const query = {
      previewImage: { $regex: /^\/wallpapers\/.*\.png$/ }
    };

    const wallpapers = await Wallpaper.find(query);
    console.log(`Found ${wallpapers.length} local mock wallpapers to update.`);

    let updatedCount = 0;
    for (const wp of wallpapers) {
      const originalPreview = wp.previewImage;
      const newPreview = originalPreview.replace(/\.png$/, '.webp');
      
      wp.previewImage = newPreview;
      await wp.save();
      
      console.log(`Updated "${wp.title}":`);
      console.log(`  Preview: ${originalPreview} -> ${newPreview}`);
      console.log(`  Download: ${wp.downloadFile} (preserved)`);
      updatedCount++;
    }

    console.log(`\nMigration completed! Successfully updated ${updatedCount} wallpapers.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
