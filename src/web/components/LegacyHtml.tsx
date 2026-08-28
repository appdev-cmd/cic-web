import { normalizeHtmlContent } from '@/shared/lib/content';

export function LegacyHtml({ html, className = '' }: { html?: string | null; className?: string }) {
  if (!html) return null;
  return <div className={`legacy-html-content ck-content ${className}`} dangerouslySetInnerHTML={{ __html: normalizeHtmlContent(html) }} />;
}
