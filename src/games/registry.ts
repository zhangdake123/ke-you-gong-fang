/**
 * 游戏模板注册表
 *
 * 管理所有已注册的游戏模板，提供按 ID 查询、推荐匹配、阻塞检测等功能。
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

/**
 * 获取当前内容可用的游戏模板列表（排除被阻塞的）。
 * 按推荐度排序：推荐的在前，其余在后。
 */
export function getAvailableGames(content: GameContent): GameTemplate[] {
  const all = Array.from(gameRegistry.values());
  const available = all.filter((t) => !t.isBlocked(content));
  const recommended = new Set(getRecommendedGames(content).map((g) => g.id));
  return available.sort((a, b) => {
    const aRec = recommended.has(a.id) ? 0 : 1;
    const bRec = recommended.has(b.id) ? 0 : 1;
    return aRec - bRec;
  });
}

/**
 * 获取某个游戏模板的阻塞原因
 */
export function getBlockReason(gameId: string, content: GameContent): string | null {
  const game = gameRegistry.get(gameId);
  if (!game) return '游戏模板不存在';
  if (game.isBlocked(content)) return game.blockReason ?? '不适合当前内容';
  return null;
}

/** 获取所有已注册的游戏模板 */
export function getAllGames(): GameTemplate[] {
  return Array.from(gameRegistry.values());
}