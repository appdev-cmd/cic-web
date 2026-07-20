const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      {/* Stats Section */}
      <section className="py-12 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
        <img src="logo.png" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.03] pointer-events-none z-0 object-contain grayscale" alt="" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
            title="Quy mô và Uy tín" 
            sub="Khẳng định vị thế qua hơn ba thập kỷ phát triển bền vững" 
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {[
              { val: 35, suffix: '+', label: 'Năm kinh nghiệm' },
              { val: 300, suffix: '+', label: 'Giải pháp công nghệ' },
              { val: 5000, suffix: '+', label: 'Dự án thành công' },
              { val: 100, suffix: '+', label: 'Đối tác toàn cầu' },
              { isIcon: true, icon: <ShieldCheck size={44} className="mx-auto" />, label: 'Phần mềm bản quyền' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-orange-600 mb-2 tracking-tighter flex items-center justify-center h-12">
                  {stat.isIcon ? stat.icon : <Counter value={stat.val!} suffix={stat.suffix!} />}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>`;

const replacement = `      {/* Stats Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 md:divide-x divide-white/10">
            {[
              { val: 35, suffix: '+', label: 'Năm kinh nghiệm' },
              { val: 300, suffix: '+', label: 'Giải pháp công nghệ' },
              { val: 5000, suffix: '+', label: 'Dự án thành công' },
              { val: 100, suffix: '+', label: 'Đối tác toàn cầu' },
              { isIcon: true, icon: <ShieldCheck size={44} className="mx-auto" />, label: 'Phần mềm bản quyền' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="text-center group"
              >
                <div className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter flex items-center justify-center h-16 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500 drop-shadow-lg">
                  {stat.isIcon ? stat.icon : <Counter value={stat.val!} suffix={stat.suffix!} />}
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log('Updated stats section');
