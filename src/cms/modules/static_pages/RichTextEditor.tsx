import React, { useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Code,
  Eye,
  FileInput,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Megaphone,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Type,
  Underline,
  Undo2,
} from 'lucide-react';
import { MOCK_CTAS } from '../customer_interaction/cta/mockData';
import { MOCK_FORMS } from '../customer_interaction/forms/mockData';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

type EditorTab = 'visual' | 'code' | 'preview';

const toolbarButtonClass =
  'rounded p-1.5 text-slate-700 transition-colors hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700';

const ToolbarButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    className={toolbarButtonClass}
    aria-label={label}
    title={label}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
  >
    {children}
  </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = '280px',
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('visual');
  const [selectedCtaId, setSelectedCtaId] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [activeTab, value]);

  useEffect(() => {
    const rememberSelection = () => {
      const selection = window.getSelection();
      const editor = editorRef.current;
      if (!selection?.rangeCount || !editor) return;
      const range = selection.getRangeAt(0);
      if (editor.contains(range.commonAncestorContainer)) savedRangeRef.current = range.cloneRange();
    };
    document.addEventListener('selectionchange', rememberSelection);
    return () => document.removeEventListener('selectionchange', rememberSelection);
  }, []);

  const emitVisualValue = () => onChange(editorRef.current?.innerHTML || '');

  const restoreSelection = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    if (savedRangeRef.current) selection?.addRange(savedRangeRef.current);
  };

  const runCommand = (command: string, commandValue?: string) => {
    restoreSelection();
    document.execCommand(command, false, commandValue);
    emitVisualValue();
  };

  const insertHtml = (html: string) => runCommand('insertHTML', html);

  const insertLink = () => {
    const url = window.prompt('Nhập địa chỉ liên kết (URL):', 'https://');
    if (!url) return;
    restoreSelection();
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) runCommand('createLink', url);
    else insertHtml(`<a href="${url}" target="_blank" rel="noopener noreferrer">Liên kết</a>`);
  };

  const insertImage = () => {
    const url = window.prompt('Nhập đường dẫn ảnh:', 'https://');
    if (!url) return;
    const alt = window.prompt('Nhập mô tả ảnh (Alt text):', '') || '';
    insertHtml(`<img src="${url}" alt="${alt}" />`);
  };

  const insertCta = () => {
    const cta = MOCK_CTAS.find((item) => item.id === selectedCtaId);
    if (!cta) return;
    insertHtml(
      `<span contenteditable="false" data-cms-reference="cta" data-cta-id="${cta.id}" class="cms-rich-reference cms-rich-cta">${cta.displayText}</span>&nbsp;`,
    );
    setSelectedCtaId('');
  };

  const insertForm = () => {
    const form = MOCK_FORMS.find((item) => item.id === selectedFormId);
    if (!form) return;
    insertHtml(
      `<div contenteditable="false" data-cms-reference="form" data-form-id="${form.id}" class="cms-rich-reference cms-rich-form"><strong>${form.title}</strong><br><small>${form.adminName}</small></div><p><br></p>`,
    );
    setSelectedFormId('');
  };

  const activeCtas = MOCK_CTAS.filter((cta) => cta.status === 'active');
  const activeForms = MOCK_FORMS.filter((form) => form.status === 'active');

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xs transition-all focus-within:border-orange-500 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800/90">
        {activeTab === 'visual' ? (
          <div className="flex flex-wrap items-center gap-1">
            <select aria-label="Kiểu đoạn văn" defaultValue="p" onChange={(e) => runCommand('formatBlock', e.target.value)} className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900">
              <option value="p">Đoạn văn</option>
              <option value="h2">Tiêu đề H2</option>
              <option value="h3">Tiêu đề H3</option>
              <option value="h4">Tiêu đề H4</option>
              <option value="blockquote">Trích dẫn</option>
            </select>
            <select aria-label="Font chữ" defaultValue="Arial" onChange={(e) => runCommand('fontName', e.target.value)} className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900">
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
            <select aria-label="Cỡ chữ" defaultValue="3" onChange={(e) => runCommand('fontSize', e.target.value)} className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900">
              <option value="1">10px</option><option value="2">13px</option><option value="3">16px</option><option value="4">18px</option><option value="5">24px</option><option value="6">32px</option>
            </select>
            <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-700" />
            <ToolbarButton label="In đậm" onClick={() => runCommand('bold')}><Bold className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="In nghiêng" onClick={() => runCommand('italic')}><Italic className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Gạch chân" onClick={() => runCommand('underline')}><Underline className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Gạch ngang" onClick={() => runCommand('strikeThrough')}><Strikethrough className="h-4 w-4" /></ToolbarButton>
            <label className={`${toolbarButtonClass} flex cursor-pointer items-center`} title="Màu chữ"><input type="color" aria-label="Màu chữ" className="h-4 w-5 cursor-pointer border-0 bg-transparent p-0" onChange={(e) => runCommand('foreColor', e.target.value)} /></label>
            <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-700" />
            <ToolbarButton label="Danh sách dấu đầu dòng" onClick={() => runCommand('insertUnorderedList')}><List className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Danh sách đánh số" onClick={() => runCommand('insertOrderedList')}><ListOrdered className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Căn trái" onClick={() => runCommand('justifyLeft')}><AlignLeft className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Căn giữa" onClick={() => runCommand('justifyCenter')}><AlignCenter className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Căn phải" onClick={() => runCommand('justifyRight')}><AlignRight className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Trích dẫn" onClick={() => runCommand('formatBlock', 'blockquote')}><Quote className="h-4 w-4" /></ToolbarButton>
            <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-700" />
            <ToolbarButton label="Chèn liên kết" onClick={insertLink}><LinkIcon className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Chèn ảnh" onClick={insertImage}><ImageIcon className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Chèn đường kẻ" onClick={() => insertHtml('<hr>')}><Minus className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Xóa định dạng" onClick={() => runCommand('removeFormat')}><RemoveFormatting className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Hoàn tác" onClick={() => runCommand('undo')}><Undo2 className="h-4 w-4" /></ToolbarButton>
            <ToolbarButton label="Làm lại" onClick={() => runCommand('redo')}><Redo2 className="h-4 w-4" /></ToolbarButton>
          </div>
        ) : <span className="px-1 text-xs font-semibold text-slate-500">{activeTab === 'code' ? 'Chỉnh sửa mã HTML' : 'Bản xem trước nội dung'}</span>}

        <div className="flex items-center gap-1 rounded-lg bg-slate-200 p-0.5 text-xs font-semibold dark:bg-slate-700">
          {([['visual', 'Soạn thảo', Type], ['code', 'Mã HTML', Code], ['preview', 'Xem trước', Eye]] as const).map(([tab, label, Icon]) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-colors ${activeTab === tab ? 'bg-white text-orange-600 shadow-2xs dark:bg-slate-900 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300'}`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'visual' && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex min-w-64 flex-1 gap-1">
            <select aria-label="Chọn CTA" value={selectedCtaId} onChange={(e) => setSelectedCtaId(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900">
              <option value="">Chọn CTA từ module CTA</option>
              {activeCtas.map((cta) => <option key={cta.id} value={cta.id}>{cta.adminName} · {cta.displayText}</option>)}
            </select>
            <button type="button" disabled={!selectedCtaId} onMouseDown={(e) => e.preventDefault()} onClick={insertCta} className="flex items-center gap-1 rounded-lg bg-orange-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-40"><Megaphone className="h-3.5 w-3.5" />Chèn CTA</button>
          </div>
          <div className="flex min-w-64 flex-1 gap-1">
            <select aria-label="Chọn biểu mẫu" value={selectedFormId} onChange={(e) => setSelectedFormId(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900">
              <option value="">Chọn biểu mẫu từ module Biểu mẫu</option>
              {activeForms.map((form) => <option key={form.id} value={form.id}>{form.adminName} · {form.title}</option>)}
            </select>
            <button type="button" disabled={!selectedFormId} onMouseDown={(e) => e.preventDefault()} onClick={insertForm} className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-40 dark:bg-slate-600"><FileInput className="h-3.5 w-3.5" />Chèn Form</button>
          </div>
        </div>
      )}

      <div className="p-3">
        {activeTab === 'visual' ? (
          <div ref={editorRef} contentEditable suppressContentEditableWarning role="textbox" aria-label="Nội dung soạn thảo" aria-multiline="true" data-placeholder="Nhập nội dung tại đây..." onInput={emitVisualValue} onBlur={emitVisualValue} style={{ minHeight }} className="cms-rich-editor prose max-w-none rounded-lg border border-dashed border-slate-200 bg-transparent p-3 text-sm leading-relaxed text-slate-900 outline-none focus:border-orange-400 dark:prose-invert dark:border-slate-700 dark:text-slate-100" />
        ) : activeTab === 'code' ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} style={{ minHeight }} aria-label="Mã HTML nội dung" className="w-full resize-y rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-relaxed text-emerald-300 outline-none focus:border-orange-500 dark:border-slate-700" />
        ) : (
          <div style={{ minHeight }} className="prose max-w-none rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3 text-sm leading-relaxed text-slate-800 dark:prose-invert dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-400 italic">Chưa có nội dung để xem trước...</p>' }} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
        <span>{value.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length} từ</span>
        <span className="flex items-center gap-1 font-sans font-medium text-emerald-600 dark:text-emerald-400"><Check className="h-3 w-3" />Đã đồng bộ nội dung</span>
      </div>
    </div>
  );
};
