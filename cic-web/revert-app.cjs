const fs = require('fs');

// Revert Constellation.tsx
const constellationCode = `import React, { useEffect, useRef } from 'react';

export const Constellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    let mx = w / 2;
    let my = h / 2;
    let mouseRadius = 150;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          const force = (mouseRadius - dist) / mouseRadius;
          const directionX = forceDirectionX * force * 0.5;
          const directionY = forceDirectionY * force * 0.5;
          
          this.x -= directionX;
          this.y -= directionY;
        } else {
            this.x -= (this.x - this.baseX) * 0.01;
            this.y -= (this.y - this.baseY) * 0.01;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 88, 12, 0.7)'; // orange
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const numParticles = Math.floor((w * h) / 5000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * w, Math.random() * h));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = \`rgba(234, 88, 12, \${0.35 - dist / 180 * 0.35})\`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
    </div>
  );
};
`;
fs.writeFileSync('src/components/Constellation.tsx', constellationCode);
console.log('Reverted Constellation.tsx');


// Revert App.tsx
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">\\n      <Constellation isGlobal={true} />',
  '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">'
);
code = code.replace(
  '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">\\n      <Constellation isGlobal={true} />',
  '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">'
);
code = code.replace(
  /<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">\s*<Constellation isGlobal=\{true\} \/>/,
  '<div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">'
);


code = code.replace('className="relative pt-32 pb-32 overflow-hidden bg-slate-950/90"', 'className="relative pt-32 pb-32 overflow-hidden bg-slate-950"');
code = code.replace('<div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent mix-blend-multiply"></div>', '<div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>\n          <Constellation />');


code = code.replace(/<section className="py-20 bg-white\/90 backdrop-blur-sm relative overflow-hidden border-t border-slate-200\/50">/g, '<section className="py-20 bg-white relative overflow-hidden">');
code = code.replace(/<section className="py-24 bg-slate-50\/80 backdrop-blur-sm relative overflow-hidden border-y border-slate-200\/50">/g, '<section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-200">\n        <Constellation />');
code = code.replace(/<section className="py-20 bg-slate-950\/95 backdrop-blur-sm text-white relative overflow-hidden border-t border-white\/5">/g, '<section className="py-20 bg-slate-950 text-white relative overflow-hidden">');
code = code.replace(/<section className="py-20 bg-slate-50\/80 backdrop-blur-sm relative overflow-hidden border-t border-slate-200\/50">/g, '<section className="py-20 bg-slate-50 relative overflow-hidden">');


const newsTarget = `              {/* Add more news items as needed */}
            </div>
            <div className="mt-12 flex justify-center">
              <button className="px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-none font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-50 hover:border-orange-600 hover:text-orange-600 btn-modern-interaction flex items-center gap-2 shadow-sm">
                Xem tất cả tin tức <ArrowRight size={16} />
              </button>
            </div>`;
const newsReplace = `              {/* Add more news items as needed */}
            </div>`;
code = code.replace(newsTarget, newsReplace);


code = code.replace('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">', '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">');

fs.writeFileSync('src/App.tsx', code);
console.log('Reverted App.tsx');
