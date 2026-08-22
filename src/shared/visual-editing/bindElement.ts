import type { RefCallback } from 'react';
import { elementBindingRegistry, type ElementBindingRegistry } from './elementBindingRegistry';
import type { EditableElementBinding } from './elementBindingTypes';

export interface BoundElementProps<T extends Element> {
  ref: RefCallback<T>;
  'data-ve-section': string;
  'data-ve-element': string;
  'data-ve-editable'?: 'true';
  'data-ve-semantic': string;
}

export function bindElement<T extends Element>(
  binding: EditableElementBinding | readonly EditableElementBinding[],
  registry: ElementBindingRegistry = elementBindingRegistry,
): BoundElementProps<T> {
  const bindings = Array.isArray(binding) ? binding : [binding];
  if (bindings.length === 0) {
    throw new Error('bindElement requires at least one binding.');
  }

  const sectionKey = bindings[0].sectionKey;
  if (bindings.some((item) => item.sectionKey !== sectionKey)) {
    throw new Error('All bindings attached to one DOM node must belong to the same section.');
  }

  let currentNode: T | null = null;
  const ref: RefCallback<T> = (node) => {
    if (currentNode && currentNode !== node) {
      for (const item of bindings) {
        registry.unregisterElement(currentNode, item.bindingId);
      }
    }

    currentNode = node;
    if (!node) return;

    for (const item of bindings) {
      registry.registerElement(node, item);
    }
  };

  return {
    ref,
    'data-ve-section': sectionKey,
    'data-ve-element': bindings.map((item) => item.elementPath).join(' '),
    'data-ve-editable': bindings.some((item) => item.editable) ? 'true' : undefined,
    'data-ve-semantic': [...new Set(bindings.map((item) => item.semantic))].join(' '),
  };
}
