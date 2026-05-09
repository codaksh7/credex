'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let animationId: number;

    const dots: { x: number; y: number; originX: number; originY: number; vx: number; vy: number }[] = [];
    const spacing = 40;
    const influenceRadius = 250;
    const friction = 0.8;
    const ease = 0.12;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      buildGrid();
    }

    function buildGrid() {
      dots.length = 0;
      const cols = Math.ceil(canvas!.width / spacing) + 1;
      const rows = Math.ceil(canvas!.height / spacing) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          dots.push({ x, y, originX: x, originY: y, vx: 0, vy: 0 });
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      mouseX += (targetMouseX - mouseX) * ease;
      mouseY += (targetMouseY - mouseY) * ease;

      if (targetMouseX !== -1000) {
        const grd = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, influenceRadius);
        grd.addColorStop(0, 'rgba(0, 230, 118, 0.05)');
        grd.addColorStop(1, 'rgba(0, 230, 118, 0)');
        ctx!.fillStyle = grd;
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < influenceRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (influenceRadius - dist) / influenceRadius;
          dot.vx -= Math.cos(angle) * force * 1.5;
          dot.vy -= Math.sin(angle) * force * 1.5;
        }

        dot.vx += (dot.originX - dot.x) * 0.1;
        dot.vy += (dot.originY - dot.y) * 0.1;
        dot.vx *= friction;
        dot.vy *= friction;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const opacityDist = Math.sqrt(Math.pow(mouseX - dot.x, 2) + Math.pow(mouseY - dot.y, 2));
        const t = Math.max(0, 1 - opacityDist / influenceRadius);
        const radius = 1.2 + t * 4.5;
        const alpha = 0.08 + t * 0.9;

        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, radius, 0, Math.PI * 2);

        if (t > 0.01) {
          ctx!.shadowBlur = t * 15;
          ctx!.shadowColor = '#00e676';
          ctx!.fillStyle = `rgba(0, 230, 118, ${alpha})`;
        } else {
          ctx!.shadowBlur = 0;
          ctx!.fillStyle = `rgba(255, 255, 255, 0.08)`;
        }

        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    function handleMouseMove(e: MouseEvent) {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    }

    function handleMouseLeave() {
      targetMouseX = -1000;
      targetMouseY = -1000;
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#050505'
      }}
    />
  );
}
