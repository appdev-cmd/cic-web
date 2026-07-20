const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/bg-white\/80/g, 'bg-white/40');
code = code.replace(/bg-slate-50\/80/g, 'bg-slate-50/40');
code = code.replace(/bg-slate-50\/90/g, 'bg-slate-50/50');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed all bg opacities');
