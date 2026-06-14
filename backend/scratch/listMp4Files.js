import fs from 'fs';
import path from 'path';

const VELORA_DIR = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
const files = fs.readdirSync(VELORA_DIR);
const mp4Files = files.filter(f => f.toLowerCase().endsWith('.mp4'));

console.log(`Found ${mp4Files.length} MP4 files:`);
mp4Files.forEach((f, i) => {
  console.log(`${i+1}. ${f}`);
});
