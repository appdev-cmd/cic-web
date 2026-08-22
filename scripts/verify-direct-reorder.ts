import assert from 'node:assert/strict';
import { createElementBinding } from '../src/shared/visual-editing/elementBindingTypes';
import { hitTestSortableCollection, isPersistentSortableId, sortableDescriptorFromBinding } from '../src/shared/visual-editing/sortableBoundCollection';
import { reorderHomeStatsItems } from '../src/cms/modules/static_pages/homeStatsElementEditing';
import { resolvePageContent } from '../src/shared/page-content/resolvePageContent';
import { getLegacyHomePageContent } from '../src/shared/page-content/legacyPageContent';
import type { PageBuilderConfigValue, PageBuilderSection } from '../src/cms/modules/static_pages/pageBuilderTypes';

const ids = ['A', 'B', 'C', 'D'];
const section: PageBuilderSection = {
  id: 'home_stats', sectionKey: 'home.stats', sectionType: 'statistics', position: 3,
  config: { items: ids.map((id, index) => ({ id, value: index + 1, suffix: '+', label: id })) },
};
const bindingFor = (id: string) => createElementBinding({ sectionKey: 'home.stats', elementPath: `items.${id}`, semantic: 'embedded-item', ownership: 'embedded', editable: false, itemId: id, collectionPath: 'items' });

const result = reorderHomeStatsItems([section], { sectionKey: 'home.stats', collectionPath: 'items', itemId: 'C', targetItemId: 'A', placement: 'before' });
assert.ok(result);
assert.deepEqual(result.items.map((item) => (item as Record<string, PageBuilderConfigValue>).id), ['C', 'A', 'B', 'D']);
assert.deepEqual({ beforeIndex: result.mutation.beforeIndex, afterIndex: result.mutation.afterIndex }, { beforeIndex: 2, afterIndex: 0 });

const resolved = resolvePageContent({ pageType: 'home', version: { sections: [{ ...section, config: { items: result.items } }] }, legacyFallback: getLegacyHomePageContent() });
assert.deepEqual(resolved.content.stats.items.map((item) => item.id), ['C', 'A', 'B', 'D']);
assert.equal(sortableDescriptorFromBinding(bindingFor('C'))?.binding.bindingId, 'home.stats/items/C');

assert.equal(isPersistentSortableId('unpersisted-home-stat-1'), false);
assert.equal(isPersistentSortableId('legacy-stat-1'), false);
assert.equal(reorderHomeStatsItems([{ ...section, config: { items: [{ value: 1, label: 'No ID' }] } }], { sectionKey: 'home.stats', collectionPath: 'items', itemId: 'unpersisted-home-stat-1', targetItemId: 'A', placement: 'before' }), null);

function fakeNode(left: number, top: number, width = 100, height = 80): Element {
  return { getBoundingClientRect: () => ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) } as unknown as Element;
}
const descriptors = ids.map((id) => sortableDescriptorFromBinding(bindingFor(id))!);
const desktop = descriptors.map((descriptor, index) => ({ descriptor, node: fakeNode(index * 100, 0) }));
assert.equal(hitTestSortableCollection(desktop, 15, 40)?.descriptor.itemId, 'A');
assert.equal(hitTestSortableCollection(desktop, 15, 40)?.placement, 'before');
const mobile = descriptors.map((descriptor, index) => ({ descriptor, node: fakeNode((index % 2) * 100, Math.floor(index / 2) * 80) }));
assert.equal(hitTestSortableCollection(mobile, 115, 120)?.descriptor.itemId, 'D');

console.log('Direct reorder contract verified.');
