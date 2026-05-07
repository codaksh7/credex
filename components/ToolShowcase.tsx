'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ToolShowcase.module.css';

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { name: 'Cursor', plans: 'Hobby / Pro / Business' },
  { name: 'GitHub Copilot', plans: 'Individual / Business / Enterprise' },
  { name: 'Claude', plans: 'Free / Pro / Team' },
  { name: 'ChatGPT', plans: 'Plus / Team' },
  { name: 'Gemini', plans: 'Advanced' },
  { name: 'Windsurf', plans: 'Free / Pro' },
  { name: 'Anthropic API', plans: 'Pay as you go' },
  { name: 'OpenAI API', plans: 'Pay as you go' },
];

export default function ToolShowcase() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(`.${styles.item}`);
    gsap.fromTo(items,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Tools we audit</h2>
      <p className={styles.subheading}>Current pricing verified weekly from official vendor pages.</p>
      <div ref={gridRef} className={styles.grid}>
        {tools.map((tool, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.toolName}>{tool.name}</span>
            <span className={styles.toolPlans}>{tool.plans}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
