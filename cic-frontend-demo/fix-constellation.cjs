const fs = require('fs');
let code = fs.readFileSync('src/components/Constellation.tsx', 'utf8');

code = code.replace(/\\\`rgba/g, '\`rgba');
code = code.replace(/\\\$/g, '$');
code = code.replace(/\\\}/g, '}');

fs.writeFileSync('src/components/Constellation.tsx', code);
console.log('Fixed Constellation escaping');
