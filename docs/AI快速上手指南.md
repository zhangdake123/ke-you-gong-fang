# AI 快速上手指南

> 本文档是 AI 接手开发时读的第一份文档。读完即可开始干活。

## 项目是什么

课游工坊：零代码教学游戏生成工具。老师选择课本课文 → AI 出题 → 选择游戏模板 → 预览 → 下载单文件离线 HTML 游戏。

最终产物：一个部署在 Vercel 上的静态网站（教师工作台）+ 导出的单文件 HTML 游戏文件。

## 技术栈

- React 18 + Vite + TypeScript + TailwindCSS（教师工作台）
- Zustand（状态管理）
- 原生 HTML/CSS/JS（游戏模板，零依赖）
- Vitest + Testing Library（测试）
- DeepSeek V4 flash API（AI 出题）

## 文件地图（改哪里找哪里）

| 要改什么 | 去哪里 |
|---------|--------|
| 出题逻辑 | `src/engine/ai/generator.ts` |
| 提示词 | `src/engine/ai/prompts/chinese.ts`（语文）/ `general.ts`（通用） |
| API 接入 | `src/engine/ai/provider.ts` |
| AI 返回解析 | `src/engine/ai/parser.ts` |
| 规则解析（降级） | `src/engine/parser/index.ts` |
| 课本目录 | `src/data/textbooks.ts` |
| 游戏模板 | `src/games/{quiz,matching,memory}/` |
| 游戏注册 | `src/games/index.ts` → `src/games/registry.ts` |
| 导出逻辑 | `src/engine/exporter/index.ts` |
| 安全模块 | `src/engine/security/{escape,scan,encode}.ts` |
| 教师 UI | `src/components/teacher/` |
| 通用 UI | `src/components/common/` |
| 状态管理 | `src/store/useAppStore.ts` |
| 类型定义 | `src/types/index.ts` |
| 文档 | `docs/` |

## 编码约定

- 组件用函数式 + Hooks，不用 class
- 状态用 Zustand（useAppStore），不用 Redux/Context 嵌套
- 游戏模板必须零依赖（原生 HTML/CSS/JS，不用 CDN/框架）
- 所有用户输入必须转义（`src/engine/security/escape.ts`）
- 配对关系不写入 DOM 属性（防作弊）
- 跨模块 import 写注释说明调用方
- 不写多余注释，只在 WHY 非显然时写

## 避坑指南

- 游戏模板的 JS 不能用 ES Module import/export（要内联到单文件 HTML）
- 导出的 HTML 要在断网环境下测试（零依赖是硬要求）
- 题目数据注入用 Base64 编码，不用明文
- TailwindCSS 只用于教师工作台，游戏模板不用
- 游戏模板的 CSS 要内联到 `<style>` 标签中

## 常见任务入口

- **新增游戏模板** → 读完 `docs/游戏模板开发规范.md` → 复制 `src/games/quiz/` 结构
- **新增学科** → 复制 `src/engine/ai/prompts/chinese.ts` → 改知识点和提示词
- **接入 AI API** → 实现 `src/engine/ai/provider.ts` 的 AIProvider 接口
- **改出题提示词** → 编辑 `src/engine/ai/prompts/chinese.ts` 的 templates 字段
- **添加课本目录** → 编辑 `src/data/textbooks.ts`

## 后续优化

见 `docs/待办清单-AI版.md`（AI 版，含代码路径）或 `docs/待办清单-人读版.md`（人类版）。
