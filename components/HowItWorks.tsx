'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HowItWorks.module.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Input your stack',
    desc: 'Tell us which AI tools you pay for, what plan, monthly cost, and how many seats. Takes about 30 seconds.'
  },
  {
    num: '02',
    title: 'Get instant analysis',
    desc: 'Our engine checks if you are on the right tier, finds cheaper alternatives, and calculates exact savings.'
  },
  {
    num: '03',
    title: 'Claim your savings',
    desc: 'For high-savings cases, purchase wholesale credits through Credex at up to 30% below retail.'
  }
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.15
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 className={styles.heading}>How it works</h2>
      <div className={styles.grid}>
        {steps.map((step, i) => (
          <div
            key={i}
            ref={el => { if (el) cardsRef.current[i] = el; }}
            className={styles.card}
          >
            <span className={styles.num}>{step.num}</span>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardDesc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
