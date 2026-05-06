import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToolName = 'Cursor' | 'GitHub Copilot' | 'Claude' | 'ChatGPT' | 'Gemini' | 'Windsurf' | 'Anthropic API' | 'OpenAI API';
export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolInput {
  name: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditState {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: UseCase;
  addTool: (tool: ToolInput) => void;
  updateTool: (index: number, tool: ToolInput) => void;
  removeTool: (index: number) => void;
  setTeamSize: (size: number) => void;
  setUseCase: (useCase: UseCase) => void;
  reset: () => void;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      tools: [],
      teamSize: 1,
      primaryUseCase: 'mixed',
      addTool: (tool) => set((state) => ({ tools: [...state.tools, tool] })),
      updateTool: (index, tool) =>
        set((state) => {
          const newTools = [...state.tools];
          newTools[index] = tool;
          return { tools: newTools };
        }),
      removeTool: (index) =>
        set((state) => ({
          tools: state.tools.filter((_, i) => i !== index),
        })),
      setTeamSize: (teamSize) => set({ teamSize }),
      setUseCase: (primaryUseCase) => set({ primaryUseCase }),
      reset: () => set({ tools: [], teamSize: 1, primaryUseCase: 'mixed' }),
    }),
    {
      name: 'audit-storage',
    }
  )
);
