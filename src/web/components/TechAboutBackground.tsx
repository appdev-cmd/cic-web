import React, { useEffect, useRef, useState } from 'react';

export const TechAboutBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Parallax Scroll Effect: 100px scroll translates to 15px-20px background movement
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Use ResizeObserver for high-fidelity canvas sizing as per guidelines
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let animationFrameId: number;
    let mx = -1000;
    let my = -1000;
    let isHovering = false;

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Adjust mouse coords for the parallax offset of the canvas
      const currentScrollY = window.scrollY;
      const parallaxOffset = currentScrollY * 0.15;
      
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      mx = -1000;
      my = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Layer 1 - Soft Mesh Gradients (moving extremely slowly, 40-60 seconds cycle)
    const orbs = [
      { 
        x: canvas.width * 0.15, 
        y: canvas.height * 0.25, 
        vx: 0.05, 
        vy: 0.03, 
        radius: canvas.width > 768 ? 450 : 250, 
        color: 'rgba(255, 107, 0, 0.04)' // Very soft CIC orange (4% opacity)
      },
      { 
        x: canvas.width * 0.85, 
        y: canvas.height * 0.65, 
        vx: -0.04, 
        vy: 0.05, 
        radius: canvas.width > 768 ? 500 : 300, 
        color: 'rgba(243, 244, 246, 0.9)' // F3F4F6 light gray/white soft area
      },
      { 
        x: canvas.width * 0.5, 
        y: canvas.height * 0.45, 
        vx: 0.03, 
        vy: -0.04, 
        radius: canvas.width > 768 ? 350 : 200, 
        color: 'rgba(255, 107, 0, 0.03)' // 3% brand glow
      },
    ];

    // Layer 3 - Active Nodes (8-12 premium slow-moving nodes)
    const numNodes = 10;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      activation: number; // 0 to 1 for elegant connection fades
    }[] = [];

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // Extremely slow drift (approx. 10px in 30 seconds)
        // 10px / (30s * 60fps) = 0.005 pixels per frame
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        radius: 2 + Math.random() * 2, // 2px to 4px
        activation: 0,
      });
    }

    const gridSize = 100;

    // Layer 2 - Subtle Tech Grid (2% opacity)
    const drawGrid = (w: number, h: number) => {
      ctx.strokeStyle = 'rgba(243, 244, 246, 0.6)'; // Extremely faint light gray
      ctx.lineWidth = 1;

      // Draw vertical grid lines
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Draw horizontal grid lines
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw tiny, neat intersection dots / ticks
      ctx.fillStyle = 'rgba(255, 107, 0, 0.03)'; // Only 3% brand color dots
      for (let x = gridSize; x < w; x += gridSize) {
        for (let y = gridSize; y < h; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Layer 1: Soft Mesh Gradients ---
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Boundary bounce checks
        if (orb.x - orb.radius < 0 || orb.x + orb.radius > canvas.width) orb.vx *= -1;
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > canvas.height) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Layer 2: Tech Grid (2%) ---
      drawGrid(canvas.width, canvas.height);

      // --- Layer 3: Active Nodes ---
      nodes.forEach(node => {
        // Move node extremely slowly
        node.x += node.vx;
        node.y += node.vy;

        // Soft screen bounce
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node
        ctx.fillStyle = 'rgba(255, 107, 0, 0.25)'; // Brand color soft point
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw inner high-tech tiny white core for extra sharpness
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Hover tracking for connection activation
        let distToMouse = 9999;
        if (isHovering) {
          const dx = mx - node.x;
          const dy = my - node.y;
          distToMouse = Math.sqrt(dx * dx + dy * dy);
        }

        if (distToMouse < 150) {
          // Accelerate activation up to 1
          node.activation = Math.min(1, node.activation + 0.08);
        } else {
          // Smooth decay over exactly 0.8 seconds (approx. 48 frames at 60fps)
          node.activation = Math.max(0, node.activation - 0.02);
        }
      });

      // --- Layer 4: Hover Connection Mesh (Interactive & Fades in 0.8s) ---
      // Line configurations
      ctx.lineWidth = 0.8;

      // Draw faint connections between active nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];

          // Distance between nodes
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distBetween = Math.sqrt(dx * dx + dy * dy);

          // Only connect nodes that are reasonably close to each other (e.g. < 280px)
          if (distBetween < 280) {
            // Activation level is the product of both node activations (both must be near mouse)
            // This creates a lovely localized connection web that fades gracefully as mouse moves away
            const jointActivation = nodeA.activation * nodeB.activation;
            if (jointActivation > 0.01) {
              const opacity = jointActivation * (1 - distBetween / 280) * 0.12; // Cap max opacity at 12%
              ctx.strokeStyle = `rgba(255, 107, 0, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(nodeA.x, nodeA.y);
              ctx.lineTo(nodeB.x, nodeB.y);
              ctx.stroke();
            }
          }
        }

        // Connect nodes directly to the mouse if they are activated
        const node = nodes[i];
        if (node.activation > 0.01 && isHovering) {
          const dx = mx - node.x;
          const dy = my - node.y;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);
          
          if (distToMouse < 150) {
            const opacity = node.activation * (1 - distToMouse / 150) * 0.15; // Cap max opacity at 15%
            ctx.strokeStyle = `rgba(255, 107, 0, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dimensions]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-[-10] overflow-hidden pointer-events-none bg-white transition-transform duration-100 ease-out"
      style={{ transform: `translateY(${scrollY * 0.15}px)` }}
    >
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none" />
    </div>
  );
};
