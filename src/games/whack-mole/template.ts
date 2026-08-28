/**
 * 打地鼠 - 游戏模板
 *
 * 地鼠头顶跳出选项文字，学生快速点击正确答案。
 * 限制：只支持选择题，选项文字必须短（≤10字符）。
 * 跨模块调用方：src/games/index.ts（注册入口）
 */
import type { GameTemplate } from '../../types';
import { generateWhackMoleHTML } from './game.html';

/** 选项最大字符数（地鼠头上字太多看不清） */
const MAX_OPTION_LENGTH = 10;

/** 打地鼠模板 */
export const whackMoleTemplate: GameTemplate = {
  id: 'whack-mole',
  name: '打地鼠',
  description: '地鼠头顶跳出选项，快速点击正确答案，限时挑战',
  icon: '🔨',
  supportedTypes: ['choice'],
  minItems: 5,
  supportsScoreReport: true,
  maxItemLength: MAX_OPTION_LENGTH,
  isBlocked: (content) => {
    const choiceQuestions = content.questions.filter((q) => q.type === 'choice');
    if (choiceQuestions.length < 5) return true;
    // 检查是否有过长的选项或题干
    const hasLongText = choiceQuestions.some((q) => {
      if (q.question.length > 30) return true;
      return q.options.some((opt) => opt.length > MAX_OPTION_LENGTH);
    });
    return hasLongText;
  },
  blockReason: `打地鼠需要至少 5 道选择题，且每个选项不超过 ${MAX_OPTION_LENGTH} 字（地鼠头上字太多看不清）`,
  isRecommended: (content) => {
    const choiceQuestions = content.questions.filter((q) => q.type === 'choice');
    return choiceQuestions.length >= 5 && choiceQuestions.every((q) => q.options.every((opt) => opt.length <= MAX_OPTION_LENGTH));
  },
  generateHTML: (content, options) => generateWhackMoleHTML(content, options),
};