import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VELORA_DIR = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
const METADATA_FILE = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\metadata.json';
const CLASS_FILE = path.join(__dirname, 'classification_results.json');

const run = () => {
  const localFiles = fs.readdirSync(VELORA_DIR);
  console.log(`Local files count: ${localFiles.length}`);

  const metadataList = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
  console.log(`Metadata records count: ${metadataList.length}`);

  const classData = JSON.parse(fs.readFileSync(CLASS_FILE, 'utf8'));
  console.log(`Classification keys count: ${Object.keys(classData).length}`);

  // Check matching
  let matchedMetaCount = 0;
  let matchedClassCount = 0;

  localFiles.forEach(f => {
    const metaMatch = metadataList.find(m => m.filename === f);
    if (metaMatch) matchedMetaCount++;

    if (classData[f]) matchedClassCount++;
  });

  console.log(`Matched with metadata.json by exact filename: ${matchedMetaCount}`);
  console.log(`Matched with classification_results.json by exact filename: ${matchedClassCount}`);

  // Let's print first 10 local files
  console.log('\nFirst 10 local files:');
  localFiles.slice(0, 10).forEach(f => console.log(` - ${f}`));
};

run();
