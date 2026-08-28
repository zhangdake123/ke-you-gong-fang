/**
 * DeepSeek AI Provider
 *
 * 实现 AIProvider 接口，对接 DeepSeek API（兼容 OpenAI Chat Completions 格式）。
 * API Key 不硬编码在代码中，运行时从 localStorage 或环境变量读取。
 * 跨模块调用方：src/engine/ai/generator.ts（QuestionGenerator）
 */
import type { AIProvider, AIRequestOptions } from '../../types';

/** DeepSeek API 默认模型 */
const DEFAULT_MODEL = 'deepseek-v4-flash';

/** DeepSeek API 默认地址 */
const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';

/** localStorage 中存储 API Key 的键名 */
export const API_KEY_STORAGE_KEY = 'kygf_deepseek_apikey';

/** 环境变量名（Vite 注入） */
const ENV_API_KEY = 'VITE_DEEPSEEK_API_KEY';

/**
 * 从 localStorage 或环境变量读取 DeepSeek API Key。
 * 优先读取 localStorage（用户在设置页面手动输入的 key），
 * 如果 localStorage 中没有，则回退到 Vite 环境变量。
 */
export function getDeepSeekApiKey(): string {
  // 优先从 localStorage 读取
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) return stored;
  }
  // 回退到 Vite 环境变量
  const env = import.meta.env as Record<string, string | undefined>;
  const envKey = env[ENV_API_KEY];
  if (envKey) return envKey;
  return '';
}

/** 将 API Key 保存到 localStorage */
export function saveDeepSeekApiKey(key: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  }
}

/** 清除已保存的 API Key */
export function clearDeepSeekApiKey(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * DeepSeek AI Provider 实现。
 *
 * 使用 OpenAI 兼容的 Chat Completions 接口格式。
 * 响应解析：返回 choices[0].message.content。
 */
export class DeepSeekProvider implements AIProvider {
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor(apiKey: string, baseURL?: string, model?: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL ?? DEFAULT_BASE_URL;
    this.model = model ?? DEFAULT_MODEL;
  }

  /** 检查 API Key 是否已配置 */
  isAvailable(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * 调用 DeepSeek API 生成内容。
   * @param prompt 用户提示词
   * @param systemPrompt 系统提示词
   * @param options 温度、最大 token、是否启用联网搜索
   * @returns AI 生成的文本内容
   */
  async complete(
    prompt: string,
    systemPrompt: string,
    options?: AIRequestOptions,
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('DeepSeek API Key 未配置，请在设置中填写 API Key');
    }

    // 构建请求体（兼容 OpenAI Chat Completions 格式）
    const body: Record<string, unknown> = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    };

    // 启用联网搜索时，在请求中加入 web_search 工具
    if (options?.webSearch) {
      body.tools = [{ type: 'web_search' }];
    }

    const url = `${this.baseURL}/chat/completions`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new Error(
        `DeepSeek API 网络请求失败：${e instanceof Error ? e.message : String(e)}`,
      );
    }

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorBody = await response.text();
        errorDetail = errorBody;
      } catch {
        errorDetail = '(无法读取错误详情)';
      }
      throw new Error(
        `DeepSeek API 请求失败 (HTTP ${response.status})：${errorDetail}`,
      );
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error('DeepSeek API 返回的 JSON 数据无法解析');
    }

    // 解析响应：choices[0].message
    // DeepSeek V4 是推理模型，返回 content（最终答案）和 reasoning_content（思考过程）
    // 当推理 token 不足时 content 可能为空，需从 reasoning_content 中提取 JSON
    const choices = (data as {
      choices?: {
        message?: { content?: unknown; reasoning_content?: unknown };
        finish_reason?: string;
      }[];
    })?.choices;
    const message = choices?.[0]?.message;
    const content = message?.content;
    const reasoning = message?.reasoning_content;
    const finishReason = choices?.[0]?.finish_reason;

    // content 是字符串且非空 → 直接返回
    if (typeof content === 'string' && content.trim().length > 0) {
      return content;
    }

    // content 为空但 reasoning_content 有内容 → 从推理过程中提取 JSON
    if (typeof reasoning === 'string' && reasoning.trim().length > 0) {
      // 尝试从 reasoning_content 中提取 JSON
      const jsonMatch = reasoning.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
    }

    // 如果是因为 token 不足导致截断
    if (finishReason === 'length') {
      throw new Error('AI 回复被截断（token 不足），请减少题目数量或缩短教学内容');
    }

    throw new Error('DeepSeek API 返回格式异常：content 为空且无法从推理内容中提取有效数据');
  }
}

/**
 * 创建 DeepSeek Provider 实例的工厂函数。
 * @param apiKey API Key（从 localStorage 或用户输入获取）
 * @param baseURL 可选的 API 地址，默认 https://api.deepseek.com/v1
 */
export function createDeepSeekProvider(
  apiKey: string,
  baseURL?: string,
): DeepSeekProvider {
  return new DeepSeekProvider(apiKey, baseURL);
}

/**
 * 使用 localStorage / 环境变量中的 API Key 自动创建 DeepSeek Provider。
 * 如果未配置 API Key，返回的实例 isAvailable() 将为 false。
 */
export function createDefaultDeepSeekProvider(): DeepSeekProvider {
  const apiKey = getDeepSeekApiKey();
  return new DeepSeekProvider(apiKey);
}
