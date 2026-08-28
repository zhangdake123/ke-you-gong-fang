/**
 * 语文提示词配置
 *
 * 面向小学语文（部编版）的 AI 出题提示词。
 * 支持两种模式：
 *   1. 联网搜索模式：AI 根据年级/学期/单元/课文自行搜索课文内容出题
 *   2. 粘贴内容模式：AI 严格从老师粘贴的内容出题
 *
 * 跨模块调用方：src/engine/ai/generator.ts（QuestionGenerator）
 */
import type { KnowledgePoint } from '../../../types';
import type { PromptConfig } from './index';

/** 语文知识点分类 */
const knowledgePoints: KnowledgePoint[] = [
  {
    id: 'pinyin',
    name: '拼音',
    description: '声母、韵母、整体认读音节、声调、拼读规则',
    recommendedTypes: ['choice', 'truefalse', 'memory'],
  },
  {
    id: 'character',
    name: '识字写字',
    description: '生字认读、笔画笔顺、偏旁部首、间架结构',
    recommendedTypes: ['choice', 'truefalse', 'matching'],
  },
  {
    id: 'word',
    name: '词语理解',
    description: '近义词、反义词、词语搭配、词义辨析',
    recommendedTypes: ['choice', 'truefalse', 'matching'],
  },
  {
    id: 'idiom',
    name: '成语',
    description: '成语含义、来源、用法、近义反义成语',
    recommendedTypes: ['choice', 'truefalse', 'matching'],
  },
  {
    id: 'sentence',
    name: '句子训练',
    description: '造句、扩句缩句、修改病句、修辞手法',
    recommendedTypes: ['choice', 'truefalse'],
  },
  {
    id: 'reading',
    name: '阅读理解',
    description: '课文内容理解、主旨概括、段落分析、人物形象',
    recommendedTypes: ['choice', 'truefalse'],
  },
  {
    id: 'poetry',
    name: '古诗词',
    description: '诗句背诵、诗意理解、作者朝代、意境赏析',
    recommendedTypes: ['choice', 'truefalse', 'matching', 'memory', 'ordering'],
  },
  {
    id: 'literature',
    name: '文学常识',
    description: '作者简介、作品出处、文体知识、文化常识',
    recommendedTypes: ['choice', 'truefalse', 'matching'],
  },
];

/** 难度等级配置 */
const difficulties = [
  { id: 'easy', name: '简单', desc: '基础识记类题目，直接考查课文原文内容' },
  { id: 'medium', name: '中等', desc: '理解应用类题目，需要简单分析和归纳' },
  { id: 'hard', name: '困难', desc: '综合拓展类题目，需要深入理解和灵活运用' },
];

/** 课本内容在线来源 */
const TEXTBOOK_URLS = `【课本内容在线来源】
- 电子课本网（部编版小学语文）：https://www.dzkbw.org/stage/bbb/xx/yuwen.html
- 该网站收录了部编版小学语文1-6年级上下册全部电子课本（PDF预览）
- 访问该网站 → 按年级选择对应课本 → 查看具体课文内容
- 也可以搜索"部编版小学语文{X年级}{X册}电子课本"来获取课文内容`;

/**
 * 系统提示词——设定 AI 角色与全局约束
 *
 * 核心变化：AI 优先使用联网搜索获取课文内容，而不是依赖老师粘贴。
 */
const system = `你是一位经验丰富的小学语文教师，擅长根据课程标准设计练习题。

【核心规则】
1. 严格按照最新部编版小学语文教材内容出题，不得偏离教材。
2. 题目难度必须匹配指定年级学生的认知水平和学习进度。
3. 题干表述浅显易懂，适合小学生阅读理解。
4. 每道题必须附带简明扼要的解析，帮助学生理解知识点。
5. 严格输出 JSON 数组格式，不要包含任何其他文字、解释或 Markdown 标记。

【出题原则】
- 题目必须与教材内容直接相关，确保学生学有所依。
- 覆盖该课文的重点生字词、关键句子、课文理解等核心知识点。
- 不出超纲题、偏题、怪题。
- 如有课文原文，请严格依据原文出题，不要编造内容。`;

/** 联网搜索模式——系统提示词补充 */
const webSearchSystem = `【联网搜索要求】
${TEXTBOOK_URLS}

【操作步骤】
1. 打开电子课本网找到对应年级的课本。
2. 根据老师指定的单元和课文，找到该课文的完整内容。
3. 基于课文原文，按照知识点分类和难度要求出题。
4. 如果找不到该课文，请搜索"部编版{X年级}{册} {课文名}"获取课文内容。`;

