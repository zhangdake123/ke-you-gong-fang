/**
 * 步骤导航组件
 *
 * 显示 5 个流程步骤，当前步骤高亮，已完成步骤打勾。
 * 点击已完成步骤可跳转。
 * 跨模块调用方：src/App.tsx
 */
import { useAppStore, type AppStep } from '../../store/useAppStore';

/** 步骤定义 */
const STEPS: { key: AppStep; label: string; desc: string }[] = [
  { key: 'input', label: '输入配置', desc: '设置学科与题目参数' },
  { key: 'edit', label: '题目编辑', desc: '编辑生成的题目' },
  { key: 'select', label: '选择游戏', desc: '选择游戏模板' },
  { key: 'preview', label: '预览', desc: '预览游戏效果' },
  { key: 'export', label: '导出', desc: '导出 HTML 文件' },
];

/** 步骤顺序，用于比较前后 */
const STEP_ORDER: AppStep[] = ['input', 'edit', 'select', 'preview', 'export'];

export function StepNav() {
  const currentStep = useAppStore((s) => s.currentStep);
  const setStep = useAppStore((s) => s.setStep);

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <nav className="w-60 bg-white border-r border-gray-200 p-4 flex flex-col gap-1 flex-shrink-0">
      <div className="mb-3 px-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          制作流程
        </h2>
      </div>
      {STEPS.map((step, index) => {
        const isCurrent = step.key === currentStep;
        const isCompleted = index < currentIndex;
        const canClick = isCompleted;

        return (
          <button
            key={step.key}
            disabled={!canClick}
            onClick={() => canClick && setStep(step.key)}
            className={`flex items-start gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors
              ${isCurrent ? 'bg-brand-50 text-brand-700' : ''}
              ${isCompleted ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : ''}
              ${!isCurrent && !isCompleted ? 'text-gray-400 cursor-default' : ''}
            `}
          >
            <span
              className={`flex items-center justify-center flex-shrink-0 w-7 h-7 rounded-full text-xs font-semibold
                ${isCurrent ? 'bg-brand-600 text-white' : ''}
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${!isCurrent && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
              `}
            >
              {isCompleted ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <div className="flex flex-col">
              <span
                className={`text-sm ${isCurrent ? 'font-semibold' : 'font-medium'}`}
              >
                {step.label}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">{step.desc}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

export default StepNav;
