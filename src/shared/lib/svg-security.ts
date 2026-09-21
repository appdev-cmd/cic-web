/**
 * Centralized SVG Security Validator
 * Protects against Stored XSS, XXE, and active script execution in SVG files.
 * Uses XML entity canonicalization and structural policy enforcement.
 */

export function decodeXmlEntities(text: string): string {
  let prev = '';
  let curr = text;
  let iterations = 0;
  // Multi-pass decoding to prevent nested entity obfuscation like &amp;#x61;
  while (curr !== prev && iterations < 4) {
    prev = curr;
    iterations++;
    curr = curr
      // Hex entities: &#x61; or &#x0061;
      .replace(/&#x([0-9a-fA-F]+);?/g, (_, hex) => {
        try {
          const cp = parseInt(hex, 16);
          return cp > 0 && cp < 0x110000 ? String.fromCodePoint(cp) : '';
        } catch {
          return '';
        }
      })
      // Decimal entities: &#97;
      .replace(/&#([0-9]+);?/g, (_, dec) => {
        try {
          const cp = parseInt(dec, 10);
          return cp > 0 && cp < 0x110000 ? String.fromCodePoint(cp) : '';
        } catch {
          return '';
        }
      })
      // Standard XML named entities
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&amp;/gi, '&');
  }
  return curr;
}

export function normalizeUri(uri: string): string {
  const decoded = decodeXmlEntities(uri);
  // Strip control characters, null bytes, and all whitespace inside the URI prefix
  return decoded.replace(/[\x00-\x20\s]/g, '').toLowerCase();
}

export function isDangerousSvg(svgContent: string): boolean {
  if (!svgContent || typeof svgContent !== 'string') return false;

  // 1. XML External Entity (XXE) and DTD entity attacks
  if (/<!doctype[^>]*\[/i.test(svgContent) || /<!entity/i.test(svgContent)) return true;
  if (/<\?xml-stylesheet/i.test(svgContent)) return true;
  if (/\b(?:system|public)\s+["'][^"']+["']/i.test(svgContent) && /<!/i.test(svgContent)) return true;

  // 2. Canonicalize XML entities and remove null bytes
  const canonical = decodeXmlEntities(svgContent).replace(/\0/g, '');

  // 3. Forbidden active / executable tags
  const forbiddenTags = [
    'script',
    'foreignobject',
    'iframe',
    'frame',
    'frameset',
    'embed',
    'object',
    'applet',
    'meta',
    'link',
    'base',
    'form',
    'input',
    'button',
    'textarea',
    'select',
  ];
  for (const tag of forbiddenTags) {
    const tagRegex = new RegExp(`<\\s*\\/?\\s*${tag}[\\s>\\/]`, 'i');
    if (tagRegex.test(canonical)) return true;
  }

  // 4. Inline event handlers on any element (onload, onerror, onclick, onfocus...)
  // Handles whitespace, newlines, tabs, and slash delimiters: on\s*load=, on\nload=, onload/=
  if (/\bon[\s\x00-\x20\/]*[a-z0-9_-]+[\s\x00-\x20\/]*=/i.test(canonical)) return true;

  // 5. Dangerous URI schemes in hyperlinks, references, or embedded attributes
  const uriAttrRegex = /\b(?:href|xlink:href|src|data|action)\s*=\s*(["'])([\s\S]*?)\1/gi;
  let match: RegExpExecArray | null;
  while ((match = uriAttrRegex.exec(canonical)) !== null) {
    const rawVal = match[2];
    const normVal = normalizeUri(rawVal);
    if (
      normVal.startsWith('javascript:') ||
      normVal.startsWith('vbscript:') ||
      normVal.startsWith('data:text/html') ||
      normVal.startsWith('data:image/svg') ||
      normVal.startsWith('data:application/')
    ) {
      return true;
    }
  }

  // 6. External resource inclusion via <use> tags
  // Local fragment identifiers (e.g. href="#icon-id") are allowed, external URLs are rejected.
  const useTagRegex = /<\s*use\b([\s\S]*?)>/gi;
  while ((match = useTagRegex.exec(canonical)) !== null) {
    const attrs = match[1];
    const hrefMatch = /\b(?:href|xlink:href)\s*=\s*(["'])([\s\S]*?)\1/i.exec(attrs);
    if (hrefMatch) {
      const normHref = normalizeUri(hrefMatch[2]);
      if (normHref && !normHref.startsWith('#')) {
        return true;
      }
    }
  }

  // 7. Dangerous animations targeting sensitive attributes or javascript URLs
  const animRegex = /<\s*(?:animate|set|animatetransform|animatemotion)\b([\s\S]*?)>/gi;
  while ((match = animRegex.exec(canonical)) !== null) {
    const attrs = match[1];
    if (/\battributeName\s*=\s*(["'])\s*(?:href|xlink:href|on\w+)\s*\1/i.test(attrs)) return true;
    if (/\b(?:to|values|from)\s*=\s*(["'])\s*javascript:/i.test(attrs)) return true;
  }

  // 8. Dangerous CSS inside <style> tags or style attributes
  const styleTagRegex = /<\s*style\b[^>]*>([\s\S]*?)<\s*\/\s*style\s*>/gi;
  while ((match = styleTagRegex.exec(canonical)) !== null) {
    const css = match[1].toLowerCase();
    if (/(?:expression\s*\(|@import|-moz-binding|behavior\s*:|javascript:)/i.test(css)) {
      return true;
    }
  }
  const styleAttrRegex = /\bstyle\s*=\s*(["'])([\s\S]*?)\1/gi;
  while ((match = styleAttrRegex.exec(canonical)) !== null) {
    const css = match[2].toLowerCase();
    if (/(?:expression\s*\(|@import|-moz-binding|behavior\s*:|javascript:)/i.test(css)) {
      return true;
    }
  }

  return false;
}

export function isSvgAsset(mime: string, filename: string, sampleBytes?: string): boolean {
  if (mime === 'image/svg+xml') return true;
  if (filename.toLowerCase().endsWith('.svg') || /\.svg$/i.test(filename)) return true;
  if (sampleBytes && /<\s*(?:[a-z0-9_-]+:)?svg[\s>]/i.test(sampleBytes)) {
    return true;
  }
  return false;
}

export async function assertSafeSvgFile(file: File): Promise<void> {
  const isSvg = isSvgAsset(file.type, file.name);
  if (!isSvg) {
    // Check first 8KB for sneaky SVG disguised as another format
    try {
      const slice = file.slice(0, 8192);
      const textSample = await slice.text();
      if (/<\s*(?:[a-z0-9_-]+:)?svg[\s>]/i.test(textSample)) {
        const fullContent = await file.text();
        if (isDangerousSvg(fullContent)) {
          throw new Error('Tệp SVG chứa mã lệnh hoặc nội dung không an toàn.');
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('Tệp SVG chứa mã lệnh')) throw e;
    }
    return;
  }

  const content = await file.text();
  if (isDangerousSvg(content)) {
    throw new Error('Tệp SVG chứa mã lệnh hoặc nội dung không an toàn.');
  }
}
