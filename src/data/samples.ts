/**
 * 内置示例数据
 *
 * 每种题型 ≥3 条示例，用于展示游戏模板效果。
 * 老师在选游戏时可直接预览。
 */
import type { SampleQuestions, MatchPair, GameContent, Question } from '../types';

/** 选择题示例：三年级语文词语理解 */
const choiceSamples = [
  {
    id: 'sample-choice-1',
    type: 'choice' as const,
    difficulty: 'easy' as const,
    question: '下列词语中，哪个词和"美丽"的意思最接近？',
    options: ['漂亮', '难看', '高大', '快速'],
    answer: 0,
    explanation: '"美丽"和"漂亮"都表示好看的意思，是同义词。',
  },
  {
    id: 'sample-choice-2',
    type: 'choice' as const,
    difficulty: 'medium' as const,
    question: '"绿油油"这个词是什么结构的词语？',
    options: ['AABB式', 'ABAB式', 'ABB式', 'AAB式'],
    answer: 2,
    explanation: '"绿油油"是"绿"+"油油"的ABB式重叠词，形容颜色浓绿。',
  },
  {
    id: 'sample-choice-3',
    type: 'choice' as const,
    difficulty: 'hard' as const,
    question: '下列句子中，哪个句子使用了拟人的修辞手法？',
    options: [
      '月亮像弯弯的小船。',
      '风儿轻轻地唱着歌，唤醒了沉睡的大地。',
      '他跑得像兔子一样快。',
      '她的脸红得像苹果。',
    ],
    answer: 1,
    explanation: '风儿"唱歌"、大地"沉睡"是把事物当作人来写，是拟人手法。',
  },
];

/** 判断题示例：三年级语文基础知识 */
const truefalseSamples = [
  {
    id: 'sample-tf-1',
    type: 'truefalse' as const,
    difficulty: 'easy' as const,
    question: '"的、地、得"这三个字在句子中的用法是相同的。',
    answer: false,
    explanation: '"的"用于定语后，"地"用于状语后，"得"用于补语前，用法不同。',
  },
  {
    id: 'sample-tf-2',
    type: 'truefalse' as const,
    difficulty: 'easy' as const,
    question: '"春天来了，花儿开了，草儿绿了。"这句话用了排比的修辞手法。',
    answer: true,
    explanation: '三个"……了"的句式结构相同，是排比。',
  },
  {
    id: 'sample-tf-3',
    type: 'truefalse' as const,
    difficulty: 'medium' as const,
    question: '"无边无际"形容非常广阔，看不到边际。',
    answer: true,
    explanation: '"无边无际"指没有边际，形容范围广阔。',
  },
  {
    id: 'sample-tf-4',
    type: 'truefalse' as const,
    difficulty: 'medium' as const,
    question: '"稻花香里说丰年"这句诗出自李白的《静夜思》。',
    answer: false,
    explanation: '这句诗出自辛弃疾的《西江月·夜行黄沙道中》，不是李白的诗。',
  },
];

/** 配对题示例：反义词配对 */
const matchingSamples: MatchPair[] = [
  { id: 'sample-match-1', left: '高', right: '矮' },
  { id: 'sample-match-2', left: '胖', right: '瘦' },
  { id: 'sample-match-3', left: '快', right: '慢' },
  { id: 'sample-match-4', left: '明亮', right: '昏暗' },
  { id: 'sample-match-5', left: '勤劳', right: '懒惰' },
];

/** 记忆配对示例：字与拼音 */
const memorySamples: MatchPair[] = [
  { id: 'sample-mem-1', left: 'zhōng', right: '钟' },
  { id: 'sample-mem-2', left: 'yuǎn', right: '远' },
  { id: 'sample-mem-3', left: 'měi', right: '美' },
  { id: 'sample-mem-4', left: 'shēn', right: '深' },
  { id: 'sample-mem-5', left: 'kuān', right: '宽' },
  { id: 'sample-mem-6', left: 'nuǎn', right: '暖' },
];

/** 排序题示例：诗句拼图 */
const orderingSamples = [
  {
    id: 'sample-order-1',
    type: 'ordering' as const,
    difficulty: 'easy' as const,
    question: '请将《静夜思》的诗句按正确顺序排列',
    segments: ['疑是地上霜', '床前明月光', '低头思故乡', '举头望明月'],
    correctOrder: [1, 0, 3, 2],
    explanation: '《静夜思》李白：床前明月光，疑是地上霜。举头望明月，低头思故乡。',
  },
  {
    id: 'sample-order-2',
    type: 'ordering' as const,
    difficulty: 'medium' as const,
    question: '请将《春晓》的诗句按正确顺序排列',
    segments: ['处处闻啼鸟', '春眠不觉晓', '花落知多少', '夜来风雨声'],
    correctOrder: [1, 0, 3, 2],
    explanation: '《春晓》孟浩然：春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
  },
  {
    id: 'sample-order-3',
    type: 'ordering' as const,
    difficulty: 'medium' as const,
    question: '请将《登鹳雀楼》的诗句按正确顺序排列',
    segments: ['更上一层楼', '白日依山尽', '黄河入海流', '欲穷千里目'],
    correctOrder: [1, 2, 3, 0],
    explanation: '《登鹳雀楼》王之涣：白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
  },
];

/** 全部示例数据 */
export const SAMPLE_DATA: SampleQuestions = {
  choice: choiceSamples as Question[],
  truefalse: truefalseSamples as Question[],
  matching: matchingSamples,
  memory: memorySamples,
  ordering: orderingSamples as Question[],
};

/** 获取指定题型的示例数据 */
export function getSampleForType(type: string): {
  questions?: Question[];
  pairs?: MatchPair[];
} {
  switch (type) {
    case 'choice':
      return { questions: choiceSamples as Question[] };
    case 'truefalse':
      return { questions: truefalseSamples as Question[] };
    case 'matching':
      return { pairs: matchingSamples };
    case 'memory':
      return { pairs: memorySamples };
    case 'ordering':
      return { questions: orderingSamples as Question[] };
    default:
      return { questions: choiceSamples as Question[] };
  }
}

/** 获取默认示例（用于展示所有游戏模板） */
export function getDefaultSample(): GameContent {
  return {
    title: '示例：三年级语文练习',
    questions: [...choiceSamples, ...truefalseSamples, ...orderingSamples],
    pairs: matchingSamples,
    contentType: 'mixed',
    samples: SAMPLE_DATA,
  };
}