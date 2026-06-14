import sizeOf from 'image-size';
import fs from 'fs';
import path from 'path';

const test = () => {
  try {
    const filePath = 'bulk-import/emerald-gaze.jpg.png';
    console.log(`Checking file ${filePath}...`);
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist!');
      return;
    }
    const stats = fs.statSync(filePath);
    console.log(`File exists! Size: ${stats.size} bytes`);
    const dims = sizeOf(filePath);
    console.log('Dimensions detected successfully:', dims);
  } catch (err) {
    console.error('Error caught during test:');
    console.error(err);
  }
};
test();
