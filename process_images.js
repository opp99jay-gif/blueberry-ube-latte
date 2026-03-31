const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Added sharp

const sourceDir = path.join(__dirname, 'ezgif-3ce4fd91f0c74502-jpg');
const destDir = path.join(__dirname, 'latte-landing', 'public', 'sequence');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg')).sort();

const totalFrames = 120;
const sourceFrames = files.length;

async function processImages() {
  console.log(`Starting true compression for ${totalFrames} frames...`);
  
  for (let i = 0; i < totalFrames; i++) {
    const sourceIndex = Math.min(Math.floor((i / totalFrames) * sourceFrames), sourceFrames - 1);
    const sourceFile = files[sourceIndex];
    
    const destFile = `latte_frame_${i}.webp`;
    
    const sourcePath = path.join(sourceDir, sourceFile);
    const destPath = path.join(destDir, destFile);

    // Using Sharp to resize and compress to WebP properly
    await sharp(sourcePath)
      .resize({ width: 1080, withoutEnlargement: true }) // Max width 1080px for mobile/desktop perf
      .webp({ quality: 60, effort: 4 }) // 60% quality is usually indistinguishable but tiny
      .toFile(destPath);
      
    if (i % 10 === 0 || i === totalFrames - 1) {
      console.log(`Processed ${i + 1}/${totalFrames} frames`);
    }
  }
  
  console.log('Images genuinely compressed and processed successfully.');
}

processImages().catch(err => {
  console.error('Error during image processing:', err);
});
