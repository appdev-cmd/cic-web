import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getLegacyHomePageContent } from '../src/shared/page-content/legacyPageContent';
import { resolvePageContent } from '../src/shared/page-content/resolvePageContent';
import { createCollectionItemPath, createElementBinding } from '../src/shared/visual-editing/elementBindingTypes';
import { referenceDescriptorFromBinding } from '../src/shared/visual-editing/referenceItemInteraction';
import { HomeView } from '../src/web/components/HomeView';
import { reorderReferenceItems } from '../src/cms/modules/static_pages/referenceSectionInteractions';

const projectIds = ['project_dien_gio_mui_dinh', 'project_landmark_81', 'project_cao_toc_bac_nam'];
const section = { id: 'home-projects', sectionKey: 'home.projects', sectionType: 'reference', position: 0, config: {}, references: [{ entityType: 'project' as const, entityIds: projectIds }] };
const version = { sections: [
  { sectionKey: 'home.stats', config: { items: [] } },
  section,
] };
const resolved = resolvePageContent({ pageType: 'home', version, legacyFallback: getLegacyHomePageContent() });
assert.deepEqual(resolved.content.projects.items.map((item) => item.entityId), projectIds);
assert.equal(resolved.diagnostics.length, 0);

const missing = resolvePageContent({ pageType: 'home', version: { sections: [{ ...section, references: [{ entityType: 'project', entityIds: ['missing-project'] }] }] }, legacyFallback: getLegacyHomePageContent() });
assert.equal(missing.content.projects.items.length, 0);
assert.equal(missing.diagnostics[0]?.code, 'UNRESOLVED_REFERENCE_ENTITY');

const binding = createElementBinding({ sectionKey: 'home.projects', elementPath: createCollectionItemPath('items', projectIds[0]), semantic: 'reference-item', ownership: 'reference', editable: false, itemId: projectIds[0], collectionPath: 'items' });
assert.equal(referenceDescriptorFromBinding(binding, 'project', true)?.entityId, projectIds[0]);

const reordered = reorderReferenceItems([section], { sectionKey: 'home.projects', collectionPath: 'items', itemId: projectIds[2], targetItemId: projectIds[0], placement: 'before' });
assert.deepEqual(reordered?.entityIds, [projectIds[2], projectIds[0], projectIds[1]]);

const noop = () => undefined;
const markup = renderToStaticMarkup(<HomeView content={resolved.content} renderPolicy={{ motionEnabled: false }} editMode setCurrentView={noop} setActiveLink={noop} setActiveServiceId={noop} setActiveProjectId={noop} setPreSelectedNewsCategory={noop} setAboutSubTab={noop} />);
for (const id of projectIds) assert.match(markup, new RegExp(`data-ve-element="items\\.${id}"`));
assert.doesNotMatch(markup, /data-ve-editable="true"[^>]*home\.projects/);
assert.ok(markup.indexOf('Điện Gió Mũi Dinh') < markup.indexOf('Landmark 81'));

console.log('reference rollout verification passed');
