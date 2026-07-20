const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>`;
const replacement = `<ParticleHero />`;

code = code.replace(target, replacement);

// Reduce image opacity
code = code.replace(/animate={{ opacity: 0.4, scale: 1 }}/g, `animate={{ opacity: 0.2, scale: 1 }}`);

fs.writeFileSync('src/App.tsx', code);
console.log('Added ParticleHero component');
