import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDumpFile = path.join(__dirname, 'db_dump.json');
const wallpapers = JSON.parse(fs.readFileSync(dbDumpFile, 'utf8'));

console.log(`Loaded ${wallpapers.length} wallpapers from db_dump.json.`);

// Let's print any wallpaper that has a title from the 9 overrides, or whose downloadFile/previewImage has filename parts
const overrideKeys = [
  'cyberpunk-synthwave-gridway',
  'tatsuya-takahashi-mystic-fairy-forest-walk',
  'technology-server-rack-terminal-console',
  'architecture-tokyo-skyscraper-intersection',
  'nature-golden-hour-river',
  'space-rings-of-saturn-gas-giant',
  'cars-mountain-pass-sunset-cruise',
  'seraphina-sunstrike-dragon-shrine-entrance',
  'cyberpunk-hackers-den-terminal'
];

wallpapers.forEach(w => {
  const fileUrl = (w.downloadFile || w.previewImage || '').toLowerCase();
  
  // Check if title matches or if url contains key terms
  const titleLower = w.title.toLowerCase();
  const matchedKey = overrideKeys.find(key => {
    const cleanKey = key.replace(/-/g, ' ');
    return titleLower.includes(cleanKey) || fileUrl.includes(key);
  });

  if (matchedKey) {
    console.log(`Matched Wallpaper:`);
    console.log(`  - ID: ${w._id}`);
    console.log(`  - Title: "${w.title}"`);
    console.log(`  - Category: "${w.category}"`);
    console.log(`  - PreviewImage: ${w.previewImage}`);
    console.log(`  - DownloadFile: ${w.downloadFile}`);
    console.log(`  - Tags: [${w.tags.join(', ')}]`);
  }
});
