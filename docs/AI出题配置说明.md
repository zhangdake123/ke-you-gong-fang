# AI 出题配置说明

## 整体架构

```
提示词配置 (prompts/)  →  出题服务 (generator.ts)  →  API 调用 (provider.ts)  →  结果解析 (parser.ts)
```

## 提示词配置

### 文件位置
- 语文：`src/engine/ai/prompts/chinese.ts`
- 通用：`src/engine/ai/prompts/general.ts`
- 统一导出：`src/engine/ai/prompts/index.ts`

### 配置结构

```typescript
interface PromptConfig {
  name: string;                    // 学科名称
  grades: number[];                // 支持的年级
  knowledgePoints: KnowledgePoint[];  // 知识点分类
  difficulties: { id: string; name: string; desc: string }[];  // 难度等级
  system: string;                  // 系统提示词
  templates: Record<string, string>;  // 题型 → 提示词模板
}
```

### 模板变量

提示词模板中使用 `{{变量名}}` 占位，generator.ts 会替换：

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{count}}` | 生成数量 | 5 |
| `{{grade}}` | 年级 | 3 |
| `{{knowledgePoint}}` | 知识点名称 | 词语理解 |
| `{{difficulty}}` | 难度 | medium |
| `{{content}}` | 教学内容 | 老师粘贴的课文 |

### 出题约束（核心）

所有提示词都包含以下约束：
1. AI 严格只从老师粘贴的教学内容中出题
2. 不得使用输入内容以外的知识点
3. 输出格式必须是纯 JSON
4. 不得包含解释性文字

### 题型与输出格式

| 题型 | 输出 JSON 结构 | 对应游戏 |
|------|---------------|---------|
| choice | `{questions: [{id, type, difficulty, question, options, answer, explanation}]}` | 闯关问答 |
| truefalse | `{questions: [{id, type, difficulty, question, answer, explanation}]}` | 闯关问答 |
| matching | `{pairs: [{id, left, right}]}` | 连连看 |
| memory | `{pairs: [{id, left, right}]}` | 翻牌记忆 |

## API 接入

### DeepSeek V4 flash

- **模型**：`deepseek-v4-flash`
- **API 格式**：OpenAI 兼容 Chat Completions
- **Base URL**：`https://api.deepseek.com/v1`
- **API Key 存储**：`localStorage`，key 名 `kygf_deepseek_apikey`

### Provider 接口

```typescript
interface AIProvider {
  complete(prompt: string, systemPrompt: string, options?: AIRequestOptions): Promise<string>;
  isAvailable(): boolean;
}
```

### 联网搜索

DeepSeek 新版 API 支持联网搜索（通过 Responses API 的 `web_search` 工具）。
在 `AIRequestOptions` 中设置 `webSearch: true` 即可启用。

### 降级策略

- API 不可用 → 切换规则解析（`src/engine/parser/`）
- AI 返回格式错误 → 尝试 JSON 提取修复
- AI 返回题目不足 → 提示实际数量，可补充出题

## 如何修改提示词

1. 打开 `src/engine/ai/prompts/chinese.ts`
2. 找到对应题型的 template（choice/truefalse/matching/memory）
3. 修改提示词文本，保持 `{{变量名}}` 不变
4. 保持输出 JSON 格式要求不变

## 如何添加新学科

1. 复制 `src/engine/ai/prompts/chinese.ts` → `math.ts`
2. 修改 name/grades/knowledgePoints/difficulties
3. 修改 system 和 templates 中的提示词
4. 在 `index.ts` 中导出并注册到 `getPromptConfig()`
