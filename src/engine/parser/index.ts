/**
 * 规则解析引擎（降级方案）
 *
 * 当 AI 不可用时，解析老师手动粘贴的文本为题目数据。
 * 支持格式：
 *   - 选择题：1. 题干\nA. 选项\nB. 选项\nC. 选项\nD. 选项\n答案: A
 *   - 判断题：1. 题干\n答案: 对/错  或  1. 题干 (对)
 *   - 配对题：左项 - 右项  或  左项 | 右项  （每行一组）
 *
 * 跨模块调用方：src/components/teacher/ManualInputPanel.tsx
 * 依赖：src/engine/ai/parser.ts（复用 generateId 生成唯一 ID）
 */
import type { MatchPair, Question } from '../../types';
import { generateId } from '../ai/parser';

// ==================== 正则常量 ====================

/** 题目起始行：数字 + 分隔符(.、）) + 内容 */
const QUESTION_START_RE = /^\d+[.、)]\s*(.+)/;

/** 选项行：字母(A-D) + 分隔符 + 内容 */
const OPTION_RE = /^([A-Da-d])[.、)]\s*(.+)/;

/** 答案行：答案/答 + 冒号(:：) + 内容 */
const ANSWER_RE = /^\s*(?:答案|答)\s*[:：]\s*(.+)/;

/** 内联判断题答案：题干末尾的 (对)/(错)/(√)/(×) */
const INLINE_TF_RE = /[（(]\s*(正确|错误|对|错|√|×|[TtFf])\s*[)）]\s*$/;

/** 配对分隔符：—— | — | -- | - | ｜ | | | ： | : */
const PAIR_SEPARATOR_RE = /^(.+?)\s*(?:——|—|--|-|｜|\||：|:)\s*(.+)$/;

// ==================== 辅助函数 ====================

/**
 * 解析选择题答案为选项索引。
 * 支持 A/B/C/D（不区分大小写）和 1/2/3/4（1-based）。
 * @returns 0-3 的索引，无效时返回 -1
 */
function parseChoiceAnswer(answer: string): number {
  const cleaned = answer.trim().toUpperCase();
  // 字母 A-D → 0-3
  const letterMatch = cleaned.match(/^([A-D])/);
  if (letterMatch) {
    return letterMatch[1].charCodeAt(0) - 65;
  }
  // 数字 1-4 → 0-3（1-based 转 0-based）
  const num = parseInt(cleaned, 10);
  if (!Number.isNaN(num)) {
    if (num >= 1 && num <= 4) return num - 1;
    if (num >= 0 && num <= 3) return num;
  }
  return -1;
}

/**
 * 解析判断题答案为布尔值。
 * 支持：对/正确/√/T → true，错/错误/×/F → false
 * @returns 布尔值，无法识别时返回 null
 */
function parseTrueFalseAnswer(answer: string): boolean | null {
  const cleaned = answer.trim().toLowerCase();
  if (/^(正确|对|√|t|true)$/.test(cleaned)) return true;
  if (/^(错误|错|×|f|false)$/.test(cleaned)) return false;
  return null;
}

/** 解析配对行，返回 MatchPair 或 null */
function parsePairLine(line: string): MatchPair | null {
  const match = line.match(PAIR_SEPARATOR_RE);
  if (!match) return null;
  const left = match[1].trim();
  const right = match[2].trim();
  if (left.length === 0 || right.length === 0) return null;
  return { id: generateId(), left, right };
}

// ==================== 主解析函数 ====================

/**
 * 解析纯文本为题目和配对数据。
 *
 * 自动识别选择题、判断题和配对题：
 * - 以数字开头的行视为题目起始，后续的 A/B/C/D 行为选项，"答案:" 行为答案。
 * - 判断题答案可以是单独的"答案: 对/错"行，或题干末尾的 (对)/(错)。
 * - 不以数字开头的行，若含分隔符（- | ：等），则视为配对项。
 *
 * @param text 老师粘贴的原始文本
 * @returns 解析出的题目数组和配对数组
 */
export function parsePlainText(text: string): {
  questions: Question[];
  pairs: MatchPair[];
} {
  const questions: Question[] = [];
  const pairs: MatchPair[] = [];

  // 按行分割并去除首尾空白
  const lines = text.split(/\r?\n/).map((l) => l.trim());

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 跳过空行
    if (line === '') {
      i++;
      continue;
    }

    // 尝试匹配题目起始行
    const qStart = line.match(QUESTION_START_RE);
    if (qStart) {
      let questionText = qStart[1].trim();
      const options: string[] = [];
      let answer: string | null = null;

      // 检查题干末尾的内联判断题答案，如 "题目 (对)"
      const inlineAns = questionText.match(INLINE_TF_RE);
      if (inlineAns) {
        answer = inlineAns[1];
        questionText = questionText.slice(0, inlineAns.index).trim();
      }

      // 继续读取后续行，收集选项和答案
      i++;
      while (i < lines.length) {
        const next = lines[i];

        // 遇到下一个题目起始行，结束当前块
    if (QUESTION_START_RE.test(next)) break;

        // 遇到空行，结束当前块
        if (next === '') break;

        // 匹配选项行
        const opt = next.match(OPTION_RE);
        if (opt) {
          options.push(opt[2].trim());
          i++;
          continue;
        }

        // 匹配答案行
        const ans = next.match(ANSWER_RE);
        if (ans) {
          answer = ans[1].trim();
          i++;
          continue;
        }

        // 其他行跳过（可能是题目续行或说明文字）
        i++;
      }

      // 根据收集到的信息判断题型
      if (options.length >= 2 && answer) {
        // 选择题：有选项 + 答案
        const idx = parseChoiceAnswer(answer);
        if (idx >= 0 && idx < options.length) {
          questions.push({
            id: generateId(),
            type: 'choice',
            difficulty: 'medium',
            question: questionText,
            options,
            answer: idx,
          });
        }
      } else if (answer) {
        // 判断题：无选项 + 答案
        const tf = parseTrueFalseAnswer(answer);
        if (tf !== null) {
          questions.push({
            id: generateId(),
            type: 'truefalse',
            difficulty: 'medium',
            question: questionText,
            answer: tf,
          });
        }
      }
      // 无法识别的题目块跳过
      continue;
    }

    // 非题目起始行，尝试解析为配对
    const pair = parsePairLine(line);
    if (pair) {
      pairs.push(pair);
    }

    i++;
  }

  return { questions, pairs };
}
