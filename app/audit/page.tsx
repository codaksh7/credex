'use client';

import { useState, useEffect } from 'react';
import { useAuditStore } from '@/store/useAuditStore';
import SpendForm from '@/components/SpendForm';
import AuditResults from '@/components/AuditResults';
import Navbar from '@/components/Navbar';
import InteractiveGrid from '@/components/InteractiveGrid';

export default function AuditPage() {
  const { tools } = useAuditStore();
  const [view, setView] = useState<'form' | 'results'>('form');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <InteractiveGrid />
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
        {view === 'form' ? (
          <SpendForm onComplete={() => setView('results')} />
        ) : (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <button
              onClick={() => setView('form')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              &#8592; Edit Stack
            </button>
            <AuditResults />
          </div>
        )}
      </main>
    </>
  );
}
