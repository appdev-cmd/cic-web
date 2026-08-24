import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { aboutCapacityElementEditingAdapter } from './aboutCapacityElementEditing';
import { homeStatsElementEditingAdapter } from './homeStatsElementEditing';
import { aboutStrategyElementEditingAdapter, aboutTimelineElementEditingAdapter, contactBranchesElementEditingAdapter } from './embeddedSectionElementEditing';
import type { PageBuilderSection } from './pageBuilderTypes';
import type { PageBuilderResolvedElementEdit, PageBuilderVisualElementEditingAdapter } from './visualElementEditingAdapterTypes';
import { directReferenceSectionKeys } from './referenceSectionInteractions';

const adapters: readonly PageBuilderVisualElementEditingAdapter[] = [
  homeStatsElementEditingAdapter,
  aboutCapacityElementEditingAdapter,
  aboutTimelineElementEditingAdapter,
  aboutStrategyElementEditingAdapter,
  contactBranchesElementEditingAdapter,
];
const adapterBySectionKey = new Map(adapters.map((adapter) => [adapter.sectionKey, adapter]));

export const directEditingSectionKeys = new Set([
  ...adapterBySectionKey.keys(),
  ...directReferenceSectionKeys,
]);

export function resolveVisualElementEdit(
  sections: readonly PageBuilderSection[],
  binding: EditableElementBinding,
): PageBuilderResolvedElementEdit | null {
  return adapterBySectionKey.get(binding.sectionKey)?.resolveInlineTextEdit(sections, binding) ?? null;
}
