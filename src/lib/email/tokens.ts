/**
 * Utility to replace tokens in email subject and content.
 * Supports both modern {{variable.name}} and legacy {name} tokens.
 */
export function interpolateTokens(text: string, values: Record<string, string | number | undefined | null>): string {
  if (!text) return '';

  // 1. First map common legacy PHP tokens to modern names if not already present
  const mappedValues: Record<string, string> = {};
  for (const [key, val] of Object.entries(values)) {
    if (val !== undefined && val !== null) {
      mappedValues[key] = String(val);
      // If key is {{customer.full_name}}, also support {name}
      if (key === '{{customer.full_name}}') {
        mappedValues['{name}'] = String(val);
      }
      if (key === '{{product.name}}') {
        mappedValues['{name1}'] = String(val);
      }
      if (key === '{{document.download_url}}' || key === '{{product.public_url}}') {
        mappedValues['{link1}'] = String(val);
      }
    }
  }

  let result = text;

  // Replace {{token}}
  result = result.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (match, token) => {
    const fullToken = `{{${token}}}`;
    if (mappedValues[fullToken] !== undefined) return mappedValues[fullToken];
    if (mappedValues[token] !== undefined) return mappedValues[token];
    return match; // leave untouched if not provided
  });

  // Replace legacy {token}
  result = result.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, token) => {
    const fullToken = `{${token}}`;
    if (mappedValues[fullToken] !== undefined) return mappedValues[fullToken];
    if (mappedValues[token] !== undefined) return mappedValues[token];
    return match;
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
