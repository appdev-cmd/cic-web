import type { EditableElementBinding } from './elementBindingTypes';

export interface RegisteredElementBinding {
  binding: EditableElementBinding;
  node: Element;
}

export class ElementBindingRegistry {
  private readonly bindingsByNode = new WeakMap<Element, Map<string, EditableElementBinding>>();
  private readonly nodesByBindingId = new Map<string, Element>();
  private readonly listeners = new Set<() => void>();
  private revision = 0;

  registerElement(node: Element, binding: EditableElementBinding): void {
    const previousNode = this.nodesByBindingId.get(binding.bindingId);
    if (previousNode && previousNode !== node) {
      this.removeBindingFromNode(previousNode, binding.bindingId);
    }

    const nodeBindings = this.bindingsByNode.get(node) ?? new Map<string, EditableElementBinding>();
    nodeBindings.set(binding.bindingId, binding);
    this.bindingsByNode.set(node, nodeBindings);
    this.nodesByBindingId.set(binding.bindingId, node);
    this.emitChange();
  }

  unregisterElement(node: Element, bindingId?: string): void {
    const nodeBindings = this.bindingsByNode.get(node);
    if (!nodeBindings) return;

    if (bindingId) {
      this.removeBindingFromNode(node, bindingId);
      return;
    }

    for (const registeredId of nodeBindings.keys()) {
      if (this.nodesByBindingId.get(registeredId) === node) {
        this.nodesByBindingId.delete(registeredId);
      }
    }
    this.bindingsByNode.delete(node);
    this.emitChange();
  }

  getBinding(node: Element): EditableElementBinding | undefined {
    return this.getBindings(node)[0];
  }

  getBindings(node: Element): readonly EditableElementBinding[] {
    return [...(this.bindingsByNode.get(node)?.values() ?? [])];
  }

  getNode(bindingId: string): Element | undefined {
    return this.nodesByBindingId.get(bindingId);
  }

  listBindings(): readonly RegisteredElementBinding[] {
    return [...this.nodesByBindingId.entries()].map(([bindingId, node]) => ({
      binding: this.bindingsByNode.get(node)?.get(bindingId) as EditableElementBinding,
      node,
    })).filter((entry) => entry.binding !== undefined);
  }

  getRevision = (): number => this.revision;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private removeBindingFromNode(node: Element, bindingId: string): void {
    const nodeBindings = this.bindingsByNode.get(node);
    nodeBindings?.delete(bindingId);

    if (nodeBindings?.size === 0) {
      this.bindingsByNode.delete(node);
    }
    if (this.nodesByBindingId.get(bindingId) === node) {
      this.nodesByBindingId.delete(bindingId);
    }
    this.emitChange();
  }

  private emitChange(): void {
    this.revision += 1;
    this.listeners.forEach((listener) => listener());
  }
}

export const elementBindingRegistry = new ElementBindingRegistry();
