const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="w-full max-w-[360px] relative">',
  '<div className="w-full max-w-[280px] relative">'
);

code = code.replace(
  '<input type="text" placeholder="Tìm kiếm giải pháp..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 px-4 py-3 pl-10 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 shadow-sm transition-all rounded-md text-sm font-medium" />',
  '<input type="text" placeholder="Tìm kiếm giải pháp..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 px-4 py-2.5 pl-10 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 shadow-sm transition-all rounded-md text-sm font-medium" />'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed input size 2');
