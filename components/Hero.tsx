'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from './MagneticButton';
import styles from './Hero.module.css';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.5 });

    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll('.word');
      tl.fromTo(words, { opacity: 0, y: 60, rotateX: -40 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.08 }, '-=0.3');
    }

    tl.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
    tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
  }, []);

  const titleText = 'Stop overpaying for AI tools.';
  const words = titleText.split(' ');

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div ref={badgeRef} className={styles.badge}>
          <span className={styles.dot} />
          Free audit. No login required.
        </div>
        <h1 ref={titleRef} className={styles.title} style={{ perspective: '600px' }}>
          {words.map((word, i) => (
            <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.3em' }}>
              {word}
            </span>
          ))}
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          Input your AI stack. Get an instant audit showing where you are overspending. Claim wholesale credits through Credex.
        </p>
        <div ref={ctaRef} className={styles.ctaRow}>
          <MagneticButton href="/audit" variant="primary">
            Run Free Audit
          </MagneticButton>
          <span className={styles.ctaNote}>Results in 30 seconds</span>
        </div>
      </div>
    </section>
  );
}
