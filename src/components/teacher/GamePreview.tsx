/**
 * 游戏预览面板（第四步）
 *
 * 显示选中游戏的预览，提供导出选项开关。
 * 使用 iframe 加载游戏 HTML 预览。
 * 跨模块依赖：engine/exporter（已存在）
 */
import { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { generateGameHTML } from '../../engine/exporter';

export function GamePreview() {
  // 全局状态——读取
  const selectedGameId = useAppStore((s) => s.selectedGameId);
  const exportOptions = useAppStore((s) => s.exportOptions);
  const questions = useAppStore((s) => s.questions);
  const pairs = useAppStore((s) => s.pairs);
  const contentType = useAppStore((s) => s.contentType);
  const title = useAppStore((s) => s.title);

  // 全局状态——动作
  const setExportOptions = useAppStore((s) => s.setExportOptions);

  // 生成预览（HTML 和错误信息一次计算）
  const preview = useMemo(() => {
    if (!selectedGameId) return { html: '', error: null as string | null };
    const result = generateGameHTML(selectedGameId, {
      title,
      questions,
      pairs,
      contentType,
    }, exportOptions);
    return {
      html: result.success ? result.html ?? '' : '',
      error: result.success ? null : result.error ?? '预览生成失败',
    };
  }, [selectedGameId, title, questions, pairs, contentType, exportOptions]);

  // 未选择游戏
  if (!selectedGameId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-16 text-sm text-gray-400">
          请先在「选择游戏」步骤中选择一个游戏模板
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-6">
      {/* 导出选项 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          导出选项
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 题目乱序 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">题目乱序</span>
            <button
              type="button"
              onClick={() =>
                setExportOptions({
                  shuffleQuestions: !exportOptions.shuffleQuestions,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                exportOptions.shuffleQuestions
                  ? 'bg-brand-600'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  exportOptions.shuffleQuestions
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 选项乱序 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">选项乱序</span>
            <button
              type="button"
              onClick={() =>
                setExportOptions({
                  shuffleOptions: !exportOptions.shuffleOptions,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                exportOptions.shuffleOptions
                  ? 'bg-brand-600'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  exportOptions.shuffleOptions
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 显示计时 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">显示计时</span>
            <button
              type="button"
              onClick={() =>
                setExportOptions({
                  showTimer: !exportOptions.showTimer,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                exportOptions.showTimer ? 'bg-brand-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  exportOptions.showTimer
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 主题选择（预留） */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">主题</span>
            <select
              disabled
              value={exportOptions.theme}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            >
              <option value="default">默认主题</option>
            </select>
            <span className="text-xs text-gray-400">更多主题开发中</span>
          </div>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 ml-2">游戏预览</span>
        </div>
        {preview.error ? (
          <div className="p-8 text-center text-sm text-red-500">
            {preview.error}
          </div>
        ) : preview.html ? (
          <iframe
            srcDoc={preview.html}
            className="w-full h-[600px] border-0 bg-white"
            sandbox="allow-scripts"
            title="游戏预览"
          />
        ) : (
          <div className="p-8 text-center text-sm text-gray-400">
            正在生成预览…
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePreview;
