const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace py-12 with py-4 or py-3 in button tags
code = code.replace(/<button([^>]*)py-12([^>]*)>/g, '<button$1py-4$2>');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed buttons');
