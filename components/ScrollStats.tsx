'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScrollStats.module.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 73, suffix: '%', label: 'of startups overpay for AI tools' },
  { value: 2400, prefix: '$', label: 'average monthly waste per team' },
  { value: 28800, prefix: '$', label: 'thrown away annually on wrong tiers' },
  { value: 30, suffix: 's', label: 'to find out with Credex' },
];

export default function ScrollStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const obj = { val: 0 };

        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            const prefix = stat.prefix || '';
            const suffix = stat.suffix || '';
            el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 className={styles.heading}>The problem is real</h2>
      <div className={styles.grid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.card}>
            <span
              ref={(el) => { numberRefs.current[i] = el; }}
              className={styles.number}
            >
              {stat.prefix || ''}0{stat.suffix || ''}
            </span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
