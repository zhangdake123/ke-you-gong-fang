/**
 * 课游工坊 — 主应用组件
 *
 * 教师工作台 UI 主框架：
 * - 顶部标题栏
 * - 左侧步骤导航（StepNav）
 * - 右侧主面板（根据 currentStep 渲染对应组件）
 * - 底部上一步/下一步操作按钮
 */
import './games/index'; // 注册所有游戏模板（其他 agent 开发）
import { useState } from 'react';
import { useAppStore, type AppStep } from './store/useAppStore';
import { Button } from './components/common/Button';
import { StepNav } from './components/common/StepNav';
import { InputPanel } from './components/teacher/InputPanel';
import { QuestionEditor } from './components/teacher/QuestionEditor';
import { GameSelector } from './components/teacher/GameSelector';
import { GamePreview } from './components/teacher/GamePreview';
import { ExportPanel } from './components/teacher/ExportPanel';
import { ScoreReportViewer } from './components/teacher/ScoreReportViewer';
import { BankManager } from './components/teacher/BankManager';

/** 步骤顺序 */
const STEPS: AppStep[] = ['input', 'edit', 'select', 'preview', 'export'];

/** 各步骤的「下一步」按钮文字 */
const NEXT_LABELS: Record<AppStep, string> = {
  input: '下一步',
  edit: '下一步',
  select: '下一步',
  preview: '下一步',
  export: '完成',
};

function App() {
  // 全局状态
  const currentStep = useAppStore((s) => s.currentStep);
  const setStep = useAppStore((s) => s.setStep);
  const selectedGameId = useAppStore((s) => s.selectedGameId);

  // 成绩查询模态框
  const [showScoreModal, setShowScoreModal] = useState(false);
  // 题库管理模态框
  const [showBankModal, setShowBankModal] = useState(false);

  const currentIndex = STEPS.indexOf(currentStep);

  // 上一步
  const handlePrev = () => {
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    }
  };

  // 下一步
  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  };

  // 上一步按钮是否禁用
  const prevDisabled = currentStep === 'input';

  // 下一步按钮是否禁用
  const nextDisabled =
    currentStep === 'input' || // 输入步骤由 InputPanel 的「生成题目」按钮推进
    currentStep === 'export' || // 最后一步无下一步
    (currentStep === 'select' && !selectedGameId); // 选择游戏步骤需要先选中游戏

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ========== 顶部标题栏 ========== */}
      <header className="flex items-center px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
            课
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            课游工坊
            <span className="ml-2 text-sm font-normal text-gray-400">
              课堂互动游戏生成器
            </span>
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                setShowBankModal(!showBankModal);
              }}
              className="px-4 py-2 text-sm text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors font-medium"
            >
              📚 题库管理
            </button>
            <button
              onClick={() => {
                setShowScoreModal(!showScoreModal);
              }}
              className="px-4 py-2 text-sm text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors font-medium"
            >
              📊 查询成绩
            </button>
          </div>
        </div>
      </header>

      {/* 成绩查询模态框 */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">成绩查询</h2>
              <button
                onClick={() => setShowScoreModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <ScoreReportViewer />
            </div>
          </div>
        </div>
      )}

      {/* 题库管理模态框 */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">题库管理</h2>
              <button
                onClick={() => setShowBankModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <BankManager />
            </div>
          </div>
        </div>
      )}

      {/* ========== 主内容区 ========== */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧步骤导航 */}
        <StepNav />

        {/* 右侧主面板 */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentStep === 'input' && <InputPanel />}
          {currentStep === 'edit' && <QuestionEditor />}
          {currentStep === 'select' && <GameSelector />}
          {currentStep === 'preview' && <GamePreview />}
          {currentStep === 'export' && <ExportPanel />}
        </main>
      </div>

      {/* ========== 底部操作栏 ========== */}
      <footer className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 flex-shrink-0">
        <Button variant="secondary" onClick={handlePrev} disabled={prevDisabled}>
          上一步
        </Button>
        <span className="text-sm text-gray-400">
          步骤 {currentIndex + 1} / {STEPS.length}
        </span>
        <Button onClick={handleNext} disabled={nextDisabled}>
          {NEXT_LABELS[currentStep]}
        </Button>
      </footer>
    </div>
  );
}

export default App;
