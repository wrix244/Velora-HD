import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

const dirPath = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
const files = fs.readdirSync(dirPath);

console.log('--- IMAGE DIMENSIONS ---');
files.forEach(f => {
  const ext = path.extname(f).toLowerCase();
  if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    const filePath = path.join(dirPath, f);
    try {
      const dims = sizeOf(filePath);
      console.log(`${f}: ${dims.width}x${dims.height} (${dims.height > dims.width ? 'mobile' : 'desktop'})`);
    } catch (err) {
      console.log(`${f}: Error getting size - ${err.message}`);
    }
  }
});
