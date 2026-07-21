const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace button paddings
code = code.replace(/px-10 py-5/g, 'px-6 py-3');
code = code.replace(/px-10 py-4/g, 'px-6 py-2.5');
code = code.replace(/px-12 py-4/g, 'px-8 py-3');
code = code.replace(/<button([^>]*)py-4([^>]*)>/g, '<button$1py-2.5$2>');
code = code.replace(/<button([^>]*)px-10([^>]*)>/g, '<button$1px-6$2>');

// Event & News Tabs
code = code.replace(/px-6 py-2 rounded-full/g, 'px-4 py-1.5 rounded-full text-xs');
code = code.replace(/px-4 py-2 rounded-full/g, 'px-4 py-1.5 rounded-full text-xs');

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed buttons');
