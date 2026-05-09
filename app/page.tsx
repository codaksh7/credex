'use client';

import InteractiveGrid from '@/components/InteractiveGrid';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ScrollStats from '@/components/ScrollStats';
import HowItWorks from '@/components/HowItWorks';
import NetworkGraph from '@/components/NetworkGraph';
import ToolShowcase from '@/components/ToolShowcase';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import MagneticButton from '@/components/MagneticButton';

export default function Home() {
  return (
    <>
      <InteractiveGrid />
      <Navbar />
      <Hero />
      <ScrollStats />
      <HowItWorks />
      <NetworkGraph />
      <ToolShowcase />

      <section style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em'
        }}>
          Ready to find out?
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: 450, fontSize: '1rem' }}>
          Takes 30 seconds. No login, no billing API, no nonsense.
        </p>
        <MagneticButton href="/audit" variant="primary">
          Start Your Free Audit
        </MagneticButton>
      </section>

      <FAQ />
      <Footer />
    </>
  );
}
