import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: 'AI Spend Audit Result | Credex',
    description: 'See how much this team could save on their AI infrastructure stack with Credex.',
    openGraph: {
      title: 'AI Spend Audit Result | Credex',
      description: 'See how much this team could save on their AI infrastructure stack with Credex.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Spend Audit Result | Credex',
    },
  };
}

async function getAuditData(id: string) {
  const { data } = await supabase.from('audits').select('results, total_savings').eq('id', id).single();
  if (data) return data;

  try {
    const decoded = Buffer.from(id, 'base64url').toString('utf-8');
    const parsed = JSON.parse(decoded);
    return { results: parsed.results, total_savings: parsed.results.reduce((a: number, r: { savings: number }) => a + r.savings, 0) };
  } catch {
    return null;
  }
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const data = await getAuditData(id);

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#050505' }}>
        <h1>Audit not found</h1>
      </div>
    );
  }

  const totalSavings = data.total_savings || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem' }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke="#00e676" strokeWidth="2.5" />
            <path d="M10 14h8M14 10v8" stroke="#00e676" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>credex</span>
        </div>

        <div style={{ textAlign: 'center', padding: '3rem', background: '#0a0a0a', borderRadius: 20, border: '1px solid #1a1a1a', marginBottom: '2rem' }}>
          <p style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Anonymous Audit Result</p>
          <p style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#00e676', lineHeight: 1 }}>
            ${Number(totalSavings).toLocaleString()}
          </p>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>potential monthly savings</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(data.results || []).map((r: { toolName: string; savings: number; recommendedAction: string }, i: number) => (
            <div key={i} style={{ padding: '1.5rem', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1.05rem', margin: 0 }}>{r.toolName}</p>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{r.recommendedAction}</p>
              </div>
              {r.savings > 0 && (
                <span style={{ color: '#00e676', fontWeight: 600 }}>Save ${r.savings}/mo</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2.5rem', borderTop: '1px solid #1a1a1a' }}>
          <h3 style={{ marginBottom: '1rem' }}>Want to audit your own stack?</h3>
          <a href="/audit" style={{ display: 'inline-block', background: '#00e676', color: '#000', padding: '0.85rem 2rem', borderRadius: 60, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            Run Free Audit
          </a>
        </div>
      </div>
    </div>
  );
}
