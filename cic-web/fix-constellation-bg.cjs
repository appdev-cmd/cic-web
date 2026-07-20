const fs = require('fs');
let code = fs.readFileSync('src/components/Constellation.tsx', 'utf8');

code = code.replace(/<div className="absolute inset-0 bg-gradient-to-b from-slate-50\/50 via-transparent to-slate-50\/50 pointer-events-none"><\/div>/, '');

fs.writeFileSync('src/components/Constellation.tsx', code);
console.log('Fixed Constellation overlay');
