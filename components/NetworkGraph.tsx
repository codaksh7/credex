'use client';

import { useEffect, useRef } from 'react';
import styles from './NetworkGraph.module.css';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  radius: number;
  color: string;
}

interface Edge {
  source: number;
  target: number;
}

const TOOL_NAMES = ['Cursor', 'Copilot', 'Claude', 'ChatGPT', 'Gemini', 'Windsurf', 'OpenAI API', 'Anthropic API'];

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 5],
  [1, 3], [1, 4],
  [2, 7], [2, 3],
  [3, 6], [3, 4],
  [4, 6],
  [5, 0], [5, 2],
  [6, 7],
];

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = section.clientWidth;
    let h = 500;
    canvas.width = w;
    canvas.height = h;

    const nodes: Node[] = TOOL_NAMES.map((label, i) => ({
      x: w * 0.2 + Math.cos((i / TOOL_NAMES.length) * Math.PI * 2) * w * 0.25,
      y: h * 0.5 + Math.sin((i / TOOL_NAMES.length) * Math.PI * 2) * h * 0.3,
      vx: 0,
      vy: 0,
      label,
      radius: 6,
      color: '#00e676',
    }));

    const edges: Edge[] = EDGES.map(([s, t]) => ({ source: s, target: t }));

    let mouseX = -1000;
    let mouseY = -1000;
    let animId: number;
    let pulse = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    function simulate() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const repulse = 8000 / (dist * dist);
          const fx = (dx / dist) * repulse;
          const fy = (dy / dist) * repulse;
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }

      for (const edge of edges) {
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const target = 120;
        const force = (dist - target) * 0.005;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }

      for (const node of nodes) {
        const cx = w / 2;
        const cy = h / 2;
        node.vx += (cx - node.x) * 0.0003;
        node.vy += (cy - node.y) * 0.0003;

        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          node.vx -= (dx / dist) * force * 2;
          node.vy -= (dy / dist) * force * 2;
        }

        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;

        node.x = Math.max(50, Math.min(w - 50, node.x));
        node.y = Math.max(30, Math.min(h - 30, node.y));
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      pulse = (Math.sin(performance.now() * 0.002) + 1) * 0.5;

      for (const edge of edges) {
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = `rgba(0, 230, 118, ${0.08 + pulse * 0.06})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      for (const node of nodes) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hover = dist < 80;
        const r = hover ? node.radius + 3 : node.radius;
        const alpha = hover ? 1 : 0.6 + pulse * 0.2;

        if (hover) {
          ctx!.shadowBlur = 20;
          ctx!.shadowColor = '#00e676';
        } else {
          ctx!.shadowBlur = 0;
        }

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 230, 118, ${alpha})`;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        ctx!.font = `${hover ? '600' : '500'} ${hover ? '13px' : '11px'} Inter, sans-serif`;
        ctx!.fillStyle = hover ? '#ffffff' : `rgba(255, 255, 255, ${0.5 + pulse * 0.2})`;
        ctx!.textAlign = 'center';
        ctx!.fillText(node.label, node.x, node.y - r - 8);
      }

      simulate();
      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      w = section.clientWidth;
      canvas.width = w;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 className={styles.heading}>AI Tool Ecosystem</h2>
      <p className={styles.subheading}>Every node is a tool we audit. Hover to explore connections.</p>
      <canvas ref={canvasRef} className={styles.canvas} />
    </section>
  );
}
