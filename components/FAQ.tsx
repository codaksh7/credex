'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FAQ.module.css';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: 'Do I need to connect my AWS or billing account?',
    a: 'No. This is a frictionless, manual input tool. We never touch your actual billing API. Just type in what you pay.'
  },
  {
    q: 'How does Credex offer discounted credits?',
    a: 'We purchase unused compute commits and over-forecasted enterprise licenses from other startups at a discount, and pass the savings to you.'
  },
  {
    q: 'Is the audit actually free?',
    a: 'Yes. The audit is 100% free forever. We only make money if you choose to buy discounted credits through us.'
  },
  {
    q: 'What tools do you support?',
    a: 'Currently we support Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, and OpenAI API. More coming soon.'
  },
  {
    q: 'Can I share the report with my CFO?',
    a: 'Yes. After the audit, you get a public, anonymized URL that strips company PII but keeps the exact dollar savings to help you build a business case.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  const toggle = (i: number) => {
    if (openIndex === i) {
      const el = answerRefs.current[i];
      if (el) gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
      setOpenIndex(null);
    } else {
      if (openIndex !== null) {
        const prev = answerRefs.current[openIndex];
        if (prev) gsap.to(prev, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
      }
      setOpenIndex(i);
      const el = answerRefs.current[i];
      if (el) {
        gsap.set(el, { height: 'auto', opacity: 1 });
        gsap.from(el, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.out' });
      }
    }
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 className={styles.heading}>Questions</h2>
      <div className={styles.list}>
        {faqs.map((faq, i) => (
          <div key={i} className={`${styles.item} ${openIndex === i ? styles.open : ''}`}>
            <button className={styles.question} onClick={() => toggle(i)}>
              <span>{faq.q}</span>
              <span className={styles.icon}>{openIndex === i ? '\u2212' : '+'}</span>
            </button>
            <div
              ref={el => { answerRefs.current[i] = el; }}
              className={styles.answer}
              style={{ height: 0, opacity: 0, overflow: 'hidden' }}
            >
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
