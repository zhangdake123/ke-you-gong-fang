# 版本记录

## 当前版本：v1.0.0

**版本名称**：课游工坊 — 初代版

**发布日期**：2026-08-28

## 版本摘要

课游工坊是一款面向小学语文教师的零代码教学游戏生成工具。教师选择课本课文 → AI 出题 → 选择游戏模板 → 预览 → 下载单文件离线 HTML 游戏，直接发给学生上课用。

### 核心能力

| 能力 | 说明 |
|------|------|
| AI 智能出题 | DeepSeek V4 flash，课本锚定模式，严格只从老师粘贴的课文内容出题 |
| 三种游戏模板 | 闯关问答（选择题/判断题）、连连看（配对题）、翻牌记忆（记忆配对） |
| 单文件离线导出 | 零依赖 HTML，断网双击即玩，93KB 以内 |
| 防作弊设计 | 答案 Base64 编码，配对关系不写入 DOM |
| 课本目录 | 部编版小学语文 1-6 年级 12 本课本，300+ 篇课文 |
| 双击启动器 | macOS .command / Windows .bat，无需安装 Node.js |

### 技术栈

- React 18 + Vite + TypeScript + TailwindCSS
- Zustand（状态管理）
- DeepSeek V4 flash（AI 出题）
- 原生 HTML/CSS/JS（游戏模板，零依赖）

### AI 配置

- 模型：deepseek-v4-flash
- API：https://api.deepseek.com/v1
- API Key：存储在浏览器 localStorage，key 名 `kygf_deepseek_apikey`
- 也可通过 `.env.local` 文件配置环境变量 `VITE_DEEPSEEK_API_KEY`

---

## 版本记录

### v1.0.0 — 2026-08-28 — 初代版

#### 新增
- 教师工作台：5 步流程（输入配置 → 题目编辑 → 选择游戏 → 预览 → 导出）
- AI 出题模块：DeepSeek V4 flash Provider + 提示词配置（语文 8 知识点 / 通用 3 知识点）
- 课本锚定出题：年级 → 学期 → 单元 → 课文 → 粘贴内容 → AI 严格从内容出题
- 三个游戏模板：闯关问答、连连看、翻牌记忆（均零依赖、防作弊、响应式）
- 安全模块：输入转义、敏感信息扫描、答案 Base64 编码
- 导出引擎：单文件 HTML 生成 + Blob 下载
- 部编版课本目录：1-6 年级上下册，96 单元 300+ 课文
- 规则解析引擎：AI 不可用时的降级方案
- 文档体系：AI 技能文件 + 6 份结构化文档 + 双版待办清单
- 启动器：macOS .command + Windows .bat

#### 已知问题
- AI 出题偶尔返回空 content（推理模型 token 不足），已做 reasoning_content 回退
- 游戏模板未支持音效（在待办清单中）
- 题库管理仅 localStorage，无云同步（在待办清单中）

#### 文件统计
- 源代码：33 个 TS/TSX 文件
- 文档：8 份（SKILL + VERSION + README + 6 份 docs）
- 构建产物：368KB（gzip 91KB）
