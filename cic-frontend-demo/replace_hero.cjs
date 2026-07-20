const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Slide 1: Sustainable / Green City
code = code.replace(
  'https://images.unsplash.com/photo-1541888081622-15cb7a56e522?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80'
);

// Slide 2: AI / Modern Tech (Abstract AI / Data)
code = code.replace(
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80'
);

// Slide 3: Renewable Energy (Wind Turbines - Green Trend)
code = code.replace(
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80'
);

// Slide 4: Global Tech / Network / Digital (Tech / AI)
code = code.replace(
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Replaced images');
