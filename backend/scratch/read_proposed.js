import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, 'proposed_corrections.json');
const corrections = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log(`Loaded ${corrections.length} proposed corrections.`);
corrections.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.id}] Title: "${c.title}"`);
  console.log(`   Category: "${c.currentCategory}" -> "${c.newCategory}"`);
  if (c.currentDescription !== c.newDescription) {
    console.log(`   Description: "${c.currentDescription.slice(0, 50)}..." -> "${c.newDescription.slice(0, 50)}..."`);
  }
  if (JSON.stringify(c.currentTags) !== JSON.stringify(c.newTags)) {
    console.log(`   Tags: [${c.currentTags.join(', ')}] -> [${c.newTags.join(', ')}]`);
  }
  console.log(`   Reason: ${c.reason}`);
});
