import fs from 'fs';
import path from 'path';

const dirPath = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
if (!fs.existsSync(dirPath)) {
  console.log('Directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(dirPath);
const mp4Files = [];
const pngFiles = [];
const jpgFiles = [];
const otherFiles = [];

files.forEach(f => {
  const ext = path.extname(f).toLowerCase();
  const stats = fs.statSync(path.join(dirPath, f));
  const fileInfo = { name: f, size: stats.size };
  
  if (ext === '.mp4') {
    mp4Files.push(fileInfo);
  } else if (ext === '.png') {
    pngFiles.push(fileInfo);
  } else if (ext === '.jpg' || ext === '.jpeg') {
    jpgFiles.push(fileInfo);
  } else {
    otherFiles.push(fileInfo);
  }
});

console.log(`Total files found: ${files.length}`);
console.log(`- MP4 files: ${mp4Files.length}`);
console.log(`- PNG files: ${pngFiles.length}`);
console.log(`- JPG/JPEG files: ${jpgFiles.length}`);
console.log(`- Other files: ${otherFiles.length}`);

console.log('\n--- MP4 Files ---');
mp4Files.forEach((f, i) => console.log(`${i+1}. ${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`));

console.log('\n--- PNG Files ---');
pngFiles.forEach((f, i) => console.log(`${i+1}. ${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`));

console.log('\n--- JPG Files ---');
jpgFiles.forEach((f, i) => console.log(`${i+1}. ${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`));
