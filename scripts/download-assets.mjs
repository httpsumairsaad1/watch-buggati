import fs from 'fs';
import path from 'path';
import https from 'https';

const BASE_URL = 'https://5e0de232-6169-4f20-a67d-882d3f3fc653.lovableproject.com';

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      // Already downloaded
      return resolve({ path: destPath, skipped: true });
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve({ path: destPath, size: fs.statSync(destPath).size }));
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading assets from Lovable storage...');

  // 1. Movement assets
  const movementDir = path.resolve('public/movement');
  if (!fs.existsSync(movementDir)) fs.mkdirSync(movementDir, { recursive: true });

  const movementFiles = fs.readdirSync(movementDir).filter(f => f.endsWith('.asset.json'));
  for (const f of movementFiles) {
    const jsonPath = path.join(movementDir, f);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const imgName = f.replace('.asset.json', '');
    const dest = path.join(movementDir, imgName);
    const url = BASE_URL + data.url;
    try {
      const res = await downloadFile(url, dest);
      console.log(`Downloaded movement: ${imgName} (${res.size || 'cached'} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${imgName}:`, err.message);
    }
  }

  // 2. Root movement assets
  const publicDir = path.resolve('public');
  const rootAssetFiles = ['watch.webp.asset.json', 'engine.webp.asset.json', 'tourbillon.webp.asset.json', 'reserve.webp.asset.json'];
  for (const f of rootAssetFiles) {
    const jsonPath = path.join(publicDir, f);
    if (!fs.existsSync(jsonPath)) continue;
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const imgName = f.replace('.asset.json', '');
    const dest = path.join(publicDir, imgName);
    const url = BASE_URL + data.url;
    try {
      const res = await downloadFile(url, dest);
      console.log(`Downloaded root: ${imgName} (${res.size || 'cached'} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${imgName}:`, err.message);
    }
  }

  // 3. Sequence frames
  const seqDir = path.resolve('public/full-sequence');
  if (fs.existsSync(seqDir)) {
    const frameFiles = fs.readdirSync(seqDir).filter(f => f.endsWith('.asset.json'));
    console.log(`Downloading ${frameFiles.length} sequence frames in batches...`);
    const batchSize = 10;
    for (let i = 0; i < frameFiles.length; i += batchSize) {
      const batch = frameFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(async (f) => {
        const jsonPath = path.join(seqDir, f);
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const imgName = f.replace('.asset.json', '');
        const dest = path.join(seqDir, imgName);
        const url = BASE_URL + data.url;
        try {
          await downloadFile(url, dest);
        } catch (err) {
          console.error(`Error downloading ${imgName}:`, err.message);
        }
      }));
      process.stdout.write(`Downloaded ${Math.min(i + batchSize, frameFiles.length)} / ${frameFiles.length} frames\r`);
    }
    console.log(`\nAll sequence frames downloaded.`);
  }

  console.log('Done!');
}

run().catch(console.error);
