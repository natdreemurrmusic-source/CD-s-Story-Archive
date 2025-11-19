const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images');
const outFile = path.join(imagesDir, 'images.json');

function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'].includes(ext);
}

function main(){
  try{
    const files = fs.readdirSync(imagesDir);
    const images = files.filter(f => isImage(f));
    fs.writeFileSync(outFile, JSON.stringify(images, null, 4));
    console.log(`Wrote ${images.length} images to ${outFile}`);
  }catch(err){
    console.error('Failed to generate images manifest:', err);
    process.exit(1);
  }
}

main();
