import type { PageBuilderConfigValue } from '../pageBuilderTypes';
import { fieldLabels } from './editorConstants';

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function labelFor(key: string): string {
  return fieldLabels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

export function updateAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>, value: PageBuilderConfigValue) {
  const next = deepClone(config || {});
  if (!path || path.length === 0) return next;
  let cursor: any = next;
  for (let i = 0; i < path.length - 1; i++) {
    let part = path[i];
    const nextPart = path[i + 1];
    if (Array.isArray(cursor)) {
      if (typeof part === 'string' && !/^\d+$/.test(part)) {
        const foundIdx = cursor.findIndex((item) => item && typeof item === 'object' && (item.id === part || item.entityId === part || item.key === part));
        if (foundIdx >= 0) {
          part = foundIdx;
        } else {
          const numMatch = part.match(/\d+$/);
          if (numMatch) {
            const parsedIdx = Number(numMatch[0]) - 1;
            if (parsedIdx >= 0 && parsedIdx < cursor.length) {
              part = parsedIdx;
            }
          }
        }
      }
      if (typeof part === 'number') {
        while (cursor.length < part) {
          cursor.push({});
        }
      }
    }
    if (cursor[part] === undefined || cursor[part] === null || typeof cursor[part] !== 'object') {
      cursor[part] = typeof nextPart === 'number' ? [] : {};
    }
    cursor = cursor[part];
  }
  let lastPart = path[path.length - 1];
  if (cursor && typeof cursor === 'object') {
    if (Array.isArray(cursor)) {
      if (typeof lastPart === 'string' && !/^\d+$/.test(lastPart)) {
        const foundIdx = cursor.findIndex((item) => item && typeof item === 'object' && (item.id === lastPart || item.entityId === lastPart || item.key === lastPart));
        if (foundIdx >= 0) lastPart = foundIdx;
      }
      if (typeof lastPart === 'number') {
        while (cursor.length < lastPart) {
          cursor.push({});
        }
      }
    }
    cursor[lastPart] = value;
    if (lastPart === 'value' && typeof cursor === 'object' && !Array.isArray(cursor) && 'val' in cursor) {
      (cursor as Record<string, unknown>).val = value;
    }
    if (lastPart === 'val' && typeof cursor === 'object' && !Array.isArray(cursor) && 'value' in cursor) {
      (cursor as Record<string, unknown>).value = value;
    }
  }
  return next;
}

export function valueAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>) {
  return path.reduce<PageBuilderConfigValue | undefined>((value, part) => {
    if (!value || typeof value !== 'object') return undefined;
    if (Array.isArray(value) && typeof part === 'string' && !/^\d+$/.test(part)) {
      const found = value.find((item) => item && typeof item === 'object' && ((item as any).id === part || (item as any).entityId === part || (item as any).key === part));
      if (found) return found;
    }
    return (value as Record<string | number, PageBuilderConfigValue>)[part];
  }, config);
}

export function siblingPath(path: Array<string | number>, suffix: string) {
  const key = String(path[path.length - 1] ?? 'ctaId');
  return [...path.slice(0, -1), `${key}${suffix}`];
}
