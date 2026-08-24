import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { isCapabilityEnabled } from '../../../shared/visual-editing/editableSectionContract';
import { referenceDescriptorFromBinding, type ReferenceItemDescriptor } from '../../../shared/visual-editing/referenceItemInteraction';
import type { SortableReorderRequest } from '../../../shared/visual-editing/sortableBoundCollection';
import { sectionDefinitions } from './pageBuilderRegistry';
import type { PageBuilderSection } from './pageBuilderTypes';

export const directReferenceSectionKeys = new Set(
  Object.entries(sectionDefinitions)
    .filter(([, definition]) => definition.editableContract?.references)
    .map(([sectionKey]) => sectionKey),
);

export function resolveReferenceItem(binding: EditableElementBinding): ReferenceItemDescriptor | null {
  const contract = sectionDefinitions[binding.sectionKey]?.editableContract?.references?.[binding.collectionPath ?? ''];
  return contract
    ? referenceDescriptorFromBinding(binding, contract.entityType, isCapabilityEnabled(contract.capabilities.replace))
    : null;
}

export function reorderReferenceItems(sections: readonly PageBuilderSection[], request: SortableReorderRequest) {
  const section = sections.find((candidate) => candidate.sectionKey === request.sectionKey);
  const contract = sectionDefinitions[request.sectionKey]?.editableContract?.references?.[request.collectionPath];
  if (!section || !contract || !isCapabilityEnabled(contract.capabilities.reorder)) return null;
  const reference = section.references?.find((candidate) => candidate.entityType === contract.entityType);
  if (!reference) return null;
  const sourceIndex = reference.entityIds.indexOf(request.itemId);
  const targetIndex = reference.entityIds.indexOf(request.targetItemId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return null;
  const entityIds = [...reference.entityIds];
  const [moved] = entityIds.splice(sourceIndex, 1);
  const adjustedTarget = entityIds.indexOf(request.targetItemId);
  entityIds.splice(request.placement === 'before' ? adjustedTarget : adjustedTarget + 1, 0, moved);
  return { sectionId: section.id, entityType: reference.entityType, entityIds };
}
