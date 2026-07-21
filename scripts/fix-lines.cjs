const fs = require('fs');
let code = fs.readFileSync('src/components/Constellation.tsx', 'utf8');

code = code.replace(
  'let baseAlpha = 0.08 - (dist / lineDistance) * 0.08;',
  'let baseAlpha = 0.35 - (dist / lineDistance) * 0.35;'
);

fs.writeFileSync('src/components/Constellation.tsx', code);
console.log('Fixed lines');
