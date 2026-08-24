import type { EditableElementOwnership, EditableElementSemantic } from './elementBindingTypes';

export type CapabilityState = 'enabled' | 'disabled' | 'blocked';
export type EditableValueKind = 'string' | 'number';
export type CollectionIdentityKind = 'persistent-item-id' | 'entity-id' | 'slot-key';

export interface EditableMediaContract {
  path: string;
  semantic: 'image' | 'background-image' | 'video';
  ownership: EditableElementOwnership;
  replace: CapabilityState;
  optional?: boolean;
  blockedReason?: EditableFieldContract['blockedReason'];
}

export interface EditableActionContract {
  path: string;
  semantic: 'cta' | 'link';
  ownership: EditableElementOwnership;
  editing: CapabilityState;
  replace: CapabilityState;
  optional?: boolean;
  blockedReason?: EditableFieldContract['blockedReason'];
}

export interface EditableReferenceContract {
  path: string;
  entityType: string;
  identity: 'entity-id' | 'slot-key';
  capabilities: {
    replace: CapabilityState;
    reorder: CapabilityState;
    add: CapabilityState;
    remove: CapabilityState;
  };
  allowDuplicates?: boolean;
  minItems?: number;
  maxItems?: number;
  layoutBehavior?: { wrap?: boolean };
}

export interface EditableFieldContract {
  /** Semantic path. `*` denotes an item selected by stable identity, never array index. */
  path: string;
  semantic: EditableElementSemantic;
  ownership: EditableElementOwnership;
  valueKind?: EditableValueKind;
  editing: CapabilityState;
  optional?: boolean;
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
  references?: Readonly<Record<string, EditableReferenceContract>>;
  media?: Readonly<Record<string, EditableMediaContract>>;
  actions?: Readonly<Record<string, EditableActionContract>>;
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
