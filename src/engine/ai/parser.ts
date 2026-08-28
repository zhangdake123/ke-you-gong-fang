/**
 * AI 返回结果解析
 *
 * 从 AI 返回的文本中提取 JSON，按题型解析为标准化数据。
 * 功能：JSON 提取、格式校验、生成唯一 ID、异常处理。
 * 跨模块调用方：src/engine/ai/generator.ts（QuestionGenerator）
 */
import type {
  ChoiceQuestion,
  Difficulty,
  MatchPair,
  Question,
  QuestionType,
  TrueFalseQuestion,
} from '../../types';

/**
 * 生成唯一 ID。
 * 优先使用 crypto.randomUUID()，不可用时回退到时间戳 + 随机数。
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 从 AI 返回的文本中提取 JSON 字符串。
 *
 * AI 可能返回：
 * 1. 纯 JSON 数组
 * 2. 包裹在 ```json ... ``` 中的 JSON
 * 3. 带有前后说明文字的 JSON
 */
function extractJSON(raw: string): string {
  const text = raw.trim();

  // 尝试提取 ```json ... ``` 或 ``` ... ``` 代码块
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim();
  }

  // 移除可能残留的 ``` 标记
  const cleaned = text.replace(/```(?:json)?/g, '').trim();

  // 尝试提取 JSON 数组（从第一个 [ 到最后一个 ]）
  const arrStart = cleaned.indexOf('[');
  const arrEnd = cleaned.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
    return cleaned.slice(arrStart, arrEnd + 1);
  }

  // 尝试提取 JSON 对象（兜底）
  const objStart = cleaned.indexOf('{');
  const objEnd = cleaned.lastIndexOf('}');
  if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
    return cleaned.slice(objStart, objEnd + 1);
  }

  return cleaned;
}

/** 校验并标准化选择题 */
function validateChoiceQuestion(
  item: unknown,
  index: number,
  difficulty: Difficulty,
): ChoiceQuestion {
  if (typeof item !== 'object' || item === null) {
    throw new Error(`第 ${index + 1} 道选择题格式异常：不是有效对象`);
  }

  const obj = item as Record<string, unknown>;

  // 校验题干
  const question = obj.question;
  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new Error(`第 ${index + 1} 道选择题缺少题干（question）`);
  }

  // 校验选项
  const options = obj.options;
  if (!Array.isArray(options) || options.length !== 4) {
    throw new Error(`第 ${index + 1} 道选择题的选项必须为 4 个`);
  }
  for (let i = 0; i < options.length; i++) {
    if (typeof options[i] !== 'string' || options[i].trim().length === 0) {
      throw new Error(`第 ${index + 1} 道选择题的第 ${i + 1} 个选项无效`);
    }
  }

  // 校验答案索引
  const answer = obj.answer;
  if (typeof answer !== 'number' || answer < 0 || answer > 3 || !Number.isInteger(answer)) {
    throw new Error(
      `第 ${index + 1} 道选择题的答案索引必须在 0-3 之间`,
    );
  }

  // 解析可选字段
  const explanation =
    typeof obj.explanation === 'string' && obj.explanation.trim().length > 0
      ? obj.explanation
      : undefined;

  return {
    id: generateId(),
    type: 'choice',
    difficulty,
    question,
    options,
    answer,
    explanation,
  };
}

/** 校验并标准化判断题 */
function validateTrueFalseQuestion(
  item: unknown,
  index: number,
  difficulty: Difficulty,
): TrueFalseQuestion {
  if (typeof item !== 'object' || item === null) {
    throw new Error(`第 ${index + 1} 道判断题格式异常：不是有效对象`);
  }

  const obj = item as Record<string, unknown>;

  // 校验题干
  const question = obj.question;
  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new Error(`第 ${index + 1} 道判断题缺少题干（question）`);
  }

  // 校验答案
  const answer = obj.answer;
  if (typeof answer !== 'boolean') {
    throw new Error(`第 ${index + 1} 道判断题的答案必须是布尔值（true/false）`);
  }

  // 解析可选字段
  const explanation =
    typeof obj.explanation === 'string' && obj.explanation.trim().length > 0
      ? obj.explanation
      : undefined;

  return {
    id: generateId(),
    type: 'truefalse',
    difficulty,
    question,
    answer,
    explanation,
  };
}

/** 校验并标准化配对项 */
function validateMatchPair(item: unknown, index: number): MatchPair {
  if (typeof item !== 'object' || item === null) {
    throw new Error(`第 ${index + 1} 组配对格式异常：不是有效对象`);
  }

  const obj = item as Record<string, unknown>;

  // 校验左项
  const left = obj.left;
  if (typeof left !== 'string' || left.trim().length === 0) {
    throw new Error(`第 ${index + 1} 组配对缺少左项（left）`);
  }

  // 校验右项
  const right = obj.right;
  if (typeof right !== 'string' || right.trim().length === 0) {
    throw new Error(`第 ${index + 1} 组配对缺少右项（right）`);
  }

  return { id: generateId(), left, right };
}

/**
 * 解析 AI 返回的文本，提取并标准化为题目数据。
 *
 * @param raw AI 返回的原始文本
 * @param type 题型（choice/truefalse/matching/memory）
 * @param difficulty 难度等级，会写入每道题的数据中
 * @returns 解析后的题目数组（选择题/判断题）或配对数组
 * @throws JSON 解析失败或格式校验不通过时抛出清晰错误
 */
export function parseAIResponse(
  raw: string,
  type: QuestionType,
  difficulty?: Difficulty,
): Question[] | MatchPair[] {
  const diff: Difficulty = difficulty ?? 'medium';

  // 提取 JSON 文本
  const jsonText = extractJSON(raw);

  // 解析 JSON
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch (e) {
    throw new Error(
      `JSON 解析失败：${e instanceof Error ? e.message : String(e)}`,
    );
  }

  // 如果 AI 返回的是对象（非数组），尝试提取其中的数组字段
  if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    const arrayField =
      obj.questions ?? obj.data ?? obj.items ?? obj.results ?? obj.pairs;
    if (Array.isArray(arrayField)) {
      data = arrayField;
    }
  }

  // 确保最终是数组
  if (!Array.isArray(data)) {
    throw new Error('AI 返回的数据不是数组格式，无法解析');
  }

  // 按题型解析
  if (type === 'choice') {
    return data.map((item, index) => validateChoiceQuestion(item, index, diff));
  }
  if (type === 'truefalse') {
    return data.map((item, index) =>
      validateTrueFalseQuestion(item, index, diff),
    );
  }
  // matching 或 memory 都解析为配对数组
  return data.map((item, index) => validateMatchPair(item, index));
}
