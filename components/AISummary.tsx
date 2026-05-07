'use client';

import React, { useEffect, useState } from 'react';
import { AuditResult } from '@/utils/auditEngine';
import styles from './AISummary.module.css';

interface AISummaryProps {
  results: AuditResult[];
  teamSize: number;
  primaryUseCase: string;
}

export default function AISummary({ results, teamSize, primaryUseCase }: AISummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ results, teamSize, primaryUseCase })
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        // Graceful fallback if Anthropic API fails or keys are missing
        const totalSavings = results.reduce((acc, curr) => acc + curr.savings, 0);
        setSummary(`Based on our analysis for your ${teamSize}-person team focused on ${primaryUseCase}, you have a potential monthly savings of $${totalSavings}. Several of your current plans are over-provisioned for your usage level. We recommend reviewing the detailed breakdown below and adjusting your tiers to eliminate retail overspend.`);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [results, teamSize, primaryUseCase]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.pulse}>Analyzing your stack...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>AI Insight</h3>
      <p className={styles.text}>{summary}</p>
    </div>
  );
}
