'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useAuditStore } from '@/store/useAuditStore';
import { analyzeSpend, AuditResult, TOOL_BENCHMARKS } from '@/utils/auditEngine';
import AISummary from './AISummary';
import styles from './AuditResults.module.css';


export default function AuditResults() {
  const router = useRouter();
  const { tools, teamSize, primaryUseCase } = useAuditStore();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [compareTools, setCompareTools] = useState<string[]>([]);
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

  const handleSwitch = () => {
    router.push('/audit');
  };

  const toggleCompare = (toolName: string) => {
    setCompareTools(prev =>
      prev.includes(toolName) ? prev.filter(t => t !== toolName) : prev.length < 3 ? [...prev, toolName] : prev
    );
  };

  const handleCompareModels = (currentTool: string, suggestedTool: string) => {
    setCompareTools([currentTool, suggestedTool]);
    const compareSec = document.getElementById('compare-section');
    if (compareSec) {
      compareSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHighSavings = totalMonthlySavings > 500;
  const allToolNames = Object.keys(TOOL_BENCHMARKS);

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
        <div className={styles.statChips}>
          <div className={styles.chip}>
            <span className={styles.chipValue}>{results.length}</span>
            <span className={styles.chipLabel}>Tools Audited</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipValue}>{results.filter(r => r.savings > 0).length}</span>
            <span className={styles.chipLabel}>Can Be Optimized</span>
          </div>
          <div className={styles.chip}>
            <span className={styles.chipValue}>{teamSize}</span>
            <span className={styles.chipLabel}>Team Members</span>
          </div>
        </div>
      </div>

      <AISummary results={results} teamSize={teamSize} primaryUseCase={primaryUseCase} />

      <div className={styles.breakdown}>
        <h3 className={styles.sectionTitle}>Per-Tool Breakdown</h3>
        {results.map((r, i) => {
          const bench = TOOL_BENCHMARKS[r.toolName];
          
          let suggestedTool: string | null = null;
          if (r.recommendedAction.startsWith('Switch to ')) suggestedTool = r.recommendedAction.replace('Switch to ', '');
          if (r.recommendedAction.startsWith('Upgrade to ')) suggestedTool = r.recommendedAction.replace('Upgrade to ', '');

          return (
            <div key={i} className={styles.resultItem}>
              <div className={styles.resultHeader}>
                <span className={styles.toolName}>{r.toolName}</span>
                <span className={r.savings > 0 ? styles.savingsTag : styles.optimalTag}>
                  {r.savings > 0 ? `Save $${r.savings}/mo` : 'Optimal'}
                </span>
              </div>
              <p className={styles.reason}>{r.reason}</p>
              {bench && (
                <div className={styles.benchRow}>
                  <div className={styles.benchItem}>
                    <span className={styles.benchLabel}>Quality</span>
                    <div className={styles.barWrap}>
                      <div className={styles.bar} style={{ width: `${bench.quality}%` }} />
                    </div>
                    <span className={styles.benchVal}>{bench.quality}%</span>
                  </div>
                  <div className={styles.benchItem}>
                    <span className={styles.benchLabel}>Speed</span>
                    <div className={styles.barWrap}>
                      <div className={styles.bar} style={{ width: `${bench.speed}%` }} />
                    </div>
                    <span className={styles.benchVal}>{bench.speed}%</span>
                  </div>
                  <div className={styles.benchItem}>
                    <span className={styles.benchLabel}>Cost/task</span>
                    <span className={styles.benchCost}>${bench.costPerTask}</span>
                  </div>
                </div>
              )}
              <div className={styles.actionRow}>
                <span className={styles.currentSpend}>${r.currentSpend}/mo current</span>
                <span className={styles.arrow}>&rarr;</span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button onClick={handleSwitch} className={styles.actionBtn}>
                    {r.recommendedAction}
                  </button>
                  {suggestedTool && (
                    <button 
                      onClick={() => handleCompareModels(r.toolName, suggestedTool!)} 
                      className={styles.compareBtnSecondary}
                    >
                      Compare Models
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div id="compare-section" className={styles.compareSection}>
        <h3 className={styles.sectionTitle}>Compare Tools</h3>
        <p className={styles.compareDesc}>Select up to 3 tools to compare side-by-side.</p>
        <div className={styles.compareChips}>
          {allToolNames.map(name => (
            <button
              key={name}
              className={`${styles.compareChip} ${compareTools.includes(name) ? styles.compareChipActive : ''}`}
              onClick={() => toggleCompare(name)}
            >
              {name}
            </button>
          ))}
        </div>
        {compareTools.length >= 2 && (
          <div className={styles.compareTable}>
            <div className={styles.compareRow}>
              <div className={styles.compareLabel} />
              {compareTools.map(name => (
                <div key={name} className={styles.compareHead}>{name}</div>
              ))}
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareLabel}>Price</div>
              {compareTools.map(name => {
                const b = TOOL_BENCHMARKS[name];
                return <div key={name} className={styles.compareCell}>${(b.costPerTask * 1000).toFixed(0)}/1K tasks</div>;
              })}
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareLabel}>Quality</div>
              {compareTools.map(name => {
                const b = TOOL_BENCHMARKS[name];
                const best = Math.max(...compareTools.map(n => TOOL_BENCHMARKS[n].quality));
                return (
                  <div key={name} className={`${styles.compareCell} ${b.quality === best ? styles.compareBest : ''}`}>
                    {b.quality}%
                  </div>
                );
              })}
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareLabel}>Speed</div>
              {compareTools.map(name => {
                const b = TOOL_BENCHMARKS[name];
                const best = Math.max(...compareTools.map(n => TOOL_BENCHMARKS[n].speed));
                return (
                  <div key={name} className={`${styles.compareCell} ${b.speed === best ? styles.compareBest : ''}`}>
                    {b.speed}%
                  </div>
                );
              })}
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareLabel}>Cost/task</div>
              {compareTools.map(name => {
                const b = TOOL_BENCHMARKS[name];
                const cheapest = Math.min(...compareTools.map(n => TOOL_BENCHMARKS[n].costPerTask));
                return (
                  <div key={name} className={`${styles.compareCell} ${b.costPerTask === cheapest ? styles.compareBest : ''}`}>
                    ${b.costPerTask}
                  </div>
                );
              })}
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareLabel}>Monthly (10 seats)</div>
              {compareTools.map(name => {
                const b = TOOL_BENCHMARKS[name];
                const monthly = Math.round(b.costPerTask * 10000);
                const cheapest = Math.min(...compareTools.map(n => Math.round(TOOL_BENCHMARKS[n].costPerTask * 10000)));
                return (
                  <div key={name} className={`${styles.compareCell} ${monthly === cheapest ? styles.compareBest : ''}`}>
                    ${monthly}/mo
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
