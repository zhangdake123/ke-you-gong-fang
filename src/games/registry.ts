/**
 * 游戏模板注册表
 *
 * 管理所有已注册的游戏模板，提供按 ID 查询、推荐匹配等功能。
 * 跨模块调用方：src/games/index.ts（注册入口）、src/engine/exporter/index.ts（导出引擎）
 */
import type { GameTemplate, GameContent } from '../types';

/** 游戏模板注册表 */
export const gameRegistry: Map<string, GameTemplate> = new Map();

/** 注册一个游戏模板 */
export function registerGame(template: GameTemplate): void {
  gameRegistry.set(template.id, template);
}

/**
 * 获取适合当前内容的推荐游戏模板列表。
 * 遍历所有已注册模板，返回 isRecommended 返回 true 的模板。
 */
export function getRecommendedGames(content: GameContent): GameTemplate[] {
  return Array.from(gameRegistry.values()).filter((t) => t.isRecommended(content));
}

/** 获取所有已注册的游戏模板 */
export function getAllGames(): GameTemplate[] {
  return Array.from(gameRegistry.values());
}
