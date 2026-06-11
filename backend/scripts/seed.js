import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Wallpaper from '../models/Wallpaper.js';
import Purchase from '../models/Purchase.js';
import Download from '../models/Download.js';
import Favorite from '../models/Favorite.js';

dotenv.config();

// Sample premium Unsplash photo IDs for different categories
const categoryPhotos = {
  Nature: [
    '1501785888041-af3ef285b470', // lake/mountain
    '1470071459604-3b5ec3a7fe05', // misty forest
    '1447752875215-b2761acb3c5d', // woodland path
    '1472214222541-d510753a4707', // green valley
    '1469474968028-56623f02e42e', // mountain sunset
  ],
  Space: [
    '1451187580459-43490279c0fa', // blue earth space
    '1462331940025-496dfbfc7564', // purple nebula
    '1506318137071-a8e063b4bec0', // starry night
    '1543722530-d2c3201371e7', // deep cosmos
    '1446776811953-b23d57bd21aa', // satellite view
  ],
  Cyberpunk: [
    '1515621061946-eff1c2a352bd', // neon city street
    '1508739773434-c26b3d09e071', // neon signs alley
    '1545239351-ef35f43d514b', // futuristic cityscape
    '1601042879364-f3947d3f9c16', // neon building facade
    '1522071820081-009f0129c71c', // cyber tech room
  ],
  Anime: [
    '1578632767115-351597cf2477', // anime character drawing
    '1607604276583-eef5d076aa5f', // animated night sky
    '1534447677768-be436bb09401', // fantasy clouds landscape
    '1542838132-92c53300491e', // cartoon street light
    '1528459801416-a9e53bbf4e17', // artistic cloud brushstrokes
  ],
  Cars: [
    '1525609004556-c46c7d6cf0a3', // sports car front
    '1617788138017-80ad40651399', // luxury car night
    '1563720223185-11003d516935', // classic wheel
    '1503376780353-7e6692767b70', // porsche side
    '1580273916550-e323be2ae537', // red sedan race
  ],
  Gaming: [
    '1538481199705-c710c4e965fc', // game setup neon
    '1542751371-adc38448a05e', // gaming controller close
    '1600861195091-690c92f1d2cc', // neon arcade cabinet
    '1511512578047-dfb367046420', // cyber setup keyboard
    '1550745165-9bc0b252726f', // retro console games
  ],
  Minimal: [
    '1507525428034-b723cf961d3e', // clean beach line
    '1486406146926-c627a92ad1ab', // single concrete wall line
    '1554034483-04fda0d3507b', // light gray minimal gradient
    '1494438639946-1ebd1d2038b5', // single yellow chair
    '1482862549707-f63cb32c5fd9', // simple dark sky mountain
  ],
  Abstract: [
    '1541701494587-cb58502866ab', // fluid colorful marble
    '1550684848-fac1c5b4e853', // black and gold waves
    '1618005182384-a83a8bd57fbe', // 3d glass spheres
    '1579783900882-c0d3dad7b119', // colorful paint splash
    '1567095761054-7a02e69e5c43', // blue watercolor bleed
  ],
  Fantasy: [
    '1518709268805-4e9042af9f23', // magic potion bottle
    '1535663110-97726af91a03', // enchanted castle silhouette
    '1509198397868-475647b2a1e5', // glowing forest lights
    '1519074002996-a69e7ac46a42', // mythical landscape mountains
    '1568605117036-5fe5e7bab0b7', // dragon wing aesthetic
  ],
  Technology: [
    '1518770660439-4636190af475', // circuit board green glow
    '1607604276583-eef5d076aa5f', // servers flashing lights
    '1526374965328-7f61d4dc18c5', // matrix code falling
    '1558494949-ef010cbdcc31', // tech cloud network nodes
    '1531297484001-80022131f5a1', // silver laptop close
  ],
  Architecture: [
    '1486406146926-c627a92ad1ab', // tall skyscraper facade
    '1513694203232-719a280e022f', // modern concrete stairs
    '1600585154340-be6161a56a0c', // luxury house structure
    '1487958449343-2442ce965ff3', // colorful geometric building
    '1512917774080-9991f1c4c750', // classic columns arches
  ],
};

