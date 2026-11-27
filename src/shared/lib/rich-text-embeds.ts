const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
]);

const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

function parseStartSeconds(rawParam: string | null): number | null {
  if (!rawParam) return null;
  const trimmed = rawParam.trim().toLowerCase();
  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    return n > 0 ? n : null;
  }
  const hmsMatch = trimmed.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (hmsMatch && (hmsMatch[1] || hmsMatch[2] || hmsMatch[3])) {
    const total =
      (Number(hmsMatch[1] || 0) * 3600) +
      (Number(hmsMatch[2] || 0) * 60) +
      Number(hmsMatch[3] || 0);
    return total > 0 ? total : null;
  }
  return null;
}

/**
 * Extracts a valid YouTube video ID (and optional start timestamp) from watch, youtu.be, Shorts, Live, Embed URLs, or <iframe> snippets.
 */
export function extractYouTubeVideoMeta(rawInput: string): { id: string; startSeconds?: number } | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  const iframeSrcMatch = trimmed.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["']/i);
  const candidate = iframeSrcMatch?.[1]?.trim() || trimmed;

  try {
    const normalizedCandidate = candidate.replace(/\?v=([^?&]+)\?start=/i, '?v=$1&start=');
    const parsed = new URL(normalizedCandidate);
    const host = parsed.hostname.toLowerCase();
    if (!YOUTUBE_HOSTS.has(host)) return null;

    const startSeconds =
      parseStartSeconds(parsed.searchParams.get('start')) ??
      parseStartSeconds(parsed.searchParams.get('t')) ??
      undefined;

    if (host === 'youtu.be') {
      const id = parsed.pathname.replace(/^\/+/, '').split('/')[0] ?? '';
      return /^[a-zA-Z0-9_-]{6,}$/.test(id) ? { id, startSeconds } : null;
    }

    const vParam = parsed.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{6,}$/.test(vParam)) {
      return { id: vParam, startSeconds };
    }

    const pathMatch = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{6,})/);
    if (pathMatch?.[1]) {
      return { id: pathMatch[1], startSeconds };
    }
  } catch {
    const fallbackMatch = candidate.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{6,})/i,
    );
    if (fallbackMatch?.[1]) {
      return { id: fallbackMatch[1] };
    }
  }

  return null;
}

export function extractYouTubeVideoId(rawInput: string): string | null {
  return extractYouTubeVideoMeta(rawInput)?.id ?? null;
}

/**
 * Extracts a numeric Vimeo video ID from Vimeo URLs or <iframe> snippets.
 */
export function extractVimeoVideoId(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  const iframeSrcMatch = trimmed.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["']/i);
  const candidate = iframeSrcMatch?.[1]?.trim() || trimmed;

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.toLowerCase();
    if (!VIMEO_HOSTS.has(host)) return null;
    const idMatch = parsed.pathname.match(/(?:\/video)?\/(\d+)(?:\/|$)/);
    return idMatch?.[1] ?? null;
  } catch {
    const fallbackMatch = candidate.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    return fallbackMatch?.[1] ?? null;
  }
}

/**
 * Resolves any allowed YouTube or Vimeo link / iframe snippet into a normalized HTTPS embed URL.
 * Returns null if not from an allowed provider (prevents untrusted iframe injection).
 */
export function resolveAllowedVideoEmbedSrc(rawInput: string): string | null {
  const yt = extractYouTubeVideoMeta(rawInput);
  if (yt) {
    return yt.startSeconds
      ? `https://www.youtube.com/embed/${yt.id}?start=${yt.startSeconds}`
      : `https://www.youtube.com/embed/${yt.id}`;
  }
  const vimeoId = extractVimeoVideoId(rawInput);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }
  return null;
}

/**
 * Strictly validates an iframe `src` attribute against HTTPS YouTube / Vimeo embed endpoints.
 */
