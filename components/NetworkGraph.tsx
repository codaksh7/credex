'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './NetworkGraph.module.css';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  radius: number;
  price: string;
  best: string;
  saving: string;
  efficiency: string;
}

interface Edge {
  source: number;
  target: number;
}

const TOOL_INFO: { label: string; price: string; best: string; saving: string; efficiency: string }[] = [
  { label: 'Cursor', price: '$20/mo Pro', best: 'Coding', saving: 'Up to 40% vs Copilot', efficiency: '92% code completion' },
  { label: 'Copilot', price: '$19/mo Individual', best: 'IDE Integration', saving: 'Best for GitHub users', efficiency: '88% code suggestion' },
  { label: 'Claude', price: '$20/mo Pro', best: 'Long documents', saving: 'Free tier available', efficiency: '95% context retention' },
  { label: 'ChatGPT', price: '$20/mo Plus', best: 'General purpose', saving: 'Team plan saves 15%', efficiency: '90% task versatility' },
  { label: 'Gemini', price: '$20/mo Advanced', best: 'Google ecosystem', saving: 'Bundled with Workspace', efficiency: '87% multimodal' },
  { label: 'Windsurf', price: '$15/mo Pro', best: 'Agentic coding', saving: 'Cheapest IDE AI', efficiency: '85% autonomous tasks' },
  { label: 'OpenAI API', price: 'Pay per token', best: 'Custom apps', saving: 'Batch API 50% off', efficiency: '94% developer control' },
  { label: 'Anthropic API', price: 'Pay per token', best: 'Safety-critical', saving: 'Haiku model 90% cheaper', efficiency: '96% instruction following' },
];

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
  const [tooltip, setTooltip] = useState<{ x: number; y: number; info: typeof TOOL_INFO[0] } | null>(null);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let w = rect.width;
    let h = 500; // Fixed height in CSS
    canvas.width = w;
    canvas.height = h;

    const nodes: Node[] = TOOL_INFO.map((info, i) => ({
      x: w * 0.2 + Math.cos((i / TOOL_INFO.length) * Math.PI * 2) * w * 0.25,
      y: h * 0.5 + Math.sin((i / TOOL_INFO.length) * Math.PI * 2) * h * 0.3,
      vx: 0,
      vy: 0,
      label: info.label,
      radius: 8,
      price: info.price,
      best: info.best,
      saving: info.saving,
      efficiency: info.efficiency,
    }));

    nodesRef.current = nodes;

    const edges: Edge[] = EDGES.map(([s, t]) => ({ source: s, target: t }));

    let mouseX = -1000;
    let mouseY = -1000;
    let animId: number;
    let pulse = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      let found = false;
      for (const node of nodes) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          setTooltip({
            x: node.x,
            y: node.y,
            info: { label: node.label, price: node.price, best: node.best, saving: node.saving, efficiency: node.efficiency }
          });
          found = true;
          break;
        }
      }
      if (!found) setTooltip(null);
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      setTooltip(null);
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
        const target = 140;
        const force = (dist - target) * 0.004;
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
        node.vx += (cx - node.x) * 0.0005;
        node.vy += (cy - node.y) * 0.0005;

        const dx = mouseX - node.x;
        const dy = mouseY - node.y;

        node.vx *= 0.92;
        node.vy *= 0.92;
        node.x += node.vx;
        node.y += node.vy;

        node.x = Math.max(60, Math.min(w - 60, node.x));
        node.y = Math.max(40, Math.min(h - 40, node.y));
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
        ctx!.strokeStyle = `rgba(0, 230, 118, ${0.1 + pulse * 0.05})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      for (const node of nodes) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hover = dist < 30;
        const r = hover ? 12 : node.radius;
        const alpha = hover ? 1 : 0.7 + pulse * 0.15;

        if (hover) {
          ctx!.shadowBlur = 25;
          ctx!.shadowColor = '#00e676';
          canvas!.style.cursor = 'pointer';
        } else {
          ctx!.shadowBlur = 0;
        }

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 230, 118, ${alpha})`;
        ctx!.fill();

        if (hover) {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
          ctx!.strokeStyle = 'rgba(0, 230, 118, 0.3)';
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }

        ctx!.shadowBlur = 0;

        ctx!.font = `${hover ? '700' : '500'} ${hover ? '14px' : '12px'} Inter, sans-serif`;
        ctx!.fillStyle = hover ? '#ffffff' : `rgba(255, 255, 255, ${0.6 + pulse * 0.15})`;
        ctx!.textAlign = 'center';
        ctx!.fillText(node.label, node.x, node.y - r - 10);


      }

      let anyHover = false;
      for (const node of nodes) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) { anyHover = true; break; }
      }
      if (!anyHover && canvas) canvas.style.cursor = 'default';

      simulate();
      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      w = canvas.getBoundingClientRect().width;
      canvas.width = w;
      setTooltip(null);
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
      <p className={styles.subheading}>Hover over any node to see pricing, savings, and efficiency data.</p>
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {tooltip && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(tooltip.x, (sectionRef.current?.clientWidth || 800) - 260),
              top: tooltip.y - 140,
            }}
          >
            <div className={styles.tooltipHeader}>{tooltip.info.label}</div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Price</span>
              <span className={styles.tooltipValue}>{tooltip.info.price}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Best for</span>
              <span className={styles.tooltipValue}>{tooltip.info.best}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Saving</span>
              <span className={styles.tooltipValueGreen}>{tooltip.info.saving}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Efficiency</span>
              <span className={styles.tooltipValueGreen}>{tooltip.info.efficiency}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
