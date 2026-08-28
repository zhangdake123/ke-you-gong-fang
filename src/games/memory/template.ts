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
  isRecommended: (content) => content.pairs.length >= 6,
  generateHTML: (content, options) => generateMemoryHTML(content, options),
};
