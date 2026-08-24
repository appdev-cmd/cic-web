import type { EditableElementBinding } from './elementBindingTypes';

export interface ReferenceItemDescriptor {
  binding: EditableElementBinding;
  sectionKey: string;
  collectionPath: string;
  entityType: string;
  entityId: string;
  replaceable: boolean;
}

export function referenceDescriptorFromBinding(binding: EditableElementBinding, entityType: string, replaceable: boolean): ReferenceItemDescriptor | null {
  if (binding.semantic !== 'reference-item' || binding.ownership !== 'reference' || !binding.itemId || !binding.collectionPath) return null;
  return { binding, sectionKey: binding.sectionKey, collectionPath: binding.collectionPath, entityType, entityId: binding.itemId, replaceable };
}
