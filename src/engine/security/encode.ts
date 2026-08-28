/**
 * 安全模块 - 答案编码
 *
 * 将答案数据 Base64 编码，防止学生通过查看源代码直接看到答案。
 * 连连看/翻牌记忆的配对关系只在运行时内存中解码，不写入 DOM 属性。
 * 跨模块调用方：src/games/ 下的 game.html.ts
 */

/** Base64 编码（兼容中文 UTF-8） */
export function encodeBase64(str: string): string {
  // 浏览器环境使用 btoa + encodeURIComponent
  // 游戏运行时也用相同方式解码
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of utf8Bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/** Base64 解码 */
export function decodeBase64(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * 生成游戏运行时解码函数的 JS 代码片段。
 * 注入到游戏 HTML 中，供游戏 JS 运行时调用。
 */
export function getDecoderScript(): string {
  return `
    function _dec(b64) {
      var binary = atob(b64);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    }
  `;
}
