const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// AI feature
code = code.replace(/className="lg:col-span-8 group relative p-8 md:p-10 rounded-lg/g, 'className="lg:col-span-8 group relative p-6 md:p-8 rounded-lg');

// BIM
code = code.replace(/className="lg:col-span-4 group p-8 rounded-lg/g, 'className="lg:col-span-4 group p-6 md:p-8 rounded-lg');

// Row 2
code = code.replace(/p-6 md:p-8 rounded-lg bg-slate-50 border/g, 'p-6 rounded-lg bg-slate-50 border');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed');
