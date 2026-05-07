'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuditStore } from '@/store/useAuditStore';
import { analyzeSpend, AuditResult } from '@/utils/auditEngine';
import AISummary from './AISummary';
import styles from './AuditResults.module.css';

export default function AuditResults() {
  const { tools, teamSize, primaryUseCase } = useAuditStore();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const results: AuditResult[] = analyzeSpend(tools, teamSize, primaryUseCase);
  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.savings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' });
    }
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(`.${styles.resultItem}`);
      gsap.fromTo(items, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.4 });
    }
  }, []);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, results, tools, teamSize })
      });
      const data = await res.json();
      if (data.shareUrl) setShareUrl(data.shareUrl);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isHighSavings = totalMonthlySavings > 500;

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={heroRef} className={styles.hero}>
        <span className={styles.heroLabel}>Potential Savings Identified</span>
        <div className={styles.savingsRow}>
          <div className={styles.savingsBlock}>
            <span className={styles.amount}>${totalMonthlySavings.toLocaleString()}</span>
            <span className={styles.period}>per month</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.savingsBlock}>
            <span className={styles.amount}>${totalAnnualSavings.toLocaleString()}</span>
            <span className={styles.period}>per year</span>
          </div>
        </div>
      </div>

      <AISummary results={results} teamSize={teamSize} primaryUseCase={primaryUseCase} />

      <div className={styles.breakdown}>
        <h3 className={styles.sectionTitle}>Per-Tool Breakdown</h3>
        {results.map((r, i) => (
          <div key={i} className={styles.resultItem}>
            <div className={styles.resultHeader}>
              <span className={styles.toolName}>{r.toolName}</span>
              <span className={r.savings > 0 ? styles.savingsTag : styles.optimalTag}>
                {r.savings > 0 ? `Save $${r.savings}/mo` : 'Optimal'}
              </span>
            </div>
            <p className={styles.reason}>{r.reason}</p>
            <div className={styles.actionRow}>
              <span className={styles.currentSpend}>${r.currentSpend}/mo current</span>
              <span className={styles.arrow}>&rarr;</span>
              <span className={styles.action}>{r.recommendedAction}</span>
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className={styles.leadCapture}>
          <h3 className={styles.captureTitle}>
            {isHighSavings ? 'Big savings found. Let us help you claim them.' : 'Get this report emailed and stay updated.'}
          </h3>
          <form onSubmit={handleCapture} className={styles.captureForm}>
            <input type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.captureInput} />
            <input type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} className={styles.captureInput} />
            <button type="submit" disabled={loading} className={styles.captureBtn}>
              {loading ? 'Saving...' : isHighSavings ? 'Book Consultation' : 'Email My Report'}
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.successBlock}>
          <span className={styles.checkmark}>&#10003;</span>
          <h3>Audit saved!</h3>
          {shareUrl && (
            <>
              <p className={styles.shareLabel}>Your shareable link:</p>
              <a href={shareUrl} target="_blank" rel="noreferrer" className={styles.shareLink}>{shareUrl}</a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
