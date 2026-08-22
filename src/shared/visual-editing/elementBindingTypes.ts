export type EditableElementSemantic =
  | 'text'
  | 'rich-text'
  | 'image'
  | 'background-image'
  | 'video'
  | 'icon'
  | 'cta'
  | 'link'
  | 'embedded-item'
  | 'reference-item'
  | 'collection'
  | 'optional-slot'
  | 'decorative';

export type EditableElementOwnership =
  | 'embedded'
  | 'reference'
  | 'section-config'
  | 'derived'
  | 'static-unwired'
  | 'decorative';

export interface EditableElementBinding {
  bindingId: string;
  sectionKey: string;
  elementPath: string;
  semantic: EditableElementSemantic;
  ownership: EditableElementOwnership;
  editable: boolean;
  itemId?: string;
  collectionPath?: string;
}

export type EditableElementBindingInput = Omit<EditableElementBinding, 'bindingId'>;

function encodeBindingSegment(segment: string): string {
  return encodeURIComponent(segment).replaceAll('.', '%2E');
}

export function createBindingId(sectionKey: string, elementPath: string): string {
  const path = elementPath.split('.').map(encodeBindingSegment).join('/');
  return `${sectionKey}/${path}`;
}

export function createElementBinding(input: EditableElementBindingInput): EditableElementBinding {
  return {
    ...input,
    bindingId: createBindingId(input.sectionKey, input.elementPath),
  };
}

export function createCollectionItemPath(
  collectionPath: string,
  itemId: string,
  field?: string,
): string {
  const encodedItemId = encodeBindingSegment(itemId);
  return field
    ? `${collectionPath}.${encodedItemId}.${field}`
    : `${collectionPath}.${encodedItemId}`;
}
