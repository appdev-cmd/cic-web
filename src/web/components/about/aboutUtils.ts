/**
 * About View Utility Functions and Types
 */
import { bindElement as bindElementRuntime, type BoundElementProps } from '@shared/visual-editing/bindElement';
import { type ElementBindingRegistry } from '@shared/visual-editing/elementBindingRegistry';
import { createElementBinding } from '@shared/visual-editing/elementBindingTypes';

export function bindElement<T extends Element>(
  registry: ElementBindingRegistry,
  binding: ReturnType<typeof createElementBinding>
): BoundElementProps<T> {
  return bindElementRuntime<T>(binding, registry);
}

export function getYoutubeEmbedUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return 'https://www.youtube.com/embed/hdLFK_09-tU?start=448';
  }
  const trimmed = rawUrl.trim();
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const target = iframeMatch ? iframeMatch[1] : trimmed;

  try {
    const parsed = new URL(target.startsWith('http') ? target : `https://${target}`);
    let videoId = '';
    let start = '';

    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace(/^\//, '');
      start = parsed.searchParams.get('t') || parsed.searchParams.get('start') || '';
    } else if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.includes('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1];
      } else {
        videoId = parsed.searchParams.get('v') || '';
      }
      start = parsed.searchParams.get('t') || parsed.searchParams.get('start') || '';
    }

    if (videoId) {
      const cleanVideoId = videoId.split(/[?&]/)[0];
      const cleanStart = start.replace(/s$/i, '');
      return `https://www.youtube.com/embed/${cleanVideoId}${cleanStart ? `?start=${cleanStart}` : ''}`;
    }
  } catch {
    // fallback if parsing fails
  }

  return target.replace('watch?v=', 'embed/').replace(/[?&]t=([0-9]+)s?/, '?start=$1');
}

export function textFrom(
  config: Record<string, unknown>,
  key: string,
  fallback: string
): string {
  return typeof config[key] === 'string' ? (config[key] as string) : fallback;
}
