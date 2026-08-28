/**
 * 题目编辑面板（第二步）
 *
 * 显示所有生成的题目，支持编辑、删除、添加。
 * 选择题/判断题以卡片形式编辑，配对题/记忆题以表格形式编辑。
 * 底部显示题目总数和题型统计。
 */
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type {
  ChoiceQuestion,
  TrueFalseQuestion,
  Difficulty,
  MatchPair,
} from '../../types';

// ==================== 配置常量 ====================

/** 难度标签 */
const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

/** 难度列表 */
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/** 题型标签 */
const TYPE_LABELS: Record<string, string> = {
  choice: '选择题',
  truefalse: '判断题',
  matching: '配对题',
  memory: '记忆题',
};

/** 题型徽章颜色 */
const TYPE_BADGE_COLORS: Record<string, string> = {
  choice: 'bg-brand-100 text-brand-700',
  truefalse: 'bg-green-100 text-green-700',
};

/** 通用输入框样式 */
const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none';

// ==================== 组件 ====================

export function QuestionEditor() {
  // 全局状态——读取
  const questions = useAppStore((s) => s.questions);
  const pairs = useAppStore((s) => s.pairs);
  const contentType = useAppStore((s) => s.contentType);

  // 全局状态——动作
  const setQuestions = useAppStore((s) => s.setQuestions);
  const updateQuestion = useAppStore((s) => s.updateQuestion);
  const deleteQuestion = useAppStore((s) => s.deleteQuestion);
  const addQuestion = useAppStore((s) => s.addQuestion);
  const updatePair = useAppStore((s) => s.updatePair);
  const deletePair = useAppStore((s) => s.deletePair);
  const addPair = useAppStore((s) => s.addPair);

  // ==================== 事件处理 ====================

  /** 添加选择题 */
  const handleAddChoice = () => {
    const newQ: ChoiceQuestion = {
      id: crypto.randomUUID(),
      type: 'choice',
      difficulty: 'medium',
      question: '',
      options: ['', '', '', ''],
      answer: 0,
      explanation: '',
    };
    addQuestion(newQ);
  };

  /** 添加判断题 */
  const handleAddTrueFalse = () => {
    const newQ: TrueFalseQuestion = {
      id: crypto.randomUUID(),
      type: 'truefalse',
      difficulty: 'medium',
      question: '',
      answer: true,
      explanation: '',
    };
    addQuestion(newQ);
  };

  /** 添加选项（选择题） */
  const handleAddOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.type === 'choice'
          ? { ...q, options: [...q.options, ''] }
          : q,
      ),
    );
  };

  /** 删除选项（选择题） */
  const handleRemoveOption = (questionId: string, optIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || q.type !== 'choice') return q;
        if (q.options.length <= 2) return q; // 至少保留 2 个选项
        const newOptions = q.options.filter((_, i) => i !== optIndex);
        // 调整正确答案索引
        const newAnswer =
          q.answer === optIndex
            ? 0
            : q.answer > optIndex
              ? q.answer - 1
              : q.answer;
        return { ...q, options: newOptions, answer: newAnswer };
      }),
    );
  };

  /** 修改选项内容（选择题） */
  const handleOptionChange = (
    questionId: string,
    optIndex: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || q.type !== 'choice') return q;
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }),
    );
  };

  /** 添加配对 */
  const handleAddPair = () => {
    const newPair: MatchPair = {
      id: crypto.randomUUID(),
      left: '',
      right: '',
    };
    addPair(newPair);
  };

  // ==================== 统计 ====================

  const choiceCount = questions.filter((q) => q.type === 'choice').length;
  const truefalseCount = questions.filter(
    (q) => q.type === 'truefalse',
  ).length;
  const pairCount = pairs.length;
  const totalCount = questions.length + pairCount;

  // 是否显示配对区
  const showPairs =
    pairCount > 0 || contentType === 'matching' || contentType === 'memory';

  // ==================== 渲染 ====================

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* 题目列表 */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">题目列表</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleAddChoice}>
            + 选择题
          </Button>
          <Button size="sm" variant="secondary" onClick={handleAddTrueFalse}>
            + 判断题
          </Button>
        </div>
      </div>

      {/* 空状态 */}
      {questions.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-400 text-sm mb-4">暂无题目，请点击上方按钮添加</p>
        </Card>
      )}

      {/* 题目卡片 */}
      {questions.map((q, index) => (
        <Card key={q.id} className="space-y-4">
          {/* 卡片头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                {index + 1}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_BADGE_COLORS[q.type] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {TYPE_LABELS[q.type] ?? q.type}
              </span>
            </div>
            <button
              type="button"
              onClick={() => deleteQuestion(q.id)}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              删除
            </button>
          </div>

          {/* 题干 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              题干
            </label>
            <textarea
              value={q.question}
              onChange={(e) =>
                updateQuestion(q.id, { question: e.target.value })
              }
              rows={2}
              className={`${inputClass} resize-y`}
              placeholder="请输入题干内容"
            />
          </div>

          {/* 选择题选项 */}
          {q.type === 'choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选项（点击圆圈设置正确答案）
              </label>
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion(q.id, { answer: optIndex })
                      }
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        q.answer === optIndex
                          ? 'border-brand-600 bg-brand-600'
                          : 'border-gray-300 hover:border-brand-400'
                      }`}
                    >
                      {q.answer === optIndex && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </button>
                    <span className="flex-shrink-0 text-sm font-medium text-gray-500 w-5">
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <input
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(q.id, optIndex, e.target.value)
                      }
                      className={inputClass}
                      placeholder={`选项 ${String.fromCharCode(65 + optIndex)}`}
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(q.id, optIndex)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                        title="删除选项"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleAddOption(q.id)}
                className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                + 添加选项
              </button>
            </div>
          )}

          {/* 判断题答案 */}
          {q.type === 'truefalse' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                正确答案
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateQuestion(q.id, { answer: true })}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    q.answer
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  正确
                </button>
                <button
                  type="button"
                  onClick={() => updateQuestion(q.id, { answer: false })}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    !q.answer
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  错误
                </button>
              </div>
            </div>
          )}

          {/* 解析 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              解析<span className="text-gray-400 font-normal">（可选）</span>
            </label>
            <textarea
              value={q.explanation ?? ''}
              onChange={(e) =>
                updateQuestion(q.id, { explanation: e.target.value })
              }
              rows={2}
              className={`${inputClass} resize-y`}
              placeholder="题目解析，帮助学生理解"
            />
          </div>

          {/* 难度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              难度
            </label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => updateQuestion(q.id, { difficulty: d })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    q.difficulty === d
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>
        </Card>
      ))}

      {/* 配对内容表格 */}
      {showPairs && (
        <>
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-base font-semibold text-gray-800">
              配对内容
            </h3>
            <Button size="sm" variant="secondary" onClick={handleAddPair}>
              + 添加配对
            </Button>
          </div>
          <Card className="p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-gray-500 w-12">
                    #
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-gray-500">
                    左侧内容
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-gray-500">
                    右侧内容
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-gray-500 w-16">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, index) => (
                  <tr
                    key={pair.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-2 px-3 text-sm text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        value={pair.left}
                        onChange={(e) =>
                          updatePair(pair.id, { left: e.target.value })
                        }
                        className={inputClass}
                        placeholder="左侧内容"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        value={pair.right}
                        onChange={(e) =>
                          updatePair(pair.id, { right: e.target.value })
                        }
                        className={inputClass}
                        placeholder="右侧内容"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        type="button"
                        onClick={() => deletePair(pair.id)}
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pairs.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-400">
                暂无配对内容，请点击「添加配对」
              </div>
            )}
          </Card>
        </>
      )}

      {/* 统计信息 */}
      <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
        <span className="font-medium text-gray-700">
          共 {totalCount} 项
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">选择题 {choiceCount}</span>
        <span className="text-gray-600">判断题 {truefalseCount}</span>
        {pairCount > 0 && (
          <span className="text-gray-600">配对 {pairCount}</span>
        )}
      </div>
    </div>
  );
}

export default QuestionEditor;
