import assert from 'node:assert/strict';
import { sectionDefinitions } from '../src/cms/modules/static_pages/pageBuilderRegistry';
import { directEditingSectionKeys } from '../src/cms/modules/static_pages/visualElementEditingAdapters';

const reviewed = [
  'home.hero', 'home.intro', 'home.awards', 'home.ecosystem', 'home.events', 'home.news', 'home.partners', 'home.contact_cta',
  'about.hero', 'about.overview', 'about.offerings', 'about.awards', 'about.partners', 'about.organization', 'about.experience',
  'about.software_partners', 'about.hardware_partners', 'about.contact_cta',
  'contact.header', 'contact.form', 'contact.security',
  'legal.header', 'legal.content', 'privacy.collection', 'privacy.usage', 'privacy.retention', 'privacy.access', 'privacy.commitment', 'legal.assistance',
];

for (const sectionKey of reviewed) {
  assert.ok(sectionDefinitions[sectionKey]?.editableContract, `${sectionKey} must have a reviewed contract`);
  assert.equal(
    directEditingSectionKeys.has(sectionKey),
    false,
    `${sectionKey} must retain its existing editor until a direct-edit adapter is implemented`,
  );
}

for (const sectionKey of ['home.stats', 'home.projects', 'about.capacity', 'about.timeline', 'about.strategy', 'contact.branches']) {
  assert.ok(directEditingSectionKeys.has(sectionKey), `${sectionKey} must use its implemented direct-edit runtime`);
}

const complexContracts = reviewed.map((sectionKey) => sectionDefinitions[sectionKey].editableContract!);
for (const contract of complexContracts) {
  for (const media of Object.values(contract.media ?? {})) assert.notEqual(media.replace, 'enabled');
  for (const action of Object.values(contract.actions ?? {})) {
    assert.notEqual(action.editing, 'enabled');
    assert.notEqual(action.replace, 'enabled');
  }
}

assert.equal(sectionDefinitions['home.hero'].editableContract?.media?.background.semantic, 'background-image');
assert.equal(sectionDefinitions['home.intro'].editableContract?.media?.video.semantic, 'video');
assert.equal(sectionDefinitions['home.hero'].editableContract?.actions?.secondary.optional, true);
assert.equal(sectionDefinitions['legal.content'].editableContract?.fields[0]?.semantic, 'rich-text');

console.log('complex/media rollout contract verification passed');
