/**
 * 输入配置面板（第一步）
 *
 * 教师在此配置学科、年级、课本目录、题型、难度等参数，
 * 粘贴教学内容后点击「生成题目」。
 *
 * 依赖模块：
 * - data/textbooks — 课本目录数据
 * - engine/ai/prompts — AI 提示词配置
 * - engine/ai/provider — DeepSeek API Provider
 * - engine/ai/generator — AI 出题生成器
 * - engine/parser — 纯文本题目解析器
 */
import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useBankStore } from '../../store/useBankStore';
import { getGamesByType } from '../../games/registry';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { SAMPLE_DATA } from '../../data/samples';
// 课本数据（其他 agent 开发）
import { textbooks, getTextbooks } from '../../data/textbooks';
// AI 出题相关（其他 agent 开发）
import { getPromptConfig } from '../../engine/ai/prompts';
import { createDeepSeekProvider, getDeepSeekApiKey, saveDeepSeekApiKey } from '../../engine/ai/provider';
import { QuestionGenerator } from '../../engine/ai/generator';
// 规则解析（其他 agent 开发）
import { parsePlainText } from '../../engine/parser';
import type {
  KnowledgePoint,
  QuestionType,
  Difficulty,
  Semester,
  MatchPair,
  Question,
} from '../../types';

// ==================== 配置常量 ====================

/** 学科列表 */
const SUBJECTS = [
  { id: 'chinese', name: '语文' },
  { id: 'general', name: '通用' },
];

/** 题型列表 */
const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'choice', label: '选择题' },
  { value: 'truefalse', label: '判断题' },
  { value: 'matching', label: '配对题' },
  { value: 'memory', label: '记忆题' },
];

/** 难度列表 */
const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

/** 年级列表 */
const GRADES = [1, 2, 3, 4, 5, 6];

/** 学期列表 */
const SEMESTERS: Semester[] = ['上册', '下册'];

/** 题型描述 */
const QUESTION_DESCRIPTIONS: Record<string, string> = {
  choice: '选择题：四个选项中选出一个正确答案，最通用，适合知识点考察。',
  truefalse: '判断题：判断正误，适合概念辨析，出题快理解简单。',
  matching: '配对题：左右内容配对，适合反义词/近义词/作者作品配对。',
  memory: '翻牌记忆：两两配对找相同，适合字词/拼音记忆。',
  ordering: '排序题：按正确顺序排列，适合古诗词/段落排序练习。',
};

// ==================== 通用样式 ====================

