const fs = require('fs');
let code = fs.readFileSync('src/components/Constellation.tsx', 'utf8');

code = code.replace(/pointer-events-auto/g, 'pointer-events-none');

fs.writeFileSync('src/components/Constellation.tsx', code);
console.log('Fixed Constellation pointer events');
