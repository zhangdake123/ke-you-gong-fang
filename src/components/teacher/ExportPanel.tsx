/**
 * 导出面板（第五步）
 *
 * 显示导出选项摘要和敏感信息扫描结果，
 * 提供「下载游戏」和「返回首页」按钮。
 * 跨模块依赖：engine/exporter（已存在）
 */
import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  generateGameHTML,
  downloadHTML,
  safeFilename,
} from '../../engine/exporter';

export function ExportPanel() {
  // 全局状态——读取
  const selectedGameId = useAppStore((s) => s.selectedGameId);
  const exportOptions = useAppStore((s) => s.exportOptions);
  const setExportOptions = useAppStore((s) => s.setExportOptions);
  const questions = useAppStore((s) => s.questions);
  const pairs = useAppStore((s) => s.pairs);
  const contentType = useAppStore((s) => s.contentType);
  const title = useAppStore((s) => s.title);

  // 全局状态——动作
  const reset = useAppStore((s) => s.reset);
  const setStep = useAppStore((s) => s.setStep);

  // 本地状态
  const [exported, setExported] = useState(false);
  const [fileName, setFileName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // 生成导出结果（含敏感信息扫描）
  const exportResult = useMemo(() => {
    if (!selectedGameId) return null;
    return generateGameHTML(
      selectedGameId,
      { title, questions, pairs, contentType },
      exportOptions,
    );
  }, [selectedGameId, title, questions, pairs, contentType, exportOptions]);

  // 下载游戏
  const handleDownload = () => {
    setLocalError(null);

    if (!exportResult?.success || !exportResult.html) {
      setLocalError(exportResult?.error ?? '生成失败，请检查游戏模板');
      return;
    }

    const name = safeFilename(title);
    downloadHTML(exportResult.html, name);
    setFileName(name);
    setExported(true);
  };

  // 返回首页
  const handleReset = () => {
    reset();
  };

  // 返回上一步
  const handleBack = () => {
    setStep('preview');
  };

  // 未选择游戏
  if (!selectedGameId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16 text-sm text-gray-400">
          请先在「选择游戏」步骤中选择一个游戏模板
        </div>
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setStep('select')}>
            前往选择游戏
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">
      {/* 导出选项摘要 */}
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          导出摘要
        </h3>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">游戏标题</span>
            <span className="font-medium text-gray-700">
              {title || '未设置'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">题目数量</span>
            <span className="font-medium text-gray-700">
              {questions.length} 题
            </span>
          </div>
          {pairs.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">配对数量</span>
              <span className="font-medium text-gray-700">
                {pairs.length} 对
              </span>
            </div>
          )}
          <div className="border-t border-gray-100 my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">题目乱序</span>
            <span
              className={`font-medium ${exportOptions.shuffleQuestions ? 'text-brand-600' : 'text-gray-400'}`}
            >
              {exportOptions.shuffleQuestions ? '开启' : '关闭'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">选项乱序</span>
            <span
              className={`font-medium ${exportOptions.shuffleOptions ? 'text-brand-600' : 'text-gray-400'}`}
            >
              {exportOptions.shuffleOptions ? '开启' : '关闭'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">显示计时</span>
            <span
              className={`font-medium ${exportOptions.showTimer ? 'text-brand-600' : 'text-gray-400'}`}
            >
              {exportOptions.showTimer ? '开启' : '关闭'}
            </span>
          </div>
          <div className="border-t border-gray-100 my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">评分报告</span>
            <span
              className={`font-medium ${exportOptions.enableScoreReport ? 'text-brand-600' : 'text-gray-400'}`}
            >
              {exportOptions.enableScoreReport ? '开启' : '关闭'}
            </span>
          </div>
          {exportOptions.enableScoreReport && exportOptions.scorePassword && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">查询密码</span>
              <span className="font-mono text-sm text-brand-600">
                {exportOptions.scorePassword}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* 敏感信息扫描 */}
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          安全检查
        </h3>
        {exportResult && exportResult.warnings.length > 0 ? (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-700 mb-1">
                  检测到敏感信息
                </p>
                <ul className="space-y-0.5">
                  {exportResult.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-amber-600">
                      {w}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-500 mt-2">
                  建议修改后再导出，但仍可继续导出。
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-green-700">
                未检测到敏感信息，可以安全导出
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* 错误提示 */}
      {localError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{localError}</p>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {exported && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-700">导出成功！</p>
              <p className="text-xs text-green-600 mt-0.5">
                文件已下载：{fileName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                可直接在浏览器中打开该 HTML 文件运行游戏。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="secondary" onClick={handleBack}>
          上一步
        </Button>
        <div className="flex gap-3">
          <Button variant="primary" size="lg" onClick={handleDownload}>
            {exported ? '重新下载' : '下载游戏'}
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExportPanel;
