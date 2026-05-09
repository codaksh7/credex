'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAuditStore, ToolName, UseCase, ToolUseCase } from '@/store/useAuditStore';
import styles from './SpendForm.module.css';

const TOOL_USE_CASES: ToolUseCase[] = [
  'Coding & IDE', 'Content Writing', 'Data Analysis', 'Academic Research', 
  'Market Research', 'Customer Support', 'Agentic Workflows', 
  'General Assistant', 'SEO & Marketing', 'Image Generation'
];

const AVAILABLE_TOOLS: { name: ToolName; plans: string[] }[] = [
  { name: 'Cursor', plans: ['Hobby', 'Pro', 'Business'] },
  { name: 'GitHub Copilot', plans: ['Individual', 'Business', 'Enterprise'] },
  { name: 'Claude', plans: ['Free', 'Pro', 'Team'] },
  { name: 'ChatGPT', plans: ['Plus', 'Team'] },
  { name: 'Gemini', plans: ['Advanced'] },
  { name: 'Windsurf', plans: ['Free', 'Pro'] },
  { name: 'Anthropic API', plans: ['Pay as you go'] },
  { name: 'OpenAI API', plans: ['Pay as you go'] },
];

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'writing', label: 'Writing' },
  { value: 'data', label: 'Data' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed' },
];

interface SpendFormProps {
  onComplete: () => void;
}

export default function SpendForm({ onComplete }: SpendFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const { tools, teamSize, primaryUseCase, addTool, removeTool, setTeamSize, setUseCase } = useAuditStore();

  const [selectedTool, setSelectedTool] = useState<ToolName>('Cursor');
  const [plan, setPlan] = useState('');
  const [spend, setSpend] = useState('');
  const [seats, setSeats] = useState('');
  const [toolUseCase, setToolUseCase] = useState<ToolUseCase>('Coding & IDE');

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    }
  }, []);

  const currentToolPlans = AVAILABLE_TOOLS.find(t => t.name === selectedTool)?.plans || [];

  useEffect(() => {
    setPlan(currentToolPlans[0] || '');
  }, [selectedTool]);

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !spend || !seats) return;
    addTool({ name: selectedTool, plan, monthlySpend: Number(spend), seats: Number(seats), useCase: toolUseCase });
    setSpend('');
    setSeats('');

    setTimeout(() => {
      const cards = document.querySelectorAll(`.${styles.toolCard}`);
      const lastCard = cards[cards.length - 1];
      if (lastCard) gsap.fromTo(lastCard, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
    }, 20);
  };

  return (
    <div className={styles.container} ref={formRef}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your AI Stack</h1>
        <p className={styles.subtitle}>Add each tool your team pays for. We will analyze the entire stack.</p>
      </div>

      <div className={styles.globalConfig}>
        <div className={styles.inputGroup}>
          <label htmlFor="teamSize">Team Size</label>
          <input id="teamSize" type="number" min="1" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="useCase">Primary Use Case</label>
          <div className={styles.useCaseGrid}>
            {USE_CASES.map(uc => (
              <button
                key={uc.value}
                type="button"
                className={`${styles.useCaseBtn} ${primaryUseCase === uc.value ? styles.useCaseActive : ''}`}
                onClick={() => setUseCase(uc.value)}
              >
                {uc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleAddTool} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="tool">Tool</label>
            <select id="tool" value={selectedTool} onChange={(e) => setSelectedTool(e.target.value as ToolName)} className={styles.input}>
              {AVAILABLE_TOOLS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="plan">Plan</label>
            <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className={styles.input}>
              {currentToolPlans.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="spend">Monthly Spend ($)</label>
            <input id="spend" type="number" min="0" value={spend} onChange={(e) => setSpend(e.target.value)} placeholder="0" className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="seats">Seats</label>
            <input id="seats" type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} placeholder="1" className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="toolUseCase">Use case:</label>
            <select id="toolUseCase" value={toolUseCase} onChange={(e) => setToolUseCase(e.target.value as ToolUseCase)} className={styles.input}>
              {TOOL_USE_CASES.map(uc => <option key={uc} value={uc}>{uc}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className={styles.addButton}>+ Add Tool</button>
      </form>

      {tools.length > 0 && (
        <div className={styles.toolsList}>
          {tools.map((t, idx) => (
            <div key={idx} className={styles.toolCard}>
              <div className={styles.toolCardTop}>
                <span className={styles.toolName}>{t.name}</span>
                <span className={styles.planBadge}>{t.plan}</span>
              </div>
              <div className={styles.toolCardBottom}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span>${t.monthlySpend}/mo &middot; {t.seats} {t.seats === 1 ? 'seat' : 'seats'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Use case: {t.useCase}</span>
                </div>
                <button onClick={() => removeTool(idx)} className={styles.removeButton}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tools.length > 0 && (
        <button onClick={onComplete} className={styles.generateBtn}>
          Generate Audit Report
        </button>
      )}
    </div>
  );
}
