# AI 待办清单

> 本文件供 AI 助手读取，包含具体的代码路径、修改方案和依赖关系。
> 人类版请读 `docs/待办清单-人读版.md`。

---

## 高优先级

### TASK-001：新增「打地鼠」游戏模板

**目标**：地鼠头顶跳出字/词，学生快速点击正确的，限时计分。

**新建文件**：
```
src/games/whack-mole/
├── template.ts       # 实现 GameTemplate 接口
├── game.html.ts      # HTML 生成函数
└── (参考 src/games/quiz/ 结构)
```

**修改文件**：
- `src/games/index.ts` — 添加 import + registerGame

**接口要求**：
- id: `'whack-mole'`
- supportedTypes: `['choice']`
- minItems: 5
- isRecommended: questions 中有 choice 类型且 >= 5

**实现要点**：
- HTML 模板参考 `src/games/quiz/game.html.ts` 的结构
- 地鼠用 CSS 动画从洞中弹出（`@keyframes` + `transform: translateY`）
- 每只地鼠头顶显示一个选项文本
- 题目在上方显示，学生点击地鼠选择答案
- 正确：加分 + 消失动画；错误：扣分 + 摇晃动画
- 限时 60 秒，结算页显示得分
- 导入 `encodeBase64` / `getDecoderScript` / `getShuffleScript` / `escapeHtml`

**复杂度**：中（~400 行 HTML 模板）

---

### TASK-002：新增「诗句拼图」游戏模板

**目标**：把诗句打乱，拖拽排列成正确的顺序。

**前置依赖**：需在 `src/types/index.ts` 新增题型 `'ordering'`
- 在 `QuestionType` 联合类型中加入 `'ordering'`
- 新增 `OrderingQuestion` 接口：`{ id, type: 'ordering', question, segments: string[], correctOrder: number[] }`
- 在 `Question` 联合类型中加入 `OrderingQuestion`

**新建文件**：
```
src/games/poetry-puzzle/
├── template.ts
├── game.html.ts
```

**修改文件**：
- `src/types/index.ts` — 新增 ordering 题型
- `src/engine/ai/prompts/chinese.ts` — 新增 ordering 提示词模板
- `src/games/index.ts` — 注册新模板

**提示词设计要点**：
- 输入：古诗词内容
- 输出：`{segments: ["片断1", "片断2", ...], correctOrder: [0,2,1,3,...]}`
- 每句拆成 2-4 个片段

**实现要点**：
- 拖拽用原生 HTML5 Drag and Drop API（`draggable` + `dragstart` + `drop`）
- 完成后高亮显示完整诗句
- 支持多首诗连续闯关

**复杂度**：高（需新增题型 + 拖拽逻辑，~500 行）

---

### TASK-003：AI 联网搜索出题

**目标**：DeepSeek V4 flash 支持联网搜索，可搜索权威练习题作为参考。

**修改文件**：
- `src/engine/ai/generator.ts` — `generate()` 方法中启用 `webSearch: true`
- `src/engine/ai/prompts/chinese.ts` — 提示词加入"可参考网上权威练习题"
- `src/components/teacher/InputPanel.tsx` — 添加联网搜索开关 UI

**代码变更**：
```typescript
// generator.ts 第 126 行附近
raw = await this.provider.complete(prompt, this.config.system, {
  temperature: 0.7,
  maxTokens: 8192,
  webSearch: true,  // 新增
});
```

**UI 变更**：
- InputPanel 中在 AI 开关旁添加「联网搜索」复选框
- 状态加入 `useAppStore.ts` 的 `questionRequest` 或单独字段

**复杂度**：低

---

### TASK-004：Vercel 自动部署

**目标**：推送到 GitHub 后自动部署，生成在线网址。

**新建文件**：
- `.github/workflows/deploy.yml` 或直接用 Vercel 连接 GitHub

**已就绪**：
- `vercel.json` 已配置
- `vite.config.ts` 已设置 `base: './'`

