const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Hero Images with more industrial/engineering/construction tech images
const slide1 = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80';
const slide2 = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80';
const slide3 = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80';
const slide4 = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80';

// 1. Engineering / Construction BIM
code = code.replace(slide1, 'https://images.unsplash.com/photo-1541888081622-15cb7a56e522?auto=format&fit=crop&q=80');
// 2. Industrial / Smart factory
code = code.replace(slide2, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80');
// 3. Civil engineering / Blueprint / Tech
code = code.replace(slide3, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80');
// 4. Tech infrastructure / Server / Data
code = code.replace(slide4, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80');

// Replace About Image
code = code.replace(
  /https:\/\/images\.unsplash\.com\/photo-1497366216548-37526070297c\?auto=format&fit=crop&q=80/g,
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Updated images');
