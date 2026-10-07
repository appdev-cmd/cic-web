export interface TocItem {
  id: string;
  title: string;
  fullTitle: string;
}

/**
 * Xác định cấp tiêu đề HTML lớn nhất thực tế có trong bài viết (ưu tiên h2, rồi đến h3, h4).
 * Giúp mục lục chỉ tập trung vào các tiêu đề lớn nhất, loại bỏ hoàn toàn các tiêu đề con.
 */
export function getHighestHtmlHeadingLevel(html: string): number | null {
  if (/<h2\b[^>]*>/i.test(html)) return 2;
  if (/<h3\b[^>]*>/i.test(html)) return 3;
  if (/<h4\b[^>]*>/i.test(html)) return 4;
  return null;
}

/**
 * Xác định cấp tiêu đề Markdown lớn nhất có trong bài viết (ưu tiên '## ', rồi đến '### ', '#### ').
 */
export function getHighestMarkdownHeadingPrefix(lines: string[]): string | null {
  const hasH2 = lines.some((l) => l.trim().startsWith('## '));
  if (hasH2) return '## ';
  const hasH3 = lines.some((l) => l.trim().startsWith('### '));
  if (hasH3) return '### ';
  const hasH4 = lines.some((l) => l.trim().startsWith('#### '));
  if (hasH4) return '#### ';
  return null;
}

/**
 * Trích xuất CHỈ CÁC TIÊU ĐỀ LỚN NHẤT từ nội dung bài viết HTML hoặc Markdown.
 * Tự động bỏ qua các tiêu đề con để mục lục gọn gàng, súc tích và đúng trọng tâm.
 */
export function extractTocItems(content: string | null | undefined): TocItem[] {
  if (!content) return [];
  const items: TocItem[] = [];

  // Trường hợp nội dung là HTML (CKEditor)
  if (/<[a-z][\s\S]*>/i.test(content)) {
    const highestLevel = getHighestHtmlHeadingLevel(content);
    if (!highestLevel) return [];

    const regex = new RegExp(`<h${highestLevel}([^>]*)>([\\s\\S]*?)<\\/h${highestLevel}>`, 'gi');
    const headingMatches = content.matchAll(regex);
    let idx = 0;
    for (const match of headingMatches) {
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        items.push({
          id: `sec-heading-${idx}`,
          title: text,
          fullTitle: text,
        });
        idx++;
      }
    }
    return items;
  }

  // Trường hợp nội dung là Markdown fallback
  const lines = content.split('\n');
  const highestPrefix = getHighestMarkdownHeadingPrefix(lines);
  if (!highestPrefix) return [];

  let idx = 0;
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith(highestPrefix)) {
      const title = trimmed.slice(highestPrefix.length).replace(/\*\*/g, '').trim();
      if (title) {
        items.push({
          id: `sec-heading-${idx}`,
          title: title,
          fullTitle: title,
        });
        idx++;
      }
    }
  });

  return items;
}

/**
 * Tiêm thuộc tính `id="sec-heading-${idx}"` và class `scroll-mt-28` CHỈ VÀO CÁC TIÊU ĐỀ LỚN NHẤT
 * của chuỗi HTML trước khi render ra DOM để đảm bảo đồng bộ 100% với TOC trích xuất.
 */
export function injectHeadingIds(html: string): string {
  if (!html) return '';
  const highestLevel = getHighestHtmlHeadingLevel(html);
  if (!highestLevel) return html;

  let idx = 0;
  const regex = new RegExp(`<h${highestLevel}([^>]*)>([\\s\\S]*?)<\\/h${highestLevel}>`, 'gi');

  return html.replace(regex, (match, attrs, innerHtml) => {
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

    return `<h${highestLevel}${updatedAttrs}>${innerHtml}</h${highestLevel}>`;
  });
}
