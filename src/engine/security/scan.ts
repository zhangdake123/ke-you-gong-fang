/**
 * 安全模块 - 敏感信息扫描
 *
 * 导出前扫描教学内容，检测是否包含敏感信息。
 * 跨模块调用方：src/engine/exporter/index.ts
 */

interface ScanResult {
  hasSensitive: boolean;
  warnings: string[];
}

/** 敏感信息正则模式 */
const PATTERNS = [
  { name: '手机号', pattern: /1[3-9]\d{9}/g },
  { name: '身份证号', pattern: /\d{17}[\dXx]/g },
  { name: 'API密钥', pattern: /(?:api[_-]?key|secret|token|password)[=:]\s*\S+/gi },
  { name: '银行卡号', pattern: /\d{16,19}/g },
];

/** 扫描文本中的敏感信息 */
export function scanSensitiveInfo(content: string): ScanResult {
  const warnings: string[] = [];

  for (const { name, pattern } of PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      warnings.push(`检测到可能的${name}（${matches.length}处）`);
    }
  }

  return {
    hasSensitive: warnings.length > 0,
    warnings,
  };
}
