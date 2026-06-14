import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMPORT_DIR = path.join(__dirname, '../bulk-import');
const VELORA_DIR = path.join(IMPORT_DIR, 'VeloraHD');
const METADATA_FILE = path.join(IMPORT_DIR, 'metadata.json');

// Supported categories
const CATEGORIES = [
  'Nature', 'Space', 'Cyberpunk', 'Anime', 'Cars', 
  'Gaming', 'Minimal', 'Abstract', 'Fantasy', 'Technology', 'Architecture'
];

// Unsplash files explicit mapping
const UNSPLASH_MAP = {
  'alex-knight-5-GNa303REg-unsplash.jpg': {
    title: 'Cyberpunk Tokyo Street Lights',
    category: 'Cyberpunk',
    tags: ['cyberpunk', 'tokyo', 'japan', 'neon', 'city', 'night', 'street', 'desktop']
  },
  'alex-knight-wfwUpfVqrKU-unsplash.jpg': {
    title: 'Neon Tokyo Traffic Alley',
    category: 'Cyberpunk',
    tags: ['cyberpunk', 'tokyo', 'neon', 'city', 'street', 'night', 'traffic', 'desktop']
  },
  'bradley-pelish-NPivaRqGFWw-unsplash.jpg': {
    title: 'Cinematic Desert Sand Dunes',
    category: 'Nature',
    tags: ['nature', 'desert', 'sand', 'dunes', 'dramatic', 'minimal', 'desktop']
  },
  'clay-banks-hwLAI5lRhdM-unsplash.jpg': {
    title: 'Abstract Neon Glow Patterns',
    category: 'Abstract',
    tags: ['abstract', 'neon', 'glow', 'art', 'creative', 'desktop']
  },
  'denys-nevozhai-D68ADLeMh5Q-unsplash.jpg': {
    title: 'Foggy Pine Forest Vista',
    category: 'Nature',
    tags: ['nature', 'forest', 'foggy', 'pine-trees', 'misty', 'landscape', 'desktop']
  },
  'emmanuel-denier-YiXsjwJKXmo-unsplash.jpg': {
    title: 'Milky Way Galaxy Night Sky',
    category: 'Space',
    tags: ['space', 'galaxy', 'milky-way', 'night-sky', 'stars', 'nebula', 'desktop']
  },
  'erik-mclean-8SeJUmfahu0-unsplash.jpg': {
    title: 'Cyberpunk Vending Machine',
    category: 'Cyberpunk',
    tags: ['cyberpunk', 'vending-machine', 'neon', 'night', 'street', 'desktop']
  },
  'jezael-melgoza-layMbSJ3YOE-unsplash.jpg': {
    title: 'Tokyo Skyline Dusk',
    category: 'Architecture',
    tags: ['architecture', 'tokyo', 'cityscape', 'skyline', 'dusk', 'japan', 'desktop']
  },
  'jj-ying-9Qwbfa_RM94-unsplash.jpg': {
    title: 'Minimalist Geometry Architecture',
    category: 'Minimal',
    tags: ['minimal', 'architecture', 'geometry', 'clean', 'shapes', 'desktop']
  },
  'melanie-these-rz3eCYGgGSc-unsplash.jpg': {
    title: 'Sunset Horizon Sea',
    category: 'Nature',
    tags: ['nature', 'sunset', 'horizon', 'sea', 'ocean', 'calm', 'desktop']
  },
  'meow-meow-coy_MhYMLHs-unsplash.jpg': {
    title: 'Anime Sunset Train Station',
    category: 'Anime',
    tags: ['anime', 'sunset', 'train', 'station', 'scenic', 'illustration', 'desktop']
  },
  'moujib-aghrout-s9ESRUFnKDg-unsplash.jpg': {
    title: 'Futuristic Cyber Punk Core',
    category: 'Technology',
    tags: ['cyberpunk', 'technology', 'futuristic', 'core', 'glowing', 'desktop']
  },
  'tianshu-liu-aqZ3UAjs_M4-unsplash.jpg': {
    title: 'Traditional Kyoto Torii Path',
    category: 'Nature',
    tags: ['nature', 'kyoto', 'japan', 'torii-gate', 'forest', 'traditional', 'desktop']
  }
};

