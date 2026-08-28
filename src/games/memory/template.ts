/**
 * 翻牌记忆 - 游戏模板
 *
 * 实现 GameTemplate 接口，支持记忆配对题型。
 * 跨模块调用方：src/games/index.ts（注册入口）
 */
import type { GameTemplate } from '../../types';
import { generateMemoryHTML } from './game.html';

/** 翻牌记忆模板 */
export const memoryTemplate: GameTemplate = {
  id: 'memory-card',
  name: '翻牌记忆',
  description: '翻牌找配对，锻炼记忆与专注力',
  icon: '🃏',
  supportedTypes: ['memory'],
  minItems: 6,
  supportsScoreReport: true,
  maxItemLength: 20,
  isBlocked: (content) => {
    if (content.pairs.length < 4) return true;
    // 必须偶数配对才能翻牌
    if (content.pairs.length % 2 !== 0) return true;
    const maxLen = content.pairs.reduce((max, p) => Math.max(max, p.left.length, p.right.length), 0);
    return maxLen > 20;
  },
  blockReason: '翻牌记忆需要至少 4 对（偶数对）配对，且每项文本不超过 20 字',
  isRecommended: (content) => content.pairs.length >= 6 && content.pairs.length % 2 === 0,
  generateHTML: (content, options) => generateMemoryHTML(content, options),
};