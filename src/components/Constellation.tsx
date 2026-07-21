import React, { useEffect, useRef } from 'react';

export const Constellation: React.FC<{
  density?: number;
  lineDistance?: number;
  particleColor?: string;
  lineColor?: string;
}> = ({
  density = 14000,
  lineDistance = 250,
  particleColor = 'rgba(234, 88, 12, 0.3)',
  lineColor = 'rgba(234, 88, 12, '
}) => {
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
    let mx = -1000;
    let my = -1000;
    let isHovering = false;
    let mouseRadius = 250;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      isHovering = true;
    };
    
    const handleMouseLeave = () => {
      isHovering = false;
      mx = -1000;
      my = -1000;
    };
    
    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle(mx, my, true));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;
      life: number = 1;
      isBurst: boolean = false;

      constructor(x: number, y: number, isBurst = false) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.isBurst = isBurst;
        if (isBurst) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 1;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.size = Math.random() * 2 + 1;
        } else {
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.size = Math.random() * 1.5 + 0.5;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        if (this.isBurst) {
          this.life -= 0.015;
          this.size *= 0.95;
        } else if (isHovering) {
          const dx = mx - this.x;
          const dy = my - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (mouseRadius - dist) / mouseRadius;
            const directionX = forceDirectionX * force * 0.6;
            const directionY = forceDirectionY * force * 0.6;
            
            this.x += directionX;
            this.y += directionY;
          } else {
            this.x -= (this.x - this.baseX) * 0.01;
            this.y -= (this.y - this.baseY) * 0.01;
          }
        } else {
          this.x -= (this.x - this.baseX) * 0.005;
          this.y -= (this.y - this.baseY) * 0.005;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.isBurst) {
          ctx.fillStyle = lineColor + this.life + ')';
        } else {
          if (isHovering) {
             const dx = mx - this.x;
             const dy = my - this.y;
             const dist = Math.sqrt(dx * dx + dy * dy);
             if (dist < 200) {
                 ctx.fillStyle = lineColor + (0.4 + (200 - dist) / 200 * 0.6) + ')';
             } else {
                 ctx.fillStyle = particleColor;
             }
          } else {
             ctx.fillStyle = particleColor;
          }
        }
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const numParticles = Math.floor((w * h) / density); 
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * w, Math.random() * h));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      particles = particles.filter(p => !p.isBurst || p.life > 0);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < lineDistance) {
            ctx.beginPath();
            let baseAlpha = 0.35 - (dist / lineDistance) * 0.35; 
            
            if (isHovering) {
              const mx1 = mx - particles[i].x;
              const my1 = my - particles[i].y;
              const distToMouse1 = Math.sqrt(mx1 * mx1 + my1 * my1);
              
              const mx2 = mx - particles[j].x;
              const my2 = my - particles[j].y;
              const distToMouse2 = Math.sqrt(mx2 * mx2 + my2 * my2);
              
              if (distToMouse1 < mouseRadius || distToMouse2 < mouseRadius) {
                baseAlpha += 0.2;
              }
            }
            
            ctx.strokeStyle = lineColor + baseAlpha + ')';
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
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [density, lineDistance, particleColor, lineColor]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none" />
    </div>
  );
};
