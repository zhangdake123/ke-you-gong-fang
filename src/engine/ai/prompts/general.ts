/**
 * 通用提示词配置
 *
 * 面向非语文学科（数学、英语、科学、社会等）的通用 AI 出题提示词。
 * 知识点分类为通用类型：概念理解、事实记忆、应用实践。
 * 跨模块调用方：src/engine/ai/generator.ts（QuestionGenerator）
 */
import type { KnowledgePoint } from '../../../types';
import type { PromptConfig } from './index';

/** 通用知识点分类 */
const knowledgePoints: KnowledgePoint[] = [
  {
    id: 'concept',
    name: '概念理解',
    description: '核心概念的定义、特征、分类与辨析',
    recommendedTypes: ['choice', 'truefalse'],
  },
  {
    id: 'fact',
    name: '事实记忆',
    description: '需要识记的事实性知识，如公式、定理、定义、事件',
    recommendedTypes: ['choice', 'truefalse', 'matching', 'memory'],
  },
  {
    id: 'application',
    name: '应用实践',
    description: '将所学知识运用到具体情境中解决问题',
    recommendedTypes: ['choice', 'truefalse'],
  },
];

/** 难度等级配置 */
const difficulties = [
  { id: 'easy', name: '简单', desc: '直接识记和辨认，考查基础知识' },
  { id: 'medium', name: '中等', desc: '需要理解概念并进行分析判断' },
  { id: 'hard', name: '困难', desc: '综合运用知识解决复杂问题' },
];

/** 系统提示词 */
const system = `你是一位经验丰富的学科教师，擅长根据教学内容设计练习题。

【核心规则】
1. 你只能从老师提供的教学内容中出题，严禁使用教学内容以外的知识点。
2. 题目难度需匹配指定年级学生的认知水平。
3. 题干表述清晰、无歧义。
4. 每道题必须附带简明扼要的解析。
5. 严格输出 JSON 数组格式，不要包含任何其他文字、解释或 Markdown 标记。`;

/** 选择题提示词模板 */
const choiceTemplate = `请根据以下教学内容，为{{grade}}年级学生生成{{count}}道选择题。

【知识点分类】{{knowledgePoint}}
【难度等级】{{difficulty}}
【教学内容】
{{content}}

【输出要求】
1. 每道题包含 4 个选项（A/B/C/D），有且仅有 1 个正确答案。
2. answer 字段为正确选项的索引（0 表示 A，1 表示 B，2 表示 C，3 表示 D）。
3. 干扰项应具有一定迷惑性，但不能出现歧义。
4. explanation 字段简要说明正确答案的依据。

【输出格式】严格输出以下 JSON 数组，不要包含任何其他文字：
[
  {
    "question": "题干文本",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "answer": 0,
    "explanation": "解析说明"
  }
]`;

/** 判断题提示词模板 */
const truefalseTemplate = `请根据以下教学内容，为{{grade}}年级学生生成{{count}}道判断题。

【知识点分类】{{knowledgePoint}}
【难度等级】{{difficulty}}
【教学内容】
{{content}}

【输出要求】
1. answer 为 true 表示该说法正确，false 表示错误。
2. 正确与错误的题目比例约为 6:4。
3. 错误题目的表述应贴近正确表述但有细微偏差，考查学生是否真正理解。
4. explanation 字段说明判断依据，错误题目需指出错在哪里。

【输出格式】严格输出以下 JSON 数组，不要包含任何其他文字：
[
  {
    "question": "判断题题干",
    "answer": true,
    "explanation": "解析说明"
  }
]`;

/** 配对题（连连看）提示词模板 */
const matchingTemplate = `请根据以下教学内容，为{{grade}}年级学生生成{{count}}组配对题（连连看）。

【知识点分类】{{knowledgePoint}}
【难度等级】{{difficulty}}
【教学内容】
{{content}}

【输出要求】
1. 生成 5-10 组配对，每组包含 left（左项）和 right（右项）。
2. 左项和右项之间有明确的对应关系。
3. 每项文字简短，不超过 15 个字。
4. 配对关系必须唯一，不能出现一个左项对应多个右项的情况。

【输出格式】严格输出以下 JSON 数组，不要包含任何其他文字：
[
  {
    "left": "左项",
    "right": "右项"
  }
]`;

/** 记忆题（翻牌记忆）提示词模板 */
const memoryTemplate = `请根据以下教学内容，为{{grade}}年级学生生成{{count}}组记忆配对题（翻牌记忆游戏）。

【知识点分类】{{knowledgePoint}}
【难度等级】{{difficulty}}
【教学内容】
{{content}}

【输出要求】
1. 生成 6-8 组配对，每组包含 left（左项）和 right（右项）。
2. 每项文字极简，不超过 10 个字，适合翻牌记忆游戏。
3. 左项和右项之间有明确的知识关联。
4. 确保内容准确，配对关系唯一。

【输出格式】严格输出以下 JSON 数组，不要包含任何其他文字：
[
  {
    "left": "左项",
    "right": "右项"
  }
]`;

/** 通用提示词配置 */
export const generalPrompts: PromptConfig = {
  name: '通用',
  grades: [1, 2, 3, 4, 5, 6],
  knowledgePoints,
  difficulties,
  system,
  templates: {
    choice: choiceTemplate,
    truefalse: truefalseTemplate,
    matching: matchingTemplate,
    memory: memoryTemplate,
  },
};
