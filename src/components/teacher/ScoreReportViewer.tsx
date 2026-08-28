/**
 * 评分报告查看器
 *
 * 老师输入验证码，查看学生游戏成绩。
 * 数据存储在 localStorage 中（游戏 HTML 保存的）。
 * 跨模块调用方：老师端主面板
 */
import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { ScoreReport } from '../../types';

/** 从 localStorage 获取所有报告 */
function getReports(): Record<string, ScoreReport> {
  try {
    return JSON.parse(localStorage.getItem('kygf_score_reports') || '{}');
  } catch {
    return {};
  }
}

export function ScoreReportViewer() {
  const [code, setCode] = useState('');
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allReports, setAllReports] = useState<ScoreReport[]>(() => {
    return Object.values(getReports());
  });

  const handleLookup = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('请输入验证码');
      return;
    }
    const reports = getReports();
    const found = reports[trimmed];
    if (found) {
      setReport(found);
      setError(null);
    } else {
      setError('未找到该验证码，请确认输入正确');
      setReport(null);
    }
  };

  const handleClearAll = () => {
    if (confirm('确定清空所有成绩记录？此操作不可恢复。')) {
      localStorage.removeItem('kygf_score_reports');
      setAllReports([]);
      setReport(null);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          查询成绩
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="输入学生提供的验证码"
            maxLength={8}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono tracking-widest uppercase focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
          <Button onClick={handleLookup}>查询</Button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </Card>

      {report && (
        <Card>
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            成绩报告
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-brand-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-brand-600">{report.score}</div>
              <div className="text-xs text-gray-500 mt-1">总分</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{Math.round(report.accuracy * 100)}%</div>
              <div className="text-xs text-gray-500 mt-1">正确率</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">游戏</span>
              <span className="font-medium">{report.gameName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">标题</span>
              <span className="font-medium">{report.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">答对</span>
              <span className="font-medium">{report.correctCount}/{report.totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">用时</span>
              <span className="font-medium">{report.timeSpent}秒</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">完成时间</span>
              <span className="font-medium">{formatTime(report.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">验证码</span>
              <span className="font-mono font-bold text-brand-600">{report.code}</span>
            </div>
          </div>
        </Card>
      )}

      {allReports.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              历史记录（{allReports.length} 条）
            </h3>
            <Button size="sm" variant="ghost" onClick={handleClearAll}>
              清空
            </Button>
          </div>
          <div className="space-y-2">
            {allReports.slice().reverse().map((r) => (
              <button
                key={r.code}
                type="button"
                onClick={() => {
                  setCode(r.code);
                  setReport(r);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div>
                  <span className="text-sm font-medium text-gray-700">{r.title}</span>
                  <span className="text-xs text-gray-400 ml-2">{r.gameName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-600">{r.score}分</span>
                  <span className="text-xs text-gray-400">{formatTime(r.timestamp)}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {!report && allReports.length === 0 && (
        <Card>
          <div className="text-center py-8 text-sm text-gray-400">
            暂无成绩记录。学生完成游戏后，将验证码发给您即可查询。
          </div>
        </Card>
      )}
    </div>
  );
}

export default ScoreReportViewer;