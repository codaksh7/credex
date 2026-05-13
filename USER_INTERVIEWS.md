# User Interviews

## Interview 1: Mr Keshav Bhardwaj, VP of Engineering at a Series B Fintech
- **Direct Quotes:**
  - "We just bought Copilot Enterprise for everyone because Microsoft bundled it, but I bet half the team uses Cursor on their personal cards and expenses it."
  - "I look at the AWS bill, but the SaaS sprawl for AI tools is completely hidden in Ramp."
  - "If you tell me I can save $2k a month, I'll listen. If you tell me it's $50, I don't have time."
- **Most surprising thing:** He cared more about *consolidating* tools (e.g., getting everyone on one standard tool) than just the raw dollar savings.
- **What it changed:** Added logic to the audit engine to recommend standardizing on Cursor for coding rather than splitting between Claude and Copilot.

## Interview 2: Nishant Maurya, Founder/CEO at a Seed Stage AI Startup
- **Direct Quotes:**
  - "We spend so much on Anthropic API direct, but we also have ChatGPT Plus for the non-technical staff."
  - "I don't even know what 'Team' tier gets us over 'Plus' right now."
  - "I wouldn't connect my company's AWS billing account to a random tool, but I'll manually type in my spend if it's 4 fields."
- **Most surprising thing:** Extreme hesitation around OAuth/API integrations for billing.
- **What it changed:** Validated the decision to use a manual, frictionless form without requiring a login or OAuth connection to their billing provider.

## Interview 3: Blaise, Staff Engineer at a Series A SaaS
- **Direct Quotes:**
  - "My CTO asked me to audit our AI spend last week, and I literally built a Google Sheet for it."
  - "I don't trust AI to do the math, show me exactly *why* you think we should downgrade."
  - "If this generates a PDF I can drop in Slack, that's the killer feature."
- **Most surprising thing:** The need for defensible, transparent math.
- **What it changed:** Ensured the Audit Results page explicitly shows the *reason* for the recommendation, not just a black-box savings number.
