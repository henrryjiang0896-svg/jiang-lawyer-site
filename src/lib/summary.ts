/**
 * 从文章 Markdown 提取摘要（用于 meta description）。
 * 优先取以「摘要」开头的首行引用块：> 摘要：……
 */
export function extractSummary(markdown: string): string {
  const m = markdown.match(/^>\s*摘要[：:]\s*(.+)$/m);
  if (m) return m[1].trim();

  // 兜底：取首个引用块
  const b = markdown.match(/^>\s*(.+)$/m);
  return b ? b[1].trim() : '';
}

/**
 * 从文章 Markdown 提取「## 直接答案」小节的纯文本，用于详情页高亮卡片。
 * 导入流程已将该小节从正文移除，避免重复展示。
 */
export function extractDirectAnswer(markdown: string): string {
  const m = markdown.match(/##\s*直接答案\s*\n([\s\S]*?)(?=\n##\s)/);
  if (!m) return '';
  return m[1].trim().replace(/\*\*/g, '');
}
