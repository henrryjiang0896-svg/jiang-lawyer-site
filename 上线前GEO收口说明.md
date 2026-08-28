# 上线前 GEO 与实体可信度收口说明

> 项目：`jiang-lawyer-site`（Astro 静态站）
> 修订目标：在真实姓名、域名、执业信息尚未确认前，不生成会造成错误实体识别的结构化数据或占位 URL；其他页面内容保持不变。
> 修订日期：2026-08-26

---

## 一、核心机制变更

### 1. 新增域名判定助手 `src/lib/site.ts`
- `isDomainConfigured()`：判断 `siteConfig.domain` 是否为非空 HTTPS 正式域名。
- `getSiteHref()`：未配置时返回空字符串（绝不回退到 `example.com` 等占位域名）；配置后返回规范的 `https://域名`（自动去末尾斜杠）。

### 2. `src/lib/seo.ts` 条件化重写
- `personJsonLd()`：**仅当 `author.realName` 非空时**才返回 `Person` 对象，否则返回 `null`。`name` 用真实姓名；律所用 `affiliation`（Organization），**不使用 `alumniOf`**；`jobTitle` 始终带，`email`/`telephone`/`image` 仅在对应字段已确认时输出。
- `articleJsonLd(entry, summary)`：**仅当 `realName` 非空时**才输出 `author` 与 `publisher`（均为 `Person` + 真实姓名），否则不输出这两个字段。
- `legalServiceJsonLd()`：`provider` 仅在 `realName` 非空时输出 `Person`，否则不输出。
- `websiteJsonLd()`：URL 字段（如 `url`）仅在域名已配置时填充，否则省略。
- 所有函数不再接收外部 `siteHref` 形参，统一内部调用 `getSiteHref()`，从源头切断占位域名泄漏。

### 3. `src/layouts/BaseLayout.astro`
- canonical 与 `og:url` 改为**条件输出**：`getSiteHref()` 为空时不渲染 `<link rel="canonical">` 与 `og:url`，避免占位链接外泄。

### 4. 页面 JSON-LD 挂载（`index.astro` / `about.astro` / `articles/[slug].astro`）
- 移除对 `siteHref` 的本地声明。
- JSON-LD 数组统一过 `filter(Boolean)`：`null` 项（未配置时）自动剔除，不写入页面。
- `services.astro` 清理了未使用的 `siteHref` 常量。

### 5. Feeds 安全跳过（`sitemap.xml.ts` / `rss.xml.ts` / `robots.txt.ts`）
- 改用 `getSiteHref()`。
- **未配置域名时**：sitemap 输出注释提示「待配置真实域名」并安全跳过 URL 生成；RSS 同逻辑；robots 不指向 sitemap（或仅输出基础 `User-agent: *`）。构建时终端打印明确提示。
- **配置域名后**：自动启用 sitemap / RSS / robots 的正式链接。

### 6. `astro.config.mjs`
- `site` 改为由 `getSiteHref()` 派生：`domain` 为空时为 `undefined`（Astro 不生成占位 `site`），配置后自动注入 HTTPS 正式域名。

### 7. `src/pages/about.astro` 描述去重
- meta description 改用专用字段 `siteConfig.display.aboutDescription`，内容为：
  > 江律师，拥有 7 年金融从业经验（5 年国有银行 + 2 年上市供应链企业）与 5 年法律实务经验，专注跨境税务、企业出海合规与跨境资金账户。
- 不再与 `jobTitle`（「曼昆律师事务所执业律师」）拼接，消除「曼昆律师事务所执业律师。曼昆律师事务所执业律师……」重复。

### 8. `src/site.config.ts`
- `domain` 注释更新为「上线前必填的 HTTPS 正式域名」语义。
- 新增 `display.aboutDescription` 字段，承载去重后的关于页描述。

---

## 二、修改文件清单

