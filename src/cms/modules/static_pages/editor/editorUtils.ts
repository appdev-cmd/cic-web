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
    const part = path[i];
    const nextPart = path[i + 1];
    if (Array.isArray(cursor) && typeof part === 'number') {
      while (cursor.length < part) {
        cursor.push({});
      }
    }
    if (cursor[part] === undefined || cursor[part] === null || typeof cursor[part] !== 'object') {
      cursor[part] = typeof nextPart === 'number' ? [] : {};
    }
    cursor = cursor[part];
  }
  const lastPart = path[path.length - 1];
  if (cursor && typeof cursor === 'object') {
    if (Array.isArray(cursor) && typeof lastPart === 'number') {
      while (cursor.length < lastPart) {
        cursor.push({});
      }
    }
    cursor[lastPart] = value;
  }
  return next;
}

export function valueAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>) {
  return path.reduce<PageBuilderConfigValue | undefined>((value, part) => {
    if (!value || typeof value !== 'object') return undefined;
    return (value as Record<string | number, PageBuilderConfigValue>)[part];
  }, config);
}

export function siblingPath(path: Array<string | number>, suffix: string) {
  const key = String(path[path.length - 1] ?? 'ctaId');
  return [...path.slice(0, -1), `${key}${suffix}`];
}
