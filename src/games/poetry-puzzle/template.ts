/**
 * 诗句拼图 - 游戏模板
 *
 * 把诗句打乱，拖拽排列成正确的顺序。
 * 适合古诗词背诵练习。
 * 跨模块调用方：src/games/index.ts（注册入口）
 */
import type { GameTemplate } from '../../types';
import { generatePoetryPuzzleHTML } from './game.html';

/** 诗句拼图模板 */
export const poetryPuzzleTemplate: GameTemplate = {
  id: 'poetry-puzzle',
  name: '诗句拼图',
  description: '诗句打乱，拖拽排列成正确顺序，锻炼背诵记忆',
  icon: '📜',
  supportedTypes: ['ordering'],
  minItems: 1,
  supportsScoreReport: true,
  maxItemLength: 20,
  isBlocked: (content) => {
    const orderingQuestions = content.questions.filter((q) => q.type === 'ordering');
    if (orderingQuestions.length === 0) return true;
    // 每句太长不好玩，限制最大长度
    return orderingQuestions.some((q) => q.type === 'ordering' && q.segments.some((s) => s.length > 20));
  },
  blockReason: '诗句拼图需要排序题（诗句），且每个片段不超过 20 字',
  isRecommended: (content) => {
    const orderingQuestions = content.questions.filter((q) => q.type === 'ordering');
    return orderingQuestions.length >= 1;
  },
  generateHTML: (content, options) => generatePoetryPuzzleHTML(content, options),
};