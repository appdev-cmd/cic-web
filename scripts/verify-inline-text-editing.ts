import assert from 'node:assert/strict';
import { createElementBinding } from '../src/shared/visual-editing/elementBindingTypes';
import { parseFiniteNumber, valueForCommit } from '../src/shared/visual-editing/inlineTextEditing';
import { resolvePageContent } from '../src/shared/page-content/resolvePageContent';
import { getLegacyHomePageContent } from '../src/shared/page-content/legacyPageContent';
import { isMatchingHomeStatsCommit, resolveHomeStatsEditTarget } from '../src/cms/modules/static_pages/homeStatsElementEditing';
import type { PageBuilderSection } from '../src/cms/modules/static_pages/pageBuilderTypes';

const section: PageBuilderSection = {
  id: 'home_stats', sectionKey: 'home.stats', sectionType: 'statistics', position: 3,
  config: { items: [{ id: 'stat_a', value: 35, suffix: '+', label: 'Năm kinh nghiệm' }] },
};
const labelBinding = createElementBinding({ sectionKey: 'home.stats', elementPath: 'items.stat_a.label', semantic: 'text', ownership: 'embedded', editable: true, itemId: 'stat_a', collectionPath: 'items' });
const valueBinding = createElementBinding({ sectionKey: 'home.stats', elementPath: 'items.stat_a.value', semantic: 'text', ownership: 'embedded', editable: true, itemId: 'stat_a', collectionPath: 'items' });

const labelTarget = resolveHomeStatsEditTarget([section], labelBinding);
assert.ok(labelTarget);
assert.deepEqual(labelTarget.path, ['items', 0, 'label']);
assert.equal(isMatchingHomeStatsCommit(labelTarget, { binding: labelBinding, before: 'Năm kinh nghiệm', after: 'Kinh nghiệm' }), true);

const valueTarget = resolveHomeStatsEditTarget([section], valueBinding);
assert.ok(valueTarget);
assert.equal(valueTarget.descriptor.fixedSuffix, '+');
assert.equal(valueForCommit(valueTarget.descriptor, '0'), 0);
assert.equal(parseFiniteNumber('not-a-number'), null);
assert.equal(parseFiniteNumber('-12.5'), -12.5);
assert.equal(resolveHomeStatsEditTarget([section], { ...valueBinding, itemId: 'missing' }), null);

const updatedSection: PageBuilderSection = {
  ...section,
  config: { items: [{ id: 'stat_a', value: 999, suffix: '+', label: 'Kinh nghiệm mới' }] },
};
const resolved = resolvePageContent({ pageType: 'home', version: { sections: [updatedSection] }, legacyFallback: getLegacyHomePageContent() });
assert.equal(resolved.content.stats.items[0].value, 999);
assert.equal(resolved.content.stats.items[0].label, 'Kinh nghiệm mới');
assert.equal(resolved.content.stats.items[0].id, 'stat_a');

console.log('Inline text editing contract verified.');
