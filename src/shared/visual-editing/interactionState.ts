import type { EditableElementBinding } from './elementBindingTypes';
import type { ElementBindingRegistry } from './elementBindingRegistry';
import type { ResolvedVisualEditingTarget } from './targetResolver';

export interface VisualEditingInteractionState {
  hoveredBindingId: string | null;
  selectedBindingId: string | null;
  editingBindingId: string | null;
  draggingBindingId: string | null;
}

const initialState: VisualEditingInteractionState = {
  hoveredBindingId: null,
  selectedBindingId: null,
  editingBindingId: null,
  draggingBindingId: null,
};

export class VisualEditingInteractionController {
  private state: VisualEditingInteractionState = initialState;
  private readonly listeners = new Set<() => void>();

  constructor(private readonly registry: ElementBindingRegistry) {}

  getState = (): VisualEditingInteractionState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  setHoveredTarget(target: ResolvedVisualEditingTarget | null): void {
    if (this.state.editingBindingId) return;
    this.setState({ hoveredBindingId: target?.bindingId ?? null });
  }

  selectTarget(target: ResolvedVisualEditingTarget | null): void {
    this.setState({ selectedBindingId: target?.bindingId ?? null });
  }

  selectBinding(bindingId: string): void {
    this.setState({ selectedBindingId: this.registry.getNode(bindingId) ? bindingId : null });
  }

  clearSelection(): void {
    if (this.state.editingBindingId) return;
    this.setState({ selectedBindingId: null });
  }

  beginEditing(bindingId: string): void {
    if (!this.registry.getNode(bindingId) || this.state.draggingBindingId) return;
    this.setState({ editingBindingId: bindingId, selectedBindingId: bindingId, hoveredBindingId: null });
  }

  endEditing(): void {
    this.setState({ editingBindingId: null });
  }

  cancelEditing(): void {
    this.setState({ editingBindingId: null, selectedBindingId: null });
  }

  beginDragging(bindingId: string): void {
    if (!this.registry.getNode(bindingId) || this.state.editingBindingId) return;
    this.setState({ draggingBindingId: bindingId, hoveredBindingId: null });
  }

  endDragging(): void {
    this.setState({ draggingBindingId: null });
  }

  clearHover(): void {
    this.setState({ hoveredBindingId: null });
  }

  getHoveredBinding(): EditableElementBinding | undefined {
    return this.getBinding(this.state.hoveredBindingId);
  }

  getSelectedBinding(): EditableElementBinding | undefined {
    return this.getBinding(this.state.selectedBindingId);
  }

  reconcileRegistry(): void {
    const hoveredBindingId = this.state.hoveredBindingId && this.registry.getNode(this.state.hoveredBindingId)
      ? this.state.hoveredBindingId
      : null;
    const selectedBindingId = this.state.selectedBindingId && this.registry.getNode(this.state.selectedBindingId)
      ? this.state.selectedBindingId
      : null;
    const editingBindingId = this.state.editingBindingId && this.registry.getNode(this.state.editingBindingId)
      ? this.state.editingBindingId
      : null;
    const draggingBindingId = this.state.draggingBindingId && this.registry.getNode(this.state.draggingBindingId)
      ? this.state.draggingBindingId
      : null;
    this.replaceState({ hoveredBindingId, selectedBindingId, editingBindingId, draggingBindingId });
  }

  private getBinding(bindingId: string | null): EditableElementBinding | undefined {
    if (!bindingId) return undefined;
    const node = this.registry.getNode(bindingId);
    return node ? this.registry.getBindings(node).find((binding) => binding.bindingId === bindingId) : undefined;
  }

  private setState(update: Partial<VisualEditingInteractionState>): void {
    this.replaceState({ ...this.state, ...update });
  }

  private replaceState(nextState: VisualEditingInteractionState): void {
    if (nextState.hoveredBindingId === this.state.hoveredBindingId
      && nextState.selectedBindingId === this.state.selectedBindingId
      && nextState.editingBindingId === this.state.editingBindingId
      && nextState.draggingBindingId === this.state.draggingBindingId) return;
    this.state = nextState;
    this.listeners.forEach((listener) => listener());
  }
}