| 文件 | 改动类型 |
|------|----------|
| `src/lib/site.ts` | 新增（域名判定助手） |
| `src/lib/seo.ts` | 重写（条件化 JSON-LD，移除 siteHref 形参与 alumniOf） |
| `src/layouts/BaseLayout.astro` | 条件输出 canonical / og:url |
| `src/pages/index.astro` | 适配新签名 + 条件挂载 JSON-LD |
| `src/pages/about.astro` | 描述去重 + 条件挂载 Person |
| `src/pages/articles/[slug].astro` | 适配新签名 + 条件输出 author/publisher |
| `src/pages/services.astro` | 清理未使用 siteHref |
| `src/pages/sitemap.xml.ts` | 安全跳过占位域名 |
| `src/pages/rss.xml.ts` | 安全跳过占位域名 |
| `src/pages/robots.txt.ts` | 条件输出 sitemap 指引 |
| `astro.config.mjs` | site 由 domain 派生 |
| `src/site.config.ts` | domain 注释 + 新增 aboutDescription |

> 5 篇文章的**正文、法律/税务/外汇/海关内容、免责声明、信息截至日期、作者署名「江律师」、联系方式待确认边界**均未改动。

---

## 三、验证结果

### 空配置（realName / domain 均为空）—— 当前实际状态
| 检查项 | 结果 |
|--------|------|
| HTML 中 `@type: Person` | **0**（不输出 Person JSON-LD） |
| Article `author: Person` | **0** |
| Article `publisher: Person` | **0** |
| LegalService `provider: Person` | **0** |
| `example.com` / 占位域名 | **0** |
| `alumniOf` | **0** |
| canonical `<link>` | **0**（按需不输出） |
| `og:url` | **0**（按需不输出） |
| 公开页显示「江律师」 | ✅ 仍正确显示 |
| 公开页显示已确认履历（7 年金融从业经验…） | ✅ 仍正确显示 |
| 关于页描述重复 | ✅ 已修正，无「曼昆……曼昆」重复 |
| 构建产物页数与原有一致 | ✅ 14 页 |

### 测试值验证（临时填入 测试域名 + 测试真实姓名）
- canonical / og:url：**14** 页全部输出正式链接。
- `Person` JSON-LD：**13** 处（首页 + 关于页 + 5 篇文章 author/publisher + LegalService provider）。
- `Person.name` = 测试真实姓名；`affiliation` = `{ Organization: 曼昆律师事务所 }`（无 alumniOf）。
- Article `author` / `publisher` 均带真实姓名。
- `email` / `telephone` 因字段为空，**未输出**（符合「仅已确认时输出」）。

### 回滚验证（删除测试值后重新构建）
- 测试姓名残留：**0**
- 测试域名残留：**0**
- example.com / Person / alumniOf / canonical / og:url：**均为 0**
- 公开页「江律师」与履历：✅ 正常

---

## 四、真实上线前必须由江律师填写的字段

> 以下字段位于 `src/site.config.ts`，当前均为空（不写入任何公开产物）。填妥后重新 `npm run build` 即可自动启用对应结构化数据与 URL 能力，**无需改代码**。

1. **`domain`**（必填，HTTPS 正式域名，如 `https://www.jianglvshi.com`）
   - 启用：canonical、`og:url`、sitemap、RSS、robots、JSON-LD 中的 URL 字段。
   - 必须为 HTTPS；非 HTTPS 或未填写时全站不输出 URL 类结构化数据。

2. **`author.realName`**（必填，真实姓名）
   - 启用：全站 `Person` JSON-LD、Article 的 `author` / `publisher`、LegalService 的 `provider`。
   - 填妥后 `Person.name` 使用真实姓名，律所以 `affiliation` 关联「曼昆律师事务所」。

3. **以下字段为选填，仅在确认后填入；填了才会出现在对应结构化数据 / 页面**
   - `author.barAdmission`（执业地区）
   - `author.licenseNo`（执业证号）—— 注意：本方案默认不把执业证号写进公开 Schema，如需展示应置于页面文本而非 JSON-LD 实体字段。
   - `author.email`（公开邮箱）
   - `author.phone`（公开电话）
   - `author.avatar`（头像 URL）
   - `author.social.*`（微博 / 微信 / LinkedIn）

### 上线操作步骤
1. 编辑 `src/site.config.ts`，填入真实 `domain` 与 `author.realName`（及其余已确认的选填项）。
2. 确认 `domain` 已解析且部署平台（Vercel / Netlify / Cloudflare Pages 等）绑定该域名。
3. 本地 `npm run build`，检查 dist 中 JSON-LD 与 `example.com` 计数为 0、正式域名已生效。
4. 部署；部署后用 GSC / 富媒体测试工具复核结构化数据。
