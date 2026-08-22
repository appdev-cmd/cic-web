import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { createInlineTextEditDescriptor, type CommitElementEditRequest, type InlineTextEditDescriptor } from '../../../shared/visual-editing/inlineTextEditing';
import type { SortableReorderMutation, SortableReorderRequest } from '../../../shared/visual-editing/sortableBoundCollection';
import { isPersistentSortableId } from '../../../shared/visual-editing/sortableBoundCollection';
import type { PageBuilderConfigValue, PageBuilderSection } from './pageBuilderTypes';
import { getEditableFieldContract } from './pageBuilderEditableContracts';
import type { PageBuilderVisualElementEditingAdapter } from './visualElementEditingAdapterTypes';

export interface HomeStatsEditTarget {
  sectionId: string;
  path: Array<string | number>;
  descriptor: InlineTextEditDescriptor;
}

function itemRecords(section: PageBuilderSection): Array<Record<string, PageBuilderConfigValue>> {
  const items = section.config.items;
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is Record<string, PageBuilderConfigValue> => Boolean(item) && typeof item === 'object' && !Array.isArray(item));
}

export function resolveHomeStatsEditTarget(
  sections: readonly PageBuilderSection[],
  binding: EditableElementBinding,
): HomeStatsEditTarget | null {
  if (binding.sectionKey !== 'home.stats' || binding.semantic !== 'text' || !binding.editable || !binding.itemId) return null;
  if (binding.itemId.startsWith('unpersisted-home-stat-')) return null;
  const section = sections.find((candidate) => candidate.sectionKey === 'home.stats');
  if (!section) return null;
  const items = itemRecords(section);
  const itemIndex = items.findIndex((item) => item.id === binding.itemId);
  if (itemIndex < 0) return null;
  const field = binding.elementPath.split('.').at(-1);
  const item = items[itemIndex];
  if (field === 'value' && typeof item.value === 'number' && Number.isFinite(item.value)) {
    const descriptor = createInlineTextEditDescriptor(binding, getEditableFieldContract('home.stats', 'items.*.value')!, item.value, typeof item.suffix === 'string' ? item.suffix : '');
    if (!descriptor) return null;
    return {
      sectionId: section.id,
      path: ['items', itemIndex, 'value'],
      descriptor,
    };
  }
  if (field === 'label' && typeof item.label === 'string') {
    const descriptor = createInlineTextEditDescriptor(binding, getEditableFieldContract('home.stats', 'items.*.label')!, item.label);
    return descriptor ? { sectionId: section.id, path: ['items', itemIndex, 'label'], descriptor } : null;
  }
  return null;
}

export function isMatchingHomeStatsCommit(target: HomeStatsEditTarget, request: CommitElementEditRequest): boolean {
  if (target.descriptor.binding.bindingId !== request.binding.bindingId) return false;
  return target.descriptor.valueKind === 'number'
    ? typeof request.after === 'number' && Number.isFinite(request.after)
    : typeof request.after === 'string';
}

export const homeStatsElementEditingAdapter: PageBuilderVisualElementEditingAdapter = {
  sectionKey: 'home.stats',
  resolveInlineTextEdit(sections, binding) {
    const target = resolveHomeStatsEditTarget(sections, binding);
    return target ? { ...target, accepts: (request) => isMatchingHomeStatsCommit(target, request) } : null;
  },
};

export interface HomeStatsReorderResult {
  sectionId: string;
  path: ['items'];
  items: PageBuilderConfigValue[];
  mutation: SortableReorderMutation;
}

export function reorderHomeStatsItems(
  sections: readonly PageBuilderSection[],
  request: SortableReorderRequest,
): HomeStatsReorderResult | null {
  if (request.sectionKey !== 'home.stats'
    || request.collectionPath !== 'items'
    || request.itemId === request.targetItemId
    || !isPersistentSortableId(request.itemId)
    || !isPersistentSortableId(request.targetItemId)) return null;
  const section = sections.find((candidate) => candidate.sectionKey === 'home.stats');
  if (!section || !Array.isArray(section.config.items)) return null;
  const items = [...section.config.items];
  const idAt = (index: number) => {
    const item = items[index];
    return item && typeof item === 'object' && !Array.isArray(item) ? item.id : undefined;
  };
  if (items.some((_, index) => typeof idAt(index) !== 'string' || !isPersistentSortableId(String(idAt(index))))) return null;
  const beforeIndex = items.findIndex((_, index) => idAt(index) === request.itemId);
  const targetIndex = items.findIndex((_, index) => idAt(index) === request.targetItemId);
  if (beforeIndex < 0 || targetIndex < 0) return null;
  const [moved] = items.splice(beforeIndex, 1);
  const targetAfterRemoval = items.findIndex((item) => item && typeof item === 'object' && !Array.isArray(item) && item.id === request.targetItemId);
  const insertionIndex = request.placement === 'before' ? targetAfterRemoval : targetAfterRemoval + 1;
  items.splice(insertionIndex, 0, moved);
  const afterIndex = items.findIndex((item) => item && typeof item === 'object' && !Array.isArray(item) && item.id === request.itemId);
  if (afterIndex === beforeIndex) return null;
  return { sectionId: section.id, path: ['items'], items, mutation: { ...request, beforeIndex, afterIndex } };
}
