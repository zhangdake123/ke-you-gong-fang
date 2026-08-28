/**
 * 导出引擎
 *
 * 负责将题目数据通过游戏模板生成单文件 HTML 并触发下载。
 * 跨模块调用方：src/components/teacher/ExportPanel.tsx
 */
import type { GameContent, ExportOptions } from '../../types';
import { gameRegistry } from '../../games/registry';
import { scanSensitiveInfo } from '../security/scan';
import { escapeHtml } from '../security/escape';

export interface ExportResult {
  success: boolean;
  html?: string;
  warnings: string[];
  error?: string;
}

/** 生成单文件 HTML */
export function generateGameHTML(
  gameId: string,
  content: GameContent,
  options: ExportOptions
): ExportResult {
  const template = gameRegistry.get(gameId);
  if (!template) {
    return { success: false, warnings: [], error: `未找到游戏模板: ${gameId}` };
  }

  // 敏感信息扫描
  const scanContent = content.questions
    .map((q) => 'question' in q ? q.question : '')
    .join(' ') + content.pairs.map((p) => p.left + p.right).join(' ');
  const scan = scanSensitiveInfo(scanContent);

  try {
    const html = template.generateHTML(content, options);
    return {
      success: true,
      html,
      warnings: scan.warnings,
    };
  } catch (e) {
    return {
      success: false,
      warnings: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/** 触发浏览器下载 */
export function downloadHTML(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 生成安全的文件名 */
export function safeFilename(title: string): string {
  const safe = title.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim() || '课堂游戏';
  return `${safe}.html`;
}
