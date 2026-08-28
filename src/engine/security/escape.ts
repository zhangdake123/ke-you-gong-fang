/**
 * 安全模块 - 输入转义
 *
 * 防止 XSS：所有用户输入在注入 HTML 前必须经过转义。
 * 跨模块调用方：src/engine/exporter/index.ts
 */

/** HTML 特殊字符转义 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 转义 JSON 字符串中的特殊字符（防止注入） */
export function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/** 批量转义题目数据 */
export function sanitizeQuestion(q: {
  question?: string;
  options?: string[];
  explanation?: string;
}) {
  return {
    question: q.question ? escapeHtml(q.question) : '',
    options: q.options?.map(escapeHtml) ?? [],
    explanation: q.explanation ? escapeHtml(q.explanation) : '',
  };
}
