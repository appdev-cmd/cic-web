const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<section className="py-12 /g, '<section className="py-20 ');
code = code.replace(/<section className="py-24 /g, '<section className="py-20 ');
code = code.replace(/<section className="pt-12 pb-12 /g, '<section className="py-20 ');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed spacing');
