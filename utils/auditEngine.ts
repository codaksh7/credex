import { ToolInput, UseCase } from '../store/useAuditStore';

export interface AuditResult {
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export const analyzeSpend = (tools: ToolInput[], teamSize: number, primaryUseCase: UseCase): AuditResult[] => {
  const results: AuditResult[] = [];

  tools.forEach(tool => {
    let savings = 0;
    let recommendedAction = 'Keep current plan';
    let reason = "You're spending well. No immediate optimization found.";

    // Logic for Cursor
    if (tool.name === 'Cursor') {
      if (tool.plan === 'Business' && tool.seats < 5) {
        savings = tool.monthlySpend - (tool.seats * 20); // Switch to Pro
        recommendedAction = 'Downgrade to Pro';
        reason = `Business plan requires minimum 5 seats for maximum value. For ${tool.seats} users, Pro is sufficient.`;
      }
    }

    // Logic for GitHub Copilot
    if (tool.name === 'GitHub Copilot') {
      if (tool.plan === 'Enterprise' && teamSize < 20) {
        savings = tool.monthlySpend - (tool.seats * 19); // Switch to Business
        recommendedAction = 'Downgrade to Business';
        reason = `Enterprise features (like custom models) are rarely utilized effectively by teams smaller than 20.`;
      }
    }

    // Logic for Claude
    if (tool.name === 'Claude') {
      if (tool.plan === 'Team' && tool.seats < 5) {
        savings = tool.monthlySpend - (tool.seats * 20); // Switch to Pro
        recommendedAction = 'Downgrade to Pro';
        reason = `Claude Team plan is optimized for larger groups. Individual Pro accounts are cheaper for ${tool.seats} seats.`;
      } else if (primaryUseCase === 'coding' && tool.plan === 'Pro' && !tools.some(t => t.name === 'Cursor')) {
        savings = 0;
        recommendedAction = 'Switch to Cursor';
        reason = `For coding, Cursor provides better native IDE integration than Claude web UI for the same $20 price point.`;
      }
    }

    // Logic for ChatGPT
    if (tool.name === 'ChatGPT') {
      if (tool.plan === 'Team' && tool.seats < 3) {
         savings = tool.monthlySpend - (tool.seats * 20);
         recommendedAction = 'Downgrade to Plus';
         reason = `Team workspace features aren't cost-effective for fewer than 3 seats compared to individual Plus accounts.`;
      }
    }

    // Credit Logic (Generic for all tools if spending is high)
    if (tool.monthlySpend >= 500 && savings === 0) {
      savings = Math.floor(tool.monthlySpend * 0.2); // Estimated 20% savings via Credex
      recommendedAction = 'Purchase through Credex Credits';
      reason = `You are paying retail. Credex can source discounted credits for this tool, saving you roughly 20%.`;
    }

    results.push({
      toolName: tool.name,
      currentSpend: tool.monthlySpend,
      recommendedAction,
      savings,
      reason
    });
  });

  return results;
}
