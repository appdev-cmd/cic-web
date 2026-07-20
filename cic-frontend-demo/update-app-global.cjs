const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Global Constellation at the top of App layout
if (!code.includes('<Constellation isGlobal={true} />') && !code.includes('<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">\\n      <Constellation />')) {
  code = code.replace(
    '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">', 
    '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white relative">\n      <div className="fixed inset-0 z-0 pointer-events-none opacity-60"><Constellation density={8000} lineDistance={250} particleColor="rgba(234, 88, 12, 0.3)" lineColor="rgba(234, 88, 12, " /></div>'
  );
}

// Remove specific Constellation calls
code = code.replace(/<Constellation \/>/g, '');

// Make sections slightly transparent so global constellation shows through
code = code.replace(/className="relative pt-32 pb-32 overflow-hidden bg-slate-950"/, 'className="relative pt-32 pb-32 overflow-hidden bg-slate-950/90 z-10"');
code = code.replace(/<section className="py-20 bg-white relative overflow-hidden">/g, '<section className="py-20 bg-white/80 backdrop-blur-sm relative overflow-hidden z-10 border-t border-slate-100">');
code = code.replace(/<section className="py-20 bg-slate-50 relative overflow-hidden">/g, '<section className="py-20 bg-slate-50/80 backdrop-blur-sm relative overflow-hidden z-10 border-t border-slate-100">');
code = code.replace(/<section id="solutions" className="py-12 bg-slate-50 text-slate-950 relative overflow-hidden">/, '<section id="solutions" className="py-12 bg-slate-50/80 backdrop-blur-sm text-slate-950 relative overflow-hidden z-10">');
code = code.replace(/<section id="projects" className="py-12 bg-white relative overflow-hidden border-t border-slate-100">/, '<section id="projects" className="py-12 bg-white/80 backdrop-blur-sm relative overflow-hidden border-t border-slate-100 z-10">');
code = code.replace(/<section id="events" className="py-12 bg-slate-950 text-white relative overflow-hidden border-t border-white\/5">/, '<section id="events" className="py-12 bg-slate-950/90 backdrop-blur-sm text-white relative overflow-hidden border-t border-white/5 z-10">');
code = code.replace(/<section id="news" className="py-12 bg-slate-50 border-t border-slate-50">/, '<section id="news" className="py-12 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 z-10 relative">');
code = code.replace(/<section id="contact" className="py-12 bg-slate-50 overflow-hidden relative">/, '<section id="contact" className="py-12 bg-slate-50/90 backdrop-blur-sm overflow-hidden relative z-10">');

// For Stats Section
code = code.replace(/<section className="py-20 bg-slate-50 relative overflow-hidden border-y border-slate-200">/, '<section className="py-20 bg-slate-50/60 backdrop-blur-sm relative overflow-hidden border-y border-slate-200 z-10">');
code = code.replace(/<section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-200">/, '<section className="py-24 bg-slate-50/60 backdrop-blur-sm relative overflow-hidden border-y border-slate-200 z-10">');

// Add "Xem tất cả" button to News section if not there
const newsTarget = `              {/* Add more news items as needed */}
            </div>`;
const newsReplace = `              {/* Add more news items as needed */}
            </div>
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-none font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-50 hover:border-orange-600 hover:text-orange-600 btn-modern-interaction flex items-center gap-2 shadow-sm">
                Xem tất cả tin tức <ArrowRight size={16} />
              </button>
            </div>`;
if (!code.includes('Xem tất cả tin tức')) {
  code = code.replace(newsTarget, newsReplace);
}

// "Cắt sát để ảnh và box gần nhau." - Decrease gap in News Section
code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">/, '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">');

fs.writeFileSync('src/App.tsx', code);
console.log('Updated App with global constellation');
