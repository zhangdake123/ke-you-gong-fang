/**
 * 游戏模板注册表
 *
 * 管理所有已注册的游戏模板，提供按 ID 查询、推荐匹配等功能。
 * 所有游戏模板始终可见，不合适的游戏只显示提示而非阻塞。
 * 跨模块调用方：src/games/index.ts（注册入口）、src/engine/exporter/index.ts（导出引擎）
 */
import type { GameTemplate, GameContent } from '../types';

/** 游戏模板注册表 */
export const gameRegistry: Map<string, GameTemplate> = new Map();

/** 注册一个游戏模板 */
export function registerGame(template: GameTemplate): void {
  gameRegistry.set(template.id, template);
}

/** 获取所有已注册的游戏模板 */
export function getAllGames(): GameTemplate[] {
  return Array.from(gameRegistry.values());
}

/**
 * 获取推荐匹配当前内容的游戏模板列表。
 * 推荐基于模板的 isRecommended 方法，仅供参考。
 */
export function getRecommendedGames(content: GameContent): string[] {
  return Array.from(gameRegistry.values())
    .filter((t) => t.isRecommended(content))
    .map((t) => t.id);
}

/**
 * 获取不适合当前内容的游戏及其原因提示。
 * 返回 { gameId, reason } 列表，用于显示提示而非阻塞。
 */
export function getGameWarnings(content: GameContent): { gameId: string; reason: string }[] {
  const warnings: { gameId: string; reason: string }[] = [];
  for (const [id, game] of gameRegistry) {
    if (game.isBlocked(content)) {
      warnings.push({ gameId: id, reason: game.blockReason || '内容可能不太适合此游戏模式' });
    }
  }
  return warnings;
}

/**
 * 获取指定题型支持的游戏列表
 */
export function getGamesByType(questionType: string): GameTemplate[] {
  return Array.from(gameRegistry.values()).filter((t) =>
    t.supportedTypes.includes(questionType as any),
  );
}