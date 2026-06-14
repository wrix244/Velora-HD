import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function readPngChunks(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  if (buffer.readUInt32BE(0) !== 0x89504e47 || buffer.readUInt32BE(4) !== 0x0d0a1a0a) {
    throw new Error('Not a valid PNG file');
  }

  const chunks = [];
  let offset = 8;

  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) break;
    
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    
    offset += 8;
    
    if (offset + length + 4 > buffer.length) break;
    
    const data = buffer.subarray(offset, offset + length);
    offset += length + 4;

    chunks.push({ type, data });
    
    if (type === 'IEND') break;
  }

  return chunks;
}

function extractTextMetadata(chunks) {
  const metadata = {};
  for (const chunk of chunks) {
    if (chunk.type === 'tEXt') {
      const data = chunk.data;
      let zeroIndex = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) {
          zeroIndex = i;
          break;
        }
      }
      if (zeroIndex !== -1) {
        const key = data.toString('ascii', 0, zeroIndex);
        const value = data.toString('ascii', zeroIndex + 1);
        metadata[key] = value;
      }
    } else if (chunk.type === 'zTXt') {
      const data = chunk.data;
      let zeroIndex = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) {
          zeroIndex = i;
          break;
        }
      }
      if (zeroIndex !== -1) {
        const key = data.toString('ascii', 0, zeroIndex);
        const compressionMethod = data[zeroIndex + 1];
        const compressedText = data.subarray(zeroIndex + 2);
        try {
          if (compressionMethod === 0) {
            const decompressed = zlib.inflateSync(compressedText);
            metadata[key] = decompressed.toString('utf8');
          } else {
            metadata[key] = `[Unknown compression method: ${compressionMethod}]`;
          }
        } catch (e) {
          metadata[key] = `[Decompression error: ${e.message}]`;
        }
      }
    } else if (chunk.type === 'iTXt') {
      const data = chunk.data;
      let zeroIndex = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) {
          zeroIndex = i;
          break;
        }
      }
      if (zeroIndex !== -1) {
        const key = data.toString('utf8', 0, zeroIndex);
        const compressionFlag = data[zeroIndex + 1];
        const compressionMethod = data[zeroIndex + 2];
        
        let langIndex = zeroIndex + 3;
        while (langIndex < data.length && data[langIndex] !== 0) langIndex++;
        
        let transIndex = langIndex + 1;
        while (transIndex < data.length && data[transIndex] !== 0) transIndex++;
        
        let valueStart = transIndex + 1;
        if (valueStart < data.length) {
          const valBuffer = data.subarray(valueStart);
          if (compressionFlag === 0) {
            metadata[key] = valBuffer.toString('utf8');
          } else {
            try {
              if (compressionMethod === 0) {
                const decompressed = zlib.inflateSync(valBuffer);
                metadata[key] = decompressed.toString('utf8');
              } else {
                metadata[key] = `[Compressed: method ${compressionMethod}]`;
              }
            } catch (e) {
              metadata[key] = `[Decompression error: ${e.message}]`;
            }
          }
        }
      }
    }
  }
  return metadata;
}

const dirPath = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD';
const files = fs.readdirSync(dirPath);
const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));

const results = {};

for (const file of pngFiles) {
  const filePath = path.join(dirPath, file);
  try {
    const chunks = readPngChunks(filePath);
    const textMeta = extractTextMetadata(chunks);
    if (Object.keys(textMeta).length > 0) {
      results[file] = textMeta;
    }
  } catch (err) {
    // Ignore errors
  }
}

fs.writeFileSync('d:\\SaaS Tools\\Dream-Lens\\backend\\scratch\\found_metadata.json', JSON.stringify(results, null, 2));
console.log(`Saved metadata for ${Object.keys(results).length} files to scratch/found_metadata.json.`);
