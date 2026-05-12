# Credex — AI Spend Intelligence Platform

A premium, GSAP-powered Next.js application that audits shadow AI spending for startups. It identifies over-provisioned tiers across tools like Cursor, Copilot, Claude, ChatGPT, and more — then captures high-value leads for Credex wholesale credits.

## Features

- **Instant AI Audit** — Input your AI stack (tools, plans, seats, use cases) and get a detailed spend analysis in under 30 seconds
- **Dynamic Pricing Engine** — Automated cost calculations based on real tool + plan + seat combinations
- **Interactive Globe** — A Three.js wireframe globe that splits open on hover to reveal scrollable AI domain shells with orbiting tool rankings
- **Compare Models** — Side-by-side comparison table for any two AI tools with performance and cost metrics
- **AI-Powered Summaries** — Gemini-generated executive summaries with actionable recommendations
- **Shareable Reports** — One-click sharable audit links with Base64 fallback when database is unavailable
- **Email Reports** — Send audit results directly to any inbox via Resend integration

## Quick Start

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```

All variables are optional — the app gracefully falls back to templated summaries and Base64 URL encoding when keys are missing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules |
| Animations | GSAP, Three.js |
| State | Zustand (persisted) |
| Database | Supabase |
| AI | Google Gemini API |
| Email | Resend |

## Architecture

```
app/                    → Next.js pages and API routes
  audit/                → Multi-step audit wizard
  share/[id]/           → Shareable audit results page
  api/audit/            → Supabase storage endpoint
  api/summary/          → Gemini AI summary endpoint
components/             → React components with CSS modules
  WireframeSphere       → Interactive 3D globe with domain shells
  NetworkGraph          → AI ecosystem visualization
  AuditResults          → Audit output with compare functionality
  SpendForm             → Multi-step audit input wizard
utils/auditEngine.ts    → Client-side audit logic and benchmarks
store/useAuditStore.ts  → Zustand persistent state management
```

## Design Decisions

1. **Vanilla CSS Modules over Tailwind** — Enforces a bespoke, premium aesthetic with full control over animations and transitions
2. **Zustand Persist over DB-first** — Form state lives in localStorage until final submission, preventing database bloat from abandoned funnels
3. **Base64 ID for Shareable URLs** — Ensures the tool works even without backend keys by encoding audit JSON directly in the URL
4. **GSAP over Framer Motion** — Superior performance and granular control for physics-based interactions
5. **Client-side Audit Logic** — Zero-latency updates when users tweak their stack, with the trade-off of exposed calculation logic
6. **Hybrid Globe Architecture** — Three.js for the idle wireframe, pure CSS for the split animation and shell content, ensuring pixel-perfect responsive positioning

## Deployment

Deployed on Vercel at **[https://credex-beige.vercel.app](https://credex-beige.vercel.app)**

For your own deployment, set these environment variables in Vercel project settings:

- `NEXT_PUBLIC_BASE_URL` → Your production domain
- `NEXT_PUBLIC_SUPABASE_URL` → Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase anon key
- `GEMINI_API_KEY` → Google Gemini API key
- `RESEND_API_KEY` → Resend email API key

## License

MIT
