import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSiteHref } from '../lib/site';

const STATIC_PATHS = [
  '/',
  '/about',
  '/articles',
  '/notes',
  '/tax-crs',
  '/outbound-compliance',
  '/cross-border-funds',
  '/services',
  '/asean-supply-chain-compliance',
  '/contact',
  '/disclaimer',
];

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
      '[sitemap] site.config.ts 的 domain 未配置，已安全跳过 sitemap 生成，未写入 占位链接。上线前请在 site.config.ts 填写真实 HTTPS 域名。'
    );
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- sitemap 已安全跳过：site.config.ts 的 domain 尚未配置，构建时未生成 占位链接。上线前请填写真实 HTTPS 域名。 -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  const articles = await getCollection('articles');
  const urls: string[] = [];

  for (const p of STATIC_PATHS) {
    urls.push(`  <url><loc>${esc(BASE + p)}</loc></url>`);
  }
  for (const a of articles) {
    urls.push(`  <url><loc>${esc(`${BASE}/articles/${a.slug}`)}</loc></url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
