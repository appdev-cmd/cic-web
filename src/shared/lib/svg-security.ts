/**
 * Centralized SVG Security Validator
 * Protects against Stored XSS, XXE, and active script execution in SVG files.
 */

export function isDangerousSvg(svgContent: string): boolean {
  if (!svgContent) return false;
  const lower = svgContent.toLowerCase();

  // 1. Script tags
  if (/<script[\s>]/i.test(lower) || /<\/script>/i.test(lower)) return true;

  // 2. ForeignObject and embedded frame/object execution
  if (/<foreignobject[\s>]/i.test(lower)) return true;
  if (/<(iframe|embed|object|applet|meta)[\s>]/i.test(lower)) return true;

  // 3. Inline event handlers (onload, onerror, onclick, onmouseover, onfocus, etc.)
  if (/\bon[a-z]+\s*=/i.test(lower)) return true;

  // 4. Dangerous URI schemes in hyperlinks or references
  if (/(?:href|xlink:href)\s*=\s*["']?\s*(?:javascript:|data:|vbscript:)/i.test(lower)) return true;

  // 5. XML External Entity (XXE) and DTD entity attacks
  if (/<!entity/i.test(lower) || /<!doctype[^>]*\[/i.test(lower)) return true;
  if (/\b(?:system|public)\s+["'][^"']+["']/i.test(lower) && /<!/i.test(lower)) return true;

  // 6. Dangerous animations targeting scripts or event attributes
  if (/<(?:animate|set)\b[^>]*(?:attributeName\s*=\s*["']?(?:href|xlink:href|on\w+)|to\s*=\s*["']?javascript:)/i.test(lower)) {
    return true;
  }

  // 7. Dangerous CSS inside <style> tags (expression, @import, javascript URLs)
  if (/<style[\s>]/i.test(lower)) {
    if (/(?:expression\s*\(|@import|-moz-binding|behavior\s*:|javascript:)/i.test(lower)) {
      return true;
    }
  }

  return false;
}

export function isSvgAsset(mime: string, filename: string, sampleBytes?: string): boolean {
  if (mime === 'image/svg+xml') return true;
  if (filename.toLowerCase().endsWith('.svg')) return true;
  if (sampleBytes && /^\s*(?:<\?xml\b[^>]*\?>\s*)?(?:<!doctype\s+svg[^>]*>\s*)?<svg[\s>]/i.test(sampleBytes)) {
    return true;
  }
  return false;
}

export async function assertSafeSvgFile(file: File): Promise<void> {
  const isSvg = isSvgAsset(file.type, file.name);
  if (!isSvg) {
    // Check first 512 bytes for sneaky SVG disguised as another format
    try {
      const slice = file.slice(0, 512);
      const textSample = await slice.text();
      if (/^\s*(?:<\?xml\b[^>]*\?>\s*)?(?:<!doctype\s+svg[^>]*>\s*)?<svg[\s>]/i.test(textSample)) {
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
