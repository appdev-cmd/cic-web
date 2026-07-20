const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const awardsStart = code.indexOf('      {/* Awards Section */}');
const coreValuesStart = code.indexOf('      {/* Core Values Section */}');
const introStart = code.indexOf('      {/* Intro Section (Hơn 35 năm đồng hành) */}');
const statsStart = code.indexOf('      {/* Stats Section */}');

const awardsSection = code.substring(awardsStart, coreValuesStart);
const coreValuesSection = code.substring(coreValuesStart, introStart);
const introSection = code.substring(introStart, statsStart);

let newAwardsSection = awardsSection.replace('className="pt-12 pb-4 bg-white relative overflow-hidden"', 'className="pt-12 pb-4 bg-slate-50 relative overflow-hidden"');
let newCoreValuesSection = coreValuesSection.replace('className="pt-8 pb-16 bg-slate-50 relative overflow-hidden"', 'className="pt-8 pb-16 bg-white relative overflow-hidden"');
let newIntroSection = introSection; // Keep it white

let newCode = code.substring(0, awardsStart) + newIntroSection + newAwardsSection + newCoreValuesSection + code.substring(statsStart);

fs.writeFileSync('src/App.tsx', newCode);
console.log('Reordered successfully');
