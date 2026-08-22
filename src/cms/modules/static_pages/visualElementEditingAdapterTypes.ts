import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import type { CommitElementEditRequest, InlineTextEditDescriptor } from '../../../shared/visual-editing/inlineTextEditing';
import type { PageBuilderSection } from './pageBuilderTypes';

export interface PageBuilderResolvedElementEdit {
  sectionId: string;
  path: Array<string | number>;
  descriptor: InlineTextEditDescriptor;
  accepts(request: CommitElementEditRequest): boolean;
}

export interface PageBuilderVisualElementEditingAdapter {
  sectionKey: string;
  resolveInlineTextEdit(
    sections: readonly PageBuilderSection[],
    binding: EditableElementBinding,
  ): PageBuilderResolvedElementEdit | null;
}
