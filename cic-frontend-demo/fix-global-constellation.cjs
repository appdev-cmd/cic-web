const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">/, 
  '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">\n      <Constellation isGlobal={true} />'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Global Constellation');
