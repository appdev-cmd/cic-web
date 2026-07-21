const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace button paddings
code = code.replace(/px-6 py-3/g, 'px-6 py-2.5');
code = code.replace(/px-8 py-3/g, 'px-6 py-2.5');
code = code.replace(/px-6 py-2\.5/g, 'px-5 py-2');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed buttons');
