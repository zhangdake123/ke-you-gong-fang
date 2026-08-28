/**
 * 题库状态管理（Zustand）
 *
 * 管理题库文件（文件夹）和条目，支持分类存储 + 抽题。
 * 跨模块调用方：InputPanel（抽题）、QuestionEditor（存题）
 */
import { create } from 'zustand';
import type { BankFile, BankEntry, GameContent, Question, MatchPair } from '../types';

/** 题库存储键名 */
const STORAGE_KEY = 'kygf_question_bank';

/** 从 localStorage 加载题库 */
function loadBanks(): BankFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultBanks();
  } catch {
    return getDefaultBanks();
  }
}

/** 保存题库到 localStorage */
function saveBanks(banks: BankFile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(banks));
}

/** 默认题库文件 */
function getDefaultBanks(): BankFile[] {
  return [
    {
      id: 'default',
      name: '默认题库',
      description: '自动保存的题目',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      entries: [],
    },
  ];
}

/** 生成唯一 ID */
function genId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 12);
}

interface BankState {
  /** 题库文件列表 */
  files: BankFile[];
  /** 当前选中的文件 ID */
  selectedFileId: string;
  /** 从题库抽题时的配置 */
  drawConfig: {
    fileId: string;
    entryIds: string[];
    count: number;
  };

  /** 加载题库 */
  loadBanks: () => void;
  /** 创建文件 */
  createFile: (name: string, description?: string) => BankFile;
  /** 删除文件 */
  deleteFile: (fileId: string) => void;
  /** 重命名文件 */
  renameFile: (fileId: string, name: string) => void;
  /** 保存当前题目到题库 */
  saveEntry: (title: string, content: GameContent, fileId?: string, tags?: string[]) => void;
  /** 删除条目 */
  deleteEntry: (fileId: string, entryId: string) => void;
  /** 从题库随机抽题 */
  drawQuestions: (fileId: string, count: number) => { questions: Question[]; pairs: MatchPair[] } | null;
  /** 设置抽题配置 */
  setDrawConfig: (config: Partial<BankState['drawConfig']>) => void;
  /** 设置选中的文件 */
  setSelectedFileId: (id: string) => void;
}

export const useBankStore = create<BankState>((set, get) => ({
  files: loadBanks(),
  selectedFileId: '',
  drawConfig: {
    fileId: '',
    entryIds: [],
    count: 5,
  },

  loadBanks: () => {
    set({ files: loadBanks() });
  },

  createFile: (name: string, description = '') => {
    const newFile: BankFile = {
      id: genId(),
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      entries: [],
    };
    set((s) => ({ files: [...s.files, newFile] }));
    saveBanks([...get().files]);
    return newFile;
  },

  deleteFile: (fileId: string) => {
    set((s) => ({ files: s.files.filter((f) => f.id !== fileId) }));
    saveBanks(get().files);
  },

  renameFile: (fileId: string, name: string) => {
    set((s) => ({
      files: s.files.map((f) =>
        f.id === fileId ? { ...f, name, updatedAt: Date.now() } : f,
      ),
    }));
    saveBanks(get().files);
  },

  saveEntry: (title: string, content: GameContent, fileId?: string, tags: string[] = []) => {
    const targetFileId = fileId || get().selectedFileId || 'default';
    const newEntry: BankEntry = {
      id: genId(),
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags,
    };
    set((s) => ({
      files: s.files.map((f) =>
        f.id === targetFileId
          ? { ...f, updatedAt: Date.now(), entries: [...f.entries, newEntry] }
          : f,
      ),
    }));
    saveBanks(get().files);
  },

  deleteEntry: (fileId: string, entryId: string) => {
    set((s) => ({
      files: s.files.map((f) =>
        f.id === fileId
          ? { ...f, entries: f.entries.filter((e) => e.id !== entryId) }
          : f,
      ),
    }));
    saveBanks(get().files);
  },

  drawQuestions: (fileId: string, count: number) => {
    const file = get().files.find((f) => f.id === fileId);
    if (!file || file.entries.length === 0) return null;

    // 合并所有条目的题目
    const allQuestions: Question[] = [];
    const allPairs: MatchPair[] = [];
    file.entries.forEach((entry) => {
      allQuestions.push(...entry.content.questions);
      allPairs.push(...entry.content.pairs);
    });

    // 随机抽取
    const shuffledQ = [...allQuestions].sort(() => Math.random() - 0.5);
    const shuffledP = [...allPairs].sort(() => Math.random() - 0.5);

    return {
      questions: shuffledQ.slice(0, count),
      pairs: shuffledP.slice(0, Math.ceil(count / 2)),
    };
  },

  setDrawConfig: (config) => {
    set((s) => ({ drawConfig: { ...s.drawConfig, ...config } }));
  },

  setSelectedFileId: (id: string) => {
    set({ selectedFileId: id });
  },
}));