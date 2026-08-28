/**
 * 提示词配置统一导出
 *
 * 汇总所有学科的提示词配置，提供按学科获取配置的工厂函数。
 * 跨模块调用方：src/engine/ai/generator.ts（QuestionGenerator）、src/components/teacher/*
 */
import type { KnowledgePoint } from '../../../types';
import { chinesePrompts } from './chinese';
import { generalPrompts } from './general';

export { chinesePrompts, generalPrompts };

/** 提示词配置接口 */
export interface PromptConfig {
  /** 学科名称 */
  name: string;
  /** 支持的年级 */
  grades: number[];
  /** 知识点分类列表 */
  knowledgePoints: KnowledgePoint[];
  /** 难度等级列表 */
  difficulties: { id: string; name: string; desc: string }[];
  /** 系统提示词 */
  system: string;
  /** 各题型提示词模板（键为 QuestionType） */
  templates: Record<string, string>;
  /** 联网搜索模式的补充系统提示词 */
  webSearchSystem?: string;
  /** 构建 content 部分的函数 */
  buildContentSection?: (content: string, webSearch: boolean) => string;
  /** 课本内容在线来源 */
  textbookUrls?: string;
}

/** 学科提示词映射表 */
const promptConfigs: Record<string, PromptConfig> = {
  chinese: chinesePrompts,
  语文: chinesePrompts,
  general: generalPrompts,
  通用: generalPrompts,
};

/**
 * 根据学科 ID 或名称获取对应的提示词配置。
 * 未匹配到时回退到通用配置。
 * @param subject 学科 ID（如 'chinese'）或名称（如 '语文'）
 */
export function getPromptConfig(subject: string): PromptConfig {
  return promptConfigs[subject] ?? generalPrompts;
}
