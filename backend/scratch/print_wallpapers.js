import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('scratch/wallpapers_dump.json', 'utf8'));
  let output = `Index | ID | Title | Category | Image Filename\n`;
  output += `--------------------------------------------------\n`;
  data.forEach((w, idx) => {
    const filename = w.previewImage ? w.previewImage.split('/').pop() : 'N/A';
    output += `${idx + 1} | ${w.id} | "${w.title}" | ${w.category} | ${filename}\n`;
  });
  fs.writeFileSync('scratch/wallpapers_summary.txt', output);
  console.log('Saved summary to scratch/wallpapers_summary.txt');
} catch (error) {
  console.error(error);
}