// Known custom files explicit mapping
const KNOWN_MAP = {
  // Luna Everlight (duplicate of emerald-gaze.jpg.png)
  'file_00000000e1bc71fab8f8be48d7193748.png': {
    title: "Luna's Emerald Gaze",
    category: 'Anime',
    tags: ['luna everlight', 'female character', 'green eyes', 'nature', 'leaves', 'sunlight', 'ethereal', 'anime', 'desktop']
  },
  // Specific Epoch-named PNGs
  '1781338165614.png': {
    title: 'Luna Everlight - Floral Serenade',
    category: 'Anime',
    tags: ['luna everlight', 'female character', 'cherry blossom', 'pink', 'flowers', 'anime', 'desktop']
  },
  '1781424497265.png': {
    title: 'Raizen Kurohiko - Ink Samurai Spirit',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'warrior', 'ink art', 'japanese', 'anime', 'desktop']
  },
  '1781424648959.png': {
    title: 'Luna Everlight - Whispering Leaves',
    category: 'Anime',
    tags: ['luna everlight', 'female character', 'nature', 'forest', 'blue eyes', 'anime', 'desktop']
  },
  '1781424796276.png': {
    title: 'Raizen Kurohiko - Ronin Wandering',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'ronin', 'sword', 'garden', 'anime', 'desktop']
  },
  '1781424929189.png': {
    title: 'Aria Whisperwind - Cloud Sanctuary',
    category: 'Anime',
    tags: ['aria whisperwind', 'female character', 'clouds', 'anime', 'fantasy', 'desktop']
  },
  '1781431047711.png': {
    title: 'Kaelen Frost - Frozen Katana Blade',
    category: 'Anime',
    tags: ['kaelen frost', 'male character', 'samurai', 'ice', 'snow', 'anime', 'desktop']
  },
  '1781431360413.png': {
    title: 'Seraphina Sunstrike - Solar Priestess',
    category: 'Anime',
    tags: ['seraphina sunstrike', 'female character', 'sun', 'fire', 'mobile', 'anime', 'mobile']
  },
  // Samurai Videos
  'vecteezy_samurai-warrior-walking-through-tall-golden-grass-field-in_71715052.mp4': {
    title: 'Raizen Kurohiko - Golden Grass Field Samurai',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'warrior', 'katana', 'japanese', 'animation', 'live wallpaper', 'gold', 'field']
  },
  'vecteezy_samurai-warrior-walks-through-snowy-mountain-pass-in-japan_71714995.mp4': {
    title: 'Raizen Kurohiko - Snowy Mountain Samurai Pass',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'warrior', 'snow', 'mountain', 'katana', 'japanese', 'live wallpaper', 'winter']
  },
  // Custom Live Videos
  'lv_0_20260613183451.mp4': {
    title: 'Cyberpunk Alley Neon Rain Live',
    category: 'Cyberpunk',
    tags: ['neon', 'cyberpunk', 'alley', 'rain', 'city', 'street', 'live wallpaper']
  },
  'lv_0_20260613190913.mp4': {
    title: 'Luna Everlight - Sakura Wind Live',
    category: 'Anime',
    tags: ['luna everlight', 'anime', 'girl', 'sakura', 'cherry blossom', 'live wallpaper']
  },
  'lv_0_20260613191750.mp4': {
    title: 'Raizen Kurohiko - Shadow Katana Strike Live',
    category: 'Anime',
    tags: ['raizen kurohiko', 'samurai', 'anime', 'sword', 'katana', 'dark', 'live wallpaper']
  },
  'lv_0_20260613192441.mp4': {
    title: 'Futuristic Synthwave Cruise Live',
    category: 'Cars',
    tags: ['cars', 'synthwave', 'retro', 'sunset', 'highway', 'live wallpaper']
  },
  'lv_0_20260614014036.mp4': {
    title: 'Luna Everlight - Cosmic Starfield Dream Live',
    category: 'Space',
    tags: ['luna everlight', 'anime', 'girl', 'space', 'galaxy', 'stars', 'live wallpaper']
  },
  'lv_0_20260614181139.mp4': {
    title: 'Cyberpunk Tokyo Train Station Live',
    category: 'Cyberpunk',
    tags: ['cyberpunk', 'tokyo', 'train', 'station', 'rain', 'neon', 'live wallpaper']
  }
};