**操作步骤**（非代码）：
1. 在 Vercel 导入 GitHub 仓库
2. 选择 vite 框架
3. 部署后获得网址

**复杂度**：低

---

## 中优先级

### TASK-005：新增「词语消消乐」游戏模板

**目标**：方块上有词语，点击配对的消除（反义词/近义词/同类词）。

**新建文件**：`src/games/word-crush/`

**实现要点**：
- 网格布局（`display: grid`），每格一个词
- 点击两个词，判断关系（复用 matching 配对数据）
- 正确消除 + 加分，错误闪烁
- 消除动画用 CSS `transform: scale(0)` + `opacity: 0`

**复杂度**：中（~350 行）

---

### TASK-006：新增「大转盘」游戏模板

**目标**：转盘随机选题，答对加分答错扣分。

**新建文件**：`src/games/spin-wheel/`

**实现要点**：
- CSS `transform: rotate()` + `transition` 旋转动画
- 转盘分成 N 个扇区（用 `conic-gradient` 或 SVG）
- 点击旋转，随机停在某个扇区
- 停下后显示该扇区对应的题目

**复杂度**：中（~300 行）

---

### TASK-007：智能难度调节

**修改文件**：
- `src/engine/ai/generator.ts` — 记录被删除/修改的题目，调整下次难度
- `src/store/useAppStore.ts` — 添加难度历史记录状态

**复杂度**：中

---

### TASK-008：多学科扩展（数学/英语）

**新建文件**：
- `src/engine/ai/prompts/math.ts` — 数学知识点 + 提示词
- `src/engine/ai/prompts/english.ts` — 英语知识点 + 提示词

**修改文件**：
- `src/engine/ai/prompts/index.ts` — 注册新学科

**复杂度**：低（复制 chinese.ts 结构修改内容）

---

### TASK-009：题库持久化

**新建文件**：`src/store/useBankStore.ts`

**功能**：
- 保存当前题目为题库条目（localStorage）
- 题库列表（按时间/学科/年级筛选）
- 一键加载题库到编辑器
- 题库导入/导出 JSON

**复杂度**：中

---

### TASK-010：音效系统

**修改文件**：
- `src/games/shared/` — 新增 `sound.ts`，用 Web Audio API 生成简单音效
- 各游戏模板 `game.html.ts` — 在关键交互点加入音效调用
- `src/types/index.ts` — `ExportOptions` 加入 `soundEnabled: boolean`
- `src/components/teacher/GamePreview.tsx` — 添加音效开关

**复杂度**：低

---

## 低优先级

### TASK-011：深色模式
- 修改文件：`tailwind.config.js`（darkMode: 'class'）+ 各组件添加 `dark:` 类名
- 复杂度：低

### TASK-012：快捷键支持
- 修改文件：`src/App.tsx` + `src/components/teacher/*`
- 复杂度：低

### TASK-013：PWA 支持
- 新建文件：`public/manifest.json` + `public/sw.js`
- 修改文件：`index.html`（注册 Service Worker）
- 复杂度：中

### TASK-014：数据云同步
- 需要后端支持，当前架构纯前端
- 复杂度：高

### TASK-015：排行榜
- 修改文件：各游戏模板 `game.html.ts`
- 数据存 localStorage
- 复杂度：低

### TASK-016：多人模式
- 需要同屏分组或局域网
- 复杂度：高

---

## 依赖关系

```
TASK-002（诗句拼图）→ 依赖新增 ordering 题型
TASK-005（词语消消乐）→ 可复用 matching 配对数据
TASK-007（智能难度）→ 依赖题库存储（TASK-009）
TASK-010（音效）→ 独立，但需修改所有游戏模板
TASK-013（PWA）→ 独立
```

## 建议实施顺序

1. TASK-004（Vercel 部署）— 零代码，先上线
2. TASK-003（联网搜索）— 改动小，效果明显
3. TASK-001（打地鼠）— 用户最期待的新游戏
4. TASK-009（题库持久化）— 基础设施
5. TASK-002（诗句拼图）— 需新增题型，工作量最大
