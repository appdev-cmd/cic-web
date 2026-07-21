const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const markers = [
  { name: 'intro', text: '      {/* Intro Section (Hơn 35 năm đồng hành) */}' },
  { name: 'awards', text: '      {/* Awards Section */}' },
  { name: 'coreValues', text: '      {/* Core Values Section */}' },
  { name: 'stats', text: '      {/* Stats Section */}' },
  { name: 'solutions', text: '      <section id="solutions"' },
  { name: 'projects', text: '      {/* Featured Projects - Bento Grid */}' },
  { name: 'events', text: '      {/* Event Section */}' },
  { name: 'news', text: '      {/* News & Perspectives Section */}' },
  { name: 'partners', text: '      {/* Partners & Strategic Clients Section (Relocated & Optimized to Marquee) */}' },
  { name: 'contact', text: '      {/* CTA & Contact Section */}' },
  { name: 'footer', text: '      <footer' }
];

let sections = {};
for (let i = 0; i < markers.length; i++) {
  const start = code.indexOf(markers[i].text);
  if (start === -1) {
    console.error('Could not find marker', markers[i].name);
    process.exit(1);
  }
  const end = (i < markers.length - 1) ? code.indexOf(markers[i+1].text) : code.indexOf('      </footer>') + 15;
  sections[markers[i].name] = code.substring(start, end);
}

// Adjust padding
function adjustPadding(html, bg) {
  let res = html.replace(/py-[0-9]+/g, 'py-12')
                .replace(/pt-[0-9]+/g, 'pt-12')
                .replace(/pb-[0-9]+/g, 'pb-12')
                .replace(/bg-white/g, 'bg-TEMP_BG')
                .replace(/bg-slate-50/g, 'bg-TEMP_BG');
  return res.replace(/bg-TEMP_BG/g, bg);
}

let intro = adjustPadding(sections['intro'], 'bg-white');
let stats = adjustPadding(sections['stats'], 'bg-slate-50');
let awards = adjustPadding(sections['awards'], 'bg-white');
let solutions = adjustPadding(sections['solutions'], 'bg-slate-50');
let projects = adjustPadding(sections['projects'], 'bg-white');
let events = sections['events'].replace(/py-[0-9]+/g, 'py-12').replace(/pt-[0-9]+/g, 'pt-12').replace(/pb-[0-9]+/g, 'pb-12'); 
let news = adjustPadding(sections['news'], 'bg-slate-50');
let partners = adjustPadding(sections['partners'], 'bg-white');
let contact = adjustPadding(sections['contact'], 'bg-slate-50');

const newCode = code.substring(0, code.indexOf(markers[0].text)) + 
  intro + stats + awards + solutions + projects + events + news + partners + contact + sections['footer'];

fs.writeFileSync('src/App.tsx', newCode);
console.log('Reordered successfully');
