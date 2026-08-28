/**
 * 连连看 - 游戏模板
 *
 * 实现 GameTemplate 接口，支持配对题型。
 * 跨模块调用方：src/games/index.ts（注册入口）
 */
import type { GameTemplate } from '../../types';
import { generateMatchingHTML } from './game.html';

/** 连连看模板 */
export const matchingTemplate: GameTemplate = {
  id: 'matching-game',
  name: '连连看',
  description: '左右配对连线，锻炼联想与记忆能力',
  icon: '🔗',
  supportedTypes: ['matching'],
  minItems: 5,
  isRecommended: (content) => content.pairs.length >= 5,
  generateHTML: (content, options) => generateMatchingHTML(content, options),
};
