const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetSocials = `<div className="flex gap-4 mb-8">
                <a href="https://www.facebook.com/cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 text-white transition-all shadow-lg">
                  <Facebook size={20} />
                </a>
                <a href="https://zalo.me/02439761381" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 text-white transition-all shadow-lg">
                  <ZaloIcon size={20} />
                </a>
                <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-slate-800 hover:border-slate-800 text-white transition-all shadow-lg">
                  <Globe size={20} />
                </a>
                <a href="mailto:info@cic.com.vn" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 text-white transition-all shadow-lg">
                  <Mail size={20} />
                </a>
              </div>`;

const replaceSocials = `<div className="flex flex-wrap gap-4 mb-8">
                <a href="https://www.facebook.com/cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-white transition-all shadow-lg group">
                  <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] text-white transition-all shadow-lg group">
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] text-white transition-all shadow-lg group">
                  <Youtube size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://zalo.me/02439761381" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 text-white transition-all shadow-lg group">
                  <ZaloIcon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.cic.com.vn" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center hover:bg-slate-800 hover:border-slate-800 text-white transition-all shadow-lg group">
                  <Globe size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>`;
              
code = code.replace(targetSocials, replaceSocials);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed socials');
