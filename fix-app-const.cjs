const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="fixed inset-0 z-0 pointer-events-none opacity-60"><Constellation density={14000} lineDistance={250} particleColor="rgba(234, 88, 12, 0.3)" lineColor="rgba(234, 88, 12, " /></div>',
  '<div className="fixed inset-0 z-0 pointer-events-none opacity-100"><Constellation density={9000} lineDistance={200} particleColor="rgba(234, 88, 12, 0.5)" lineColor="rgba(234, 88, 12, " /></div>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App const');
