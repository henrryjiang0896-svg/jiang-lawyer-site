import { defineCollection, z } from 'astro:content';

// 兼容 YAML 将未加引号的 2026-08-26 解析为 Date 的情况，统一规范为 YYYY-MM-DD 字符串。
const dateStr = z
  .union([z.string(), z.date()])
  .transform((v) => (typeof v === 'string' ? v : v.toISOString().slice(0, 10)));

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // 源文件中的历史 slug 字段，路由实际以文件名（entry.slug）为准
    author: z.string(),
    jobTitle: z.string(),
    category: z.string(),
    datePublished: dateStr,
    dateModified: dateStr,
    updatedAsOf: dateStr,
    directAnswer: z.string().optional(), // 由导入脚本从「## 直接答案」抽取，供详情页高亮呈现
    series: z.string().optional(), // 系列/专题（如「钱的法律身份」），用于文章中心内专题聚合页筛选
  }),
});

export const collections = { articles };
