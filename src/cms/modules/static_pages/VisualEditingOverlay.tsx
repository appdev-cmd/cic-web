import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import type { ElementBindingRegistry } from '../../../shared/visual-editing/elementBindingRegistry';
import { observeElementGeometry, readTextContentGeometry, type ElementGeometry } from '../../../shared/visual-editing/elementGeometry';
import { VisualEditingInteractionController } from '../../../shared/visual-editing/interactionState';
import { resolveVisualEditingTarget } from '../../../shared/visual-editing/targetResolver';
import { startInlineTextSession, type CommitElementEdit, type InlineTextEditDescriptor, type InlineTextSession } from '../../../shared/visual-editing/inlineTextEditing';
import { GripVertical, RefreshCw } from 'lucide-react';
import type { ReferenceItemDescriptor } from '../../../shared/visual-editing/referenceItemInteraction';
import {
  adjacentSortableTarget,
  hitTestSortableCollection,
  listSortableCollectionItems,
  type SortableHitTarget,
  type SortableItemDescriptor,
  type SortableReorderRequest,
} from '../../../shared/visual-editing/sortableBoundCollection';

interface VisualEditingOverlayProps {
  enabled: boolean;
  root: HTMLElement | null;
  registry: ElementBindingRegistry;
  resolveElementEdit?: (bindingId: string) => InlineTextEditDescriptor | null;
  commitElementEdit?: CommitElementEdit;
  resolveSortableItem?: (bindingId: string) => SortableItemDescriptor | null;
  commitItemReorder?: (request: SortableReorderRequest) => boolean;
  resolveReferenceItem?: (bindingId: string) => ReferenceItemDescriptor | null;
  replaceReferenceItem?: (descriptor: ReferenceItemDescriptor) => void;
}

interface DragState {
  source: SortableItemDescriptor;
  target: SortableHitTarget | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  keyboard: boolean;
}

function useBindingGeometry(
  bindingId: string | null,
  registry: ElementBindingRegistry,
  registryRevision: number,
): ElementGeometry | null {
  const [geometry, setGeometry] = useState<ElementGeometry | null>(null);

  useEffect(() => {
    if (!bindingId) {
      setGeometry(null);
      return undefined;
    }
    const node = registry.getNode(bindingId);
    if (!node) {
      setGeometry(null);
      return undefined;
    }
    const binding = registry.getBindings(node).find((candidate) => candidate.bindingId === bindingId);
    return observeElementGeometry(
      node,
      setGeometry,
      binding?.semantic === 'text' ? readTextContentGeometry : undefined,
    );
  }, [bindingId, registry, registryRevision]);

  return geometry;
}

const baseOverlayStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 2147483647,
  boxSizing: 'border-box',
  borderRadius: 4,
  pointerEvents: 'none',
};

function geometryStyle(geometry: ElementGeometry): CSSProperties {
  return {
    left: geometry.left - 3,
    top: geometry.top - 3,
    width: geometry.width + 6,
    height: geometry.height + 6,
  };
}

