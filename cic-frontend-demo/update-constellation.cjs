const fs = require('fs');
let code = fs.readFileSync('src/components/Constellation.tsx', 'utf8');

// Increase number of particles (lower denominator means more particles)
code = code.replace(/Math\.floor\(\(w \* h\) \/ 8000\)/g, 'Math.floor((w * h) / 5000)');

// Increase connection distance and opacity
code = code.replace(/if \(dist < 100\) \{/g, 'if (dist < 180) {');
code = code.replace(/ctx\.strokeStyle = \`rgba\\(234, 88, 12, \\\$\\{0\.15 - dist \/ 100 \* 0\.15\\}\\)\`;/g, 'ctx.strokeStyle = `rgba(234, 88, 12, ${0.35 - dist / 180 * 0.35})`;');

// Increase particle base opacity slightly
code = code.replace(/ctx\.fillStyle = 'rgba\\(234, 88, 12, 0\.4\\)';/g, 'ctx.fillStyle = \'rgba(234, 88, 12, 0.7)\';');

// Also make lines thicker if needed, or keep 0.5
// code = code.replace(/ctx.lineWidth = 0.5;/g, 'ctx.lineWidth = 1;');

fs.writeFileSync('src/components/Constellation.tsx', code);
console.log('Updated Constellation');
