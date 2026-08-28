/**
 * remark 插件：在「渲染层」剥离文章正文里与页面模板重复的头部信息，
 * 让正文从第一段实质内容或第一个二级标题开始，避免同一页面出现
 * 重复的主标题 / 摘要 / 时效提示。
 *
 * 仅删除明确重复的开头节点，不影响：
 *   - 资料来源、FAQ、表格、二三级标题、作者卡片、免责声明、相关文章、JSON-LD
 *   - Markdown 源文件本身（这里只修改渲染产物，不改写 .md）
 *
 * 剥离的三类（均位于正文开头或与模板 freshness 重复）：
 *   1) 一级标题（模板已用 frontmatter 的 title 渲染 <h1 class="article-title">）
 *   2) 以「摘要」开头的首部引用块（模板已展示 directAnswer / summary）
 *   3) 以「本文信息截至」开头的段落或引用块（模板已展示 freshness 时效提示）
 */
function nodeText(node: any): string {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value || '';
  if (Array.isArray(node.children)) return node.children.map(nodeText).join('');
  return '';
}

export function remarkStripDuplicateHeader() {
  return (tree: any) => {
    const children: any[] = tree.children || [];

    // 1) 删除首部一级标题（重复的主标题）
    if (
      children.length &&
      children[0].type === 'heading' &&
      children[0].depth === 1
    ) {
      children.shift();
    }

    // 2) 删除首部「摘要」引用块（重复的摘要/直接答案）
    while (children.length && children[0].type === 'blockquote') {
      const t = nodeText(children[0]).trim();
      if (t.startsWith('摘要')) children.shift();
      else break;
    }

    // 3) 删除任何以「本文信息截至」开头的节点（与模板 freshness 重复的时效提示）
    tree.children = children.filter(
      (n: any) => !nodeText(n).trim().startsWith('本文信息截至')
    );
  };
}
