const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'scratch') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const root = 'c:/Users/User/Downloads/toy-rental-navbar-redesign';
const files = getHtmlFiles(root);

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /src=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('data:')) {
      const target = path.resolve(path.dirname(f), src);
      if (!fs.existsSync(target)) {
        console.log(`MISSING in ${path.relative(root, f)}: ${src} -> ${target}`);
      }
    }
  }
});
