const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import { motion, AnimatePresence } from 'motion\/react';/, `import { motion, AnimatePresence } from 'motion/react';\nimport { ParticleHero } from './components/ParticleHero';`);

fs.writeFileSync('src/App.tsx', code);
console.log('Added import');
