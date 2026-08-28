# 课游工坊 — AI 内置技能

> 本文件是 AI 助手的项目理解入口。读完此文件即可开始开发和调整。
> 人类开发者可先读 README.md 了解概览。

## 项目概述

课游工坊是一款面向小学语文教师的零代码教学游戏生成工具。
教师选择课本课文 → AI 出题 → 选择游戏模板 → 预览 → 下载单文件离线 HTML 游戏。

**核心价值**：老师不需要任何技术能力，5 分钟做出可用的课堂互动游戏。
**部署方式**：打包后双击启动器即用（Python 静态服务器 + 浏览器），无需安装 Node.js。

## 技术栈

- React 18 + Vite + TypeScript + TailwindCSS（教师工作台）
- Zustand（状态管理，不用 Redux）
- 原生 HTML/CSS/JS（游戏模板，零依赖，内联到单文件 HTML）
- DeepSeek V4 flash API（AI 出题，OpenAI 兼容格式）
- Vitest + Testing Library（测试）

## 文件地图

```
ke-you-gong-fang/
├── 启动课游工坊.command          # macOS 启动器（双击即用）
├── 启动课游工坊.bat              # Windows 启动器（三级回退：Python→PowerShell→直接打开）
├── 启动服务-PowerShell.ps1       # PowerShell 静态服务器（Windows 无 Python 时自动调用）
├── SKILL.md                      # 本文件（AI 入口）
├── VERSION.md                    # 版本摘要 + 版本记录
├── README.md                     # 项目说明（人类入口）
├── dist/                         # 构建产物（静态网站）
├── docs/                         # 文档
│   ├── AI快速上手指南.md          # AI 速览（精简版，先读）
│   ├── 系统架构文档.md            # 架构图 + 数据流
│   ├── 游戏模板开发规范.md         # 新增游戏的接口规范
│   ├── AI出题配置说明.md          # 提示词 + API 配置
│   ├── 开发指南.md               # 环境搭建 + 构建
│   ├── 待办清单-人读版.md         # 后续优化方向（人类视角）
│   └── 待办清单-AI版.md           # 后续优化方向（AI 视角，含代码路径）
├── src/
│   ├── types/index.ts            # 全部类型定义（改类型来这里）
│   ├── store/useAppStore.ts      # Zustand 全局状态
│   ├── components/
│   │   ├── teacher/              # 教师端 5 步流程组件
│   │   └── common/               # 通用 UI 组件
│   ├── engine/
│   │   ├── ai/
│   │   │   ├── prompts/          # 提示词配置（按学科分文件）
│   │   │   ├── provider.ts       # DeepSeek API 抽象层
│   │   │   ├── generator.ts      # 出题服务
│   │   │   └── parser.ts         # AI 返回解析
│   │   ├── parser/index.ts       # 规则解析（降级方案）
│   │   ├── exporter/index.ts     # 单文件 HTML 导出
│   │   └── security/             # 转义 + 扫描 + 编码
│   ├── games/
│   │   ├── registry.ts           # 游戏模板注册表
│   │   ├── index.ts              # 注册入口
│   │   ├── quiz/                 # 闯关问答
│   │   ├── matching/             # 连连看
│   │   ├── memory/               # 翻牌记忆
│   │   └── shared/               # 洗牌 + 编码工具
│   └── data/textbooks.ts         # 部编版语文课本目录
└── tests/
```

## 常见开发任务

### 改出题提示词
文件：`src/engine/ai/prompts/chinese.ts`
- 修改 `templates` 对象中对应题型的提示词
- 保持 `{{count}}` `{{grade}}` `{{knowledgePoint}}` `{{difficulty}}` `{{content}}` 变量不变
- 保持输出 JSON 格式要求不变

### 接入 / 切换 AI API
文件：`src/engine/ai/provider.ts`
- 实现 `AIProvider` 接口
- API key 从 localStorage（key: `kygf_deepseek_apikey`）或环境变量 `VITE_DEEPSEEK_API_KEY` 读取
- DeepSeek V4 是推理模型，响应含 `content` + `reasoning_content`，content 为空时需从 reasoning_content 提取

### 新增游戏模板
1. 读 `docs/游戏模板开发规范.md`
2. 复制 `src/games/quiz/` 目录
3. 实现 `GameTemplate` 接口
4. 在 `src/games/index.ts` 中注册
5. 硬性要求：零依赖、单文件、防作弊、响应式

### 新增学科
1. 复制 `src/engine/ai/prompts/chinese.ts`
2. 修改知识点和提示词
3. 在 `src/engine/ai/prompts/index.ts` 中注册

### 添加课本目录
文件：`src/data/textbooks.ts`
- 按 `Textbook` 接口添加数据
- 使用 `getTextbooks(grade, semester)` 查询

## 编码约定

1. 组件用函数式 + Hooks，不用 class
2. 状态用 Zustand（useAppStore），不用 Context 嵌套
3. 游戏模板 JS 不能用 ES Module（内联到单文件 HTML）
4. 游戏模板 CSS 必须内联到 `<style>` 标签
5. 所有用户输入用 `escapeHtml()` 转义
6. 配对关系不写入 DOM 属性（防作弊）
7. 答案用 Base64 编码存储
8. 跨模块 import 写注释说明调用方
9. TailwindCSS 只用于教师工作台，游戏模板不用

## 避坑指南

- 游戏模板的 JS 不能用 `import/export`，必须内联
- 导出的 HTML 要在断网环境测试（零依赖是硬要求）
- DeepSeek V4 flash 会先推理再输出，max_tokens 要设 8192+
- `content` 为空时检查 `reasoning_content` 字段
- Vite 配置 `base: './'` 才能打包后直接打开
- 不要在源码中硬编码 API key