export function resolveAllowedIframeEmbedSrc(rawSrc: string): string | null {
  const trimmed = rawSrc.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;
    const host = parsed.hostname.toLowerCase();
    if (
      (host === 'www.youtube.com' ||
        host === 'youtube.com' ||
        host === 'www.youtube-nocookie.com' ||
        host === 'youtube-nocookie.com') &&
      /^\/embed\/[a-zA-Z0-9_-]{6,}/.test(parsed.pathname)
    ) {
      const ytId = parsed.pathname.replace(/^\/embed\//, '').split('/')[0]!;
      const startSeconds = parseStartSeconds(parsed.searchParams.get('start'));
      return startSeconds
        ? `https://www.youtube.com/embed/${ytId}?start=${startSeconds}`
        : `https://www.youtube.com/embed/${ytId}`;
    }
    if (host === 'player.vimeo.com' && /^\/video\/\d+/.test(parsed.pathname)) {
      const vimeoId = parsed.pathname.replace(/^\/video\//, '').split('/')[0]!;
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return resolveAllowedVideoEmbedSrc(trimmed);
  } catch {
    return resolveAllowedVideoEmbedSrc(trimmed);
  }
}

function escapeAttrText(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Builds a clean, responsive 16:9 <iframe> HTML snippet for YouTube / Vimeo.
 */
export function buildSafeVideoIframeHtml(
  embedSrc: string,
  title = 'Video giới thiệu CIC Technology',
): string {
  const safeSrc = resolveAllowedIframeEmbedSrc(embedSrc);
  if (!safeSrc) return '';
  const safeTitle = escapeAttrText(title.trim() || 'Video giới thiệu CIC Technology');
  return `<iframe src="${safeSrc}" title="${safeTitle}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="allowfullscreen" loading="lazy" class="w-full aspect-video rounded-[10px] border-0"></iframe>`;
}

export function buildSafeVideoFigureHtml(
  embedSrc: string,
  title = 'Video giới thiệu CIC Technology',
): string {
  const safeSrc = resolveAllowedIframeEmbedSrc(embedSrc);
  const iframeHtml = buildSafeVideoIframeHtml(embedSrc, title);
  if (!safeSrc || !iframeHtml) return '';
  return `<figure class="media my-4"><div data-oembed-url="${safeSrc}">${iframeHtml}</div></figure>`;
}

/**
 * Automatically upgrades bare YouTube/Vimeo <iframe> tags (pasted in HTML Source mode)
 * into CKEditor-compatible <figure class="media"> structures.
 */
export function upgradeBareVideoIframesToMediaFigures(html: string): string {
  if (!/<iframe\b/i.test(html)) return html;

  const TOKEN = '___CIC_OEMBED_DONE_';
  const kept: string[] = [];
  let work = html.replace(
    /<figure\b[^>]*class=["'][^"']*\bmedia\b[^"']*["'][^>]*>\s*<div\b[^>]*\bdata-oembed-url=["'][^"']+["'][^>]*>[\s\S]*?<\/div>\s*<\/figure>/gi,
    (m) => {
      const idx = kept.length;
      kept.push(m);
      return `${TOKEN}${idx}___`;
    },
  );

  const replaceIframe = (fullMatch: string, attrs: string) => {
    const srcMatch = attrs.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const rawSrc = srcMatch?.[1] ?? srcMatch?.[2] ?? srcMatch?.[3] ?? '';
    const embedSrc = resolveAllowedVideoEmbedSrc(rawSrc);
    if (!embedSrc) return fullMatch;
    const titleMatch = attrs.match(/\btitle\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    return buildSafeVideoFigureHtml(embedSrc, titleMatch?.[1] ?? titleMatch?.[2]);
  };

  work = work.replace(
    /<div\b[^>]*class=["'][^"']*\bcms-video-wrapper\b[^"']*["'][^>]*>[\s\S]*?<iframe\b([^>]*)>[\s\S]*?<\/iframe>[\s\S]*?<\/div>(?:\s*<\/div>)?/gi,
    replaceIframe,
  );
  work = work.replace(
    /<figure\b[^>]*>\s*<iframe\b([^>]*)>[\s\S]*?<\/iframe>\s*(?:<figcaption\b[^>]*>[\s\S]*?<\/figcaption>\s*)?<\/figure>/gi,
    replaceIframe,
  );
  work = work.replace(
    /<p\b[^>]*>\s*<iframe\b([^>]*)>[\s\S]*?<\/iframe>\s*<\/p>/gi,
    replaceIframe,
  );
  work = work.replace(
    /<iframe\b([^>]*)>[\s\S]*?<\/iframe>|<iframe\b([^>]*)\/?>/gi,
    (fullMatch, attrs1?: string, attrs2?: string) =>
      replaceIframe(fullMatch, attrs1 ?? attrs2 ?? ''),
  );

  for (let i = 0; i < kept.length; i++) {
    work = work.replace(`${TOKEN}${i}___`, kept[i]!);
  }
  return work;
}
