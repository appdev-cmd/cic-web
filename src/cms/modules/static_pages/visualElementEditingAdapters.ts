import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { aboutCapacityElementEditingAdapter } from './aboutCapacityElementEditing';
import { homeStatsElementEditingAdapter } from './homeStatsElementEditing';
import { aboutStrategyElementEditingAdapter, aboutTimelineElementEditingAdapter, contactBranchesElementEditingAdapter, createEmbeddedTextAdapter } from './embeddedSectionElementEditing';
import type { PageBuilderSection } from './pageBuilderTypes';
import type { PageBuilderResolvedElementEdit, PageBuilderVisualElementEditingAdapter } from './visualElementEditingAdapterTypes';
import { directReferenceSectionKeys } from './referenceSectionInteractions';

const adapters: readonly PageBuilderVisualElementEditingAdapter[] = [
  homeStatsElementEditingAdapter,
  aboutCapacityElementEditingAdapter,
  aboutTimelineElementEditingAdapter,
  aboutStrategyElementEditingAdapter,
  contactBranchesElementEditingAdapter,
  ...['about.hero', 'about.overview', 'about.offerings', 'about.awards', 'about.partners'].map((sectionKey) => createEmbeddedTextAdapter({ sectionKey, collections: {} })),
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
