import type { EditableElementBinding } from './elementBindingTypes';
import type { ElementBindingRegistry } from './elementBindingRegistry';

export interface ResolvedVisualEditingTarget {
  bindingId: string;
  bindings: readonly EditableElementBinding[];
  node: Element;
  sharedNode: boolean;
}

export interface ResolveVisualEditingTargetOptions {
  sectionKey?: string;
  includeStructural?: boolean;
}

export function resolveVisualEditingTarget(
  startNode: EventTarget | null,
  root: Element,
  registry: ElementBindingRegistry,
  options: ResolveVisualEditingTargetOptions = {},
): ResolvedVisualEditingTarget | null {
  const ElementConstructor = root.ownerDocument.defaultView?.Element;
  if (!ElementConstructor || !(startNode instanceof ElementConstructor) || !root.contains(startNode)) return null;

  let node: Element | null = startNode;
  while (node) {
    const bindings = registry.getBindings(node)
      .filter((binding) => !options.sectionKey || binding.sectionKey === options.sectionKey);
    const editableBindings = bindings.filter((binding) => binding.editable);
    const candidates = editableBindings.length > 0
      ? editableBindings
      : options.includeStructural
        ? bindings
        : [];

    if (candidates.length > 0) {
      return {
        bindingId: candidates[0].bindingId,
        bindings: candidates,
        node,
        sharedNode: candidates.length > 1,
      };
    }
    if (node === root) break;
    node = node.parentElement;
  }

  return null;
}
