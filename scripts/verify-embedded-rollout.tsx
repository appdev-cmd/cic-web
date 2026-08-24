import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getLegacyAboutPageContent, getLegacyContactPageContent } from '../src/shared/page-content/legacyPageContent';
import { resolvePageContent } from '../src/shared/page-content/resolvePageContent';
import { createElementBinding } from '../src/shared/visual-editing/elementBindingTypes';
import { resolveVisualElementEdit } from '../src/cms/modules/static_pages/visualElementEditingAdapters';
import type { PageBuilderSection } from '../src/cms/modules/static_pages/pageBuilderTypes';
import { AboutView } from '../src/web/components/AboutView';
import { ContactView } from '../src/web/components/ContactView';

const timeline: PageBuilderSection = { id: 'timeline', sectionKey: 'about.timeline', sectionType: 'timeline', position: 1, config: { title: 'Draft timeline', milestones: [{ id: 'milestone_b', year: '2026', title: 'Hidden', description: 'Draft milestone' }, { id: 'milestone_a', year: '1990', title: 'Hidden', description: 'Foundation' }] } };
const strategy: PageBuilderSection = { id: 'strategy', sectionKey: 'about.strategy', sectionType: 'strategy', position: 2, config: { title: 'Draft strategy', subtitle: 'Draft subtitle', vision: 'Draft vision', mission: 'Draft mission', coreValues: [{ id: 'value_b', value: 'Value B' }, { id: 'value_a', value: 'Value A' }] } };
const about = resolvePageContent({ pageType: 'about', version: { sections: [timeline, strategy] }, legacyFallback: getLegacyAboutPageContent() });
assert.equal(about.source, 'page-builder');
assert.equal(about.content.timeline.milestones[0].id, 'milestone_b');
assert.equal(about.content.strategy.coreValues[1].value, 'Value A');
const milestoneBinding = createElementBinding({ sectionKey: 'about.timeline', elementPath: 'milestones.milestone_b.description', semantic: 'text', ownership: 'embedded', editable: true, itemId: 'milestone_b', collectionPath: 'milestones' });
const coreBinding = createElementBinding({ sectionKey: 'about.strategy', elementPath: 'coreValues.value_a.value', semantic: 'text', ownership: 'embedded', editable: true, itemId: 'value_a', collectionPath: 'coreValues' });
assert.deepEqual(resolveVisualElementEdit([timeline, strategy], milestoneBinding)?.path, ['milestones', 0, 'description']);
assert.deepEqual(resolveVisualElementEdit([timeline, strategy], coreBinding)?.path, ['coreValues', 1, 'value']);
const aboutMarkup = renderToStaticMarkup(<AboutView activeTab="overview" setActiveTab={() => undefined} aboutContent={about.content} renderPolicy={{ motionEnabled: false }} />);
assert.match(aboutMarkup, /Draft milestone/);
assert.match(aboutMarkup, /data-ve-element="milestones\.milestone_b\.description"/);
assert.match(aboutMarkup, /data-ve-element="coreValues\.value_a\.value"/);
assert.doesNotMatch(aboutMarkup, /animate-ping/);

const branches: PageBuilderSection = { id: 'branches', sectionKey: 'contact.branches', sectionType: 'branches', position: 1, config: { title: 'Draft branches', branches: [{ key: 'hn', name: 'Draft Hanoi', address: 'Draft address', phone: '0', email: 'draft@example.com', workingHours: 'Always', mapUrl: 'about:blank' }] } };
const contact = resolvePageContent({ pageType: 'contact', version: { sections: [branches] }, legacyFallback: getLegacyContactPageContent() });
assert.equal(contact.content.branches.branches[0].phone, '0');
const phoneBinding = createElementBinding({ sectionKey: 'contact.branches', elementPath: 'branches.hn.phone', semantic: 'text', ownership: 'embedded', editable: true, itemId: 'hn', collectionPath: 'branches' });
assert.deepEqual(resolveVisualElementEdit([branches], phoneBinding)?.path, ['branches', 0, 'phone']);
const contactMarkup = renderToStaticMarkup(<ContactView content={contact.content} renderPolicy={{ motionEnabled: false }} />);
assert.match(contactMarkup, /Draft Hanoi/);
assert.match(contactMarkup, /data-ve-element="branches\.hn\.phone"/);
assert.doesNotMatch(contactMarkup, /TimelineEditor|AwardEditor|GalleryEditor|ExperienceEditor|BranchEditor/);

console.log('embedded rollout verification passed');
