import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dirPath = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
const files = fs.readdirSync(dirPath);

const hashToFiles = {};

files.forEach(f => {
  const filePath = path.join(dirPath, f);
  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5').update(buffer).digest('hex');
  hashToFiles[hash] = f;
});

const artifactsDir = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\ab79ff1f-bea9-424b-91ce-c987e3dae609';
if (fs.existsSync(artifactsDir)) {
  const artFiles = fs.readdirSync(artifactsDir);
  console.log('--- COMPARING WITH BRAIN ARTIFACTS ---');
  artFiles.forEach(af => {
    const ext = path.extname(af).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const artPath = path.join(artifactsDir, af);
      const buf = fs.readFileSync(artPath);
      const artHash = crypto.createHash('md5').update(buf).digest('hex');
      if (hashToFiles[artHash]) {
        console.log(`Artifact ${af} matches in VeloraHD: ${hashToFiles[artHash]}`);
      } else {
        console.log(`Artifact ${af} (${artHash}) has no direct MD5 match in VeloraHD.`);
      }
    }
  });
} else {
  console.log('Artifacts directory does not exist!');
}
