/**
 * 游戏选择面板（第三步）
 *
 * 显示所有已注册的游戏模板（卡片形式）。
 * 根据当前题目内容推荐的游戏高亮显示。
 * 跨模块依赖：games/registry（其他 agent 开发）
 */
import { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getAllGames, getRecommendedGames } from '../../games/registry';

/** 题型短标签 */
const TYPE_LABELS: Record<string, string> = {
  choice: '选择',
  truefalse: '判断',
  matching: '配对',
  memory: '记忆',
};

export function GameSelector() {
  // 全局状态——读取
  const questions = useAppStore((s) => s.questions);
  const pairs = useAppStore((s) => s.pairs);
  const contentType = useAppStore((s) => s.contentType);
  const title = useAppStore((s) => s.title);
  const selectedGameId = useAppStore((s) => s.selectedGameId);

  // 全局状态——动作
  const setSelectedGameId = useAppStore((s) => s.setSelectedGameId);

  // 所有已注册游戏
  const allGames = useMemo(() => getAllGames(), []);

  // 推荐游戏
  const recommendedGames = useMemo(
    () =>
      getRecommendedGames({
        title,
        questions,
        pairs,
        contentType,
      }),
    [title, questions, pairs, contentType],
  );

  // 推荐 ID 集合
  const recommendedIds = useMemo(
    () => new Set(recommendedGames.map((g) => g.id)),
    [recommendedGames],
  );

  // 当前内容总项数
  const totalItems = questions.length + pairs.length;

  // 无游戏模板
  if (allGames.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
          <p className="text-gray-400 text-sm">暂无游戏模板，请等待游戏模块加载完成</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          选择游戏模板
        </h3>
        <span className="text-sm text-gray-400">
          共 {allGames.length} 个模板
          {recommendedIds.size > 0 && `，${recommendedIds.size} 个推荐`}
        </span>
      </div>

      {/* 游戏卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allGames.map((game) => {
          const isSelected = selectedGameId === game.id;
          const isRecommended = recommendedIds.has(game.id);
          const meetsMinimum = totalItems >= game.minItems;

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelectedGameId(game.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200'
                  : isRecommended
                    ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
                    : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* 头部：图标 + 名称 + 标签 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{game.icon}</span>
                  <h4 className="font-semibold text-gray-800">{game.name}</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  {isRecommended && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      ★ 推荐
                    </span>
                  )}
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">
                      已选
                    </span>
                  )}
                </div>
              </div>

              {/* 描述 */}
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                {game.description}
              </p>

              {/* 支持题型 */}
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <span className="text-xs text-gray-400">支持题型:</span>
                {game.supportedTypes.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                  >
                    {TYPE_LABELS[t] ?? t}
                  </span>
                ))}
              </div>

              {/* 最低数量要求 */}
              {!meetsMinimum && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠ 需要至少 {game.minItems} 项内容（当前 {totalItems} 项）
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* 未选择提示 */}
      {!selectedGameId && (
        <p className="text-center text-sm text-gray-400 pt-2">
          请选择一个游戏模板后点击「下一步」继续
        </p>
      )}
    </div>
  );
}

export default GameSelector;
