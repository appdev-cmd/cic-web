const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<section className="py-20 bg-slate-50/60  relative overflow-hidden border-y border-slate-200 z-10">',
  '<section className="py-20 bg-slate-50/30 relative overflow-hidden border-y border-slate-200 z-10">'
);
code = code.replace(
  '<section className="py-24 bg-slate-50/60  relative overflow-hidden border-y border-slate-200 z-10">',
  '<section className="py-24 bg-slate-50/30 relative overflow-hidden border-y border-slate-200 z-10">'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Stats');
