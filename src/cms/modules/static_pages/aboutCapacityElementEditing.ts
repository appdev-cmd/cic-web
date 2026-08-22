import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { createInlineTextEditDescriptor, type CommitElementEditRequest, type InlineTextEditDescriptor } from '../../../shared/visual-editing/inlineTextEditing';
import type { PageBuilderConfigValue, PageBuilderSection } from './pageBuilderTypes';
import { getEditableFieldContract } from './pageBuilderEditableContracts';
import type { PageBuilderVisualElementEditingAdapter } from './visualElementEditingAdapterTypes';

export interface AboutCapacityEditTarget {
  sectionId: string;
  path: Array<string | number>;
  descriptor: InlineTextEditDescriptor;
}

function metricRecords(section: PageBuilderSection): Array<Record<string, PageBuilderConfigValue>> {
  return Array.isArray(section.config.metrics)
    ? section.config.metrics.filter((item): item is Record<string, PageBuilderConfigValue> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    : [];
}

export function resolveAboutCapacityEditTarget(
  sections: readonly PageBuilderSection[],
  binding: EditableElementBinding,
): AboutCapacityEditTarget | null {
  if (binding.sectionKey !== 'about.capacity' || binding.semantic !== 'text' || !binding.editable) return null;
  const section = sections.find((candidate) => candidate.sectionKey === binding.sectionKey);
  if (!section) return null;
  if (binding.elementPath === 'description' && typeof section.config.description === 'string') {
    const descriptor = createInlineTextEditDescriptor(binding, getEditableFieldContract('about.capacity', 'description')!, section.config.description);
    return descriptor ? { sectionId: section.id, path: ['description'], descriptor } : null;
  }
  if (!binding.itemId || binding.itemId.startsWith('unpersisted-about-capacity-metric-')) return null;
  const metrics = metricRecords(section);
  const metricIndex = metrics.findIndex((metric) => metric.id === binding.itemId);
  if (metricIndex < 0) return null;
  const field = binding.elementPath.split('.').at(-1);
  if ((field !== 'value' && field !== 'label') || typeof metrics[metricIndex][field] !== 'string') return null;
  const descriptor = createInlineTextEditDescriptor(binding, getEditableFieldContract('about.capacity', `metrics.*.${field}`)!, metrics[metricIndex][field] as string);
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
