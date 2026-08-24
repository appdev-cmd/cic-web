import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeView } from '../src/web/components/HomeView';
import { bindElement } from '../src/shared/visual-editing/bindElement';
import { ElementBindingRegistry } from '../src/shared/visual-editing/elementBindingRegistry';
import {
  createCollectionItemPath,
  createElementBinding,
} from '../src/shared/visual-editing/elementBindingTypes';

const noop = () => undefined;
const registry = new ElementBindingRegistry();
const fakeNode = () => ({}) as Element;

const collectionBinding = createElementBinding({
  sectionKey: 'home.stats',
  elementPath: 'items',
  semantic: 'collection',
  ownership: 'embedded',
  editable: false,
  collectionPath: 'items',
});
const collectionNode = fakeNode();
const collectionRef = bindElement(collectionBinding, registry).ref;
collectionRef(collectionNode);

const itemIds = ['stat-a', 'stat-b', 'stat-c', 'stat-d'];
const itemNodes = new Map<string, Element>();
const itemRefs = new Map<string, ReturnType<typeof bindElement<Element>>['ref']>();
const fieldRefs: Array<ReturnType<typeof bindElement<Element>>['ref']> = [];

for (const itemId of itemIds) {
  const itemPath = createCollectionItemPath('items', itemId);
  const itemBinding = createElementBinding({
    sectionKey: 'home.stats',
    elementPath: itemPath,
    semantic: 'embedded-item',
    ownership: 'embedded',
    editable: false,
    itemId,
    collectionPath: 'items',
  });
  const node = fakeNode();
  const ref = bindElement(itemBinding, registry).ref;
  ref(node);
  itemNodes.set(itemId, node);
  itemRefs.set(itemId, ref);

  const value = createElementBinding({
    sectionKey: 'home.stats',
    elementPath: `${itemPath}.value`,
    semantic: 'text',
    ownership: 'embedded',
    editable: true,
    itemId,
    collectionPath: 'items',
  });
  const suffix = createElementBinding({
    sectionKey: 'home.stats',
    elementPath: `${itemPath}.suffix`,
    semantic: 'text',
    ownership: 'embedded',
    editable: true,
    itemId,
    collectionPath: 'items',
  });
  const label = createElementBinding({
    sectionKey: 'home.stats',
    elementPath: `${itemPath}.label`,
    semantic: 'text',
    ownership: 'embedded',
    editable: true,
    itemId,
    collectionPath: 'items',
  });
  const valueRef = bindElement([value, suffix], registry).ref;
  const labelRef = bindElement(label, registry).ref;
  valueRef(fakeNode());
  labelRef(fakeNode());
  fieldRefs.push(valueRef, labelRef);
}

assert.equal(registry.getNode(collectionBinding.bindingId), collectionNode);
assert.equal(
  registry.listBindings().filter(({ binding }) => binding.semantic === 'embedded-item').length,
  4,
);
assert.equal(
  registry.listBindings().filter(({ binding }) => binding.semantic === 'text').length,
  12,
);

const reorderedIds = ['stat-d', 'stat-a', 'stat-c', 'stat-b'];
for (const itemId of reorderedIds) {
  const itemPath = createCollectionItemPath('items', itemId);
  const bindingId = createElementBinding({
    sectionKey: 'home.stats',
    elementPath: itemPath,
    semantic: 'embedded-item',
    ownership: 'embedded',
    editable: false,
    itemId,
    collectionPath: 'items',
  }).bindingId;
  assert.equal(registry.getNode(bindingId), itemNodes.get(itemId));
}

const sharedValueNode = fakeNode();
const sharedItemPath = createCollectionItemPath('items', 'stat-a');
const valueBinding = createElementBinding({
  sectionKey: 'home.stats',
  elementPath: `${sharedItemPath}.value`,
  semantic: 'text',
  ownership: 'embedded',
  editable: true,
  itemId: 'stat-a',
  collectionPath: 'items',
});
const suffixBinding = createElementBinding({
  sectionKey: 'home.stats',
  elementPath: `${sharedItemPath}.suffix`,
  semantic: 'text',
  ownership: 'embedded',
  editable: true,
  itemId: 'stat-a',
  collectionPath: 'items',
});
const sharedValueRef = bindElement([valueBinding, suffixBinding], registry).ref;
sharedValueRef(sharedValueNode);
assert.deepEqual(
  registry.getBindings(sharedValueNode).map((binding) => binding.bindingId),
  [valueBinding.bindingId, suffixBinding.bindingId],
);
assert.equal(registry.getNode(valueBinding.bindingId), sharedValueNode);
assert.equal(registry.getNode(suffixBinding.bindingId), sharedValueNode);

const content = {
  stats: {
    items: itemIds.map((id, index) => ({
      id,
      value: index === 0 ? 999 : index,
      suffix: index === 0 ? '+' : '',
      label: `Statistic ${index + 1}`,
    })),
  },
  projects: { items: [] },
};
const markup = renderToStaticMarkup(
  <HomeView
    content={content}
    renderPolicy={{ motionEnabled: false }}
    setCurrentView={noop}
    setActiveLink={noop}
    setActiveServiceId={noop}
    setActiveProjectId={noop}
    setPreSelectedNewsCategory={noop}
    setAboutSubTab={noop}
    setActiveEventId={noop}
    setIsRegisteringEvent={noop}
    editMode
  />,
);

assert.match(markup, /data-ve-section="home\.stats" data-ve-element="items"/);
for (const itemId of itemIds) {
  assert.match(markup, new RegExp(`data-ve-element="items\\.${itemId}"`));
  assert.match(markup, new RegExp(`items\\.${itemId}\\.value items\\.${itemId}\\.suffix`));
  assert.match(markup, new RegExp(`data-ve-element="items\\.${itemId}\\.label"`));
}
assert.match(markup, />999\+</);

sharedValueRef(null);
assert.equal(registry.getNode(valueBinding.bindingId), undefined);
assert.equal(registry.getNode(suffixBinding.bindingId), undefined);
assert.equal(registry.getBindings(sharedValueNode).length, 0);

for (const ref of itemRefs.values()) ref(null);
for (const ref of fieldRefs) ref(null);
collectionRef(null);
assert.equal(registry.listBindings().length, 0);

console.log('element binding runtime verification passed');
