/**
 * 游戏选择器
 *
 * 展示所有已注册的游戏模板，不阻塞任何游戏。
 * 不适合当前内容的游戏显示黄色提示，但仍可正常选择。
 * 支持一键加载示例数据预览效果。
 *
 * 跨模块依赖：games/registry（游戏模板注册表）、store/useAppStore
 */
import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useBankStore } from '../../store/useBankStore';
import { getAllGames, getGameWarnings, getRecommendedGames, getGamesByType } from '../../games/registry';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { SAMPLE_DATA } from '../../data/samples';

/** 游戏类型标签 */
const TYPE_LABELS: Record<string, string> = {
  choice: '选择题',
  truefalse: '判断题',
  matching: '配对题',
  memory: '记忆题',
  ordering: '排序题',
};

export function GameSelector() {
  // 全局状态
  const title = useAppStore((s) => s.title);
  const questions = useAppStore((s) => s.questions);
  const pairs = useAppStore((s) => s.pairs);
  const contentType = useAppStore((s) => s.contentType);
  const selectedGameId = useAppStore((s) => s.selectedGameId);
  const setSelectedGameId = useAppStore((s) => s.setSelectedGameId);
  const setStep = useAppStore((s) => s.setStep);
  const setQuestions = useAppStore((s) => s.setQuestions);
  const setPairs = useAppStore((s) => s.setPairs);

  // 当前内容
  const content = useMemo(
    () => ({ title, questions, pairs, contentType }),
    [title, questions, pairs, contentType],
  );

  // 所有游戏 + 警告 + 推荐
  const allGames = useMemo(() => getAllGames(), []);
  const warnings = useMemo(() => getGameWarnings(content), [content]);
  const recommendedIds = useMemo(() => getRecommendedGames(content), [content]);

  // 获取游戏对应的题型标签
  const getTypeLabels = (game: typeof allGames[0]) => {
    return game.supportedTypes.map((t) => TYPE_LABELS[t] || t).join('、');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        选择游戏模式
      </h2>
      <p className="text-sm text-gray-500">
        选择一个游戏模板来呈现你的题目。所有游戏都可用，不适配的内容会显示提示。
      </p>

      {/* 游戏列表 */}
      <div className="grid gap-4">
        {allGames.map((game) => {
          const isSelected = selectedGameId === game.id;
          const isRecommended = recommendedIds.includes(game.id);
          const warning = warnings.find((w) => w.gameId === game.id);

          return (
            <Card
              key={game.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-brand-600' : ''
              }`}
              onClick={() => setSelectedGameId(game.id)}
            >
              <div className="flex items-start gap-4">
                {/* 图标 */}
                <div className="text-4xl flex-shrink-0">{game.icon}</div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {game.name}
                    </h3>
                    {isRecommended && (
                      <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        推荐
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {game.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full">
                      支持：{getTypeLabels(game)}
                    </span>
                    {game.supportsScoreReport && (
                      <span className="px-2 py-0.5 text-xs text-purple-600 bg-purple-50 rounded-full">
                        评分报告
                      </span>
                    )}
                  </div>

                  {/* 警告提示 */}
                  {warning && (
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <span className="text-amber-500 text-xs mt-0.5">⚠️</span>
                      <p className="text-xs text-amber-700">
                        {warning.reason}（仍可选择）
                      </p>
                    </div>
                  )}
                </div>

                {/* 右侧操作 */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant={isSelected ? 'primary' : 'secondary'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGameId(game.id);
                    }}
                  >
                    {isSelected ? '已选择' : '选择'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 为该游戏支持的题型加载示例数据
                      const type = game.supportedTypes[0];
                      if (type === 'matching' || type === 'memory') {
                        setQuestions([]);
                        setPairs(SAMPLE_DATA[type]);
                      } else {
                        const samples = SAMPLE_DATA[type];
                        if ('length' in samples && samples.length > 0) {
                          setQuestions(samples as any);
                          setPairs([]);
                        }
                      }
                      setStep('preview');
                    }}
                    title="加载示例数据预览效果"
                  >
                    👀 预览
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default GameSelector;