/** 选择题提示词模板 */
const choiceTemplate = `请为{{grade}}年级学生（{{semester}}）生成{{count}}道选择题，基于{{lesson}}的课文内容。

【课文信息】
- 年级：{{grade}}年级
- 学期：{{semester}}
- 单元：{{unit}}
- 课文：{{lesson}}
- 知识点：{{knowledgePoint}}
- 难度：{{difficulty}}

{{contentSection}}

【输出要求】
1. 每道题包含 4 个选项（A/B/C/D），有且仅有 1 个正确答案。
2. answer 字段为正确选项的索引（0 表示 A，1 表示 B，2 表示 C，3 表示 D）。
3. 干扰项应具有一定迷惑性，但不能出现歧义，不能出现"以上都对"、"以上都错"。
4. explanation 字段简要说明正确答案的依据，用小学生能理解的语言。

【输出格式】严格输出以下 JSON 数组，不要包含任何其他文字：
[
  {
    "question": "题干文本",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "answer": 0,
    "explanation": "解析文本"
  }
]`;

/** 判断题提示词模板 */
const truefalseTemplate = `请为{{grade}}年级学生（{{semester}}）生成{{count}}道判断题，基于{{lesson}}的课文内容。

【课文信息】
- 年级：{{grade}}年级
- 学期：{{semester}}
- 单元：{{unit}}
- 课文：{{lesson}}
- 知识点：{{knowledgePoint}}
- 难度：{{difficulty}}

{{contentSection}}

【输出要求】
1. 题干应是一个明确的陈述句，学生判断其正误。
2. answer 为 true 表示正确，false 表示错误。
3. 错误陈述应具有迷惑性，但必须明显可判断。
4. 不要出现模棱两可、可对可错的陈述。
5. explanation 字段简要说明判断依据。

【输出格式】严格输出以下 JSON 数组，不要包含任何其他文字：
[
  {
    "question": "陈述句文本",
    "answer": true,
    "explanation": "解析文本"
  }
]`;

/** 配对题提示词模板 */
const matchingTemplate = `请为{{grade}}年级学生（{{semester}}）生成{{count}}对配对题，基于{{lesson}}的课文内容。

【课文信息】
- 年级：{{grade}}年级
- 学期：{{semester}}
- 单元：{{unit}}
- 课文：{{lesson}}
- 知识点：{{knowledgePoint}}
- 难度：{{difficulty}}

{{contentSection}}

【输出要求】
1. 每对包含 left 和 right 两个字段，左右配对。
2. 适合配对的内容类型：生字↔拼音、词语↔释义、反义词配对、作者↔作品等。
3. 每对配对应该是唯一的、明确的对应关系。
4. left 和 right 内容不要过长，每个不超过 15 个字。

【输出格式】严格输出以下格式，不要包含任何其他文字：
[
  {"left": "左边内容", "right": "右边内容"}
]`;

/** 排序题提示词模板 */
const orderingTemplate = `请为{{grade}}年级学生（{{semester}}）生成{{count}}道排序题，基于{{lesson}}的课文内容。

【课文信息】
- 年级：{{grade}}年级
- 学期：{{semester}}
- 单元：{{unit}}
- 课文：{{lesson}}
- 知识点：{{knowledgePoint}}
- 难度：{{difficulty}}

{{contentSection}}

【输出要求】
1. 每道题包含一个被打乱的片段列表（segments），和正确顺序索引（correctOrder）。
2. 适合排序的内容：诗句顺序、段落顺序、事件发展顺序等。
3. segments 中每个片段不超过 15 个字。
4. correctOrder 是 segments 的正确索引顺序（0-based）。
5. 古诗排序题，correctOrder 应该是诗句在诗中的正确顺序。

【输出格式】严格输出以下 JSON 数组，不要包含任何其他文字：
[
  {
    "question": "题目标题文本",
    "segments": ["片段1", "片段2", "片段3", "片段4"],
    "correctOrder": [0, 1, 2, 3],
    "explanation": "解析文本"
  }
]`;

/** 构建 content 部分（有粘贴内容则用，无则提示联网搜索） */
function buildContentSection(content: string, webSearch: boolean): string {
  if (content.trim()) {
    return `【课文原文】
${content}`;
  }
  if (webSearch) {
    return `【提示】
老师没有提供课文原文。
请使用联网搜索功能，在电子课本网（https://www.dzkbw.org/stage/bbb/xx/yuwen.html）上找到对应年级和课文的完整内容。
搜索关键词："部编版 {{grade}}年级{{semester}} {{lesson}} 课文原文"
找到课文后，基于课文原文出题。`;
  }
  return `【提示】
老师没有提供课文原文。请先粘贴课文内容，或者开启联网搜索模式让 AI 自动查找。
如果你看到这句话，说明内容为空，请返回空数组。`;
}

/** 语文提示词配置 */
export const chinesePrompts: PromptConfig = {
  name: '语文',
  grades: [1, 2, 3, 4, 5, 6],
  knowledgePoints,
  difficulties,
  system,
  templates: {
    choice: choiceTemplate,
    truefalse: truefalseTemplate,
    matching: matchingTemplate,
    ordering: orderingTemplate,
  },
  webSearchSystem,
  buildContentSection,
  textbookUrls: TEXTBOOK_URLS,
};