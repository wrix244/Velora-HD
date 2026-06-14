import fs from 'fs';

const data = JSON.parse(fs.readFileSync('d:\\SaaS Tools\\Dream-Lens\\backend\\scratch\\found_metadata.json', 'utf8'));

for (const [filename, meta] of Object.entries(data)) {
  console.log(`\nFile: ${filename}`);
  for (const [key, value] of Object.entries(meta)) {
    if (key === 'Raw profile type APP1') {
      console.log(`  - ${key}: [Hex data of length ${value.length}]`);
      
      // Let's decode the hex data in APP1 and check if it contains ascii text
      const hex = value.replace(/\r?\n/g, '').trim();
      // Wait, let's look for ASCII strings in this hex
      const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
      const bytes = Buffer.from(cleanHex, 'hex');
      let ascii = '';
      for (let i = 0; i < bytes.length; i++) {
        const char = bytes[i];
        if (char >= 32 && char <= 126) {
          ascii += String.fromCharCode(char);
        } else {
          ascii += ' ';
        }
      }
      // Clean up whitespace
      ascii = ascii.replace(/\s+/g, ' ').trim();
      if (ascii.length > 50) {
        console.log(`    Parsed Text: ${ascii.slice(0, 300)}...`);
      }
    } else {
      console.log(`  - ${key}: ${value.slice(0, 100)}...`);
    }
  }
}