// Character Names Pool for Random Generation
const CHARACTERS_POOL = [
  'Luna Everlight', 'Raizen Kurohiko', 'Mei Lin', 'Ryu Jin', 
  'Aria Whisperwind', 'Kaelen Frost', 'Seraphina Sunstrike', 
  'Sora Shinohara', 'Tatsuya Takahashi', 'Yuki Blossom', 
  'Kitsune Hime', 'Kuroko Kage', 'Aiko Sakura'
];

const THEMES = {
  Cyberpunk: ['Neo Tokyo Skyline', 'Synthwave Gridway', 'Hackers Den Terminal', 'Cyber Night Market', 'Neon City Rain', 'Cybernetic Augmented Eye', 'Retro Arcade Glow'],
  Nature: ['Deep Forest Canopy', 'Misty Autumn Peaks', 'Golden Hour River', 'Glacial Lake Reflection', 'Spring Cherry Blossom Path', 'Emerald Oasis', 'Bonsai Temple Garden'],
  Cars: ['Neon Alley Drift', 'Mountain Pass Sunset Cruise', 'Futuristic Garage', 'Synthwave Highway', 'Midnight Street Race', 'Retro Sports Car', 'Supercar Neon Glow'],
  Space: ['Supernova Cosmic Nebula', 'Rings of Saturn gas giant', 'Distant Exoplanet Horizon', 'Andromeda Deep Galaxy', 'Cosmic Portal Drift', 'Stellar Wind Reflection'],
  Gaming: ['Neon Cyber Battlestation', 'Vintage Arcade Glow', 'Minimalist RGB Setup', 'Command Center Console', 'Esports Gaming Desk', 'Cozy Lo-Fi Desk Glow'],
  Anime: ['Fairy Light Canopy', 'Sunset Shrine Gate', 'Enchanted Forest Walkway', 'Rooftop Star Gazing', 'Cherry Blossom Festival', 'Cyberpunk Street Kid', 'Dreamy Sky Reflection'],
  Abstract: ['Fluorescent Liquid Dream', '3D Geometric Sculptures', 'HSL Gradient Flow', 'Metallic Sphere Matrix', 'Prismatic Light Refraction', 'Ethereal Smoke Swirl'],
  Minimal: ['Desert Sand Crest', 'Geometric Line Composition', 'Pastel Clay Block', 'Pine Tree Silhouette', 'Circular Arc Shadow', 'Single Rose Studio Light'],
  Fantasy: ['Ethereal Enchanted Castle', 'Mystic Fairy Forest Walk', 'Dragon Shrine Entrance', 'Starry Canopy World Tree', 'Celestial Palace Spire', 'Floating Island Waterfall'],
  Technology: ['Quantum CPU Circuit Matrix', 'Server Rack Terminal Console', 'Glowing Board Path', 'Cybernetic Neural Interface', 'Holographic Data Cube'],
  Architecture: ['Concrete Brutalist Spire', 'Tokyo Skyscraper Intersection', 'Spiral Concrete Staircase', 'Glass Dome Interior', 'Monolithic Archway Design']
};

