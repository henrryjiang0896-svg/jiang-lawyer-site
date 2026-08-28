# 江律师个人网站 · 构建说明

## 项目位置
`/Users/henrry/WorkBuddy/2026-08-25-11-16-06/jiang-lawyer-site/`

## 技术栈
Astro 5 静态站点；Markdown 内容集合驱动；无后端。

## 本地预览
```bash
npm install
npm run dev        # 开发预览 http://localhost:4321
npm run build      # 产出 dist/
npm run preview    # 预览 dist/
```

## 内容来源与导入
5 篇已核验文章位于工作区根目录（如 `asean-origin-us-tariff-compliance.md`）。
导入脚本 `scripts/import-articles.mjs` 会：
1. 剥离「非发布内容」及其之后全部内容；
2. 将「## 直接答案」抽取进 frontmatter 的 `directAnswer` 字段，并从正文移除（避免重复展示）；
3. 移除 frontmatter 的 `slug` 字段，路由以文件名（entry.slug）为准。

重新导入：修改根目录文章后运行 `npm run import`，再 `npm run build`。

## 页面
- 首页、关于、文章中心、文章详情
- 三个栏目：跨境税务与 CRS / 企业出海与原产地合规 / 跨境资金与账户合规
- 服务与能力、联系咨询、隐私与免责声明
- 自动生成：sitemap.xml、robots.txt、rss.xml

## SEO / GEO
- 全站 JSON-LD：首页 WebSite + Person + LegalService；文章页 Article + FAQPage
- canonical / Open Graph / X 卡片完整；语义化标题与面包屑

## 上线前必做（待江律师确认）
1. 在 `src/site.config.ts` 填写：`domain`、真实姓名、律所（已填曼昆）、执业地区、执业证号、公开邮箱/电话、头像、社交主页。
   - 这些字段当前为空，不会出现在任何公开页面或结构化数据中。
2. 把 `astro.config.mjs` 的 `site` 改为真实域名（如 `https://www.jianglvshi.com`），重新 `npm run build`，sitemap/robots/rss 会自动使用新域名。
3. 部署：可将 `dist/` 部署到 Vercel / Netlify / Cloudflare Pages（静态托管），或在自有服务器静态托管；配置 404 与 HTTPS。

## 合规边界（已固化）
- 文章仅作一般信息分享，不构成法律/税务意见或结果承诺；每页均含免责声明。
- 联系页为纯前端示意，表单不提交任何数据，并提示勿发送保密材料。
- 全站不含虚构资质、案例或确定性结论；所涉规则均标注"以官方最新来源为准"。
