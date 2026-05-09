import { ToolInput, UseCase } from '../store/useAuditStore';

export interface AuditResult {
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export const TOOL_BENCHMARKS: Record<string, { quality: number; speed: number; costPerTask: number }> = {
  'Cursor': { quality: 93, speed: 95, costPerTask: 0.12 },
  'GitHub Copilot': { quality: 88, speed: 90, costPerTask: 0.15 },
  'Claude': { quality: 96, speed: 85, costPerTask: 0.08 },
  'ChatGPT': { quality: 90, speed: 92, costPerTask: 0.10 },
  'Gemini': { quality: 87, speed: 88, costPerTask: 0.09 },
  'Windsurf': { quality: 85, speed: 91, costPerTask: 0.11 },
  'Anthropic API': { quality: 96, speed: 80, costPerTask: 0.04 },
  'OpenAI API': { quality: 91, speed: 88, costPerTask: 0.05 },
};

export const PLAN_PRICES: Record<string, Record<string, number>> = {
  'Cursor': { 'Hobby': 0, 'Pro': 20, 'Business': 40 },
  'GitHub Copilot': { 'Individual': 19, 'Business': 19, 'Enterprise': 39 },
  'Claude': { 'Free': 0, 'Pro': 20, 'Team': 30 },
  'ChatGPT': { 'Plus': 20, 'Team': 30 },
  'Gemini': { 'Advanced': 20 },
  'Windsurf': { 'Free': 0, 'Pro': 15 },
  'Anthropic API': { 'Pay as you go': 50 }, 
  'OpenAI API': { 'Pay as you go': 50 },
};

export const analyzeSpend = (tools: ToolInput[], teamSize: number, primaryUseCase: UseCase): AuditResult[] => {
  const results: AuditResult[] = [];

  const bestByUseCase: Record<string, string> = {
    'Coding & IDE': 'Cursor',
    'Content Writing': 'Claude',
    'Data Analysis': 'ChatGPT',
    'Academic Research': 'Claude',
    'Market Research': 'ChatGPT',
    'Customer Support': 'Anthropic API',
    'Agentic Workflows': 'Windsurf',
    'General Assistant': 'ChatGPT',
    'SEO & Marketing': 'Claude',
    'Image Generation': 'ChatGPT'
  };

  tools.forEach(tool => {
    let savings = 0;
    let recommendedAction = 'Keep current plan';
    let reason = "You're spending well. No immediate optimization found.";

    // Fallback to ChatGPT if use case isn't mapped
    const bestToolForCase = tool.useCase ? bestByUseCase[tool.useCase] || 'ChatGPT' : 'ChatGPT';

    // 1. Check for Downgrade Opportunities (Over-provisioning)
    let isDowngrade = false;
    if (tool.name === 'GitHub Copilot' && tool.plan === 'Enterprise' && teamSize < 20) {
      savings = tool.monthlySpend - (tool.seats * 19); 
      recommendedAction = 'Downgrade to Business';
      reason = `Enterprise features are rarely utilized effectively by teams smaller than 20. Downgrading saves $${savings}/mo.`;
      isDowngrade = true;
    } else if (tool.name === 'Cursor' && tool.plan === 'Business' && tool.seats < 5) {
      savings = tool.monthlySpend - (tool.seats * 20); 
      recommendedAction = 'Downgrade to Pro';
      reason = `Business plan requires minimum 5 seats for maximum value. For ${tool.seats} users, Pro is sufficient, saving $${savings}/mo.`;
      isDowngrade = true;
    } else if (tool.name === 'Claude' && tool.plan === 'Team' && tool.seats < 5) {
      savings = tool.monthlySpend - (tool.seats * 20); 
      recommendedAction = 'Downgrade to Pro';
      reason = `Claude Team plan is optimized for larger groups. Individual Pro accounts are cheaper for ${tool.seats} seats, saving $${savings}/mo.`;
      isDowngrade = true;
    } else if (tool.name === 'ChatGPT' && tool.plan === 'Team' && tool.seats < 3) {
      savings = tool.monthlySpend - (tool.seats * 20);
      recommendedAction = 'Downgrade to Plus';
      reason = `Team workspace features aren't cost-effective for fewer than 3 seats compared to individual Plus accounts, saving $${savings}/mo.`;
      isDowngrade = true;
    }

    // 2. Check for Tool Switch (Better tool for the use case)
    if (!isDowngrade && tool.name !== bestToolForCase && TOOL_BENCHMARKS[bestToolForCase] && TOOL_BENCHMARKS[tool.name]) {
      const currentBench = TOOL_BENCHMARKS[tool.name];
      const recommendedBench = TOOL_BENCHMARKS[bestToolForCase];

      const currentMonthly = tool.monthlySpend;
      
      // Determine target monthly based on the recommended tool's Pro/Team tier
      let targetPricePerSeat = 20; // Default fallback
      if (PLAN_PRICES[bestToolForCase]) {
         const plans = PLAN_PRICES[bestToolForCase];
         if ('Pro' in plans) targetPricePerSeat = plans['Pro'];
         else if ('Plus' in plans) targetPricePerSeat = plans['Plus'];
         else if ('Advanced' in plans) targetPricePerSeat = plans['Advanced'];
         else if ('Pay as you go' in plans) targetPricePerSeat = plans['Pay as you go'];
         else if ('Business' in plans) targetPricePerSeat = plans['Business'];
      }
      
      const targetMonthly = tool.seats * targetPricePerSeat;

      if (currentMonthly > targetMonthly) {
        savings = currentMonthly - targetMonthly;
        recommendedAction = `Switch to ${bestToolForCase}`;
        reason = `For ${tool.useCase}, ${bestToolForCase} provides ${Math.max(0, recommendedBench.quality - currentBench.quality)}% better quality. Switching saves $${savings}/mo.`;
      } else if (currentMonthly === targetMonthly) {
        recommendedAction = `Switch to ${bestToolForCase}`;
        reason = `For ${tool.useCase}, ${bestToolForCase} provides better performance (${recommendedBench.quality}% quality vs ${currentBench.quality}%) for the same price.`;
      } else {
        const costIncrease = targetMonthly - currentMonthly;
        recommendedAction = `Upgrade to ${bestToolForCase}`;
        reason = `For ${tool.useCase}, ${bestToolForCase} boosts quality by ${Math.max(0, recommendedBench.quality - currentBench.quality)}% and speed by ${Math.max(0, recommendedBench.speed - currentBench.speed)}%. This upgrade costs $${costIncrease}/mo more but significantly improves output.`;
      }
    }

    // 3. Check for Credex Credits (If spending is high and no structural savings found)
    if (tool.monthlySpend >= 500 && savings === 0 && recommendedAction === 'Keep current plan') {
      savings = Math.floor(tool.monthlySpend * 0.2); 
      recommendedAction = 'Purchase through Credex Credits';
      reason = `Your team is configured optimally, but you are paying retail. Credex can source discounted credits for ${tool.name}, saving roughly 20% ($${savings}/mo).`;
    }

    results.push({
      toolName: tool.name,
      currentSpend: tool.monthlySpend,
      recommendedAction,
      savings: Math.max(0, savings), // ensure savings is never negative
      reason
    });
  });

  return results;
}
