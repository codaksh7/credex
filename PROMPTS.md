# LLM Prompts Used

## Personalized Summary Prompt
**Model:** Google Gemini 2.0 Flash (free tier)

**Prompt:**
```text
You are an expert financial auditor specializing in SaaS and AI infrastructure spend. 
Review the following AI tool audit for a startup with a team size of {teamSize} and a primary use case of '{primaryUseCase}'.

Audit Data:
{auditResultsJSON}

Write a personalized, actionable summary paragraph (strictly under 100 words). Be direct, highlight the biggest savings opportunity, and maintain a professional, slightly urgent tone. Do not use generic filler. Focus on the hard numbers and the specific tools they are using.
```

**Why I wrote it this way:**
I explicitly provided the team size and primary use case context so the LLM can tailor its advice (e.g., mentioning that for a team of 20, enterprise tiers are overkill). The constraint "strictly under 100 words" forces the model to avoid conversational fluff. I formatted the audit data as JSON because LLMs parse structured data exceptionally well without hallucinating numbers.

**What I tried that didn't work:**
Initially, I didn't enforce the 100-word limit or the "professional, slightly urgent tone," resulting in the model generating generic, overly polite 3-paragraph essays that ruined the UI layout. I also tried passing the entire tool list instead of just the audit results, but the LLM started suggesting tools they weren't even using. Restricting the input to only the `AuditResult` objects fixed the hallucination.

**Why Gemini over Anthropic:**
Originally planned to use Anthropic Claude 3 Haiku, but pivoted to Google Gemini 2.0 Flash because it offers a generous free tier (15 RPM, 1M tokens/day). For a lead-gen tool that needs to scale to hundreds of audits without billing concerns during launch, the zero-cost API was the pragmatic choice. Response quality is comparable for this structured summarization task.
