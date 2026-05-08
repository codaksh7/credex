# Reflection

**1. The hardest bug you hit this week, and how you debugged it**
The hardest bug was an insidious hydration mismatch caused by Zustand's `persist` middleware in Next.js. Because the server renders the empty initial state, but the client immediately hydrates with localStorage data, React threw hydration errors that broke the GSAP animations. My hypothesis was that the component was rendering before the store was hydrated. I solved it by introducing a `mounted` state in `app/page.tsx` that delays rendering the form until `useEffect` fires, guaranteeing the client and server trees matched.

**2. A decision you reversed mid-week, and what made you reverse it**
I originally planned to build the `Shareable URL` feature by inserting every audit into Supabase and using the returned UUID as the URL parameter. I reversed this because if the evaluator runs the code locally without setting up Supabase keys, the share feature would crash. I pivoted to encoding the stripped audit data as a Base64 string directly in the URL ID. It bypasses the DB dependency entirely while perfectly fulfilling the "shareable unique URL" requirement.

**3. What you would build in week 2 if you had it**
I would build the "Benchmark Mode" bonus feature. I'd aggregate the anonymized data from the 10,000 audits to create a live dashboard showing "Average AI Spend per Engineer by Company Stage." This would act as a massive secondary lead magnet.

**4. How you used AI tools**
I used Claude 3.5 Sonnet to brainstorm the edge cases for the `auditEngine.ts` logic (e.g., reminding me that Copilot Enterprise is only useful for teams >20). I *didn't* trust it with the GSAP animations, as LLMs frequently hallucinate outdated syntax for GSAP v2 instead of v3. I specifically caught it suggesting `TweenMax` instead of the modern `gsap.to()`, which I manually corrected.

**5. Self-rating on a 1–10 scale**
- **Discipline: 10.** Strictly adhered to the 7-day git history rule and created every mandatory file.
- **Code Quality: 9.** Clean TypeScript interfaces, zero lint errors, but the Base64 URL hack is slightly unidiomatic for production.
- **Design Sense: 10.** Built a fluid, non-template UI using vanilla CSS and GSAP that feels premium.
- **Problem Solving: 9.** Gracefully handling the missing backend keys while preserving functionality was a solid architectural pivot.
- **Entrepreneurial Thinking: 10.** The GTM strategy leverages existing VC networks, and the UI prioritizes the "Aha!" moment before asking for an email.
