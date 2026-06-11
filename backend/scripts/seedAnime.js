import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Wallpaper from '../models/Wallpaper.js';

dotenv.config();

const animeWallpapers = [
  {
    title: 'Sakura Lake Twilight',
    description: 'A serene mountain lake at twilight with cherry blossom petals floating in the air, mirror-like water reflections, and glowing fireflies. Makoto Shinkai inspired anime art.',
    category: 'Anime',
    type: 'static',
    deviceType: 'desktop',
    resolution: '1920x1080',
    previewImage: '/wallpapers/anime/sakura-lake.png',
    downloadFile: '/wallpapers/anime/sakura-lake.png',
    price: 0,
    isPremium: false,
    tags: ['anime', 'sakura', 'lake', 'twilight', 'makoto shinkai', 'peaceful'],
  },
  {
    title: 'Neon City Nights',
    description: 'A futuristic anime cityscape at night with towering neon skyscrapers, flying vehicles, and rain-soaked streets reflecting colorful lights. Cyberpunk anime aesthetic.',
    category: 'Anime',
    type: 'static',
    deviceType: 'desktop',
    resolution: '1920x1080',
    previewImage: '/wallpapers/anime/neon-city.png',
    downloadFile: '/wallpapers/anime/neon-city.png',
    price: 1.99,
    isPremium: true,
    tags: ['anime', 'cyberpunk', 'city', 'neon', 'night', 'rain'],
  },
  {
    title: 'Enchanted Forest Path',
    description: 'A magical anime forest with ancient glowing trees, bioluminescent mushrooms, and golden sunlight filtering through the canopy. Studio Ghibli inspired.',
    category: 'Anime',
    type: 'static',
    deviceType: 'desktop',
    resolution: '1920x1080',
    previewImage: '/wallpapers/anime/enchanted-forest.png',
    downloadFile: '/wallpapers/anime/enchanted-forest.png',
    price: 0,
    isPremium: false,
    tags: ['anime', 'forest', 'ghibli', 'magical', 'nature', 'enchanted'],
  },
  {
    title: 'Torii Gate Sunset',
    description: 'A stunning anime ocean sunset with a lone torii gate standing in shallow water, dramatic orange and purple sky with massive cumulus clouds.',
    category: 'Anime',
    type: 'static',
    deviceType: 'desktop',
    resolution: '1920x1080',
    previewImage: '/wallpapers/anime/torii-sunset.png',
    downloadFile: '/wallpapers/anime/torii-sunset.png',
    price: 0,
    isPremium: false,
    tags: ['anime', 'torii', 'sunset', 'ocean', 'japanese', 'scenic'],
  },
  {
    title: 'Rooftop Dusk Vibes',
    description: 'A cozy anime rooftop scene overlooking a vast city at dusk with string lights, potted plants, and warm golden hour lighting. Lo-fi anime aesthetic.',
    category: 'Anime',
    type: 'static',
    deviceType: 'desktop',
    resolution: '1920x1080',
    previewImage: '/wallpapers/anime/rooftop-dusk.png',
    downloadFile: '/wallpapers/anime/rooftop-dusk.png',
    price: 2.99,
    isPremium: true,
    tags: ['anime', 'rooftop', 'lofi', 'city', 'cozy', 'dusk'],
  },
];

async function seedAnime() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const wp of animeWallpapers) {
      const existing = await Wallpaper.findOne({ title: wp.title });
      if (existing) {
        console.log(`⏭️  Skipping "${wp.title}" (already exists)`);
        continue;
      }
      await Wallpaper.create(wp);
      console.log(`✅ Created: ${wp.title}`);
    }

    console.log('\n🎨 Anime wallpapers seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedAnime();
