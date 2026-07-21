const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// AI feature
code = code.replace(/className="lg:col-span-8 group relative p-12 rounded-lg/g, 'className="lg:col-span-8 group relative p-8 md:p-10 rounded-lg');
code = code.replace(/<h3 className="text-4xl font-black mb-6/g, '<h3 className="text-3xl font-black mb-4');
code = code.replace(/<p className="text-lg text-slate-500/g, '<p className="text-base text-slate-500');

// BIM
code = code.replace(/className="lg:col-span-4 group p-10 rounded-lg/g, 'className="lg:col-span-4 group p-8 rounded-lg');
code = code.replace(/<h3 className="text-2xl font-black mb-4/g, '<h3 className="text-xl font-black mb-4');

// Row 2
code = code.replace(/p-8 rounded-lg bg-slate-50 border/g, 'p-6 md:p-8 rounded-lg bg-slate-50 border');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed');
