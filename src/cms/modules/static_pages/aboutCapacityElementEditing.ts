import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { createInlineTextEditDescriptor, type CommitElementEditRequest, type InlineTextEditDescriptor } from '../../../shared/visual-editing/inlineTextEditing';
import type { PageBuilderConfigValue, PageBuilderSection } from './pageBuilderTypes';
import { getEditableFieldContract } from './pageBuilderEditableContracts';
import type { PageBuilderVisualElementEditingAdapter } from './visualElementEditingAdapterTypes';

import { getLegacyAboutCapacityContent } from '../../../shared/page-content/legacyPageContent';

export interface AboutCapacityEditTarget {
  sectionId: string;
  path: Array<string | number>;
  descriptor: InlineTextEditDescriptor;
}

function metricRecords(section: PageBuilderSection): Array<Record<string, PageBuilderConfigValue>> {
  const configured = Array.isArray(section.config.metrics)
    ? section.config.metrics.filter((item): item is Record<string, PageBuilderConfigValue> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    : [];
  if (configured.length > 0) return configured;
  return getLegacyAboutCapacityContent().metrics as unknown as Array<Record<string, PageBuilderConfigValue>>;
}

export function resolveAboutCapacityEditTarget(
  sections: readonly PageBuilderSection[],
  binding: EditableElementBinding,
): AboutCapacityEditTarget | null {
  if (binding.sectionKey !== 'about.capacity' || binding.semantic !== 'text' || !binding.editable) return null;
  const section = sections.find((candidate) => candidate.sectionKey === binding.sectionKey);
  if (!section) return null;
  if (binding.elementPath === 'description') {
    const descVal = typeof section.config.description === 'string' && section.config.description
      ? section.config.description
      : getLegacyAboutCapacityContent().description;
    const descriptor = createInlineTextEditDescriptor(binding, getEditableFieldContract('about.capacity', 'description')!, descVal);
    return descriptor ? { sectionId: section.id, path: ['description'], descriptor } : null;
  }
  if (!binding.itemId || binding.itemId.startsWith('unpersisted-about-capacity-metric-')) return null;
  const metrics = metricRecords(section);
  let metricIndex = metrics.findIndex((metric) => metric.id === binding.itemId);
  if (metricIndex < 0) {
    const match = binding.itemId.match(/(?:metric-|cap-)(\d+)/);
    if (match) {
      const parsed = Number(match[1]);
      const candidateIdx = binding.itemId.includes('metric-') ? parsed - 1 : parsed;
      if (candidateIdx >= 0 && candidateIdx < metrics.length) {
        metricIndex = candidateIdx;
      }
    }
  }
  if (metricIndex < 0) return null;
  const field = binding.elementPath.split('.').at(-1);
  if (field !== 'value' && field !== 'label') return null;
  const rawVal = metrics[metricIndex]?.[field];
  const editVal = typeof rawVal === 'string' ? rawVal : (rawVal !== undefined && rawVal !== null ? String(rawVal) : '');
  const descriptor = createInlineTextEditDescriptor(binding, getEditableFieldContract('about.capacity', `metrics.*.${field}`)!, editVal);
  return descriptor ? {
    sectionId: section.id,
    path: ['metrics', metricIndex, field],
    descriptor,
  } : null;
}

export const aboutCapacityElementEditingAdapter: PageBuilderVisualElementEditingAdapter = {
  sectionKey: 'about.capacity',
  resolveInlineTextEdit(sections, binding) {
    const target = resolveAboutCapacityEditTarget(sections, binding);
    return target ? { ...target, accepts: (request) => isMatchingAboutCapacityCommit(target, request) } : null;
  },
};

export function isMatchingAboutCapacityCommit(target: AboutCapacityEditTarget, request: CommitElementEditRequest): boolean {
  return target.descriptor.binding.bindingId === request.binding.bindingId && typeof request.after === 'string';
}
