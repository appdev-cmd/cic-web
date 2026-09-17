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

function configValueAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>): PageBuilderConfigValue | undefined {
  return path.reduce<PageBuilderConfigValue | undefined>((val, part) => {
    if (!val || typeof val !== 'object') return undefined;
    return (val as Record<string | number, PageBuilderConfigValue>)[part];
  }, config);
}

export function createEmbeddedTextAdapter(config: EmbeddedTextAdapterConfig): PageBuilderVisualElementEditingAdapter {
  return {
    sectionKey: config.sectionKey,
    resolveInlineTextEdit(sections, binding) {
      if (binding.sectionKey !== config.sectionKey || (binding.semantic !== 'text' && binding.semantic !== 'rich-text') || !binding.editable) return null;
      const section = sections.find((candidate) => candidate.sectionKey === config.sectionKey);
      if (!section) return null;
      const segments = binding.elementPath.split('.');
      let path: Array<string | number>;
      let rawValue: PageBuilderConfigValue | undefined;
      let contractPath: string;
      if (binding.itemId && binding.collectionPath) {
        const collection = config.collections[binding.collectionPath];
        if (collection && binding.itemId.startsWith(collection.transientPrefix)) return null;
        const items = recordArray(section.config[binding.collectionPath]);
        let itemIndex = collection
          ? items.findIndex((item) => item[collection.idField] === binding.itemId)
          : items.findIndex((item) => item.id === binding.itemId || item.entityId === binding.itemId || item.key === binding.itemId);
        if (itemIndex < 0) {
          const possibleIdx = Number(segments[1]);
          if (Number.isInteger(possibleIdx) && possibleIdx >= 0 && possibleIdx < items.length) {
            itemIndex = possibleIdx;
          } else {
            const numMatch = binding.itemId.match(/\d+$/);
            if (numMatch) {
              const idx = Number(numMatch[0]) - 1;
              if (idx >= 0 && idx < items.length) itemIndex = idx;
            }
          }
        }
        const field = segments.at(-1);
        if (itemIndex < 0 || !field) return null;
        rawValue = items[itemIndex][field];
        path = [binding.collectionPath, itemIndex, field];
        contractPath = `${binding.collectionPath}.*.${field}`;
      } else {
        path = segments.map((seg) => /^\d+$/.test(seg) ? Number(seg) : seg);
        contractPath = segments.map((seg) => /^\d+$/.test(seg) ? '*' : seg).join('.');
        rawValue = configValueAtPath(section.config, path);
      }
      const fieldContract = getEditableFieldContract(config.sectionKey, contractPath) ?? getEditableFieldContract(config.sectionKey, segments.at(-1)!);
      if (!fieldContract) return null;
      let editValue = (rawValue !== undefined && rawValue !== null)
        ? (fieldContract.valueKind === 'number' && typeof rawValue === 'string' ? Number(rawValue) || 0 : rawValue)
        : (fieldContract.valueKind === 'number' ? 0 : '');
      if (fieldContract.valueKind === 'number' && typeof editValue !== 'number') return null;
      if (fieldContract.valueKind === 'string' && typeof editValue !== 'string') {
        editValue = String(editValue);
      }
      const descriptor = createInlineTextEditDescriptor(binding, fieldContract, editValue as string | number);
      return descriptor ? {
        sectionId: section.id,
        path,
        descriptor,
        accepts: (request) => {
          if (request.binding.bindingId !== binding.bindingId) return false;
          return fieldContract.valueKind === 'number'
            ? typeof request.after === 'number' && Number.isFinite(request.after)
            : typeof request.after === 'string';
        },
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
