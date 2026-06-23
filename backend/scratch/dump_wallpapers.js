import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Wallpaper from '../models/Wallpaper.js';

dotenv.config();

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://velorahdwallart_db_user:wS0UoX3uyUC6Y96B@cluster0.asdb7xr.mongodb.net/';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    const wallpapers = await Wallpaper.find({}).sort({ createdAt: -1 });
    console.log(`Total wallpapers retrieved: ${wallpapers.length}`);

    const outputData = wallpapers.map(w => ({
      id: w._id,
      title: w.title,
      slug: w.slug,
      category: w.category,
      type: w.type,
      deviceType: w.deviceType,
      resolution: w.resolution,
      price: w.price,
      isPremium: w.isPremium,
      tags: w.tags,
      description: w.description,
      previewImage: w.previewImage,
      downloadFile: w.downloadFile
    }));

    fs.writeFileSync('scratch/wallpapers_dump.json', JSON.stringify(outputData, null, 2));
    console.log('Dumped metadata to scratch/wallpapers_dump.json');

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
