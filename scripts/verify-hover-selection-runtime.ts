import assert from 'node:assert/strict';
import { ElementBindingRegistry } from '../src/shared/visual-editing/elementBindingRegistry';
import { VisualEditingInteractionController } from '../src/shared/visual-editing/interactionState';
import { createElementBinding } from '../src/shared/visual-editing/elementBindingTypes';
import { resolveVisualEditingTarget } from '../src/shared/visual-editing/targetResolver';

class FakeElement {
  parentElement: FakeElement | null = null;
  ownerDocument!: { defaultView: { Element: typeof FakeElement } };

  append(child: FakeElement): void {
    child.parentElement = this;
    child.ownerDocument = this.ownerDocument;
  }

  contains(candidate: FakeElement): boolean {
    let current: FakeElement | null = candidate;
    while (current) {
      if (current === this) return true;
      current = current.parentElement;
    }
    return false;
  }
}

const documentRealm = { defaultView: { Element: FakeElement } };
const createNode = () => {
  const node = new FakeElement();
  node.ownerDocument = documentRealm;
  return node;
};
const asElement = (node: FakeElement) => node as unknown as Element;

const registry = new ElementBindingRegistry();
const controller = new VisualEditingInteractionController(registry);
const root = createNode();
const item = createNode();
const label = createNode();
const labelText = createNode();
const counter = createNode();
root.append(item);
item.append(label);
label.append(labelText);
item.append(counter);

const itemBinding = createElementBinding({
  sectionKey: 'home.stats',
  elementPath: 'items.stat-04',
  semantic: 'embedded-item',
  ownership: 'embedded',
  editable: false,
  itemId: 'stat-04',
  collectionPath: 'items',
});
const labelBinding = createElementBinding({
  sectionKey: 'home.stats',
  elementPath: 'items.stat-04.label',
  semantic: 'text',
  ownership: 'embedded',
  editable: true,
  itemId: 'stat-04',
  collectionPath: 'items',
});
const valueBinding = createElementBinding({
  sectionKey: 'home.stats',
  elementPath: 'items.stat-04.value',
  semantic: 'text',
  ownership: 'embedded',
  editable: true,
  itemId: 'stat-04',
  collectionPath: 'items',
});
const suffixBinding = createElementBinding({
  sectionKey: 'home.stats',
  elementPath: 'items.stat-04.suffix',
  semantic: 'text',
  ownership: 'embedded',
  editable: true,
  itemId: 'stat-04',
  collectionPath: 'items',
});

registry.registerElement(asElement(item), itemBinding);
registry.registerElement(asElement(label), labelBinding);
registry.registerElement(asElement(counter), valueBinding);
registry.registerElement(asElement(counter), suffixBinding);

const labelTarget = resolveVisualEditingTarget(
  labelText as unknown as EventTarget,
  asElement(root),
  registry,
  { sectionKey: 'home.stats' },
);
assert.equal(labelTarget?.bindingId, labelBinding.bindingId);
assert.equal(labelTarget?.sharedNode, false);

controller.setHoveredTarget(labelTarget);
assert.equal(controller.getState().hoveredBindingId, labelBinding.bindingId);
assert.equal(controller.getHoveredBinding()?.elementPath, 'items.stat-04.label');

const counterTarget = resolveVisualEditingTarget(
  counter as unknown as EventTarget,
  asElement(root),
  registry,
  { sectionKey: 'home.stats' },
);
assert.equal(counterTarget?.bindingId, valueBinding.bindingId);
assert.equal(counterTarget?.sharedNode, true);
assert.deepEqual(counterTarget?.bindings.map((binding) => binding.bindingId), [
  valueBinding.bindingId,
  suffixBinding.bindingId,
]);

const structuralTarget = resolveVisualEditingTarget(
  item as unknown as EventTarget,
  asElement(root),
  registry,
  { sectionKey: 'home.stats' },
);
assert.equal(structuralTarget, null);

controller.selectTarget(counterTarget);
assert.equal(controller.getState().selectedBindingId, valueBinding.bindingId);
assert.equal(controller.getSelectedBinding()?.elementPath, 'items.stat-04.value');
controller.clearSelection();
assert.equal(controller.getState().selectedBindingId, null);

controller.selectTarget(labelTarget);
controller.selectTarget(resolveVisualEditingTarget(
  root as unknown as EventTarget,
  asElement(root),
  registry,
  { sectionKey: 'home.stats' },
));
assert.equal(controller.getState().selectedBindingId, null);

controller.selectBinding(labelBinding.bindingId);
const replacementLabel = createNode();
root.append(replacementLabel);
registry.registerElement(asElement(replacementLabel), labelBinding);
controller.reconcileRegistry();
assert.equal(controller.getState().selectedBindingId, labelBinding.bindingId);
assert.equal(registry.getNode(labelBinding.bindingId), asElement(replacementLabel));

registry.unregisterElement(asElement(replacementLabel), labelBinding.bindingId);
controller.reconcileRegistry();
assert.equal(controller.getState().selectedBindingId, null);

console.log('hover and selection runtime verification passed');
