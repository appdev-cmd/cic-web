const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /https:\/\/images\.unsplash\.com\/photo-1497366216548-37526070297c\?auto=format&fit=crop&q=80/g,
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed about image');
