// generate-manifest.js
const fs = require('fs');
const path = require('path');

const rootDir = '.'; // Começa do diretório atual
const outputFile = 'manifest.json';

// Lista de arquivos e pastas a serem ignorados
const ignoreList = [
  '.git',
  'node_modules',
  'manifest.json',       // Ignora o próprio arquivo de manifesto
  'generate-manifest.js', // Ignora este script
  'index.html'           // Ignora o explorador
];

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filepath = path.join(dir, file);
    
    if (ignoreList.includes(file)) {
      return; // Pula o item se estiver na lista de ignorados
    }

    const stats = fs.statSync(filepath);
    const relativePath = path.relative(rootDir, filepath).replace(/\\/g, '/'); // Normaliza para usar barras '/'

    if (stats.isDirectory()) {
      filelist.push({ path: relativePath, type: 'dir' });
      walk(filepath, filelist);
    } else {
      filelist.push({ path: relativePath, type: 'file' });
    }
  });

  return filelist;
}

const fileManifest = walk(rootDir);
fs.writeFileSync(outputFile, JSON.stringify(fileManifest, null, 2));

console.log(`Manifesto gerado com sucesso em "${outputFile}" com ${fileManifest.length} itens.`);