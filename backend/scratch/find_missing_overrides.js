import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDumpFile = path.join(__dirname, 'db_dump.json');
const wallpapers = JSON.parse(fs.readFileSync(dbDumpFile, 'utf8'));

console.log(`Loaded ${wallpapers.length} wallpapers.`);

const terms = [
  'Samurai', 'Dragon', 'Nier', 'Virtuous', 'Gargantua', 'Black Hole', 'Moon', 'Skyscraper',
  'Server', 'Terminal', 'Gridway', 'Synthwave', 'Fairy', 'Forest'
];

wallpapers.forEach(w => {
  const titleLower = w.title.toLowerCase();
  const matchedTerms = terms.filter(t => titleLower.includes(t.toLowerCase()));
  if (matchedTerms.length > 0) {
    console.log(`- [${w._id}] Title: "${w.title}" | Category: "${w.category}"`);
  }
});
