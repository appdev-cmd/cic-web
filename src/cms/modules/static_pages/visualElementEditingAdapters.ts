import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { aboutCapacityElementEditingAdapter } from './aboutCapacityElementEditing';
import { homeStatsElementEditingAdapter } from './homeStatsElementEditing';
import { aboutStrategyElementEditingAdapter, aboutTimelineElementEditingAdapter, contactBranchesElementEditingAdapter, createEmbeddedTextAdapter } from './embeddedSectionElementEditing';
import type { PageBuilderSection } from './pageBuilderTypes';
import type { PageBuilderResolvedElementEdit, PageBuilderVisualElementEditingAdapter } from './visualElementEditingAdapterTypes';

const standardSectionKeys = [
  'home.hero',
  'home.intro',
  'home.awards',
  'home.ecosystem',
  'home.projects',
  'home.events',
  'home.news',
  'home.partners',
  'home.contact_cta',
  'about.hero',
  'about.overview',
  'about.offerings',
  'about.awards',
  'about.partners',
  'about.organization',
  'about.experience',
  'about.software_partners',
  'about.hardware_partners',
  'about.contact_cta',
  'contact.header',
  'contact.form',
  'contact.security',
  'legal.header',
  'legal.content',
  'privacy.collection',
  'privacy.usage',
  'privacy.retention',
  'privacy.access',
  'privacy.commitment',
  'legal.assistance',
];

const adapters: readonly PageBuilderVisualElementEditingAdapter[] = [
  homeStatsElementEditingAdapter,
  aboutCapacityElementEditingAdapter,
  aboutTimelineElementEditingAdapter,
  aboutStrategyElementEditingAdapter,
  contactBranchesElementEditingAdapter,
  ...standardSectionKeys.map((sectionKey) => createEmbeddedTextAdapter({ sectionKey, collections: {} })),
];
const adapterBySectionKey = new Map(adapters.map((adapter) => [adapter.sectionKey, adapter]));

// Unify inline editing: allow canvasDomInjector to run across all sections uniformly (matching Home page logic)
export const directEditingSectionKeys = new Set<string>();

export function resolveVisualElementEdit(
  sections: readonly PageBuilderSection[],
  binding: EditableElementBinding,
): PageBuilderResolvedElementEdit | null {
  const adapter = adapterBySectionKey.get(binding.sectionKey)
    ?? createEmbeddedTextAdapter({ sectionKey: binding.sectionKey, collections: {} });
  return adapter.resolveInlineTextEdit(sections, binding) ?? null;
}
