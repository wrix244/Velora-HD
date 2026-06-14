import fs from 'fs';
import path from 'path';

const metadataFile = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\metadata.json';
const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));

const hexFiles = [
  '0dc5f90badd1e6702f476f930ee3e4f0.jpg',
  '20aa2d5fe6be0873fd5051f8507efcf7.jpg',
  '238b5b7852714fdaa5e27dd2ea6b5445.jpg',
  '2cb1bea637c46a8d7e21e09d22cd9391.jpg',
  '46a3fe46ffe9fcef79d5aa89faa4d377.jpg',
  '509b1860c31cc6bc65a845197b1a5433.jpg',
  'a6a072447bedfddd39021a79978b60f6.jpg',
  'a79ce040ca8e4e7a10d25e11cdf1000e.jpg',
  'aae3ba517e4c3c6446a989540c7bfdb2.jpg',
  'c65207b35022627158f74294455d83af.jpg',
  'f00132dc04d6b7512d1aede19e4e6bb4.jpg'
];

hexFiles.forEach(f => {
  const m = metadata.find(entry => entry.filename === f);
  if (m) {
    const ext = path.extname(f);
    const cleanTitle = m.title;
    const cleanSlug = cleanTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    console.log(`${f} -> ${cleanSlug}${ext} (Title: "${m.title}", Category: "${m.category}")`);
  } else {
    console.log(`${f} -> No metadata found!`);
  }
});
