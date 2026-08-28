import siteConfig from '../site.config';

/**
 * 是否已配置真实 HTTPS 域名。
 * 上线前由江恒律师在 site.config.ts 的 domain 字段填写。
 * 必须是 https 正式域名，暂不接受 http 或 等非正式占位值。
 */
export function isDomainConfigured(): boolean {
  const d = (siteConfig.domain || '').trim();
  return /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(d);
}

/**
 * 返回去尾斜杠的站点根 URL；未配置时返回空字符串 ''。
 * 全站 canonical / og:url / sitemap / rss / JSON-LD 的 URL 字段统一以此为准；
 * 未配置时不得输出任何 URL，避免产生 占位域名 等占位链接。
 */
export function getSiteHref(): string {
  const d = (siteConfig.domain || '').trim();
  return d ? d.replace(/\/+$/, '') : '';
}
