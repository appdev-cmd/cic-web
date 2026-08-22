import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getLegacyAboutCapacityContent } from '../src/shared/page-content/legacyPageContent';
import { resolvePageContent } from '../src/shared/page-content/resolvePageContent';
import { createElementBinding } from '../src/shared/visual-editing/elementBindingTypes';
import { valueForCommit } from '../src/shared/visual-editing/inlineTextEditing';
import { resolveVisualElementEdit } from '../src/cms/modules/static_pages/visualElementEditingAdapters';
import type { PageBuilderSection } from '../src/cms/modules/static_pages/pageBuilderTypes';
import { AboutView } from '../src/web/components/AboutView';

const section: PageBuilderSection = {
  id: 'about_capacity', sectionKey: 'about.capacity', sectionType: 'company_capacity', position: 9,
  config: {
    title: 'Plain CMS title remains blocked', description: 'Draft capacity description',
    metrics: [
      { id: 'metric_a', value: '150+', label: 'People' },
      { id: 'metric_b', value: '5.000+', label: 'Projects' },
    ],
  },
};
const fallback = { capacity: getLegacyAboutCapacityContent() };
const resolved = resolvePageContent({ pageType: 'capacity_experience', version: { sections: [section] }, legacyFallback: fallback });
assert.equal(resolved.source, 'page-builder');
assert.equal(resolved.content.capacity.description, 'Draft capacity description');
assert.equal(resolved.content.capacity.metrics[1].value, '5.000+');
assert.equal(typeof resolved.content.capacity.metrics[1].value, 'string');

const labelBinding = createElementBinding({ sectionKey: 'about.capacity', elementPath: 'metrics.metric_b.label', semantic: 'text', ownership: 'embedded', editable: true, itemId: 'metric_b', collectionPath: 'metrics' });
const valueBinding = createElementBinding({ sectionKey: 'about.capacity', elementPath: 'metrics.metric_b.value', semantic: 'text', ownership: 'embedded', editable: true, itemId: 'metric_b', collectionPath: 'metrics' });
const descriptionBinding = createElementBinding({ sectionKey: 'about.capacity', elementPath: 'description', semantic: 'text', ownership: 'embedded', editable: true });
const labelTarget = resolveVisualElementEdit([section], labelBinding);
const valueTarget = resolveVisualElementEdit([section], valueBinding);
const descriptionTarget = resolveVisualElementEdit([section], descriptionBinding);
assert.deepEqual(labelTarget?.path, ['metrics', 1, 'label']);
assert.deepEqual(valueTarget?.path, ['metrics', 1, 'value']);
assert.deepEqual(descriptionTarget?.path, ['description']);
assert.equal(valueTarget?.descriptor.valueKind, 'string');
assert.equal(valueForCommit(valueTarget!.descriptor, '35+'), '35+');

const reorderedSection: PageBuilderSection = { ...section, config: { ...section.config, metrics: [...(section.config.metrics as object[])].reverse() as never } };
const reordered = resolvePageContent({ pageType: 'capacity_experience', version: { sections: [reorderedSection] }, legacyFallback: fallback });
assert.equal(reordered.content.capacity.metrics[0].id, 'metric_b');
assert.equal(resolveVisualElementEdit([reorderedSection], labelBinding)?.path[1], 0);
assert.equal(labelBinding.bindingId, 'about.capacity/metrics/metric_b/label');

assert.equal(resolveVisualElementEdit([section], { ...labelBinding, itemId: 'unpersisted-about-capacity-metric-1' }), null);
const titleBinding = createElementBinding({ sectionKey: 'about.capacity', elementPath: 'title', semantic: 'rich-text', ownership: 'static-unwired', editable: false });
assert.equal(resolveVisualElementEdit([section], titleBinding), null);

const markup = renderToStaticMarkup(<AboutView activeTab="experience" setActiveTab={() => undefined} capacityContent={resolved.content.capacity} renderPolicy={{ motionEnabled: false }} />);
assert.match(markup, /Draft capacity description/);
assert.match(markup, /data-ve-element="metrics\.metric_b\.value"/);
assert.match(markup, /data-ve-element="metrics\.metric_b\.label"/);
assert.doesNotMatch(markup, /data-ve-element="title"/);
assert.doesNotMatch(markup, /CapacityEditor|CapacityMetricEditor|data-ve-sortable-handle/);

console.log('about.capacity genericity verification passed');
