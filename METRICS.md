# Product Metrics

**Single North Star metric:**
**Audits with >$500/mo Identified Savings**
*Why:* A raw "Audit Completed" metric includes single-dev hobbyists who can't buy credits. "Identified Savings >$500" proves we successfully targeted our ICP (Series A/B teams) and delivered enough value to warrant a Credex sales conversation.

**3 Input metrics that drive the North Star:**
1. **Visitor-to-Audit Conversion Rate:** Measures how frictionless the GSAP UI is.
2. **Average Seats per Audit:** If this number is <5, our GTM distribution is failing to reach the target CTO persona.
3. **Report Share Rate:** Percentage of users who copy their shareable URL. Drives viral B2B loops.

**What I'd instrument first:**
I would instrument PostHog to track the exact drop-off point in the `SpendForm` input fields. E.g., do they quit when asked for "Monthly Spend" because they have to look it up?

**What number triggers a pivot decision:**
If the **Visitor-to-Audit Conversion Rate falls below 5%** after 1,000 visitors, we pivot. It means the "frictionless" promise isn't working, and we might need to build a browser extension or Slack bot to pull data automatically instead of relying on manual input.
