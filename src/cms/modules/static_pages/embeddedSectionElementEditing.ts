import type { EditableElementBinding } from '../../../shared/visual-editing/elementBindingTypes';
import { createInlineTextEditDescriptor } from '../../../shared/visual-editing/inlineTextEditing';
import type { PageBuilderConfigValue, PageBuilderSection } from './pageBuilderTypes';
import { getEditableFieldContract } from './pageBuilderEditableContracts';
import type { PageBuilderVisualElementEditingAdapter } from './visualElementEditingAdapterTypes';

interface EmbeddedTextAdapterConfig {
  sectionKey: string;
  collections: Readonly<Record<string, { idField: string; transientPrefix: string }>>;
}

function recordArray(value: PageBuilderConfigValue | undefined): Array<Record<string, PageBuilderConfigValue>> {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, PageBuilderConfigValue> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    : [];
}

function createEmbeddedTextAdapter(config: EmbeddedTextAdapterConfig): PageBuilderVisualElementEditingAdapter {
  return {
    sectionKey: config.sectionKey,
    resolveInlineTextEdit(sections, binding) {
      if (binding.sectionKey !== config.sectionKey || binding.semantic !== 'text' || !binding.editable) return null;
      const section = sections.find((candidate) => candidate.sectionKey === config.sectionKey);
      if (!section) return null;
      const segments = binding.elementPath.split('.');
      let path: Array<string | number>;
      let rawValue: PageBuilderConfigValue | undefined;
      let contractPath: string;
      if (binding.itemId && binding.collectionPath) {
        const collection = config.collections[binding.collectionPath];
        if (!collection || binding.itemId.startsWith(collection.transientPrefix)) return null;
        const items = recordArray(section.config[binding.collectionPath]);
        const itemIndex = items.findIndex((item) => item[collection.idField] === binding.itemId);
        const field = segments.at(-1);
        if (itemIndex < 0 || !field) return null;
        rawValue = items[itemIndex][field];
        path = [binding.collectionPath, itemIndex, field];
        contractPath = `${binding.collectionPath}.*.${field}`;
      } else {
        const field = segments.at(-1);
        if (!field) return null;
        rawValue = section.config[field];
        path = [field];
        contractPath = field;
      }
      if (typeof rawValue !== 'string') return null;
      const fieldContract = getEditableFieldContract(config.sectionKey, contractPath);
      if (!fieldContract) return null;
      const descriptor = createInlineTextEditDescriptor(binding, fieldContract, rawValue);
      return descriptor ? {
        sectionId: section.id,
        path,
        descriptor,
        accepts: (request) => request.binding.bindingId === binding.bindingId && typeof request.after === 'string',
      } : null;
    },
  };
}

export const aboutTimelineElementEditingAdapter = createEmbeddedTextAdapter({
  sectionKey: 'about.timeline',
  collections: { milestones: { idField: 'id', transientPrefix: 'unpersisted-about-timeline-' } },
});

export const aboutStrategyElementEditingAdapter = createEmbeddedTextAdapter({
  sectionKey: 'about.strategy',
  collections: { coreValues: { idField: 'id', transientPrefix: 'unpersisted-about-core-value-' } },
});

export const contactBranchesElementEditingAdapter = createEmbeddedTextAdapter({
  sectionKey: 'contact.branches',
  collections: { branches: { idField: 'key', transientPrefix: 'unpersisted-contact-branch-' } },
});
