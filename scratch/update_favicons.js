const fs = require('fs');

const rootFavicon = [
  '  <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">',
  '  <link rel="alternate icon" type="image/png" href="assets/images/favicon.png">',
  '  <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">'
].join('\n');

const dashFavicon = [
  '  <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg">',
  '  <link rel="alternate icon" type="image/png" href="../assets/images/favicon.png">',
  '  <link rel="apple-touch-icon" href="../assets/images/apple-touch-icon.png">'
].join('\n');

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
rootFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('favicon.svg')) {
    content = content.replace(/(<title>.*?<\/title>)/, '$1\n' + rootFavicon);
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + f);
  } else {
    console.log('Already updated ' + f);
  }
});

const dashFiles = fs.readdirSync('dashboard').filter(f => f.endsWith('.html'));
dashFiles.forEach(f => {
  const p = 'dashboard/' + f;
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('favicon.svg')) {
    content = content.replace(/(<title>.*?<\/title>)/, '$1\n' + dashFavicon);
    fs.writeFileSync(p, content, 'utf8');
    console.log('Updated ' + p);
  } else {
    console.log('Already updated ' + p);
  }
});
