import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const metadataFile = path.join(__dirname, '../bulk-import/metadata.json');
const metadataList = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));

const keywords = [
  'Synthwave Gridway', 'Server Rack', 'Tokyo Skyscraper', 'Mountain Pass',
  'Saturn', 'Fairy Forest', 'Golden Hour River', 'Dragon Shrine', 'Hackers Den'
];

keywords.forEach(kw => {
  const matches = metadataList.filter(m => (m.title || '').toLowerCase().includes(kw.toLowerCase()));
  console.log(`Keyword: "${kw}" -> ${matches.length} matches`);
  matches.forEach(m => {
    console.log(`  - Title: "${m.title}" | Category: "${m.category}" | Filename: "${m.filename}"`);
  });
});
