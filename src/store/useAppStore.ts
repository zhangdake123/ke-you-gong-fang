/**
 * 全局状态管理（Zustand）
 *
 * 跨模块调用的状态都在这里集中管理。
 * 组件通过 useAppStore() 读取和更新状态。
 */
import { create } from 'zustand';
import type {
  GameContent,
  Question,
  MatchPair,
  QuestionType,
  Difficulty,
  ExportOptions,
  QuestionRequest,
} from '../types';

/** 应用流程步骤 */
export type AppStep = 'input' | 'edit' | 'select' | 'preview' | 'export';

interface AppState {
  // 流程控制
  currentStep: AppStep;

  // 输入阶段
  questionRequest: QuestionRequest;
  aiEnabled: boolean;
  loading: boolean;
  error: string | null;

  // 编辑阶段
  questions: Question[];
  pairs: MatchPair[];
  contentType: QuestionType | 'mixed';
  title: string;

  // 游戏选择阶段
  selectedGameId: string | null;

  // 导出选项
  exportOptions: ExportOptions;

  // 动作
  setStep: (step: AppStep) => void;
  setQuestionRequest: (req: Partial<QuestionRequest>) => void;
  setAiEnabled: (enabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  setQuestions: (questions: Question[]) => void;
  updateQuestion: (id: string, patch: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  addQuestion: (q: Question) => void;

  setPairs: (pairs: MatchPair[]) => void;
  updatePair: (id: string, patch: Partial<MatchPair>) => void;
  deletePair: (id: string) => void;
  addPair: (pair: MatchPair) => void;

  setTitle: (title: string) => void;
  setContentType: (type: QuestionType | 'mixed') => void;
  setSelectedGameId: (id: string | null) => void;
  setExportOptions: (opts: Partial<ExportOptions>) => void;

  /** 获取当前内容数据（供游戏模板使用） */
  getGameContent: () => GameContent;

  /** 重置到初始状态 */
  reset: () => void;
}

const defaultExportOptions: ExportOptions = {
  shuffleQuestions: true,
  shuffleOptions: true,
  showTimer: true,
  theme: 'default',
  enableScoreReport: true,
  scorePassword: '',
};

const defaultQuestionRequest: QuestionRequest = {
  subject: 'chinese',
  grade: 3,
  semester: '上册',
  unit: '',
  lesson: '',
  content: '',
  questionType: 'choice',
  difficulty: 'medium',
  count: 5,
  webSearch: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  currentStep: 'input',
  questionRequest: defaultQuestionRequest,
  aiEnabled: true,
  loading: false,
  error: null,

  questions: [],
  pairs: [],
  contentType: 'mixed',
  title: '',

  selectedGameId: null,
  exportOptions: defaultExportOptions,

  setStep: (step) => set({ currentStep: step }),
  setQuestionRequest: (req) =>
    set((s) => ({ questionRequest: { ...s.questionRequest, ...req } })),
  setAiEnabled: (enabled) => set({ aiEnabled: enabled }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setQuestions: (questions) => set({ questions }),
  updateQuestion: (id, patch) =>
    set((s) => ({
      questions: s.questions.map((q) =>
        q.id === id ? ({ ...q, ...patch } as Question) : q
      ),
    })),
  deleteQuestion: (id) =>
    set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),
  addQuestion: (q) => set((s) => ({ questions: [...s.questions, q] })),

  setPairs: (pairs) => set({ pairs }),
  updatePair: (id, patch) =>
    set((s) => ({
      pairs: s.pairs.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  deletePair: (id) =>
    set((s) => ({ pairs: s.pairs.filter((p) => p.id !== id) })),
  addPair: (pair) => set((s) => ({ pairs: [...s.pairs, pair] })),

  setTitle: (title) => set({ title }),
  setContentType: (type) => set({ contentType: type }),
  setSelectedGameId: (id) => set({ selectedGameId: id }),
  setExportOptions: (opts) =>
    set((s) => ({ exportOptions: { ...s.exportOptions, ...opts } })),

  getGameContent: () => {
    const s = get();
    return {
      title: s.title,
      questions: s.questions,
      pairs: s.pairs,
      contentType: s.contentType,
    };
  },

  reset: () =>
    set({
      currentStep: 'input',
      questions: [],
      pairs: [],
      contentType: 'mixed',
      title: '',
      selectedGameId: null,
      error: null,
      loading: false,
      questionRequest: defaultQuestionRequest,
    }),
}));
