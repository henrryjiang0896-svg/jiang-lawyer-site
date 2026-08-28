import type { CollectionEntry } from 'astro:content';
import { columnOf } from './columns';
import { extractFaq } from './faq';
import siteConfig from '../site.config';
import { getSiteHref } from './site';

type Json = Record<string, any>;

/** 真实姓名：仅当 site.config.ts 的 author.realName 已确认（非空）时返回 */
function realName(): string {
  return (siteConfig.author.realName || '').trim();
}

export function websiteJsonLd(): Json {
  const siteHref = getSiteHref();
  const w: Json = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '江恒律师 · 跨境税务与出海合规',
    inLanguage: 'zh-CN',
    description: siteConfig.display.subtitle,
  };
  // 域名未配置时不输出 url，避免产生 占位链接
  if (siteHref) w.url = siteHref;
  return w;
}

/**
 * 仅当真实姓名（author.realName）已确认时才返回 Person JSON-LD；
 * 否则返回 null，避免把笔名当作已核验实体写入 Schema。
 * 律所使用 affiliation（非 alumniOf）；jobTitle/email/telephone/image/url
 * 仅在该字段已确认时输出。
 */
export function personJsonLd(): Json | null {
  const a = siteConfig.author;
  const name = realName();
  if (!name) return null;

  const p: Json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
  };
  if (siteConfig.display.jobTitle) p.jobTitle = siteConfig.display.jobTitle;
  // 律所（曼昆律师事务所）已确认；律所并非毕业院校，故以 affiliation 关联执业机构
  if (a.lawFirm) {
    p.affiliation = {
      '@type': 'Organization',
      name: a.lawFirm,
    };
  }
  // 仅当字段已确认（非空）时才写入，避免虚构信息
  if (a.email) p.email = a.email;
  if (a.phone) p.telephone = a.phone;
  if (a.avatar) p.image = a.avatar;
  const siteHref = getSiteHref();
  if (siteHref) p.url = siteHref;
  return p;
}

export function legalServiceJsonLd(): Json {
  const siteHref = getSiteHref();
  const ls: Json = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: '江恒律师 · 跨境税务与出海合规咨询',
    description: '跨境税务、企业出海合规与跨境资金账户的专业支持方向。',
    areaServed: { '@type': 'Country', name: 'CN' },
    serviceType: siteConfig.display.focuses,
  };
  // 仅当真实姓名已确认才关联 provider；否则不输出 Person 实体
  const name = realName();
  if (name) {
    ls.provider = { '@type': 'Person', name };
  }
  if (siteHref) ls.url = `${siteHref}/services`;
  return ls;
}

export function articleJsonLd(
  entry: CollectionEntry<'articles'>,
  summary: string
): Json {
  const col = columnOf(entry.data.category);
  const name = realName();
  const siteHref = getSiteHref();

  const article: Json = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.data.title,
    description: summary,
    inLanguage: 'zh-CN',
    datePublished: entry.data.datePublished,
    dateModified: entry.data.dateModified,
    articleSection: col.label,
  };
  // 仅当真实姓名已确认才输出 author / publisher（不使用笔名作为已核验实体）
  if (name) {
    article.author = {
      '@type': 'Person',
      name,
      jobTitle: siteConfig.display.jobTitle,
    };
    article.publisher = { '@type': 'Person', name };
  }
  // 域名未配置时不输出 mainEntityOfPage/@id（避免占位链接）
  if (siteHref) {
    article.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': `${siteHref}/articles/${entry.slug}`,
    };
  }
  return article;
}

export function faqJsonLd(markdown: string): Json | null {
  const faqs = extractFaq(markdown);
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
