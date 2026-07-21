const fs = require('fs');
let code = fs.readFileSync('src/components/Constellation.tsx', 'utf8');

code = code.replace(/\\\`/g, '\`');
fs.writeFileSync('src/components/Constellation.tsx', code);
console.log('Fixed Constellation escaping 2');
