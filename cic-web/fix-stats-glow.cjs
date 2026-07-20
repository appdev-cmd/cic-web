const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStats = `className="text-5xl md:text-6xl font-black text-slate-800 mb-4 tracking-tighter flex items-center justify-center h-16 group-hover:scale-110 group-hover:text-orange-600 transition-all duration-500 drop-shadow-sm"`;
const replaceStats = `className="text-5xl md:text-6xl font-black text-slate-800 mb-4 tracking-tighter flex items-center justify-center h-16 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]"`;

code = code.replace(targetStats, replaceStats);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Stats Glow');
