import type { EditableCollectionContract, EditableFieldContract, EditableSectionContract } from '../../../shared/visual-editing/editableSectionContract';
import { fieldContractAtPath } from '../../../shared/visual-editing/editableSectionContract';
import { sectionDefinitions } from './pageBuilderRegistry';

export function getEditableSectionContract(sectionKey: string): EditableSectionContract | undefined {
  return sectionDefinitions[sectionKey]?.editableContract;
}

export function getEditableFieldContract(sectionKey: string, path: string): EditableFieldContract | undefined {
  const contract = getEditableSectionContract(sectionKey);
  return contract ? fieldContractAtPath(contract, path) : undefined;
}

export function getEditableCollectionContract(sectionKey: string, collectionPath: string): EditableCollectionContract | undefined {
  return getEditableSectionContract(sectionKey)?.collections?.[collectionPath];
}
