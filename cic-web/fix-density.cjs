const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/density=\{8000\}/g, 'density={14000}');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed density');