export const VisualEditingOverlay: React.FC<VisualEditingOverlayProps> = ({ enabled, root, registry, resolveElementEdit, commitElementEdit, resolveSortableItem, commitItemReorder, resolveReferenceItem, replaceReferenceItem }) => {
  const controller = useMemo(() => new VisualEditingInteractionController(registry), [registry]);
  const interactionState = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
  const registryRevision = useSyncExternalStore(
    registry.subscribe,
    registry.getRevision,
    registry.getRevision,
  );
  const sessionRef = useRef<InlineTextSession | null>(null);
  const [sortableHoverBindingId, setSortableHoverBindingId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const sourceStyleRef = useRef<{ node: HTMLElement; transform: string; opacity: string; zIndex: string } | null>(null);

  const restoreDraggedNode = () => {
    const saved = sourceStyleRef.current;
    if (saved) {
      saved.node.style.transform = saved.transform;
      saved.node.style.opacity = saved.opacity;
      saved.node.style.zIndex = saved.zIndex;
    }
    sourceStyleRef.current = null;
  };

  const cancelDrag = () => {
    restoreDraggedNode();
    setDragState(null);
    controller.endDragging();
  };

  const finishDrag = () => {
    if (!dragState) return false;
    const { source, target } = dragState;
    restoreDraggedNode();
    setDragState(null);
    controller.endDragging();
    if (!target || target.descriptor.itemId === source.itemId || !commitItemReorder) return false;
    return commitItemReorder({
      sectionKey: source.sectionKey,
      collectionPath: source.collectionPath,
      itemId: source.itemId,
      targetItemId: target.descriptor.itemId,
      placement: target.placement,
    });
  };

  useEffect(() => {
    controller.reconcileRegistry();
  }, [controller, registryRevision]);

  useEffect(() => {
    if (!enabled || !root) {
      sessionRef.current?.cancel();
      sessionRef.current = null;
      cancelDrag();
      setSortableHoverBindingId(null);
      controller.clearHover();
      controller.clearSelection();
      return undefined;
    }

    const resolveTarget = (eventTarget: EventTarget | null) => resolveVisualEditingTarget(eventTarget, root, registry, { includeReferenceItems: true });
    const handlePointerMove = (event: PointerEvent) => {
      if (controller.getState().editingBindingId || controller.getState().draggingBindingId) return;
      const fieldTarget = resolveTarget(event.target);
      controller.setHoveredTarget(fieldTarget);
      if (fieldTarget && resolveReferenceItem?.(fieldTarget.bindingId)) {
        setSortableHoverBindingId(fieldTarget.bindingId);
        return;
      }
      if (fieldTarget || !resolveSortableItem) {
        setSortableHoverBindingId(null);
        return;
      }
      const structuralTarget = resolveVisualEditingTarget(event.target, root, registry, { includeStructural: true });
      const descriptor = structuralTarget ? resolveSortableItem(structuralTarget.bindingId) : null;
      setSortableHoverBindingId(descriptor?.binding.bindingId ?? null);
    };
    const handlePointerLeave = (event: PointerEvent) => {
      const RelatedElement = root.ownerDocument.defaultView?.Element;
      if (RelatedElement && event.relatedTarget instanceof RelatedElement && event.relatedTarget.closest('[data-ve-sortable-handle]')) return;
      controller.clearHover();
      if (!controller.getState().draggingBindingId) setSortableHoverBindingId(null);
    };
    const handleClick = (event: MouseEvent) => {
      const target = resolveTarget(event.target);
      const referenceTarget = target ? resolveReferenceItem?.(target.bindingId) : null;
      if (referenceTarget) {
        event.preventDefault();
        event.stopPropagation();
      }
      const editingBindingId = controller.getState().editingBindingId;
      const activeNode = editingBindingId ? registry.getNode(editingBindingId) : null;
      const EventTargetNode = activeNode?.ownerDocument.defaultView?.Node;
      if (sessionRef.current && activeNode && EventTargetNode && event.target instanceof EventTargetNode && !activeNode.contains(event.target as Node)) {
        if (!sessionRef.current.commit()) return;
        sessionRef.current = null;
      }
      controller.selectTarget(target);
      const TargetHTMLElement = target?.node.ownerDocument.defaultView?.HTMLElement;
      if (!target || !resolveElementEdit || !commitElementEdit || !TargetHTMLElement || !(target.node instanceof TargetHTMLElement)) return;
      if (editingBindingId === target.bindingId) return;
      const descriptor = resolveElementEdit(target.bindingId);
      if (!descriptor) return;
      controller.beginEditing(target.bindingId);
      sessionRef.current = startInlineTextSession(target.node as HTMLElement, descriptor, commitElementEdit, (committed) => {
        sessionRef.current = null;
        if (committed) controller.endEditing();
        else controller.cancelEditing();
      });
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && controller.getState().draggingBindingId) {
        event.preventDefault();
        cancelDrag();
      } else if (event.key === 'Escape' && !controller.getState().editingBindingId) controller.clearSelection();
    };

    root.addEventListener('pointermove', handlePointerMove);
    root.addEventListener('pointerleave', handlePointerLeave);
    root.addEventListener('click', handleClick, true);
    root.ownerDocument.addEventListener('keydown', handleKeyDown);

    return () => {
      root.removeEventListener('pointermove', handlePointerMove);
      root.removeEventListener('pointerleave', handlePointerLeave);
      root.removeEventListener('click', handleClick, true);
      root.ownerDocument.removeEventListener('keydown', handleKeyDown);
      sessionRef.current?.cancel();
      sessionRef.current = null;
      restoreDraggedNode();
      setDragState(null);
      setSortableHoverBindingId(null);
      controller.endDragging();
      controller.clearHover();
      controller.clearSelection();
    };
  }, [commitElementEdit, controller, enabled, registry, resolveElementEdit, resolveReferenceItem, resolveSortableItem, root]);

  const selectedGeometry = useBindingGeometry(
    enabled ? interactionState.selectedBindingId : null,
    registry,
    registryRevision,
  );
  const hoveredGeometry = useBindingGeometry(
    enabled && interactionState.hoveredBindingId !== interactionState.selectedBindingId
      ? interactionState.hoveredBindingId
      : null,
    registry,
    registryRevision,
  );
  const sortableGeometry = useBindingGeometry(
    enabled ? dragState?.source.binding.bindingId ?? sortableHoverBindingId : null,
    registry,
    registryRevision,
  );
  const targetGeometry = useBindingGeometry(
    enabled ? dragState?.target?.descriptor.binding.bindingId ?? null : null,
    registry,
    registryRevision,
  );
  const activeReferenceBindingId = interactionState.selectedBindingId && resolveReferenceItem?.(interactionState.selectedBindingId)
    ? interactionState.selectedBindingId
    : interactionState.hoveredBindingId && resolveReferenceItem?.(interactionState.hoveredBindingId)
      ? interactionState.hoveredBindingId
      : null;
  const activeReference = activeReferenceBindingId ? resolveReferenceItem?.(activeReferenceBindingId) ?? null : null;
  const referenceGeometry = useBindingGeometry(enabled ? activeReferenceBindingId : null, registry, registryRevision);

  const beginDrag = (descriptor: SortableItemDescriptor, clientX: number, clientY: number, keyboard: boolean) => {
    if (controller.getState().editingBindingId) return;
    const node = registry.getNode(descriptor.binding.bindingId);
    const NodeHTMLElement = node?.ownerDocument.defaultView?.HTMLElement;
    if (!node || !NodeHTMLElement || !(node instanceof NodeHTMLElement)) return;
    sourceStyleRef.current = { node: node as HTMLElement, transform: (node as HTMLElement).style.transform, opacity: (node as HTMLElement).style.opacity, zIndex: (node as HTMLElement).style.zIndex };
    controller.beginDragging(descriptor.binding.bindingId);
    controller.clearHover();
    setDragState({ source: descriptor, target: null, startX: clientX, startY: clientY, currentX: clientX, currentY: clientY, keyboard });
  };

  const updatePointerDrag = (clientX: number, clientY: number) => {
    setDragState((current) => {
      if (!current || current.keyboard) return current;
      const items = listSortableCollectionItems(registry, current.source);
      const target = hitTestSortableCollection(items, clientX, clientY);
      const saved = sourceStyleRef.current;
      if (saved) {
        saved.node.style.transform = `translate3d(${clientX - current.startX}px, ${clientY - current.startY}px, 0)`;
        saved.node.style.opacity = '0.58';
        saved.node.style.zIndex = '2';
      }
      return { ...current, target, currentX: clientX, currentY: clientY };
    });
  };

  const moveKeyboardTarget = (direction: -1 | 1) => {
    setDragState((current) => {
      if (!current?.keyboard) return current;
      const items = listSortableCollectionItems(registry, current.source);
      const anchorId = current.target?.descriptor.itemId ?? current.source.itemId;
      const target = adjacentSortableTarget(items, anchorId, direction);
      return target ? { ...current, target } : current;
    });
  };

  if (!enabled) return null;

  return <>
    {selectedGeometry ? <div
      aria-hidden="true"
      data-ve-overlay="selected"
      data-ve-binding-id={interactionState.selectedBindingId ?? undefined}
      style={{
        ...baseOverlayStyle,
        ...geometryStyle(selectedGeometry),
        border: '1px solid rgb(234 88 12 / 0.7)',
        background: 'transparent',
        boxShadow: interactionState.editingBindingId ? '0 0 0 1px rgb(255 255 255 / 0.82)' : 'none',
      }}
    /> : null}
    {hoveredGeometry ? <div
      aria-hidden="true"
      data-ve-overlay="hover"
      data-ve-binding-id={interactionState.hoveredBindingId ?? undefined}
      style={{
        ...baseOverlayStyle,
        ...geometryStyle(hoveredGeometry),
        border: '1px solid rgb(249 115 22 / 0.34)',
        background: 'transparent',
      }}
    /> : null}
    {activeReference?.replaceable && referenceGeometry && !dragState ? <button
      type="button"
      aria-label="Thay nội dung tham chiếu"
      data-ve-reference-action="replace"
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); replaceReferenceItem?.(activeReference); }}
      style={{
        position: 'fixed', zIndex: 2147483647,
        left: referenceGeometry.left + referenceGeometry.width - 58,
        top: referenceGeometry.top + 6,
        width: 24, height: 24, display: 'grid', placeItems: 'center',
        border: '1px solid rgb(148 163 184 / 0.52)', borderRadius: 7,
        background: 'rgb(255 255 255 / 0.9)', color: '#64748b',
        boxShadow: '0 2px 7px rgb(15 23 42 / 0.09)', cursor: 'pointer',
      }}
    ><RefreshCw aria-hidden="true" size={13} strokeWidth={2} /></button> : null}
    {sortableGeometry && (sortableHoverBindingId || dragState) ? <button
      type="button"
      aria-label="Kéo để sắp xếp mục"
      aria-pressed={dragState?.keyboard ?? false}
      data-ve-sortable-handle={`${(dragState?.source ?? resolveSortableItem?.(sortableHoverBindingId ?? ''))?.sectionKey ?? ''}.${(dragState?.source ?? resolveSortableItem?.(sortableHoverBindingId ?? ''))?.collectionPath ?? ''}`}
      onPointerEnter={() => setSortableHoverBindingId(dragState?.source.binding.bindingId ?? sortableHoverBindingId)}
      onPointerLeave={() => { if (!dragState) setSortableHoverBindingId(null); }}
      onPointerDown={(event) => {
        if (dragState || !resolveSortableItem) return;
        const descriptor = resolveSortableItem(sortableHoverBindingId ?? '');
        if (!descriptor) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        beginDrag(descriptor, event.clientX, event.clientY, false);
      }}
      onPointerMove={(event) => { if (dragState && !dragState.keyboard) updatePointerDrag(event.clientX, event.clientY); }}
      onPointerUp={(event) => {
        if (!dragState || dragState.keyboard) return;
        event.currentTarget.releasePointerCapture(event.pointerId);
        finishDrag();
      }}
      onPointerCancel={cancelDrag}
      onKeyDown={(event) => {
        if ((event.key === ' ' || event.key === 'Enter') && !dragState && resolveSortableItem) {
          event.preventDefault();
          const descriptor = resolveSortableItem(sortableHoverBindingId ?? '');
          if (descriptor) beginDrag(descriptor, sortableGeometry.left, sortableGeometry.top, true);
        } else if ((event.key === ' ' || event.key === 'Enter') && dragState?.keyboard) {
          event.preventDefault();
          finishDrag();
        } else if (dragState?.keyboard && ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          moveKeyboardTarget(event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1);
        } else if (event.key === 'Escape' && dragState) {
          event.preventDefault();
          cancelDrag();
        }
      }}
      style={{
        position: 'fixed',
        zIndex: 2147483647,
        left: sortableGeometry.left + sortableGeometry.width - 25,
        top: sortableGeometry.top + 5,
        width: 24,
        height: 24,
        display: 'grid',
        placeItems: 'center',
        border: '1px solid rgb(148 163 184 / 0.52)',
        borderRadius: 7,
        background: 'rgb(255 255 255 / 0.86)',
        color: '#64748b',
        boxShadow: '0 2px 7px rgb(15 23 42 / 0.09)',
        cursor: dragState ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    ><GripVertical aria-hidden="true" size={14} strokeWidth={2} /></button> : null}
    {dragState && targetGeometry && dragState.target && dragState.target.descriptor.itemId !== dragState.source.itemId ? <div
      aria-hidden="true"
      data-ve-drop-indicator={`${dragState.source.sectionKey}.${dragState.source.collectionPath}`}
      style={{
        position: 'fixed',
        zIndex: 2147483646,
        pointerEvents: 'none',
        left: dragState.target.placement === 'before' ? targetGeometry.left - 3 : targetGeometry.left + targetGeometry.width + 1,
        top: targetGeometry.top + 8,
        width: 2,
        height: Math.max(16, targetGeometry.height - 16),
        borderRadius: 2,
        background: '#f97316',
        boxShadow: '0 0 0 1px rgb(255 255 255 / 0.9)',
      }}
    /> : null}
  </>;
};
