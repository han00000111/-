const fs = require('fs');
const path = require('path');

// 产物目录可通过参数指定（默认 dist），以兼容 production(dist) 与 demo(dist-demo)。
const outDir = process.argv[2] || 'dist';
const distDir = path.resolve(__dirname, '..', outDir);
const indexFile = path.join(distDir, 'index.html');
const notFoundFile = path.join(distDir, '404.html');

if (!fs.existsSync(indexFile)) {
  console.warn(`[copy-404] skip: ${indexFile} not found`);
  process.exit(0);
}

fs.copyFileSync(indexFile, notFoundFile);
