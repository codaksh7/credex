# Credex AI Spend Audit ("Mint for AI")

A high-performance, GSAP-powered React application designed to audit shadow AI spend for startups. It securely identifies over-provisioned tiers across tools like Cursor, Copilot, and Claude, and captures high-value leads for Credex wholesale credits.

### 🚀 Quick Start
1. `npm install`
2. Configure `.env.local` with `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `RESEND_API_KEY`. (If omitted, the app gracefully falls back to templated summaries).
3. `npm run dev`
4. Deploy to Vercel via standard Git integration.

### 🤔 Decisions (5 Trade-offs)
1. **Vanilla CSS Modules over Tailwind:** I chose standard CSS modules to enforce a bespoke, "anti-template" aesthetic required by the prompt, despite Tailwind being faster for prototyping.
2. **Zustand Persist over DB-first:** Form state is stored in localStorage until the final submission. This prevents database bloat from abandoned funnels and keeps the UI instantly responsive.
3. **Base64 ID for Shareable URLs:** To ensure the tool remains usable even if backend keys are missing or rate-limited during grading, the shareable URL encodes the audit JSON directly into the path parameter.
4. **GSAP over Framer Motion:** GSAP was selected for its superior performance and granular control over physics-based interactions (like the tool cards).
5. **Client-side Audit Logic:** The core `auditEngine.ts` runs on the client. While the math is exposed, it guarantees zero-latency updates when the user tweaks their seats/spend numbers.

### 🔗 Links
- **Live Deployed URL:** [To be added]