/** 按钮组项的选中/未选中样式 */
function groupButtonClass(isActive: boolean, disabled = false): string {
  const base = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border';
  if (disabled) {
    return `${base} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed`;
  }
  return isActive
    ? `${base} bg-brand-600 text-white border-brand-600`
    : `${base} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
}

// ==================== 组件 ====================

export function InputPanel() {
  // 全局状态
  const questionRequest = useAppStore((s) => s.questionRequest);
  const setQuestionRequest = useAppStore((s) => s.setQuestionRequest);
  const aiEnabled = useAppStore((s) => s.aiEnabled);
  const setAiEnabled = useAppStore((s) => s.setAiEnabled);
  const loading = useAppStore((s) => s.loading);
  const setLoading = useAppStore((s) => s.setLoading);
  const error = useAppStore((s) => s.error);
  const setError = useAppStore((s) => s.setError);

  const setQuestions = useAppStore((s) => s.setQuestions);
  const setPairs = useAppStore((s) => s.setPairs);
  const setContentType = useAppStore((s) => s.setContentType);
  const setTitle = useAppStore((s) => s.setTitle);
  const setStep = useAppStore((s) => s.setStep);

  // 本地状态
  const [apiKey, setApiKey] = useState(() => getDeepSeekApiKey());
  const [selectedKp, setSelectedKp] = useState<string>('');

  // 题库状态
  const { files, drawConfig, setDrawConfig, drawQuestions } = useBankStore();

  // 课本数据：根据年级+学期加载
  const textbook = useMemo(
    () => getTextbooks(questionRequest.grade, questionRequest.semester),
    [questionRequest.grade, questionRequest.semester],
  );

  // 可用年级（从 textbooks 数据中提取）
  const availableGrades = useMemo(
    () => new Set(textbooks.map((t) => t.grade)),
    [],
  );

  // 提示词配置（含知识点列表，从 prompts 模块获取，确保与 AI 出题一致）
  const promptConfig = useMemo(
    () => getPromptConfig(questionRequest.subject),
    [questionRequest.subject],
  );

  const units = textbook?.units ?? [];
  const selectedUnit = units.find((u) => u.id === questionRequest.unit);
  const lessons = selectedUnit?.lessons ?? [];

  // 当前学科的知识点（来自 prompts 模块配置）
  const knowledgePoints = promptConfig.knowledgePoints;

  // 当前选中的知识点对象
  const selectedKpObj = knowledgePoints.find((kp) => kp.id === selectedKp);

  // ==================== 事件处理 ====================

  /** 学科切换 */
  const handleSubjectChange = (subject: string) => {
    setQuestionRequest({ subject });
    setSelectedKp('');
  };

  /** 年级切换 — 重置单元和课文 */
  const handleGradeChange = (grade: number) => {
    setQuestionRequest({ grade, unit: '', lesson: '' });
  };

  /** 学期切换 — 重置单元和课文 */
  const handleSemesterChange = (semester: Semester) => {
    setQuestionRequest({ semester, unit: '', lesson: '' });
  };

  /** 单元切换 — 重置课文 */
  const handleUnitChange = (unit: string) => {
    setQuestionRequest({ unit, lesson: '' });
  };

  /** 知识点选择 — 联动推荐题型 */
  const handleKpSelect = (kp: KnowledgePoint) => {
    setSelectedKp(kp.id);
    if (kp.recommendedTypes.length > 0) {
      setQuestionRequest({ questionType: kp.recommendedTypes[0] });
    }
  };

  /** API Key 输入 — 通过 provider 模块同步到 localStorage */
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    saveDeepSeekApiKey(value);
  };

  /** 是否可以生成 */
  const canGenerate =
    !loading &&
    questionRequest.content.trim().length > 0 &&
    (!aiEnabled || apiKey.trim().length > 0);

  /** 生成题目 */
  const handleGenerate = async () => {
    if (!questionRequest.content.trim()) {
      setError('请输入教学内容');
      return;
    }
    if (aiEnabled && !apiKey.trim()) {
      setError('请先输入 DeepSeek API Key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 课文标题用于默认游戏标题
      const lessonTitle = lessons.find(
        (l) => l.id === questionRequest.lesson,
      )?.title;

      if (aiEnabled) {
        // AI 出题流程（promptConfig 来自组件 memoized 值）
        const provider = createDeepSeekProvider(apiKey);
        const generator = new QuestionGenerator(provider, promptConfig);
        const result = await generator.generate(questionRequest);

        // generate() 返回 Question[] | MatchPair[]
        if (questionRequest.questionType === 'matching' || questionRequest.questionType === 'memory') {
          setPairs(result as MatchPair[]);
          setQuestions([]);
        } else {
          setQuestions(result as Question[]);
          setPairs([]);
        }
        setContentType(questionRequest.questionType);
        setTitle(lessonTitle ?? '课堂互动游戏');
      } else {
        // 规则解析流程（关闭 AI 时使用）
        const result = parsePlainText(questionRequest.content);

        setQuestions(result.questions ?? []);
        setPairs(result.pairs ?? []);
        setContentType('mixed');
        setTitle(lessonTitle ?? '课堂互动游戏');
      }

      // 进入题目编辑步骤
      setStep('edit');
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 教学内容输入框 placeholder
  const contentPlaceholder = aiEnabled
    ? questionRequest.lesson
      ? `请粘贴《${lessons.find((l) => l.id === questionRequest.lesson)?.title ?? ''}》的课文内容，AI 将根据内容自动出题。`
      : '请粘贴课文内容，AI 将根据内容自动出题。'
    : '请粘贴纯文本题目，系统将自动解析。\n格式示例：\n1. 题干内容\nA. 选项A\nB. 选项B\nC. 选项C\nD. 选项D\n答案：A\n解析：...';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-6">
      {/* ==================== 学科与年级 ==================== */}
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          学科与年级
        </h3>

        {/* 学科选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学科
          </label>
          <div className="flex gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSubjectChange(s.id)}
                className={groupButtonClass(questionRequest.subject === s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* 年级选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            年级
          </label>
          <div className="flex gap-2 flex-wrap">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleGradeChange(g)}
                disabled={!availableGrades.has(g)}
                className={groupButtonClass(
                  questionRequest.grade === g,
                  !availableGrades.has(g),
                )}
              >
                {g}年级
              </button>
            ))}
          </div>
        </div>

        {/* 学期选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学期
          </label>
          <div className="flex gap-2">
            {SEMESTERS.map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => handleSemesterChange(sem)}
                className={groupButtonClass(questionRequest.semester === sem)}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ==================== 课本目录 ==================== */}
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          课本目录
        </h3>

        {!textbook && (
          <p className="text-sm text-gray-400 mb-4">
            当前年级/学期暂无课本数据，可直接在下方粘贴教学内容。
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* 单元选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              单元
            </label>
            <select
              value={questionRequest.unit}
              onChange={(e) => handleUnitChange(e.target.value)}
              disabled={units.length === 0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">请选择单元</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                  {u.theme ? ` — ${u.theme}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 课文选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              课文
            </label>
            <select
              value={questionRequest.lesson}
              onChange={(e) =>
                setQuestionRequest({ lesson: e.target.value })
              }
              disabled={lessons.length === 0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">请选择课文</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 知识点提示 */}
        {selectedUnit && (
          <p className="mt-3 text-xs text-gray-400">
            当前单元主题：{selectedUnit.theme || '未设置'}
          </p>
        )}
      </Card>

      {/* ==================== 题目设置 ==================== */}
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          题目设置
        </h3>

        {/* 知识点选择 */}
        {knowledgePoints.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              知识点
              <span className="ml-2 text-xs text-gray-400 font-normal">
                选择后自动推荐适合的题型
              </span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {knowledgePoints.map((kp) => (
                <button
                  key={kp.id}
                  type="button"
                  onClick={() => handleKpSelect(kp)}
                  className={groupButtonClass(selectedKp === kp.id)}
                  title={kp.description}
                >
                  {kp.name}
                </button>
              ))}
            </div>
            {selectedKpObj && (
              <p className="mt-2 text-xs text-gray-500">
                {selectedKpObj.description} · 推荐题型：
                {selectedKpObj.recommendedTypes
                  .map(
                    (t) =>
                      QUESTION_TYPES.find((qt) => qt.value === t)?.label ?? t,
                  )
                  .join('、')}
              </p>
            )}
          </div>
        )}

        {/* 题型选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            题型
          </label>
          <div className="flex gap-2 flex-wrap">
            {QUESTION_TYPES.map((qt) => {
              const isRecommended = selectedKpObj?.recommendedTypes.includes(
                qt.value,
              );
              return (
                <button
                  key={qt.value}
                  type="button"
                  onClick={() =>
                    setQuestionRequest({ questionType: qt.value })
                  }
                  className={groupButtonClass(
                    questionRequest.questionType === qt.value,
                  )}
                >
                  {qt.label}
                  {isRecommended && (
                    <span className="ml-1 text-green-500">★</span>
                  )}
                </button>
              );
            })}
          </div>
          {/* 题型说明 + 加载示例按钮 */}
          {questionRequest.questionType && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700 mb-2">
                {QUESTION_DESCRIPTIONS[questionRequest.questionType]}
              </p>
              {/* 可玩的小游戏列表 */}
              <div className="mb-3">
                <p className="text-xs text-blue-500 mb-1.5 font-medium">可玩的小游戏：</p>
                <div className="flex flex-wrap gap-1.5">
                  {getGamesByType(questionRequest.questionType).map((game) => (
                    <span
                      key={game.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white rounded-full border border-blue-200 text-blue-600"
                    >
                      {game.icon} {game.name}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const type = questionRequest.questionType;
                  if (type === 'matching' || type === 'memory') {
                    const pairs = SAMPLE_DATA[type];
                    setQuestions([]);
                    setPairs(pairs);
                    setContentType(type);
                  } else {
                    const samples = SAMPLE_DATA[type];
                    if ('length' in samples && samples.length > 0) {
                      setQuestions(samples as Question[]);
                      setPairs([]);
                      setContentType(type);
                    }
                  }
                  setStep('edit');
                }}
              >
                👀 加载示例预览
              </Button>
            </div>
          )}
        </div>

        {/* 难度选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            难度
          </label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setQuestionRequest({ difficulty: d.value })}
                className={groupButtonClass(
                  questionRequest.difficulty === d.value,
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 题目数量 */}
        <div className="max-w-full">
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span>题目数量</span>
            <span className="text-brand-600 font-semibold whitespace-nowrap">
              {questionRequest.count} 题
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={questionRequest.count}
            onChange={(e) =>
              setQuestionRequest({ count: Number(e.target.value) })
            }
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      </Card>

      {/* ==================== 教学内容 ==================== */}
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          教学内容
        </h3>
        <textarea
          value={questionRequest.content}
          onChange={(e) =>
            setQuestionRequest({ content: e.target.value })
          }
          placeholder={contentPlaceholder}
          rows={8}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-y"
        />
        <p className="mt-2 text-xs text-gray-400">
          {aiEnabled
            ? '粘贴课文原文，AI 将自动理解内容并生成题目。'
            : '粘贴纯文本题目（含题干、选项、答案），系统将自动解析为结构化数据。'}
        </p>
      </Card>

      {/* ==================== AI 出题设置 ==================== */}
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          AI 出题设置
        </h3>

        {/* AI 开关 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              AI 出题
            </label>
            <p className="text-xs text-gray-400 mt-0.5">
              {aiEnabled
                ? '开启后使用 DeepSeek AI 自动出题'
                : '关闭后使用规则解析手动输入的题目'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              aiEnabled ? 'bg-brand-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                aiEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 联网搜索开关 */}
        {aiEnabled && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                联网搜索出题
              </label>
              <p className="text-xs text-gray-400 mt-0.5">
                AI 可搜索同课文权威练习题作为参考
              </p>
            </div>
            <button
              type="button"
              onClick={() => setQuestionRequest({ webSearch: !questionRequest.webSearch })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                questionRequest.webSearch ? 'bg-brand-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  questionRequest.webSearch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}

        {/* 题库抽题 */}
        <div className="mb-4 pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            从题库抽题
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={drawConfig.fileId}
              onChange={(e) => setDrawConfig({ fileId: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            >
              <option value="">选择题库文件</option>
              {files.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}（{f.entries.length} 条）
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={10}
              value={drawConfig.count}
              onChange={(e) => setDrawConfig({ count: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
              className="w-16 rounded-lg border border-gray-300 px-2 py-2 text-sm text-center focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              title="抽取数量"
            />
            <Button
              size="sm"
              disabled={!drawConfig.fileId}
              onClick={() => {
                const result = drawQuestions(drawConfig.fileId, drawConfig.count);
                if (result) {
                  setQuestions(result.questions);
                  setPairs(result.pairs);
                  setContentType('mixed');
                }
              }}
            >
              抽题
            </Button>
          </div>
        </div>

        {/* API Key 输入 */}
        {aiEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DeepSeek API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
            <p className="mt-2 text-xs text-gray-400">
              API Key 存储在浏览器 localStorage 中，不会上传到服务器。
            </p>
          </div>
        )}
      </Card>

      {/* ==================== 错误提示 ==================== */}
      {error && (
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
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* ==================== 生成按钮 ==================== */}
      <div className="flex justify-center">
        <Button
          size="lg"
          loading={loading}
          disabled={!canGenerate}
          onClick={handleGenerate}
          className="min-w-[200px]"
        >
          {loading ? '正在生成…' : '生成题目'}
        </Button>
      </div>
    </div>
  );
}

export default InputPanel;
