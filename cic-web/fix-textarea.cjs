const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<textarea([^>]*)py-12([^>]*)>/g, '<textarea$1py-4$2>');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed textarea');
