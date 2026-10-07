export interface TocItem {
  id: string;
  title: string;
  fullTitle: string;
}

/**
 * Trích xuất các mục lục (TOC) từ nội dung bài viết HTML hoặc Markdown.
 * Hỗ trợ thẻ h2, h3, h4 đối với HTML và '### ', '#### ' đối với Markdown.
 */
export function extractTocItems(content: string | null | undefined): TocItem[] {
  if (!content) return [];
  const items: TocItem[] = [];

  // Trường hợp nội dung là HTML
  if (/<[a-z][\s\S]*>/i.test(content)) {
    const headingMatches = content.matchAll(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi);
    let idx = 0;
    for (const match of headingMatches) {
      const text = match[3].replace(/<[^>]+>/g, '').trim();
      if (text) {
        items.push({
          id: `sec-heading-${idx}`,
          title: text.length > 36 ? text.substring(0, 36) + '...' : text,
          fullTitle: text,
        });
        idx++;
      }
    }
    return items;
  }

  // Trường hợp nội dung là Markdown fallback
  const lines = content.split('\n');
  let idx = 0;
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
      const title = trimmed.replace(/^#{3,4}\s+/, '').replace(/\*\*/g, '').trim();
      if (title) {
        items.push({
          id: `sec-heading-${idx}`,
          title: title.length > 36 ? title.substring(0, 36) + '...' : title,
          fullTitle: title,
        });
        idx++;
      }
    }
  });

  return items;
}

/**
 * Tiêm thuộc tính `id="sec-heading-${idx}"` và class `scroll-mt-28` vào các thẻ heading <h2-h4>
 * của chuỗi HTML trước khi render ra DOM để đảm bảo đồng bộ 100% với TOC trích xuất.
 */
export function injectHeadingIds(html: string): string {
  if (!html) return '';
  let idx = 0;
  return html.replace(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, innerHtml) => {
    const text = innerHtml.replace(/<[^>]+>/g, '').trim();
    if (!text) return match;
    const sectionId = `sec-heading-${idx++}`;

    let updatedAttrs = attrs;

    // Gán hoặc thay thế thuộc tính id
    if (/\bid=["'][^"']*["']/i.test(updatedAttrs)) {
      updatedAttrs = updatedAttrs.replace(/\bid=["'][^"']*["']/i, `id="${sectionId}"`);
    } else {
      updatedAttrs = ` id="${sectionId}"${updatedAttrs}`;
    }

    // Bổ sung scroll-mt-28 vào class để tránh bị che bởi sticky header khi cuộn
    if (/\bclass=["']([^"']*)["']/i.test(updatedAttrs)) {
      updatedAttrs = updatedAttrs.replace(/\bclass=["']([^"']*)["']/i, (_m: string, cls: string) => `class="${cls} scroll-mt-28"`);
    } else {
      updatedAttrs = ` class="scroll-mt-28"${updatedAttrs}`;
    }

    return `<h${level}${updatedAttrs}>${innerHtml}</h${level}>`;
  });
}
