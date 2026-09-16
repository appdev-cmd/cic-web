import type { PageBuilderConfigValue } from '../pageBuilderTypes';
import { fieldLabels } from './editorConstants';

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function labelFor(key: string): string {
  return fieldLabels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

export function updateAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>, value: PageBuilderConfigValue) {
  const next = deepClone(config);
  let cursor: PageBuilderConfigValue = next;
  path.slice(0, -1).forEach((part) => {
    cursor = (cursor as Record<string | number, PageBuilderConfigValue>)[part];
  });
  (cursor as Record<string | number, PageBuilderConfigValue>)[path[path.length - 1]] = value;
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
