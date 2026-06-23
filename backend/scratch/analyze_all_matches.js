import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDumpFile = path.join(__dirname, 'db_dump.json');
const metadataFile = path.join(__dirname, '../bulk-import/metadata.json');

const wallpapers = JSON.parse(fs.readFileSync(dbDumpFile, 'utf8'));
const metadataList = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));

console.log(`Loaded ${wallpapers.length} database wallpapers.`);
console.log(`Loaded ${metadataList.length} metadata records.`);

const cleanTitle = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/^(nature|space|cyberpunk|anime|cars|gaming|minimal|abstract|fantasy|technology|architecture|ai art)\s*-\s*/, '')
    .trim();
};

const metaMap = new Map();
metadataList.forEach(m => {
  if (m.title) {
    const cleaned = cleanTitle(m.title);
    metaMap.set(cleaned, m);
  }
});

let matchedCount = 0;
let mismatchCount = 0;

wallpapers.forEach((w, idx) => {
  const dbCleaned = cleanTitle(w.title);
  let match = metaMap.get(dbCleaned);

  if (!match) {
    // Try fuzzy substring matching
    for (const [key, val] of metaMap.entries()) {
      if (dbCleaned.includes(key) || key.includes(dbCleaned)) {
        match = val;
        break;
      }
    }
  }

  if (match) {
    matchedCount++;
    
    // Check for mismatches
    const catMismatch = w.category !== match.category;
    // Check description mismatch: strip white spaces and compare
    const cleanDesc = (desc) => (desc || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const descMismatch = cleanDesc(w.description) !== cleanDesc(match.description) && match.description;
    
    // Compare tags
    const wTags = (w.tags || []).map(t => t.toLowerCase()).sort();
    const mTags = (match.tags || []).map(t => t.toLowerCase()).sort();
    const tagsMismatch = JSON.stringify(wTags) !== JSON.stringify(mTags) && match.tags;

    if (catMismatch || descMismatch || tagsMismatch) {
      mismatchCount++;
      console.log(`\nMismatch #${mismatchCount}: "${w.title}" (ID: ${w._id})`);
      if (catMismatch) {
        console.log(`  - Category: "${w.category}" (DB) vs "${match.category}" (Meta)`);
      }
      if (descMismatch) {
        console.log(`  - Description:`);
        console.log(`      DB:   "${w.description}"`);
        console.log(`      Meta: "${match.description}"`);
      }
      if (tagsMismatch) {
        console.log(`  - Tags: [${w.tags.join(', ')}] vs [${match.tags.join(', ')}]`);
      }
    }
  } else {
    console.log(`No match in metadata.json for: "${w.title}" (ID: ${w._id})`);
  }
});

console.log(`\n========================================`);
console.log(`Matched: ${matchedCount}/${wallpapers.length}`);
console.log(`Mismatched properties: ${mismatchCount}`);
