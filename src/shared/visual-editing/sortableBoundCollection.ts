import type { EditableElementBinding } from './elementBindingTypes';
import type { ElementBindingRegistry } from './elementBindingRegistry';

export interface SortableItemDescriptor {
  binding: EditableElementBinding;
  sectionKey: string;
  collectionPath: string;
  itemId: string;
}

export type SortablePlacement = 'before' | 'after';

export interface SortableReorderRequest {
  sectionKey: string;
  collectionPath: string;
  itemId: string;
  targetItemId: string;
  placement: SortablePlacement;
}

export interface SortableReorderMutation extends SortableReorderRequest {
  beforeIndex: number;
  afterIndex: number;
}

export interface SortableHitTarget {
  descriptor: SortableItemDescriptor;
  placement: SortablePlacement;
  node: Element;
}

export function isPersistentSortableId(itemId: string): boolean {
  return itemId.length > 0
    && !itemId.startsWith('unpersisted-')
    && !itemId.startsWith('legacy-')
    && !itemId.startsWith('fallback-');
}

export function sortableDescriptorFromBinding(binding: EditableElementBinding): SortableItemDescriptor | null {
  if (binding.semantic !== 'embedded-item'
    || !binding.itemId
    || !binding.collectionPath
    || !isPersistentSortableId(binding.itemId)) return null;
  return {
    binding,
    sectionKey: binding.sectionKey,
    collectionPath: binding.collectionPath,
    itemId: binding.itemId,
  };
}

export function listSortableCollectionItems(
  registry: ElementBindingRegistry,
  collection: Pick<SortableItemDescriptor, 'sectionKey' | 'collectionPath'>,
): Array<{ descriptor: SortableItemDescriptor; node: Element }> {
  return registry.listBindings().flatMap(({ binding, node }) => {
    const descriptor = sortableDescriptorFromBinding(binding);
    return descriptor
      && descriptor.sectionKey === collection.sectionKey
      && descriptor.collectionPath === collection.collectionPath
      ? [{ descriptor, node }]
      : [];
  });
}

export function hitTestSortableCollection(
  items: readonly { descriptor: SortableItemDescriptor; node: Element }[],
  clientX: number,
  clientY: number,
): SortableHitTarget | null {
  let closest: { descriptor: SortableItemDescriptor; node: Element; distance: number } | null = null;
  for (const item of items) {
    const rect = item.node.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    const distance = dx * dx + dy * dy;
    if (!closest || distance < closest.distance) closest = { ...item, distance };
  }
  if (!closest) return null;
  const rect = closest.node.getBoundingClientRect();
  const rowDistance = Math.abs(clientY - (rect.top + rect.height / 2));
  const placement: SortablePlacement = rowDistance > rect.height * 0.28
    ? (clientY < rect.top + rect.height / 2 ? 'before' : 'after')
    : (clientX < rect.left + rect.width / 2 ? 'before' : 'after');
  return { descriptor: closest.descriptor, placement, node: closest.node };
}

export function adjacentSortableTarget(
  items: readonly { descriptor: SortableItemDescriptor; node: Element }[],
  itemId: string,
  direction: -1 | 1,
): SortableHitTarget | null {
  const index = items.findIndex((item) => item.descriptor.itemId === itemId);
  const target = items[index + direction];
  return target ? { ...target, placement: direction < 0 ? 'before' : 'after' } : null;
}
