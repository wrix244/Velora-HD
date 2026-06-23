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

const filenamesToSearch = [
  'a6a072447bedfddd39021a79978b60f6',
  '238b5b7852714fdaa5e27dd2ea6b5445',
  'file_00000000e1ec7207b72c5d94d892f349',
  '2cb1bea637c46a8d7e21e09d22cd9391',
  'file_00000000e40871fab43f56c6d625e6b4',
  'aae3ba517e4c3c6446a989540c7bfdb2',
  '509b1860c31cc6bc65a845197b1a5433',
  '20aa2d5fe6be0873fd5051f8507efcf7',
  '46a3fe46ffe9fcef79d5aa89faa4d377',
  'c65207b35022627158f74294455d83af',
  'f00132dc04d6b7512d1aede19e4e6bb4'
];

wallpapers.forEach(w => {
  const fileUrl = (w.downloadFile || w.previewImage || '').toLowerCase();
  
  // Find which filename this URL matches
  const matchedFilename = filenamesToSearch.find(fn => fileUrl.includes(fn.toLowerCase()));
  if (matchedFilename) {
    console.log(`\nFound Wallpaper matching filename: "${matchedFilename}"`);
    console.log(`  - ID: ${w._id}`);
    console.log(`  - Title: "${w.title}"`);
    console.log(`  - Category: "${w.category}"`);
    console.log(`  - PreviewImage: ${w.previewImage}`);
    console.log(`  - DownloadFile: ${w.downloadFile}`);
  }
});