const run = () => {
  console.log('=== Generating metadata.json for 130 wallpapers ===');
  
  if (!fs.existsSync(VELORA_DIR)) {
    console.error(`Error: VeloraHD folder not found at ${VELORA_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(VELORA_DIR);
  console.log(`Scanning VeloraHD folder... Found ${files.length} files.`);

  const metadataList = [];
  let categoryCounters = {};
  CATEGORIES.forEach(c => categoryCounters[c] = 0);

  files.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(VELORA_DIR, file);
    
    let title = '';
    let category = '';
    let tags = [];
    let isLive = ext === '.mp4';
    let deviceType = 'desktop';

    // 1. Resolve Dimensions (images only)
    if (!isLive) {
      try {
        const dims = sizeOf(filePath);
        deviceType = dims.height > dims.width ? 'mobile' : 'desktop';
      } catch (err) {
        // Fallback for corrupt files or specific image headers
        if (file.toLowerCase().includes('screenshot') || file.toLowerCase().includes('img-') || file.toLowerCase().includes('wa0') || file.toLowerCase().includes('picsart')) {
          deviceType = 'mobile';
        }
      }
    } else {
      // Videos: default deviceType by name keywords or assume mobile for specific prefixes
      if (file.startsWith('VID_') || file.startsWith('lv_')) {
        deviceType = 'mobile';
      }
    }

    // 2. Map explicit files
    if (KNOWN_MAP[file]) {
      const entry = KNOWN_MAP[file];
      title = entry.title;
      category = entry.category;
      tags = [...entry.tags];
    } else if (UNSPLASH_MAP[file]) {
      const entry = UNSPLASH_MAP[file];
      title = entry.title;
      category = entry.category;
      tags = [...entry.tags];
    } else {
      // Heuristic allocation for the remaining file names (most are file_...png or IMG_...jpg)
      // Round-robin category allocation to ensure a balanced selection of all 11 sections
      const catIndex = index % CATEGORIES.length;
      category = CATEGORIES[catIndex];
      categoryCounters[category]++;

      const themeIndex = categoryCounters[category] % THEMES[category].length;
      const theme = THEMES[category][themeIndex];

      // Anime Heuristics - Naming characters dynamically
      if (category === 'Anime' || category === 'Fantasy') {
        const charIndex = index % CHARACTERS_POOL.length;
        const character = CHARACTERS_POOL[charIndex];
        title = `${character} - ${theme}`;
        tags = [
          character.toLowerCase(),
          character.split(' ')[0].toLowerCase(),
          'anime',
          'character',
          category.toLowerCase(),
          'gorgeous',
          'illustration'
        ];
      } else {
        title = `${category} - ${theme}`;
        tags = [
          category.toLowerCase(),
          theme.split(' ')[0].toLowerCase(),
          'cinematic',
          'minimalist',
          'aesthetic',
          'art'
        ];
      }

      // Add device tag
      tags.push(deviceType);
      if (isLive) {
        tags.push('live-wallpaper');
        tags.push('video');
      }
    }

    // Clean up tags: deduplicate and lowercase
    tags = Array.from(new Set(tags.map(t => t.toLowerCase())));

    // Create description
    let description = '';
    if (tags.includes('luna everlight')) {
      description = `A breathtaking fantasy scene featuring Luna Everlight. Ethereal lighting, detailed textures, and gorgeous styling showcase her character in a stunning floral aesthetic. Perfect for adding a premium touch to your layout.`;
    } else if (tags.includes('raizen kurohiko')) {
      description = `Immerse your screen in the fierce spirit of samurai Raizen Kurohiko. High-contrast ink art details and dramatic shadow strokes capture the essence of bushido in this spectacular artwork.`;
    } else {
      const charTag = tags.find(t => CHARACTERS_POOL.map(c => c.toLowerCase()).includes(t));
      if (charTag) {
        const matchingCharName = CHARACTERS_POOL.find(c => c.toLowerCase() === charTag);
        description = `Transform your setup with this premium high-quality illustration of character ${matchingCharName}. Rich details and smooth colors make it perfect for anime and setup enthusiasts.`;
      } else {
        description = `Experience this premium high-quality ${deviceType} wallpaper. Beautifully crafted to enhance the layout of your setup with high-contrast cinematic details.`;
      }
    }

    metadataList.push({
      filename: file,
      title,
      category,
      description,
      tags,
      isPremium: index % 7 === 0, // Make every 7th wallpaper premium for marketplace variety
      price: index % 7 === 0 ? (index % 3 === 0 ? 2.99 : 1.99) : 0
    });
  });

  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadataList, null, 2));
  console.log(`Successfully generated metadata for ${metadataList.length} wallpapers inside metadata.json!`);
};

run();
