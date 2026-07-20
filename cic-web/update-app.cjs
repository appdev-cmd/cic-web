const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Global Constellation at the top of App layout
code = code.replace(
  /<div className="min-h-screen font-sans bg-slate-50">/, 
  '<div className="min-h-screen font-sans bg-slate-50">\n      <Constellation isGlobal={true} />'
);

// Remove specific Constellation calls
code = code.replace(/<Constellation \/>/g, '');

// Fix Hero Section
code = code.replace(/className="relative pt-32 pb-32 overflow-hidden bg-slate-950"/, 'className="relative pt-32 pb-32 overflow-hidden bg-slate-950/90"');
// Change hero background to allow constellation through
code = code.replace(/<div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950\/80 to-transparent"><\/div>/, '<div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent mix-blend-multiply"></div>');

// Remove hard backgrounds from sections to let constellation shine through, or make them light overlays
code = code.replace(/<section className="py-20 bg-white relative overflow-hidden">/g, '<section className="py-20 bg-white/90 backdrop-blur-sm relative overflow-hidden border-t border-slate-200/50">');
code = code.replace(/<section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-200">/, '<section className="py-24 bg-slate-50/80 backdrop-blur-sm relative overflow-hidden border-y border-slate-200/50">');
code = code.replace(/<section className="py-20 bg-slate-950 text-white relative overflow-hidden">/g, '<section className="py-20 bg-slate-950/95 backdrop-blur-sm text-white relative overflow-hidden border-t border-white/5">');
code = code.replace(/<section className="py-20 bg-slate-50 relative overflow-hidden">/g, '<section className="py-20 bg-slate-50/80 backdrop-blur-sm relative overflow-hidden border-t border-slate-200/50">');

// Add "Xem tất cả" button to News section
const newsTarget = `              {/* Add more news items as needed */}
            </div>`;
const newsReplace = `              {/* Add more news items as needed */}
            </div>
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-none font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-50 hover:border-orange-600 hover:text-orange-600 btn-modern-interaction flex items-center gap-2 shadow-sm">
                Xem tất cả tin tức <ArrowRight size={16} />
              </button>
            </div>`;
code = code.replace(newsTarget, newsReplace);

// "Cắt sát để ảnh và box gần nhau." - Decrease gap in News Section
code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">/, '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">');

fs.writeFileSync('src/App.tsx', code);
console.log('Updated App');
