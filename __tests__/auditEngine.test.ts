import { expect, test, describe } from 'vitest';
import { analyzeSpend } from '../utils/auditEngine';
import { ToolInput } from '../store/useAuditStore';

describe('Audit Engine Optimization Logic', () => {
  test('1. Cursor Business vs Pro Optimization', () => {
    const tools: ToolInput[] = [{ name: 'Cursor', plan: 'Business', monthlySpend: 160, seats: 4, useCase: 'Coding & IDE' }];
    const results = analyzeSpend(tools, 4, 'coding');
    expect(results[0].recommendedAction).toBe('Downgrade to Pro');
    expect(results[0].savings).toBe(80);
  });

  test('2. Claude Team Optimization', () => {
    const tools: ToolInput[] = [{ name: 'Claude', plan: 'Team', monthlySpend: 120, seats: 4, useCase: 'Content Writing' }];
    const results = analyzeSpend(tools, 4, 'mixed');
    expect(results[0].recommendedAction).toBe('Downgrade to Pro');
    expect(results[0].savings).toBe(40);
  });

  test('3. Copilot Enterprise Utilization', () => {
    const tools: ToolInput[] = [{ name: 'GitHub Copilot', plan: 'Enterprise', monthlySpend: 390, seats: 10, useCase: 'Coding & IDE' }];
    const results = analyzeSpend(tools, 10, 'coding');
    expect(results[0].recommendedAction).toBe('Downgrade to Business');
    expect(results[0].savings).toBe(200);
  });

  test('4. OpenAI API Switch Recommendation for General Assistant', () => {
    const tools: ToolInput[] = [{ name: 'OpenAI API', plan: 'Pay as you go', monthlySpend: 1000, seats: 10, useCase: 'General Assistant' }];
    const results = analyzeSpend(tools, 10, 'mixed');
    expect(results[0].recommendedAction).toBe('Switch to ChatGPT');
    expect(results[0].savings).toBe(800); // 1000 - (10 * 20)
  });

  test('5. Optimal Spend (No Savings)', () => {
    const tools: ToolInput[] = [{ name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1, useCase: 'Coding & IDE' }];
    const results = analyzeSpend(tools, 1, 'coding');
    expect(results[0].recommendedAction).toBe('Keep current plan');
    expect(results[0].savings).toBe(0);
  });
});
