/**
 * 课游工坊 - 核心类型定义
 *
 * 本文件定义了项目中所有模块共享的数据类型。
 * 所有跨模块的数据传递都使用这里的类型，确保接口一致。
 */

// ==================== 题目类型 ====================

/** 题型枚举 */
export type QuestionType = 'choice' | 'truefalse' | 'matching' | 'memory' | 'ordering';

/** 难度等级 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** 学期 */
export type Semester = '上册' | '下册';

/** 选择题 */
export interface ChoiceQuestion {
  id: string;
  type: 'choice';
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number; // 正确选项的索引（0-based）
  explanation?: string;
}

/** 判断题 */
export interface TrueFalseQuestion {
  id: string;
  type: 'truefalse';
  difficulty: Difficulty;
  question: string;
  answer: boolean;
  explanation?: string;
}

/** 排序题（如诗句拼图） */
export interface OrderingQuestion {
  id: string;
  type: 'ordering';
  difficulty: Difficulty;
  question: string;         // 题目说明（如"请将以下诗句按正确顺序排列"）
  segments: string[];       // 被打乱的片段
  correctOrder: number[];   // 正确顺序的索引数组
  explanation?: string;
}

/** 配对项（连连看 / 翻牌记忆共用） */
export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

/** 题目联合类型 */
export type Question = ChoiceQuestion | TrueFalseQuestion | OrderingQuestion;

/** 配对题数据（连连看） */
export interface MatchingData {
  type: 'matching';
  pairs: MatchPair[];
}

/** 记忆题数据（翻牌记忆） */
export interface MemoryData {
  type: 'memory';
  pairs: MatchPair[];
}

/** 排序题数据 */
export interface OrderingData {
  type: 'ordering';
  segments: string[];
  correctOrder: number[];
}

/** 统一的内容数据——出题后的结果，传入游戏模板 */
export interface GameContent {
  title: string;
  questions: Question[];
  pairs: MatchPair[];
  contentType: QuestionType | 'mixed';
  /** 内置示例数据（非 AI 生成） */
  samples?: SampleQuestions;
}

// ==================== 示例数据 ====================

/** 内置示例（每种题型 ≥3 题） */
export interface SampleQuestions {
  choice: Question[];
  truefalse: Question[];
  matching: MatchPair[];
  memory: MatchPair[];
  ordering: Question[];
}

// ==================== 游戏模板类型 ====================

/** 导出选项 */
export interface ExportOptions {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showTimer: boolean;
  theme: 'default' | 'forest' | 'ocean' | 'sunset';
  /** 开启评分报告（老师可查看学生成绩） */
  enableScoreReport?: boolean;
  /** 评分报告密码 */
  scorePassword?: string;
}

/** 游戏模板接口——每个游戏模板实现此接口 */
export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  supportedTypes: QuestionType[];
  minItems: number;
  /** 该项内容是否完全不适合此模板（如长文本不适合打地鼠） */
  isBlocked: (content: GameContent) => boolean;
  /** 阻塞原因说明 */
  blockReason?: string;
  /** 单个题目/选项的最大文本长度（0 表示不限制） */
  maxItemLength?: number;
  /** 是否支持评分报告 */
  supportsScoreReport: boolean;
  /** 判断该模板是否适合当前内容 */
  isRecommended: (content: GameContent) => boolean;
  /** 生成单文件 HTML */
  generateHTML: (content: GameContent, options: ExportOptions) => string;
}

// ==================== 评分报告 ====================

/** 单题得分 */
export interface QuestionScore {
  index: number;
  question: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  timeSpent: number;
}

/** 游戏评分报告 */
export interface ScoreReport {
  gameId: string;
  gameName: string;
  title: string;
  totalQuestions: number;
  correctCount: number;
  score: number;        // 百分制
  accuracy: number;     // 正确率 0-1
  timeSpent: number;    // 总用时（秒）
  details: QuestionScore[];
  timestamp: number;
  code: string;         // 验证码
}

// ==================== 题库管理 ====================

/** 题库文件（类似文件夹） */
export interface BankFile {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  entries: BankEntry[];
}

/** 题库条目 */
export interface BankEntry {
  id: string;
  title: string;
  content: GameContent;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

/** 抽题配置 */
export interface DrawConfig {
  fileId: string;
  entryIds: string[];   // 空表示从整个文件抽
  count: number;
}

// ==================== AI 出题类型 ====================

/** AI Provider 接口——接入 DeepSeek 等 API 时实现此接口 */
export interface AIProvider {
  /** 调用 AI 生成内容，返回原始文本 */
  complete(prompt: string, systemPrompt: string, options?: AIRequestOptions): Promise<string>;
  /** 检测 API 是否可用 */
  isAvailable(): boolean;
}

/** AI 请求选项 */
export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  webSearch?: boolean;
}

/** 出题请求配置 */
export interface QuestionRequest {
  subject: string;          // 学科 ID
  grade: number;             // 年级 1-6
  semester: Semester;        // 学期
  unit: string;              // 单元
  lesson: string;            // 课文
  content: string;           // 教学内容（老师粘贴的课文原文）
  questionType: QuestionType; // 题型
  difficulty: Difficulty;    // 难度
  count: number;             // 生成数量
  /** 是否启用联网搜索 */
  webSearch?: boolean;
  /** 从题库抽题 */
  drawFromBank?: DrawConfig;
}

/** 出题方向（知识点分类） */
export interface KnowledgePoint {
  id: string;
  name: string;
  description: string;
  recommendedTypes: QuestionType[];
}

// ==================== 课本目录类型 ====================

/** 课文 */
export interface Lesson {
  id: string;
  title: string;
  knowledgePoints: string[]; // 关联的知识点 ID
}

/** 单元 */
export interface Unit {
  id: string;
  title: string;
  theme: string; // 单元主题
  lessons: Lesson[];
}

/** 学期课本 */
export interface Textbook {
  grade: number;
  semester: Semester;
  publisher: string;
  units: Unit[];
}

// ==================== 课本内容预置 ====================

/** 预置课文内容 */
export interface TextContent {
  lessonId: string;
  content: string;
  keywords: string[];
  source: string;
}