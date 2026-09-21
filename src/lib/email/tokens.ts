/**
 * Utility to escape HTML special characters to prevent HTML injection in emails.
 */
export function escapeHtml(text: unknown): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface InterpolateTokenOptions {
  /**
   * Whether the target template is HTML.
   * When true (or auto-detected from template markup), variable values are HTML-escaped by default to prevent injection.
   * Explicit raw tokens (e.g. {{{token}}}) bypass escaping.
   */
  isHtml?: boolean;
}

/**
 * Utility to replace tokens in email subject and content.
 * Supports both modern {{variable.name}} and legacy {name} tokens.
 * By default, escapes variable values when interpolating into HTML templates.
 */
export function interpolateTokens(
  text: string,
  values: Record<string, string | number | undefined | null>,
  options?: InterpolateTokenOptions
): string {
  if (!text) return '';

  const isHtml = options?.isHtml ?? /<[a-z][\s\S]*>/i.test(text);

  // 1. First map common legacy PHP tokens to modern names if not already present
  const mappedValues: Record<string, string> = {};
  for (const [key, val] of Object.entries(values)) {
    if (val !== undefined && val !== null) {
      const strVal = String(val);
      mappedValues[key] = strVal;
      // If key is {{customer.full_name}}, also support {name}
      if (key === '{{customer.full_name}}') {
        mappedValues['{name}'] = strVal;
      }
      if (key === '{{product.name}}') {
        mappedValues['{name1}'] = strVal;
      }
      if (key === '{{document.download_url}}' || key === '{{product.public_url}}') {
        mappedValues['{link1}'] = strVal;
      }
    }
  }

  const resolveVal = (token: string, fullToken: string, isRaw: boolean): string | undefined => {
    let raw: string | undefined;
    if (mappedValues[fullToken] !== undefined) raw = mappedValues[fullToken];
    else if (mappedValues[token] !== undefined) raw = mappedValues[token];
    if (raw === undefined) return undefined;
    return isHtml && !isRaw ? escapeHtml(raw) : raw;
  };

  let result = text;

  // 1. Replace {{{raw_token}}} (explicit unescaped HTML)
  result = result.replace(/\{\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}\}/g, (match, token) => {
    const resolved = resolveVal(token, `{{${token}}}`, true);
    return resolved !== undefined ? resolved : match;
  });

  // 2. Replace {{token}} (HTML-escaped if isHtml)
  result = result.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (match, token) => {
    const resolved = resolveVal(token, `{{${token}}}`, false);
    return resolved !== undefined ? resolved : match;
  });

  // 3. Replace legacy {token} (HTML-escaped if isHtml)
  result = result.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, token) => {
    const resolved = resolveVal(token, `{${token}}`, false);
    return resolved !== undefined ? resolved : match;
  });

  return result;
}

/**
 * Standardize legacy HTML content from cic_email:
 * Convert {name} -> {{customer.full_name}}, {name1} -> {{product.name}}, {link1} -> {{document.download_url}}
 * Clean up relative PHP strings like '.URL_ROOT.'
 */
export function normalizeLegacyEmailContent(html: string): string {
  if (!html) return '';
  return html
    .replace(/\{name\}/g, '{{customer.full_name}}')
    .replace(/\{name1\}/g, '{{product.name}}')
    .replace(/\{link1\}/g, '{{document.download_url}}')
    .replace(/'\s*\.\s*URL_ROOT\s*\.\s*'/g, 'https://www.cic.com.vn/')
    .replace(/'\s*\.\s*URL_ROOT\s*/g, 'https://www.cic.com.vn/')
    .replace(/\.URL_ROOT\./g, 'https://www.cic.com.vn/')
    .replace(/http:\/\/enjicad\.vn\/img\//g, 'https://www.cic.com.vn/images/');
}
