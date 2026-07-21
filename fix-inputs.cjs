const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<input([^>]*)py-12([^>]*)>/g, '<input$1py-4$2>');
code = code.replace(/py-12\.5/g, 'py-2.5');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed inputs');
