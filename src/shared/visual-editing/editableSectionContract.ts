import type { EditableElementOwnership, EditableElementSemantic } from './elementBindingTypes';

export type CapabilityState = 'enabled' | 'disabled' | 'blocked';
export type EditableValueKind = 'string' | 'number';
export type CollectionIdentityKind = 'persistent-item-id' | 'entity-id' | 'slot-key';

export interface EditableFieldContract {
  /** Semantic path. `*` denotes an item selected by stable identity, never array index. */
  path: string;
  semantic: EditableElementSemantic;
  ownership: EditableElementOwnership;
  valueKind?: EditableValueKind;
  editing: CapabilityState;
  blockedReason?: 'representation-mismatch' | 'data-unwired' | 'identity-unresolved' | 'contract-missing';
}

export interface EditableCollectionContract {
  path: string;
  identity: CollectionIdentityKind;
  capabilities: {
    reorder: CapabilityState;
    add: CapabilityState;
    remove: CapabilityState;
  };
  minItems?: number;
  maxItems?: number;
  layoutBehavior?: {
    wrap?: boolean;
  };
}

export interface EditableSectionContract {
  sectionKey: string;
  fields: readonly EditableFieldContract[];
  collections?: Readonly<Record<string, EditableCollectionContract>>;
}

export function isCapabilityEnabled(state: CapabilityState | undefined): boolean {
  return state === 'enabled';
}

export function isFieldEditable(field: EditableFieldContract | undefined): field is EditableFieldContract & { valueKind: EditableValueKind } {
  return field?.editing === 'enabled' && field.valueKind !== undefined;
}

export function fieldContractAtPath(contract: EditableSectionContract, path: string): EditableFieldContract | undefined {
  return contract.fields.find((field) => field.path === path);
}
