/**
 * 部编版（人教版）小学语文 1-6 年级课本目录
 *
 * 数据来源：教育部统编语文教材（部编版/人教版）。
 * knowledgePoints 字段关联 chinesePrompts 中定义的知识点 ID。
 * 跨模块调用方：src/components/teacher/* 课本选择组件
 */
import type { Semester, Textbook } from '../types';

/** 部编版小学语文课本目录数据 */
export const textbooks: Textbook[] = [
  // ==================== 一年级上册 ====================
  {
    grade: 1,
    semester: '上册',
    publisher: '部编版',
    units: [
      {
        id: '1-1-u1',
        title: '第一单元',
        theme: '识字',
        lessons: [
          { id: '1-1-u1-l1', title: '天地人', knowledgePoints: ['character'] },
          { id: '1-1-u1-l2', title: '金木水火土', knowledgePoints: ['character'] },
          { id: '1-1-u1-l3', title: '口耳目', knowledgePoints: ['character'] },
          { id: '1-1-u1-l4', title: '日月水火', knowledgePoints: ['character'] },
          { id: '1-1-u1-l5', title: '对韵歌', knowledgePoints: ['character', 'word'] },
        ],
      },
      {
        id: '1-1-u2',
        title: '第二单元',
        theme: '汉语拼音',
        lessons: [
          { id: '1-1-u2-l1', title: 'a o e', knowledgePoints: ['pinyin'] },
          { id: '1-1-u2-l2', title: 'i u ü', knowledgePoints: ['pinyin'] },
          { id: '1-1-u2-l3', title: 'b p m f', knowledgePoints: ['pinyin'] },
          { id: '1-1-u2-l4', title: 'd t n l', knowledgePoints: ['pinyin'] },
        ],
      },
      {
        id: '1-1-u3',
        title: '第三单元',
        theme: '汉语拼音',
        lessons: [
          { id: '1-1-u3-l1', title: 'g k h', knowledgePoints: ['pinyin'] },
          { id: '1-1-u3-l2', title: 'j q x', knowledgePoints: ['pinyin'] },
          { id: '1-1-u3-l3', title: 'z c s', knowledgePoints: ['pinyin'] },
          { id: '1-1-u3-l4', title: 'zh ch sh r', knowledgePoints: ['pinyin'] },
        ],
      },
      {
        id: '1-1-u4',
        title: '第四单元',
        theme: '汉语拼音',
        lessons: [
          { id: '1-1-u4-l1', title: 'ai ei ui', knowledgePoints: ['pinyin'] },
          { id: '1-1-u4-l2', title: 'ao ou iu', knowledgePoints: ['pinyin'] },
          { id: '1-1-u4-l3', title: 'ie üe er', knowledgePoints: ['pinyin'] },
          { id: '1-1-u4-l4', title: 'an en in un ün', knowledgePoints: ['pinyin'] },
          { id: '1-1-u4-l5', title: 'ang eng ing ong', knowledgePoints: ['pinyin'] },
        ],
      },
      {
        id: '1-1-u5',
        title: '第五单元',
        theme: '课文',
        lessons: [
          { id: '1-1-u5-l1', title: '秋天', knowledgePoints: ['word', 'reading'] },
          { id: '1-1-u5-l2', title: '小小的船', knowledgePoints: ['word', 'reading'] },
          { id: '1-1-u5-l3', title: '江南', knowledgePoints: ['poetry', 'reading'] },
          { id: '1-1-u5-l4', title: '四季', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '1-1-u6',
        title: '第六单元',
        theme: '识字',
        lessons: [
          { id: '1-1-u6-l1', title: '画', knowledgePoints: ['character', 'poetry'] },
          { id: '1-1-u6-l2', title: '大小多少', knowledgePoints: ['character', 'word'] },
          { id: '1-1-u6-l3', title: '小书包', knowledgePoints: ['character', 'word'] },
          { id: '1-1-u6-l4', title: '日月明', knowledgePoints: ['character'] },
        ],
      },
      {
        id: '1-1-u7',
        title: '第七单元',
        theme: '课文',
        lessons: [
          { id: '1-1-u7-l1', title: '明天要远足', knowledgePoints: ['word', 'reading'] },
          { id: '1-1-u7-l2', title: '大还是小', knowledgePoints: ['word', 'reading'] },
          { id: '1-1-u7-l3', title: '项链', knowledgePoints: ['word', 'reading'] },
          { id: '1-1-u7-l4', title: '雪地里的小画家', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '1-1-u8',
        title: '第八单元',
        theme: '课文',
        lessons: [
          { id: '1-1-u8-l1', title: '乌鸦喝水', knowledgePoints: ['word', 'reading'] },
          { id: '1-1-u8-l2', title: '小蜗牛', knowledgePoints: ['word', 'reading'] },
        ],
      },
    ],
  },

  // ==================== 一年级下册 ====================
  {
    grade: 1,
    semester: '下册',
    publisher: '部编版',
    units: [
      {
        id: '1-2-u1',
        title: '第一单元',
        theme: '识字',
        lessons: [
          { id: '1-2-u1-l1', title: '春夏秋冬', knowledgePoints: ['character', 'word'] },
          { id: '1-2-u1-l2', title: '姓氏歌', knowledgePoints: ['character'] },
          { id: '1-2-u1-l3', title: '小青蛙', knowledgePoints: ['character'] },
          { id: '1-2-u1-l4', title: '猜字谜', knowledgePoints: ['character', 'word'] },
        ],
      },
      {
        id: '1-2-u2',
        title: '第二单元',
        theme: '课文',
        lessons: [
          { id: '1-2-u2-l1', title: '吃水不忘挖井人', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '1-2-u2-l2', title: '我多想去看看', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u2-l3', title: '一个接一个', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u2-l4', title: '四个太阳', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '1-2-u3',
        title: '第三单元',
        theme: '课文',
        lessons: [
          { id: '1-2-u3-l1', title: '小公鸡和小鸭子', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u3-l2', title: '树和喜鹊', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u3-l3', title: '怎么都快乐', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '1-2-u4',
        title: '第四单元',
        theme: '课文',
        lessons: [
          { id: '1-2-u4-l1', title: '静夜思', knowledgePoints: ['poetry', 'literature'] },
          { id: '1-2-u4-l2', title: '夜色', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u4-l3', title: '端午粽', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '1-2-u4-l4', title: '彩虹', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '1-2-u5',
        title: '第五单元',
        theme: '识字',
        lessons: [
          { id: '1-2-u5-l1', title: '古对今', knowledgePoints: ['character', 'word'] },
          { id: '1-2-u5-l2', title: '操场上', knowledgePoints: ['character', 'word'] },
          { id: '1-2-u5-l3', title: '人之初', knowledgePoints: ['character', 'literature'] },
        ],
      },
      {
        id: '1-2-u6',
        title: '第六单元',
        theme: '课文',
        lessons: [
          { id: '1-2-u6-l1', title: '古诗二首（池上·小池）', knowledgePoints: ['poetry', 'literature'] },
          { id: '1-2-u6-l2', title: '荷叶圆圆', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u6-l3', title: '要下雨了', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '1-2-u7',
        title: '第七单元',
        theme: '课文',
        lessons: [
          { id: '1-2-u7-l1', title: '文具的家', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u7-l2', title: '一分钟', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u7-l3', title: '动物王国开大会', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u7-l4', title: '小猴子下山', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '1-2-u8',
        title: '第八单元',
        theme: '课文',
        lessons: [
          { id: '1-2-u8-l1', title: '棉鞋里的阳光', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u8-l2', title: '咕咚', knowledgePoints: ['word', 'reading'] },
          { id: '1-2-u8-l3', title: '小壁虎借尾巴', knowledgePoints: ['word', 'reading'] },
        ],
      },
    ],
  },

  // ==================== 二年级上册 ====================
  {
    grade: 2,
    semester: '上册',
    publisher: '部编版',
    units: [
      {
        id: '2-1-u1',
        title: '第一单元',
        theme: '课文·小动物',
        lessons: [
          { id: '2-1-u1-l1', title: '小蝌蚪找妈妈', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u1-l2', title: '我是什么', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u1-l3', title: '植物妈妈有办法', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-1-u2',
        title: '第二单元',
        theme: '识字',
        lessons: [
          { id: '2-1-u2-l1', title: '场景歌', knowledgePoints: ['character', 'word'] },
          { id: '2-1-u2-l2', title: '树之歌', knowledgePoints: ['character', 'word'] },
          { id: '2-1-u2-l3', title: '拍手歌', knowledgePoints: ['character', 'word'] },
          { id: '2-1-u2-l4', title: '田家四季歌', knowledgePoints: ['character', 'word'] },
        ],
      },
      {
        id: '2-1-u3',
        title: '第三单元',
        theme: '课文',
        lessons: [
          { id: '2-1-u3-l1', title: '曹冲称象', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u3-l2', title: '玲玲的画', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u3-l3', title: '一封信', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u3-l4', title: '妈妈睡了', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-1-u4',
        title: '第四单元',
        theme: '课文·风景',
        lessons: [
          { id: '2-1-u4-l1', title: '古诗二首（登鹳雀楼·望庐山瀑布）', knowledgePoints: ['poetry', 'literature'] },
          { id: '2-1-u4-l2', title: '黄山奇石', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u4-l3', title: '日月潭', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u4-l4', title: '葡萄沟', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-1-u5',
        title: '第五单元',
        theme: '课文·寓言',
        lessons: [
          { id: '2-1-u5-l1', title: '坐井观天', knowledgePoints: ['idiom', 'reading'] },
          { id: '2-1-u5-l2', title: '寒号鸟', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u5-l3', title: '我要的是葫芦', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-1-u6',
        title: '第六单元',
        theme: '课文',
        lessons: [
          { id: '2-1-u6-l1', title: '大禹治水', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '2-1-u6-l2', title: '朱德的扁担', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '2-1-u6-l3', title: '难忘的泼水节', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '2-1-u7',
        title: '第七单元',
        theme: '课文·想象',
        lessons: [
          { id: '2-1-u7-l1', title: '古诗二首（夜宿山寺·敕勒歌）', knowledgePoints: ['poetry', 'literature'] },
          { id: '2-1-u7-l2', title: '雾在哪里', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u7-l3', title: '雪孩子', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-1-u8',
        title: '第八单元',
        theme: '课文·故事',
        lessons: [
          { id: '2-1-u8-l1', title: '狐假虎威', knowledgePoints: ['idiom', 'reading'] },
          { id: '2-1-u8-l2', title: '纸船和风筝', knowledgePoints: ['word', 'reading'] },
          { id: '2-1-u8-l3', title: '风娃娃', knowledgePoints: ['word', 'reading'] },
        ],
      },
    ],
  },

  // ==================== 二年级下册 ====================
  {
    grade: 2,
    semester: '下册',
    publisher: '部编版',
    units: [
      {
        id: '2-2-u1',
        title: '第一单元',
        theme: '课文·春天',
        lessons: [
          { id: '2-2-u1-l1', title: '古诗二首（村居·咏柳）', knowledgePoints: ['poetry', 'literature'] },
          { id: '2-2-u1-l2', title: '找春天', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u1-l3', title: '开满鲜花的小路', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u1-l4', title: '邓小平爷爷植树', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '2-2-u2',
        title: '第二单元',
        theme: '课文',
        lessons: [
          { id: '2-2-u2-l1', title: '雷锋叔叔，你在哪里', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '2-2-u2-l2', title: '千人糕', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u2-l3', title: '一匹出色的马', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-2-u3',
        title: '第三单元',
        theme: '识字',
        lessons: [
          { id: '2-2-u3-l1', title: '神州谣', knowledgePoints: ['character', 'word'] },
          { id: '2-2-u3-l2', title: '传统节日', knowledgePoints: ['character', 'literature'] },
          { id: '2-2-u3-l3', title: '"贝"的故事', knowledgePoints: ['character', 'word'] },
          { id: '2-2-u3-l4', title: '中国美食', knowledgePoints: ['character', 'word'] },
        ],
      },
      {
        id: '2-2-u4',
        title: '第四单元',
        theme: '课文·童心',
        lessons: [
          { id: '2-2-u4-l1', title: '彩色的梦', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u4-l2', title: '枫树上的喜鹊', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u4-l3', title: '沙滩上的童话', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u4-l4', title: '我是一只小虫子', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-2-u5',
        title: '第五单元',
        theme: '课文·寓言',
        lessons: [
          { id: '2-2-u5-l1', title: '寓言二则（亡羊补牢·揠苗助长）', knowledgePoints: ['idiom', 'reading'] },
          { id: '2-2-u5-l2', title: '画杨桃', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u5-l3', title: '小马过河', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-2-u6',
        title: '第六单元',
        theme: '课文·自然',
        lessons: [
          { id: '2-2-u6-l1', title: '古诗二首（绝句·晓出净慈寺送林子方）', knowledgePoints: ['poetry', 'literature'] },
          { id: '2-2-u6-l2', title: '雷雨', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u6-l3', title: '要是你在野外迷了路', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u6-l4', title: '太空生活趣事多', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-2-u7',
        title: '第七单元',
        theme: '课文·童话',
        lessons: [
          { id: '2-2-u7-l1', title: '大象的耳朵', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u7-l2', title: '蜘蛛开店', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u7-l3', title: '青蛙卖泥塘', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u7-l4', title: '小毛虫', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '2-2-u8',
        title: '第八单元',
        theme: '课文·故事',
        lessons: [
          { id: '2-2-u8-l1', title: '祖先的摇篮', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u8-l2', title: '当世界年纪还小的时候', knowledgePoints: ['word', 'reading'] },
          { id: '2-2-u8-l3', title: '羿射九日', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
    ],
  },

  // ==================== 三年级上册 ====================
  {
    grade: 3,
    semester: '上册',
    publisher: '部编版',
    units: [
      {
        id: '3-1-u1',
        title: '第一单元',
        theme: '校园生活',
        lessons: [
          { id: '3-1-u1-l1', title: '大青树下的小学', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u1-l2', title: '花的学校', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '3-1-u1-l3', title: '不懂就要问', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-1-u2',
        title: '第二单元',
        theme: '秋天',
        lessons: [
          { id: '3-1-u2-l1', title: '古诗三首（山行·赠刘景文·夜书所见）', knowledgePoints: ['poetry', 'literature'] },
          { id: '3-1-u2-l2', title: '铺满金色巴掌的水泥道', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u2-l3', title: '秋天的雨', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u2-l4', title: '听听，秋的声音', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-1-u3',
        title: '第三单元',
        theme: '童话',
        lessons: [
          { id: '3-1-u3-l1', title: '卖火柴的小女孩', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '3-1-u3-l2', title: '在牛肚子里旅行', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u3-l3', title: '一块奶酪', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-1-u4',
        title: '第四单元',
        theme: '预测与推想',
        lessons: [
          { id: '3-1-u4-l1', title: '总也倒不了的老屋', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u4-l2', title: '胡萝卜先生的长胡子', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u4-l3', title: '不会叫的狗', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-1-u5',
        title: '第五单元',
        theme: '观察',
        lessons: [
          { id: '3-1-u5-l1', title: '搭船的鸟', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u5-l2', title: '金色的草地', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-1-u6',
        title: '第六单元',
        theme: '祖国山河',
        lessons: [
          { id: '3-1-u6-l1', title: '古诗三首（望天门山·饮湖上初晴后雨·望洞庭）', knowledgePoints: ['poetry', 'literature'] },
          { id: '3-1-u6-l2', title: '富饶的西沙群岛', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u6-l3', title: '海滨小城', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u6-l4', title: '美丽的小兴安岭', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-1-u7',
        title: '第七单元',
        theme: '自然之美',
        lessons: [
          { id: '3-1-u7-l1', title: '大自然的声音', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u7-l2', title: '父亲、树林和鸟', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u7-l3', title: '带刺的朋友', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-1-u8',
        title: '第八单元',
        theme: '美好的品质',
        lessons: [
          { id: '3-1-u8-l1', title: '司马光', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '3-1-u8-l2', title: '掌声', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u8-l3', title: '灰雀', knowledgePoints: ['word', 'reading'] },
          { id: '3-1-u8-l4', title: '手术台就是阵地', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
    ],
  },

  // ==================== 三年级下册 ====================
  {
    grade: 3,
    semester: '下册',
    publisher: '部编版',
    units: [
      {
        id: '3-2-u1',
        title: '第一单元',
        theme: '可爱的生灵',
        lessons: [
          { id: '3-2-u1-l1', title: '古诗三首（绝句·惠崇春江晚景·三衢道中）', knowledgePoints: ['poetry', 'literature'] },
          { id: '3-2-u1-l2', title: '燕子', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u1-l3', title: '荷花', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u1-l4', title: '昆虫备忘录', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-2-u2',
        title: '第二单元',
        theme: '寓言故事',
        lessons: [
          { id: '3-2-u2-l1', title: '守株待兔', knowledgePoints: ['idiom', 'reading'] },
          { id: '3-2-u2-l2', title: '陶罐和铁罐', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u2-l3', title: '鹿角和鹿腿', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u2-l4', title: '池子与河流', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-2-u3',
        title: '第三单元',
        theme: '中华传统文化',
        lessons: [
          { id: '3-2-u3-l1', title: '元日', knowledgePoints: ['poetry', 'literature'] },
          { id: '3-2-u3-l2', title: '清明', knowledgePoints: ['poetry', 'literature'] },
          { id: '3-2-u3-l3', title: '九月九日忆山东兄弟', knowledgePoints: ['poetry', 'literature'] },
          { id: '3-2-u3-l4', title: '纸的发明', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '3-2-u3-l5', title: '赵州桥', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u3-l6', title: '一幅名扬中外的画', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '3-2-u4',
        title: '第四单元',
        theme: '观察与发现',
        lessons: [
          { id: '3-2-u4-l1', title: '花钟', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u4-l2', title: '蜜蜂', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u4-l3', title: '小虾', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-2-u5',
        title: '第五单元',
        theme: '想象',
        lessons: [
          { id: '3-2-u5-l1', title: '小真的长头发', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u5-l2', title: '我变成了一棵树', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-2-u6',
        title: '第六单元',
        theme: '多彩的童年',
        lessons: [
          { id: '3-2-u6-l1', title: '童年的水墨画', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u6-l2', title: '剃头大师', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u6-l3', title: '肥皂泡', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u6-l4', title: '我不能失信', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-2-u7',
        title: '第七单元',
        theme: '天地奥秘',
        lessons: [
          { id: '3-2-u7-l1', title: '我们奇妙的世界', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u7-l2', title: '海底世界', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u7-l3', title: '火烧云', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '3-2-u8',
        title: '第八单元',
        theme: '有趣的故事',
        lessons: [
          { id: '3-2-u8-l1', title: '慢性子裁缝和急性子顾客', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u8-l2', title: '方帽子店', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u8-l3', title: '漏', knowledgePoints: ['word', 'reading'] },
          { id: '3-2-u8-l4', title: '枣核', knowledgePoints: ['word', 'reading'] },
        ],
      },
    ],
  },

  // ==================== 四年级上册 ====================
  {
    grade: 4,
    semester: '上册',
    publisher: '部编版',
    units: [
      {
        id: '4-1-u1',
        title: '第一单元',
        theme: '自然之美',
        lessons: [
          { id: '4-1-u1-l1', title: '观潮', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u1-l2', title: '走月亮', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u1-l3', title: '现代诗二首（秋晚的江上·花牛歌）', knowledgePoints: ['poetry', 'reading'] },
          { id: '4-1-u1-l4', title: '繁星', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '4-1-u2',
        title: '第二单元',
        theme: '提问策略',
        lessons: [
          { id: '4-1-u2-l1', title: '一个豆荚里的五粒豆', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u2-l2', title: '蝙蝠和雷达', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u2-l3', title: '呼风唤雨的世纪', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u2-l4', title: '蝴蝶的家', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-1-u3',
        title: '第三单元',
        theme: '连续观察',
        lessons: [
          { id: '4-1-u3-l1', title: '古诗三首（暮江吟·题西林壁·雪梅）', knowledgePoints: ['poetry', 'literature'] },
          { id: '4-1-u3-l2', title: '爬山虎的脚', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u3-l3', title: '蟋蟀的住宅', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-1-u4',
        title: '第四单元',
        theme: '神话故事',
        lessons: [
          { id: '4-1-u4-l1', title: '盘古开天地', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-1-u4-l2', title: '精卫填海', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-1-u4-l3', title: '普罗米修斯', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-1-u4-l4', title: '女娲补天', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '4-1-u5',
        title: '第五单元',
        theme: '把一件事写清楚',
        lessons: [
          { id: '4-1-u5-l1', title: '麻雀', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u5-l2', title: '爬天都峰', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-1-u6',
        title: '第六单元',
        theme: '童年生活',
        lessons: [
          { id: '4-1-u6-l1', title: '牛和鹅', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u6-l2', title: '一只窝囊的大老虎', knowledgePoints: ['word', 'reading'] },
          { id: '4-1-u6-l3', title: '陀螺', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-1-u7',
        title: '第七单元',
        theme: '家国情怀',
        lessons: [
          { id: '4-1-u7-l1', title: '古诗三首（出塞·凉州词·夏日绝句）', knowledgePoints: ['poetry', 'literature'] },
          { id: '4-1-u7-l2', title: '为中华之崛起而读书', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-1-u7-l3', title: '梅兰芳蓄须', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-1-u7-l4', title: '延安，我把你追寻', knowledgePoints: ['poetry', 'reading'] },
        ],
      },
      {
        id: '4-1-u8',
        title: '第八单元',
        theme: '历史故事',
        lessons: [
          { id: '4-1-u8-l1', title: '王戎不取道旁李', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-1-u8-l2', title: '西门豹治邺', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-1-u8-l3', title: '故事二则（扁鹊治病·纪昌学射）', knowledgePoints: ['idiom', 'reading'] },
        ],
      },
    ],
  },

  // ==================== 四年级下册 ====================
  {
    grade: 4,
    semester: '下册',
    publisher: '部编版',
    units: [
      {
        id: '4-2-u1',
        title: '第一单元',
        theme: '乡村生活',
        lessons: [
          { id: '4-2-u1-l1', title: '古诗词三首（四时田园杂兴·宿新市徐公店·清平乐·村居）', knowledgePoints: ['poetry', 'literature'] },
          { id: '4-2-u1-l2', title: '乡下人家', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u1-l3', title: '天窗', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u1-l4', title: '三月桃花水', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-2-u2',
        title: '第二单元',
        theme: '科普',
        lessons: [
          { id: '4-2-u2-l1', title: '琥珀', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u2-l2', title: '飞向蓝天的恐龙', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u2-l3', title: '纳米技术就在我们身边', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u2-l4', title: '十万个为什么（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '4-2-u3',
        title: '第三单元',
        theme: '现代诗歌',
        lessons: [
          { id: '4-2-u3-l1', title: '短诗三首（繁星）', knowledgePoints: ['poetry', 'literature'] },
          { id: '4-2-u3-l2', title: '绿', knowledgePoints: ['poetry', 'reading'] },
          { id: '4-2-u3-l3', title: '白桦', knowledgePoints: ['poetry', 'reading'] },
          { id: '4-2-u3-l4', title: '在天晴了的时候', knowledgePoints: ['poetry', 'reading'] },
        ],
      },
      {
        id: '4-2-u4',
        title: '第四单元',
        theme: '动物朋友',
        lessons: [
          { id: '4-2-u4-l1', title: '猫', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u4-l2', title: '母鸡', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u4-l3', title: '白鹅', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-2-u5',
        title: '第五单元',
        theme: '按游览顺序写',
        lessons: [
          { id: '4-2-u5-l1', title: '海上日出', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u5-l2', title: '记金华的双龙洞', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-2-u6',
        title: '第六单元',
        theme: '成长',
        lessons: [
          { id: '4-2-u6-l1', title: '小英雄雨来（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-2-u6-l2', title: '我们家的男子汉', knowledgePoints: ['word', 'reading'] },
          { id: '4-2-u6-l3', title: '芦花鞋', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-2-u7',
        title: '第七单元',
        theme: '人物品质',
        lessons: [
          { id: '4-2-u7-l1', title: '古诗三首（芙蓉楼送辛渐·塞下曲·墨梅）', knowledgePoints: ['poetry', 'literature'] },
          { id: '4-2-u7-l2', title: '黄继光', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-2-u7-l3', title: '挑山工', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '4-2-u8',
        title: '第八单元',
        theme: '童话之美',
        lessons: [
          { id: '4-2-u8-l1', title: '宝葫芦的秘密（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-2-u8-l2', title: '巨人的花园', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '4-2-u8-l3', title: '海的女儿（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
    ],
  },

  // ==================== 五年级上册 ====================
  {
    grade: 5,
    semester: '上册',
    publisher: '部编版',
    units: [
      {
        id: '5-1-u1',
        title: '第一单元',
        theme: '万物有灵',
        lessons: [
          { id: '5-1-u1-l1', title: '白鹭', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u1-l2', title: '落花生', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-1-u1-l3', title: '桂花雨', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u1-l4', title: '珍珠鸟', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-1-u2',
        title: '第二单元',
        theme: '阅读策略',
        lessons: [
          { id: '5-1-u2-l1', title: '搭石', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u2-l2', title: '将相和', knowledgePoints: ['idiom', 'reading', 'literature'] },
          { id: '5-1-u2-l3', title: '什么比猎豹的速度更快', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u2-l4', title: '冀中的地道战', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '5-1-u3',
        title: '第三单元',
        theme: '民间故事',
        lessons: [
          { id: '5-1-u3-l1', title: '猎人海力布', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-1-u3-l2', title: '牛郎织女（一）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-1-u3-l3', title: '牛郎织女（二）', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '5-1-u4',
        title: '第四单元',
        theme: '爱国情怀',
        lessons: [
          { id: '5-1-u4-l1', title: '古诗三首（示儿·题临安邸·己亥杂诗）', knowledgePoints: ['poetry', 'literature'] },
          { id: '5-1-u4-l2', title: '少年中国说（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-1-u4-l3', title: '圆明园的毁灭', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-1-u4-l4', title: '小岛', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-1-u5',
        title: '第五单元',
        theme: '说明文',
        lessons: [
          { id: '5-1-u5-l1', title: '太阳', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u5-l2', title: '松鼠', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-1-u6',
        title: '第六单元',
        theme: '父母之爱',
        lessons: [
          { id: '5-1-u6-l1', title: '慈母情深', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u6-l2', title: '父爱之舟', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u6-l3', title: '"精彩极了"和"糟糕透了"', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-1-u7',
        title: '第七单元',
        theme: '自然之景',
        lessons: [
          { id: '5-1-u7-l1', title: '古诗词三首（山居秋暝·枫桥夜泊·长相思）', knowledgePoints: ['poetry', 'literature'] },
          { id: '5-1-u7-l2', title: '四季之美', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u7-l3', title: '鸟的天堂', knowledgePoints: ['word', 'reading'] },
          { id: '5-1-u7-l4', title: '月迹', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-1-u8',
        title: '第八单元',
        theme: '读书明智',
        lessons: [
          { id: '5-1-u8-l1', title: '古人谈读书', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-1-u8-l2', title: '忆读书', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-1-u8-l3', title: '我的"长生果"', knowledgePoints: ['word', 'reading'] },
        ],
      },
    ],
  },

  // ==================== 五年级下册 ====================
  {
    grade: 5,
    semester: '下册',
    publisher: '部编版',
    units: [
      {
        id: '5-2-u1',
        title: '第一单元',
        theme: '童年往事',
        lessons: [
          { id: '5-2-u1-l1', title: '古诗三首（四时田园杂兴·稚子弄冰·村晚）', knowledgePoints: ['poetry', 'literature'] },
          { id: '5-2-u1-l2', title: '祖父的园子', knowledgePoints: ['word', 'reading'] },
          { id: '5-2-u1-l3', title: '月是故乡明', knowledgePoints: ['word', 'reading'] },
          { id: '5-2-u1-l4', title: '梅花魂', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-2-u2',
        title: '第二单元',
        theme: '古典名著',
        lessons: [
          { id: '5-2-u2-l1', title: '草船借箭', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-2-u2-l2', title: '景阳冈', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-2-u2-l3', title: '猴王出世', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '5-2-u3',
        title: '第三单元',
        theme: '综合性学习·汉字',
        lessons: [
          { id: '5-2-u3-l1', title: '汉字真有趣', knowledgePoints: ['character', 'literature'] },
          { id: '5-2-u3-l2', title: '我爱你，汉字', knowledgePoints: ['character', 'literature'] },
        ],
      },
      {
        id: '5-2-u4',
        title: '第四单元',
        theme: '家国情怀',
        lessons: [
          { id: '5-2-u4-l1', title: '古诗三首（从军行·秋夜将晓出篱门迎凉有感·闻官军收河南河北）', knowledgePoints: ['poetry', 'literature'] },
          { id: '5-2-u4-l2', title: '青山处处埋忠骨', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-2-u4-l3', title: '军神', knowledgePoints: ['word', 'reading'] },
          { id: '5-2-u4-l4', title: '清贫', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '5-2-u5',
        title: '第五单元',
        theme: '人物描写',
        lessons: [
          { id: '5-2-u5-l1', title: '人物描写一组（摔跤·他像一棵挺脱的树·两茎灯草）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-2-u5-l2', title: '刷子李', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-2-u6',
        title: '第六单元',
        theme: '探索之旅',
        lessons: [
          { id: '5-2-u6-l1', title: '文言文二则（自相矛盾·杨氏之子）', knowledgePoints: ['idiom', 'reading', 'literature'] },
          { id: '5-2-u6-l2', title: '田忌赛马', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '5-2-u7',
        title: '第七单元',
        theme: '世界各地',
        lessons: [
          { id: '5-2-u7-l1', title: '威尼斯的小艇', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '5-2-u7-l2', title: '牧场之国', knowledgePoints: ['word', 'reading'] },
          { id: '5-2-u7-l3', title: '金字塔夕照', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '5-2-u8',
        title: '第八单元',
        theme: '幽默与风趣',
        lessons: [
          { id: '5-2-u8-l1', title: '手指', knowledgePoints: ['word', 'reading'] },
          { id: '5-2-u8-l2', title: '童年的发现', knowledgePoints: ['word', 'reading'] },
        ],
      },
    ],
  },

  // ==================== 六年级上册 ====================
  {
    grade: 6,
    semester: '上册',
    publisher: '部编版',
    units: [
      {
        id: '6-1-u1',
        title: '第一单元',
        theme: '触摸自然',
        lessons: [
          { id: '6-1-u1-l1', title: '草原', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u1-l2', title: '丁香结', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u1-l3', title: '古诗词三首（宿建德江·六月二十七日望湖楼醉书·西江月·夜行黄沙道中）', knowledgePoints: ['poetry', 'literature'] },
          { id: '6-1-u1-l4', title: '花之歌', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '6-1-u2',
        title: '第二单元',
        theme: '革命岁月',
        lessons: [
          { id: '6-1-u2-l1', title: '七律·长征', knowledgePoints: ['poetry', 'literature'] },
          { id: '6-1-u2-l2', title: '狼牙山五壮士', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u2-l3', title: '开国大典', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u2-l4', title: '灯光', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '6-1-u3',
        title: '第三单元',
        theme: '有目的地阅读',
        lessons: [
          { id: '6-1-u3-l1', title: '竹节人', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u3-l2', title: '宇宙生命之谜', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u3-l3', title: '故宫博物院', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '6-1-u4',
        title: '第四单元',
        theme: '小说',
        lessons: [
          { id: '6-1-u4-l1', title: '桥', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u4-l2', title: '穷人', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u4-l3', title: '在柏林', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '6-1-u5',
        title: '第五单元',
        theme: '围绕中心写',
        lessons: [
          { id: '6-1-u5-l1', title: '夏天里的成长', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u5-l2', title: '盼', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '6-1-u6',
        title: '第六单元',
        theme: '保护环境',
        lessons: [
          { id: '6-1-u6-l1', title: '古诗三首（浪淘沙·江南春·书湖阴先生壁）', knowledgePoints: ['poetry', 'literature'] },
          { id: '6-1-u6-l2', title: '只有一个地球', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u6-l3', title: '青山不老', knowledgePoints: ['word', 'reading'] },
          { id: '6-1-u6-l4', title: '三黑和土地', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '6-1-u7',
        title: '第七单元',
        theme: '艺术之美',
        lessons: [
          { id: '6-1-u7-l1', title: '文言文二则（伯牙鼓琴·书戴嵩画牛）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u7-l2', title: '月光曲', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u7-l3', title: '京剧趣谈', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '6-1-u8',
        title: '第八单元',
        theme: '鲁迅',
        lessons: [
          { id: '6-1-u8-l1', title: '少年闰土', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u8-l2', title: '好的故事', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u8-l3', title: '我的伯父鲁迅先生', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-1-u8-l4', title: '有的人', knowledgePoints: ['poetry', 'reading', 'literature'] },
        ],
      },
    ],
  },

  // ==================== 六年级下册 ====================
  {
    grade: 6,
    semester: '下册',
    publisher: '部编版',
    units: [
      {
        id: '6-2-u1',
        title: '第一单元',
        theme: '民风民俗',
        lessons: [
          { id: '6-2-u1-l1', title: '北京的春节', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u1-l2', title: '腊八粥', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u1-l3', title: '古诗三首（寒食·迢迢牵牛星·十五夜望月）', knowledgePoints: ['poetry', 'literature'] },
          { id: '6-2-u1-l4', title: '藏戏', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '6-2-u2',
        title: '第二单元',
        theme: '外国名著',
        lessons: [
          { id: '6-2-u2-l1', title: '鲁滨逊漂流记（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u2-l2', title: '骑鹅旅行记（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u2-l3', title: '汤姆·索亚历险记（节选）', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '6-2-u3',
        title: '第三单元',
        theme: '真情实感',
        lessons: [
          { id: '6-2-u3-l1', title: '匆匆', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u3-l2', title: '那个星期天', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '6-2-u4',
        title: '第四单元',
        theme: '理想与信念',
        lessons: [
          { id: '6-2-u4-l1', title: '古诗三首（马诗·石灰吟·竹石）', knowledgePoints: ['poetry', 'literature'] },
          { id: '6-2-u4-l2', title: '十六年前的回忆', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u4-l3', title: '为人民服务', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u4-l4', title: '金色的鱼钩', knowledgePoints: ['word', 'reading', 'literature'] },
        ],
      },
      {
        id: '6-2-u5',
        title: '第五单元',
        theme: '科学精神',
        lessons: [
          { id: '6-2-u5-l1', title: '文言文二则（学弈·两小儿辩日）', knowledgePoints: ['word', 'reading', 'literature'] },
          { id: '6-2-u5-l2', title: '真理诞生于一百个问号之后', knowledgePoints: ['word', 'reading'] },
          { id: '6-2-u5-l3', title: '表里的生物', knowledgePoints: ['word', 'reading'] },
        ],
      },
      {
        id: '6-2-u6',
        title: '第六单元',
        theme: '难忘小学生活',
        lessons: [
          { id: '6-2-u6-l1', title: '回忆往事', knowledgePoints: ['word', 'reading'] },
          { id: '6-2-u6-l2', title: '写信', knowledgePoints: ['sentence', 'reading'] },
        ],
      },
    ],
  },
];

/**
 * 根据年级和学期获取课本。
 * @param grade 年级 1-6
 * @param semester 学期（上册/下册）
 * @returns 对应的课本数据，未找到时返回 undefined
 */
export function getTextbooks(
  grade: number,
  semester: Semester,
): Textbook | undefined {
  return textbooks.find(
    (tb) => tb.grade === grade && tb.semester === semester,
  );
}

/** 获取全部课本数据 */
export function getAllTextbooks(): Textbook[] {
  return textbooks;
}
