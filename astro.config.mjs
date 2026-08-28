import { defineConfig } from 'astro/config';
import { siteConfig } from './src/site.config';
import { remarkStripDuplicateHeader } from './src/lib/remarkStripDuplicateHeader';

// 站点域名以 site.config.ts 的 domain 为唯一来源。
// 未配置时 site 为 undefined，运行时（BaseLayout / seo / feeds）统一用 getSiteHref() 判定，
// 绝不会把 example.com 写入 canonical / og:url / sitemap / rss / JSON-LD。
export default defineConfig({
  site: siteConfig.domain || undefined,
  trailingSlash: 'ignore',
  markdown: {
    remarkPlugins: [remarkStripDuplicateHeader],
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
