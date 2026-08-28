/**
 * 游戏模块 - 统一注册入口
 *
 * 导入并注册所有内置游戏模板，统一导出注册表查询接口。
 * 跨模块调用方：src/engine/exporter/index.ts（导出引擎）
 */
import { registerGame } from './registry';
import { quizTemplate } from './quiz/template';
import { matchingTemplate } from './matching/template';
import { memoryTemplate } from './memory/template';
import { whackMoleTemplate } from './whack-mole/template';
import { poetryPuzzleTemplate } from './poetry-puzzle/template';

/* 注册所有内置游戏 */
registerGame(quizTemplate);
registerGame(matchingTemplate);
registerGame(memoryTemplate);
registerGame(whackMoleTemplate);
registerGame(poetryPuzzleTemplate);

/* 统一导出注册表查询接口 */
export { gameRegistry, getRecommendedGames, getAllGames, getAvailableGames, getBlockReason } from './registry';