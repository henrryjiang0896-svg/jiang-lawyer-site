import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSiteHref } from '../lib/site';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const GET: APIRoute = async () => {
  const BASE = getSiteHref();

  // 域名未配置：安全跳过，不在构建产物中写入 占位域名 等占位链接
  if (!BASE) {
    console.warn(
      '[rss] site.config.ts 的 domain 未配置，已安全跳过 RSS 链接生成，未写入 占位链接。上线前请在 site.config.ts 填写真实 HTTPS 域名。'
    );
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- RSS 已安全跳过：site.config.ts 的 domain 尚未配置，构建时未生成 占位链接。上线前请填写真实 HTTPS 域名。 -->
<rss version="2.0"><channel>
  <title>江恒律师 · 跨境税务与出海合规</title>
  <description>江恒律师关于跨境税务、企业出海合规与跨境资金账户的专业文章，基于官方来源撰写并经发布前核验。</description>
  <language>zh-CN</language>
</channel></rss>`;
    return new Response(xml, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
  }

  const articles = (await getCollection('articles')).sort((a, b) =>
    b.data.datePublished.localeCompare(a.data.datePublished)
  );

  const items = articles
    .map((a) => {
      const summary =
        (a.body.match(/^>\s*摘要[：:]\s*(.+)$/m)?.[1]?.trim()) ?? a.data.title;
      const pub = new Date(a.data.datePublished).toUTCString();
      const link = `${BASE}/articles/${a.slug}`;
      return `    <item>
      <title>${esc(a.data.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${pub}</pubDate>
      <category>${esc(a.data.category)}</category>
      <description>${esc(summary)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>江恒律师 · 跨境税务与出海合规</title>
    <link>${esc(BASE)}</link>
    <description>江恒律师关于跨境税务、企业出海合规与跨境资金账户的专业文章，基于官方来源撰写并经发布前核验。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
