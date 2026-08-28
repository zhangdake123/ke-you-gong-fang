/**
 * 游戏共享工具 - 洗牌算法 + 安全工具
 *
 * Fisher-Yates 洗牌算法，用于打乱题目/选项/配对顺序。
 * 跨模块调用方：src/games/{quiz,matching,memory,whack-mole,poetry-puzzle}/game.html.ts
 */

/** Fisher-Yates 洗牌（纯函数，不修改原数组） */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 生成洗牌函数的 JS 代码片段（注入到游戏 HTML 中运行时使用） */
export function getShuffleScript(): string {
  return `
    function _shuffle(arr) {
      var result = arr.slice();
      for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
      return result;
    }
  `;
}

/** HTML 转义（防止 XSS） */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** 获取评分报告解码器 JS 代码片段（注入到游戏 HTML 中） */
export function getDecoderScript(): string {
  return `
    function _decodeReport(data, password) {
      try {
        if (password) {
          var decoded = atob(data);
          return JSON.parse(decoded);
        }
        return JSON.parse(data);
      } catch(e) {
        return null;
      }
    }
  `;
}
