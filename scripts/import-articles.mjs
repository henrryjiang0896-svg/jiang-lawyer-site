import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
// 源 Markdown 位于工作区根目录（与本站点项目同级）
const WORKSPACE_ROOT = '/Users/henrry/WorkBuddy/2026-08-25-11-16-06';
const SRC_DIR = WORKSPACE_ROOT;
const DEST_DIR = join(PROJECT_ROOT, 'src/content/articles');

// 待导入的源文件（工作区根目录下的 5 篇文章）
const FILES = [
  'asean-origin-us-tariff-compliance.md',
  'corporate-bank-account-restricted-or-frozen.md',
  'overseas-bank-account-crs-exchange-to-china.md',
  'cross-border-ecommerce-payment-tax-compliance.md',
  'hong-kong-bvi-china-tax-risk.md',
];

// 非发布内容标记：以任意以 # 开头且包含「非发布内容」的行为界，从该处（含）全部剔除。
// 兼容 "# 非发布内容：..." 与 "# （以下为非发布内容）..." 等不同写法。
const NON_PUBLISH_RE = /^#.*非发布内容.*$/m;

// 正文中的「## 直接答案」小节：改由详情页以高亮卡片呈现，导入时从正文移除，避免重复。
const DIRECT_ANSWER_RE = /\n##\s*直接答案[\s\S]*?(?=\n##\s)/;
// 仅抽取「## 直接答案」行的正文文本（不含标题行），供写入 frontmatter。
const DIRECT_ANSWER_CAPTURE = /##\s*直接答案\s*\n([\s\S]*?)(?=\n##\s)/;

// 文末模板段（作者信息 / 免责声明 / 咨询 CTA）：改由详情页组件统一呈现，
// 导入时从正文移除，避免与 AuthorCard / Disclaimer / CTA 组件重复。
const TRAILING_SECTION_RE = /\n##\s*(作者信息|免责声明|咨询\s*CTA)[\s\S]*$/;

// 将直接答案文本安全地放入 YAML 双引号字符串中（转义反斜杠与双引号，合并多余空白）。
function yamlString(value) {
  const collapsed = value.replace(/\s*\n\s*/g, ' ').replace(/\*\*/g, '').trim();
  return `"${collapsed.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function stripNonPublish(text) {
  // 找到第一个包含「非发布内容」的标题行，从该处起全部丢弃。
  const m = text.match(NON_PUBLISH_RE);
  if (!m || m.index === undefined) return text;
  const cut = text.lastIndexOf('\n', m.index);
  return (cut <= 0 ? '' : text.slice(0, cut));
}

await mkdir(DEST_DIR, { recursive: true });

let ok = 0;
for (const f of FILES) {
  const src = join(SRC_DIR, f);
  let raw;
  try {
    raw = await readFile(src, 'utf8');
  } catch (e) {
    console.warn(`跳过（未找到）: ${f}`);
    continue;
  }

  // 1) 抽取直接答案文本（在剥离前抽取，确保拿到原文）
  const daMatch = raw.match(DIRECT_ANSWER_CAPTURE);
  const directAnswer = daMatch ? daMatch[1] : '';

  // 2) 去掉「非发布内容」及之后全部内容
  let cleaned = stripNonPublish(raw);

  // 3) 移除正文「## 直接答案」小节（详情页单独高亮呈现）
  cleaned = cleaned.replace(DIRECT_ANSWER_RE, '');

  // 3.6) 移除文末模板段（作者信息 / 免责声明 / 咨询 CTA），改由详情页组件统一呈现
  cleaned = cleaned.replace(TRAILING_SECTION_RE, '');

  // 3.5) 去除 frontmatter 中的 slug 字段：路由以文件名（entry.slug）为准，
  //      避免源文件中形如 "/outbound-compliance/xxx" 的 slug 造成嵌套路径。
  cleaned = cleaned.replace(/^slug:.*\r?\n/m, '');

  // 规整首尾空白与结尾多余分隔线
  cleaned = cleaned.replace(/\n*---\s*$/, '').trimEnd() + '\n';

  // 4) 若 frontmatter 尚无 directAnswer，则插入（供详情页高亮卡片使用）
  if (directAnswer && !/^\s*directAnswer\s*:/m.test(cleaned)) {
    const fmEnd = cleaned.indexOf('\n---', cleaned.indexOf('---'));
    if (fmEnd !== -1) {
      cleaned =
        cleaned.slice(0, fmEnd) +
        `\ndirectAnswer: ${yamlString(directAnswer)}` +
        cleaned.slice(fmEnd);
    }
  }

  await writeFile(join(DEST_DIR, f), cleaned, 'utf8');
  ok += 1;
  console.log(`已导入: ${f}${directAnswer ? '（含 directAnswer）' : ''}`);
}

console.log(`\n完成：${ok}/${FILES.length} 篇已写入 ${DEST_DIR}`);