// Direct MP4 video URLs for Live Wallpapers (using standard public samples)
const liveVideoUrls = [
  'https://assets.mixkit.co/videos/preview/mixkit-nebula-in-outer-space-42456-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-neon-lines-42595-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-with-neon-lights-40141-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41761-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-retro-futuristic-grid-background-42614-large.mp4',
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dreamlens');
    console.log('Database connected!');

    // Clear existing tables
    await User.deleteMany({});
    await Wallpaper.deleteMany({});
    await Purchase.deleteMany({});
    await Download.deleteMany({});
    await Favorite.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    const adminUser = await User.create({
      name: 'Dream Lens Admin',
      email: 'admin@dreamlens.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
    });

    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@dreamlens.com',
      password: 'user123', // Will be hashed by pre-save hook
      role: 'user',
    });

    console.log('Created Admin and Regular Test User.');

    // 2. Generate 52 Wallpapers
    const categories = Object.keys(categoryPhotos);
    const wallpapersToSeed = [];

    // Counter to loop through live videos
    let liveVideoIndex = 0;

    for (let i = 1; i <= 52; i++) {
      const category = categories[(i - 1) % categories.length];
      const photoArray = categoryPhotos[category];
      const photoId = photoArray[(i - 1) % photoArray.length];

      // Determinations
      const deviceType = i % 2 === 0 ? 'mobile' : 'desktop';
      const type = i % 4 === 0 ? 'live' : 'static'; // 25% live wallpapers
      const isPremium = i % 3 === 0; // ~33% premium wallpapers
      const price = isPremium ? [2.99, 4.99, 6.99, 9.99][i % 4] : 0;
      
      const resolution = deviceType === 'desktop' 
        ? (i % 3 === 0 ? '3840x2160' : '1920x1080')
        : (i % 3 === 0 ? '1440x3200' : '1080x1920');

      // URLs
      const previewImage = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=75`;
      
      // If live, the download file is an mp4, otherwise a high-res image
      let downloadFile = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=3840&q=95`;
      if (type === 'live') {
        downloadFile = liveVideoUrls[liveVideoIndex % liveVideoUrls.length];
        liveVideoIndex++;
      }

      // Metadata tags
      const tags = [
        category.toLowerCase(),
        deviceType,
        type,
        isPremium ? 'premium' : 'free',
        'cinematic',
        'hd',
      ];

      // Random initial stats
      const downloads = Math.floor(Math.random() * 400) + 10;
      const likes = Math.floor(downloads * (0.1 + Math.random() * 0.15)) + 2;

      const title = `${category} ${type === 'live' ? 'Motion' : 'Scene'} #${Math.floor(i * 1.5 + 10)}`;
      const baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const suffix = Math.random().toString(36).substring(2, 7);
      const slug = `${baseSlug}-${suffix}`;

      wallpapersToSeed.push({
        title,
        slug,
        description: `Experience this premium high-quality ${deviceType} ${type} wallpaper from the ${category} collection. Crafted with modern cinematic aesthetics, glassmorphic tones, and vibrant layouts to transform your device.`,
        category,
        type,
        deviceType,
        resolution,
        previewImage,
        downloadFile,
        price,
        isPremium,
        downloads,
        likes,
        tags,
        createdAt: new Date(Date.now() - (52 - i) * 6 * 3600000), // Spaced out created times
      });
    }

    const createdWallpapers = await Wallpaper.insertMany(wallpapersToSeed);
    console.log(`Seeded ${createdWallpapers.length} wallpapers.`);

    // 3. Seed Mock Favorites, Downloads and Purchases
    console.log('Seeding transactions and user logs...');
    
    // Seed some favorites for the regular user
    const favoriteCount = 8;
    for (let i = 0; i < favoriteCount; i++) {
      // Pick random wallpapers
      const randomWallpaper = createdWallpapers[Math.floor(Math.random() * createdWallpapers.length)];
      try {
        await Favorite.create({
          userId: regularUser._id,
          wallpaperId: randomWallpaper._id,
        });
        // Increment likes on wallpaper
        randomWallpaper.likes += 1;
        await randomWallpaper.save();
      } catch (err) {
        // avoid duplicate keys
      }
    }

    // Seed some downloads for the regular user
    const downloadCount = 12;
    for (let i = 0; i < downloadCount; i++) {
      const randomWallpaper = createdWallpapers[Math.floor(Math.random() * createdWallpapers.length)];
      await Download.create({
        userId: regularUser._id,
        wallpaperId: randomWallpaper._id,
        createdAt: new Date(Date.now() - i * 24 * 3600000),
      });
      randomWallpaper.downloads += 1;
      await randomWallpaper.save();
    }

    // Seed some purchases (Only premium wallpapers)
    const premiumWallpapers = createdWallpapers.filter((w) => w.isPremium);
    const purchaseCount = 5;
    for (let i = 0; i < Math.min(purchaseCount, premiumWallpapers.length); i++) {
      const randomPremium = premiumWallpapers[i];
      await Purchase.create({
        userId: regularUser._id,
        wallpaperId: randomPremium._id,
        amount: randomPremium.price,
        createdAt: new Date(Date.now() - i * 36 * 3600000),
      });
      // also log download for purchased item
      await Download.create({
        userId: regularUser._id,
        wallpaperId: randomPremium._id,
        createdAt: new Date(Date.now() - i * 36 * 3600000),
      });
      randomPremium.downloads += 1;
      await randomPremium.save();
    }

    // Seed a couple of anonymous downloads
    for (let i = 0; i < 15; i++) {
      const randomFreeWallpaper = createdWallpapers.filter((w) => !w.isPremium)[Math.floor(Math.random() * 20)];
      await Download.create({
        userId: null,
        wallpaperId: randomFreeWallpaper._id,
        createdAt: new Date(Date.now() - i * 12 * 3600000),
      });
      randomFreeWallpaper.downloads += 1;
      await randomFreeWallpaper.save();
    }

    console.log('Successfully seeded database with users, favorites, downloads, and purchases!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
