const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import { ParticleHero } from '\.\/components\/ParticleHero';\n/, '');
code = code.replace(/<ParticleHero \/>/, '<div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>');
code = code.replace(/animate=\{\{ opacity: 0\.2, scale: 1 \}\}/g, 'animate={{ opacity: 0.4, scale: 1 }}');

fs.writeFileSync('src/App.tsx', code);
console.log('Removed ParticleHero');
