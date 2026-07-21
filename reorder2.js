const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const markers = [
  { name: 'intro', text: '      {/* Intro Section (Hơn 35 năm đồng hành) */}' },
  { name: 'awards', text: '      {/* Awards Section */}' },
  { name: 'coreValues', text: '      {/* Core Values Section */}' },
  { name: 'stats', text: '      {/* Stats Section */}' },
  { name: 'solutions', text: '      <section id="solutions"' },
  { name: 'projects', text: '      {/* Featured Projects - Bento Grid */}' },
  { name: 'events', text: '      {/* Events Section */}' },
  { name: 'news', text: '      {/* News & Perspectives Section */}' },
  { name: 'partners', text: '      {/* Partners & Strategic Clients Section (Relocated & Optimized to Marquee) */}' },
  { name: 'contact', text: '      {/* CTA & Contact Section */}' },
  { name: 'footer', text: '      <footer' }
];

let sections = {};
for (let i = 0; i < markers.length; i++) {
  const start = code.indexOf(markers[i].text);
  const end = (i < markers.length - 1) ? code.indexOf(markers[i+1].text) : code.indexOf('      </footer>') + 15;
  sections[markers[i].name] = code.substring(start, end);
}

// Adjust padding
// "py-20", "py-16", "py-12" -> "py-10" or "py-8"
function adjustPadding(html, bg) {
  let res = html.replace(/py-20/g, 'py-10')
                .replace(/py-16/g, 'py-10')
                .replace(/py-12/g, 'py-10')
                .replace(/pt-12/g, 'pt-10')
                .replace(/pb-16/g, 'pb-10')
                .replace(/pt-8/g, 'pt-8')
                .replace(/pb-4/g, 'pb-8')
                .replace(/py-6/g, 'py-10')
                .replace(/bg-white/g, 'bg-TEMP_BG')
                .replace(/bg-slate-50/g, 'bg-TEMP_BG');
  return res.replace(/bg-TEMP_BG/g, bg);
}

// Reorder and re-color backgrounds
// Intro: white
// Stats: slate-50
// Awards: white
// Solutions: slate-50
// Projects: white
// Events: (dark)
// News: slate-50
// Partners: white
// Contact: slate-50

let intro = adjustPadding(sections['intro'], 'bg-white');
let stats = adjustPadding(sections['stats'], 'bg-slate-50');
let awards = adjustPadding(sections['awards'], 'bg-white');
let solutions = adjustPadding(sections['solutions'], 'bg-slate-50');
let projects = adjustPadding(sections['projects'], 'bg-white');
let events = sections['events'].replace(/py-6/g, 'py-12'); // keep events dark, slightly tighter
let news = adjustPadding(sections['news'], 'bg-slate-50');
let partners = adjustPadding(sections['partners'], 'bg-white');
let contact = adjustPadding(sections['contact'], 'bg-slate-50');

const newCode = code.substring(0, code.indexOf(markers[0].text)) + 
  intro + stats + awards + solutions + projects + events + news + partners + contact + sections['footer'];

fs.writeFileSync('src/App.tsx', newCode);
console.log('Reordered successfully');
