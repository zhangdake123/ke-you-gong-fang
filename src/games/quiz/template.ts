/**
 * 闯关问答 - 游戏模板
 *
 * 实现 GameTemplate 接口，支持选择题和判断题。
 * 跨模块调用方：src/games/index.ts（注册入口）
 */
import type { GameTemplate } from '../../types';
import { generateQuizHTML } from './game.html';

/** 闯关问答模板 */
export const quizTemplate: GameTemplate = {
  id: 'quiz-adventure',
  name: '闯关问答',
  description: '逐题作答闯关，即时反馈解析，适合知识巩固',
  icon: '🎯',
  supportedTypes: ['choice', 'truefalse'],
  minItems: 3,
  isRecommended: (content) =>
    content.questions.some((q) => q.type === 'choice' || q.type === 'truefalse'),
  generateHTML: (content, options) => generateQuizHTML(content, options),
};
