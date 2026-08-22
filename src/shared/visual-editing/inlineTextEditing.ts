import type { EditableElementBinding } from './elementBindingTypes';
import type { EditableFieldContract, EditableValueKind } from './editableSectionContract';
import { isFieldEditable } from './editableSectionContract';

export interface ParseResult<T extends string | number> {
  ok: boolean;
  value?: T;
}

export interface FieldValueCodec<T extends string | number> {
  kind: EditableValueKind;
  format(value: T): string;
  parse(input: string): ParseResult<T>;
}

export interface InlineTextEditDescriptor {
  binding: EditableElementBinding;
  rawValue: string;
  valueKind: EditableValueKind;
  fixedSuffix?: string;
}

export interface CommitElementEditRequest {
  binding: EditableElementBinding;
  before: string | number;
  after: string | number;
}

export type CommitElementEdit = (request: CommitElementEditRequest) => boolean;

export function parseFiniteNumber(rawValue: string): number | null {
  const normalized = rawValue.trim();
  if (!/^-?(?:\d+|\d*\.\d+)$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export const stringValueCodec: FieldValueCodec<string> = {
  kind: 'string',
  format: (value) => value,
  parse: (input) => ({ ok: true, value: input }),
};

export const numberValueCodec: FieldValueCodec<number> = {
  kind: 'number',
  format: String,
  parse: (input) => {
    const value = parseFiniteNumber(input);
    return value === null ? { ok: false } : { ok: true, value };
  },
};

export function codecForValueKind(kind: EditableValueKind): FieldValueCodec<string> | FieldValueCodec<number> {
  return kind === 'number' ? numberValueCodec : stringValueCodec;
}

export function createInlineTextEditDescriptor(
  binding: EditableElementBinding,
  field: EditableFieldContract,
  value: string | number,
  fixedSuffix?: string,
): InlineTextEditDescriptor | null {
  if (!isFieldEditable(field)) return null;
  const codec = codecForValueKind(field.valueKind);
  if ((field.valueKind === 'number' && typeof value !== 'number') || (field.valueKind === 'string' && typeof value !== 'string')) return null;
  return { binding, rawValue: codec.format(value as never), valueKind: field.valueKind, fixedSuffix };
}

export function valueForCommit(descriptor: InlineTextEditDescriptor, rawValue: string): string | number | null {
  const result = codecForValueKind(descriptor.valueKind).parse(rawValue);
  return result.ok ? result.value ?? null : null;
}

function setCaret(node: HTMLElement, offset: number): void {
  const selection = node.ownerDocument.getSelection();
  if (!selection) return;
  const textNode = node.firstChild;
  if (!textNode) return;
  const range = node.ownerDocument.createRange();
  range.setStart(textNode, Math.min(offset, textNode.textContent?.length ?? 0));
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function replaceSelectionWithPlainText(node: HTMLElement, text: string): void {
  const selection = node.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const textNode = node.ownerDocument.createTextNode(text);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export interface InlineTextSession {
  commit(): boolean;
  cancel(): void;
  destroy(): void;
}

export function startInlineTextSession(
  node: HTMLElement,
  descriptor: InlineTextEditDescriptor,
  commitElementEdit: CommitElementEdit,
  onFinish: (committed: boolean) => void,
): InlineTextSession {
  const originalDisplay = node.textContent ?? '';
  const originalOutline = node.style.outline;
  const originalValue = valueForCommit(descriptor, descriptor.rawValue);
  const suffix = descriptor.fixedSuffix ?? '';
  let rawValue = descriptor.rawValue;
  let composing = false;
  let finished = false;

  const renderRaw = (caret = rawValue.length) => {
    node.textContent = `${rawValue}${suffix}`;
    setCaret(node, caret);
  };
  const readRaw = () => {
    const text = node.textContent ?? '';
    rawValue = suffix && text.endsWith(suffix) ? text.slice(0, -suffix.length) : text;
  };
  const cleanup = () => {
    const selection = node.ownerDocument.getSelection();
    const anchorNode = selection?.anchorNode;
    if (selection && anchorNode && node.contains(anchorNode)) selection.removeAllRanges();
    node.blur();
    node.removeAttribute('contenteditable');
    node.removeAttribute('spellcheck');
    node.style.outline = originalOutline;
    node.removeEventListener('input', handleInput);
    node.removeEventListener('keydown', handleKeyDown);
    node.removeEventListener('blur', handleBlur);
    node.removeEventListener('paste', handlePaste);
    node.removeEventListener('compositionstart', handleCompositionStart);
    node.removeEventListener('compositionend', handleCompositionEnd);
  };
  const finish = (committed: boolean) => {
    if (finished) return;
    finished = true;
    cleanup();
    onFinish(committed);
  };
  const commit = () => {
    if (finished) return true;
    readRaw();
    const parsed = valueForCommit(descriptor, rawValue);
    if (parsed === null || originalValue === null) {
      node.focus();
      renderRaw();
      return false;
    }
    if (!commitElementEdit({ binding: descriptor.binding, before: originalValue, after: parsed })) {
      node.focus();
      renderRaw();
      return false;
    }
    finish(true);
    return true;
  };
  const cancel = () => {
    if (finished) return;
    node.textContent = originalDisplay;
    finish(false);
  };
  function handleInput() {
    readRaw();
    if (suffix && !composing) renderRaw();
  }
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.isComposing && !composing) {
      event.preventDefault();
      event.stopPropagation();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      cancel();
    }
  }
  function handleBlur() {
    if (!finished) commit();
  }
  function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    replaceSelectionWithPlainText(node, event.clipboardData?.getData('text/plain') ?? '');
    readRaw();
    if (suffix) renderRaw();
  }
  function handleCompositionStart() { composing = true; }
  function handleCompositionEnd() { composing = false; readRaw(); if (suffix) renderRaw(); }

  node.setAttribute('contenteditable', 'plaintext-only');
  node.setAttribute('spellcheck', descriptor.valueKind === 'string' ? 'true' : 'false');
  node.style.outline = 'none';
  node.addEventListener('input', handleInput);
  node.addEventListener('keydown', handleKeyDown);
  node.addEventListener('blur', handleBlur);
  node.addEventListener('paste', handlePaste);
  node.addEventListener('compositionstart', handleCompositionStart);
  node.addEventListener('compositionend', handleCompositionEnd);
  node.focus();
  renderRaw();
  const selection = node.ownerDocument.getSelection();
  if (selection && node.firstChild) {
    const range = node.ownerDocument.createRange();
    range.setStart(node.firstChild, 0);
    range.setEnd(node.firstChild, rawValue.length);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return { commit, cancel, destroy: cancel };
}
