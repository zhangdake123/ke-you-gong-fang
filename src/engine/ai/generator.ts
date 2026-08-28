/**
 * AI 出题服务
 *
 * 组装提示词 → 调用 AI Provider → 解析返回 → 格式校验 + 去重 → 返回标准化数据。
 * 支持两种模式：
 *   1. 联网搜索模式：AI 根据年级/学期/课文自行搜索内容出题
 *   2. 粘贴内容模式：AI 严格从老师粘贴的内容出题
 *
 * 跨模块调用方：src/components/teacher/AIGeneratorPanel.tsx
 */
import type {
  AIProvider,
  MatchPair,
  Question,
  QuestionRequest,
  QuestionType,
} from '../../types';
import type { PromptConfig } from './prompts';
import { parseAIResponse } from './parser';

/**
 * 对已解析的数据进行去重。
 * - 选择题/判断题：按题干文本去重
 * - 配对题/记忆题：按 left+right 去重
 */
export function deduplicate(
  data: Question[] | MatchPair[],
  type: QuestionType,
): Question[] | MatchPair[] {
  if (data.length === 0) return data;

  // 配对题和记忆题按 left+right 去重
  if (type === 'matching' || type === 'memory') {
    const pairs = data as MatchPair[];
    const seen = new Set<string>();
    return pairs.filter((p) => {
      const key = `${p.left}\0${p.right}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // 选择题/判断题/排序题按题干去重
  const questions = data as Question[];
  const seen = new Set<string>();
  return questions.filter((q) => {
    const key = q.question.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * AI 出题服务。
 *
 * 使用流程：
 * 1. 用 AIProvider 和 PromptConfig 构造实例
 * 2. 调用 generate() 传入出题请求，获得标准化题目数据
 */
export class QuestionGenerator {
  private provider: AIProvider;
  private config: PromptConfig;

  constructor(provider: AIProvider, config: PromptConfig) {
    this.provider = provider;
    this.config = config;
  }

  /**
   * 组装系统提示词（联网搜索模式时附加补充提示词）。
   */
  assembleSystemPrompt(req: QuestionRequest): string {
    const base = this.config.system;
    if (req.webSearch && this.config.webSearchSystem) {
      return `${base}\n\n${this.config.webSearchSystem}`;
    }
    return base;
  }

  /**
   * 组装提示词，替换模板变量。
   *
   * 替换的变量：{{count}} {{grade}} {{semester}} {{unit}} {{lesson}}
   * {{knowledgePoint}} {{difficulty}} {{content}} {{contentSection}}
   *
   * @param req 出题请求
   * @returns 组装后的完整提示词
   */
  assemblePrompt(req: QuestionRequest): string {
    const template = this.config.templates[req.questionType];
    if (!template) {
      throw new Error(`不支持的题型: ${req.questionType}`);
    }

    const difficultyInfo = this.config.difficulties.find(
      (d) => d.id === req.difficulty,
    );
    const difficultyName = difficultyInfo
      ? `${difficultyInfo.name}（${difficultyInfo.desc}）`
      : req.difficulty;

    // 知识点描述
    const knowledgePoint =
      req.unit && req.lesson
        ? `${req.unit} - ${req.lesson}`
        : req.lesson || req.unit || '通用知识点';

    // 构建 contentSection（优先使用 buildContentSection 函数）
    let contentSection = '';
    if (this.config.buildContentSection) {
      contentSection = this.config.buildContentSection(req.content, req.webSearch === true);
    } else if (req.content) {
      contentSection = `【课文原文】\n${req.content}`;
    } else {
      contentSection = '【提示】老师未提供课文内容，请根据课本知识出题。';
    }

    return template
      .replace(/\{\{count\}\}/g, String(req.count))
      .replace(/\{\{grade\}\}/g, String(req.grade))
      .replace(/\{\{semester\}\}/g, req.semester)
      .replace(/\{\{unit\}\}/g, req.unit || '未指定单元')
      .replace(/\{\{lesson\}\}/g, req.lesson || '未指定课文')
      .replace(/\{\{knowledgePoint\}\}/g, knowledgePoint)
      .replace(/\{\{difficulty\}\}/g, difficultyName)
      .replace(/\{\{content\}\}/g, req.content)
      .replace(/\{\{contentSection\}\}/g, contentSection);
  }

  /**
   * 生成题目。
   *
   * 流程：组装提示词 → 调用 AI（联网搜索时附加 webSearch 参数）→ 解析 → 校验 + 去重 → 返回
   *
   * @param req 出题请求
   * @returns 标准化题目数组（选择题/判断题/排序题）或配对数组
   */
  async generate(req: QuestionRequest): Promise<Question[] | MatchPair[]> {
    if (!this.provider.isAvailable()) {
      throw new Error('AI 服务不可用，请检查 API Key 配置');
    }

    // 1. 组装提示词
    const prompt = this.assemblePrompt(req);
    const systemPrompt = this.assembleSystemPrompt(req);

    // 2. 调用 AI Provider（联网搜索时传递 webSearch 参数）
    let raw: string;
    try {
      raw = await this.provider.complete(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 8192,
        webSearch: req.webSearch,
      });
    } catch (e) {
      throw new Error(
        `AI 调用失败：${e instanceof Error ? e.message : String(e)}`,
      );
    }

    // 3. 解析 AI 返回结果
    let parsed: Question[] | MatchPair[];
    try {
      parsed = parseAIResponse(raw, req.questionType, req.difficulty);
    } catch (e) {
      throw new Error(
        `AI 返回结果解析失败：${e instanceof Error ? e.message : String(e)}`,
      );
    }

    // 4. 去重
    const result = deduplicate(parsed, req.questionType);

    // 5. 返回标准化数据
    return result;
  }
}