const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const slide1 = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80';
const slide2 = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80';
const slide3 = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80';
const slide4 = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80';

code = code.replace(slide1, 'https://images.unsplash.com/photo-1541888081622-15cb7a56e522?auto=format&fit=crop&q=80');
code = code.replace(slide2, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80');
code = code.replace(slide3, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80');
code = code.replace(slide4, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80');

const targetHero = `      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              src={heroSlides[currentSlide].img} 
              alt="Slide" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>`;
        
const replaceHero = `      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              src={heroSlides[currentSlide].img} 
              alt="Slide" 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          <Constellation />
        </div>`;

code = code.replace(targetHero, replaceHero);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed hero');
