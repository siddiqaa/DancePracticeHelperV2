import fs from 'fs';
import path from 'path';

const filesToCopy = [
  'index.html',
  'chunked_bachata.html',
  'chunked_wcs.html'
];

const directoriesToCopy = [
  'archive'
];

const distDir = './dist';

// Clean and create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy individual files
for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`Copied ${file} to dist/`);
  }
}

// Copy directories recursively
for (const dir of directoriesToCopy) {
  if (fs.existsSync(dir)) {
    copyFolderRecursiveSync(dir, distDir);
    console.log(`Copied directory ${dir} to dist/`);
  }
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  // Check if folder needs to be created or exists
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}
