const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'www');

// Ensure www exists and is clean
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Files and folders to bundle
const itemsToCopy = [
  'index.html',
  'style.css',
  'game.js',
  'assets'
];

for (const item of itemsToCopy) {
  const src = path.join(rootDir, item);
  const dest = path.join(outDir, item);

  if (fs.existsSync(src)) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
    console.log(`Copied: ${item} -> www/${item}`);
  }
}

console.log('Build completed successfully. www/ is ready for Capacitor.');
