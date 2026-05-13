const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexFile = path.join(distDir, 'index.html');
const notFoundFile = path.join(distDir, '404.html');

fs.copyFileSync(indexFile, notFoundFile);
