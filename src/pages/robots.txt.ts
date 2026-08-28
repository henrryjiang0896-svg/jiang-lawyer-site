import type { APIRoute } from 'astro';
import { getSiteHref } from '../lib/site';

export const GET: APIRoute = () => {
  const BASE = getSiteHref();
  // 域名未配置时不输出 Sitemap 指令，避免暴露 占位链接
  const sitemapLine = BASE ? `Sitemap: ${BASE}/sitemap.xml\n` : '';
  const txt = `User-agent: *
Allow: /

${sitemapLine}`;
  return new Response(txt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
