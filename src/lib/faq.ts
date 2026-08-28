export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * 从文章 Markdown 的 `## FAQ` 段落中提取问答对，用于生成 FAQPage JSON-LD。
 * 文章格式约定：
 *   ## FAQ
 *   **问题文本？**
 *   回答文本（可多行，直到下一个 **问题** 或 ## 标题）
 */
export function extractFaq(markdown: string): FaqItem[] {
  const marker = '## FAQ';
  const idx = markdown.indexOf(marker);
  if (idx === -1) return [];

  let section = markdown.slice(idx + marker.length);
  const nextHeading = section.search(/\n##\s/);
  if (nextHeading !== -1) section = section.slice(0, nextHeading);

  const lines = section.split('\n');
  const items: FaqItem[] = [];
  let cur: FaqItem | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const q = line.match(/^\*\*(.+)\*\*$/);
    const isQuestion = q && /[?？]$/.test(g(q ? q[1] : '').trim());
    if (isQuestion && q) {
      if (cur) items.push(cur);
      cur = { question: cleanQuestion(q[1]), answer: '' };
    } else if (cur) {
      const text = g(line);
      cur.answer = cur.answer ? `${cur.answer} ${text}` : text;
    }
  }
  if (cur) items.push(cur);

  return items.filter((i) => i.question && i.answer);
}

// 去除 markdown 粗体标记 ** 与首尾空白
function g(s: string): string {
  return s.replace(/\*\*/g, '').trim();
}

// 去除 FAQ 问题前的编号前缀（如 "Q1："、"问："），仅保留问题文本
function cleanQuestion(s: string): string {
  return g(s).replace(/^(Q\d+[：:]\s*|问[：:]\s*|A\d+[：:]\s*)/, '').trim();
}
