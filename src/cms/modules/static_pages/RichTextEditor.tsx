import React, { useMemo, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Alignment,
  Autoformat,
  AutoImage,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
  Undo,
} from 'ckeditor5';
import type { Editor, FileLoader, PluginConstructor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { Eye, FileInput, Megaphone, X } from 'lucide-react';
import { MOCK_CTAS } from '../customer_interaction/cta/mockData';
import { MOCK_FORMS } from '../customer_interaction/forms/mockData';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

class UploadAdapter {
  private controller = new AbortController();

  constructor(private loader: FileLoader) {}

  async upload(): Promise<{ default: string }> {
    const file = await this.loader.file;
    if (!file) throw new Error('Không tìm thấy ảnh cần tải lên.');
    const body = new FormData();
    body.append('upload', file);
    const response = await fetch('/upload', {
      method: 'POST',
      body,
      credentials: 'same-origin',
      signal: this.controller.signal,
    });
    const payload = await response.json().catch(() => null) as { url?: string; default?: string; error?: { message?: string } } | null;
    if (!response.ok) throw new Error(payload?.error?.message || `Tải ảnh thất bại (${response.status}).`);
    const url = payload?.url || payload?.default;
    if (!url) throw new Error('API /upload không trả về url của ảnh.');
    return { default: url };
  }

  abort() {
    this.controller.abort();
  }
}

function UploadAdapterPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => new UploadAdapter(loader);
}

const editorPlugins: PluginConstructor<Editor>[] = [
  Essentials, Paragraph, Heading, Autoformat, Undo,
  Bold, Italic, Underline, Strikethrough, RemoveFormat,
  FontFamily, FontSize, FontColor, FontBackgroundColor,
  Alignment, Indent, IndentBlock, BlockQuote,
  List, ListProperties, Link, PasteFromOffice,
  Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, ImageInsert, ImageResize, LinkImage, AutoImage,
  Table, TableToolbar, TableCaption, TableProperties, TableCellProperties, TableColumnResize,
  MediaEmbed, SourceEditing, GeneralHtmlSupport,
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, minHeight = '280px' }) => {
  const editorRef = useRef<Editor | null>(null);
  const [selectedCtaId, setSelectedCtaId] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [previewFormId, setPreviewFormId] = useState<string | null>(null);

  const activeCtas = useMemo(() => MOCK_CTAS.filter((item) => item.status === 'active'), []);
  const activeForms = useMemo(() => MOCK_FORMS.filter((item) => item.status === 'active'), []);
  const previewForm = activeForms.find((item) => item.id === previewFormId) || null;

  const config = useMemo(() => ({
    licenseKey: 'GPL',
    plugins: editorPlugins,
    extraPlugins: [UploadAdapterPlugin],
    toolbar: {
      shouldNotGroupWhenFull: true,
      items: [
        'sourceEditing', '|', 'undo', 'redo', '|',
        'heading', 'fontFamily', 'fontSize', '|',
        'bold', 'italic', 'underline', 'strikethrough', 'removeFormat', '|',
        'fontColor', 'fontBackgroundColor', '|',
        'alignment', 'bulletedList', 'numberedList', 'outdent', 'indent', '|',
        'link', 'uploadImage', 'insertImage', 'mediaEmbed', 'insertTable', 'blockQuote',
      ],
    },
    heading: {
      options: [
        { model: 'paragraph' as const, title: 'Đoạn văn', class: 'ck-heading_paragraph' },
        { model: 'heading2' as const, view: 'h2', title: 'Tiêu đề H2', class: 'ck-heading_heading2' },
        { model: 'heading3' as const, view: 'h3', title: 'Tiêu đề H3', class: 'ck-heading_heading3' },
        { model: 'heading4' as const, view: 'h4', title: 'Tiêu đề H4', class: 'ck-heading_heading4' },
      ],
    },
    fontFamily: { supportAllValues: true },
    fontSize: { options: [10, 12, 14, 'default' as const, 18, 24, 32, 40], supportAllValues: true },
    image: {
      upload: { types: ['jpeg', 'png', 'gif', 'webp'] },
      toolbar: ['imageTextAlternative', 'toggleImageCaption', '|', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|', 'resizeImage'],
      resizeOptions: [
        { name: 'resizeImage:original', value: null, label: 'Kích thước gốc' },
        { name: 'resizeImage:50', value: '50', label: '50%' },
        { name: 'resizeImage:75', value: '75', label: '75%' },
      ],
    },
    table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', '|', 'toggleTableCaption', 'tableProperties', 'tableCellProperties'] },
    link: { addTargetToExternalLinks: true, defaultProtocol: 'https://' },
    htmlSupport: {
      allow: [
        { name: /^(div|span|p|a|img|table|thead|tbody|tr|th|td|figure|figcaption)$/, attributes: /.*/, classes: /.*/, styles: /.*/ },
      ],
    },
    placeholder: 'Nhập nội dung tại đây…',
  }), []);

  const insertReference = (html: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const viewFragment = editor.data.processor.toView(html);
    const modelFragment = editor.data.toModel(viewFragment);
    editor.model.insertContent(modelFragment);
    onChange(editor.getData());
    editor.editing.view.focus();
  };

  const insertCta = () => {
    const cta = activeCtas.find((item) => item.id === selectedCtaId);
    if (!cta) return;
    insertReference(`<p><a class="cms-rich-reference cms-rich-cta" data-cms-reference="cta" data-cta-id="${cta.id}" href="#">${cta.displayText}</a></p>`);
    setSelectedCtaId('');
  };

  const insertForm = (formId = selectedFormId) => {
    const form = activeForms.find((item) => item.id === formId);
    if (!form) return;
    insertReference(`<div class="cms-rich-reference cms-rich-form" data-cms-reference="form" data-form-id="${form.id}"><p><strong>${form.title}</strong></p><p>${form.adminName}</p></div><p>&nbsp;</p>`);
    setSelectedFormId('');
  };

  return (
    <div className="cms-ckeditor overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900" style={{ '--cms-editor-min-height': minHeight } as React.CSSProperties}>
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={value}
        onReady={(editor) => { editorRef.current = editor; }}
        onChange={(_, editor) => onChange(editor.getData())}
        onAfterDestroy={() => { editorRef.current = null; }}
      />

      <div className="grid gap-2 border-t border-slate-200 bg-slate-50 p-3 lg:grid-cols-2 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
          <select aria-label="Chọn CTA" value={selectedCtaId} onChange={(event) => setSelectedCtaId(event.target.value)} className="min-w-48 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-900">
            <option value="">Chọn CTA từ module CTA</option>
            {activeCtas.map((cta) => <option key={cta.id} value={cta.id}>{cta.adminName} · {cta.displayText}</option>)}
          </select>
          <button type="button" disabled={!selectedCtaId} onClick={insertCta} className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-40"><Megaphone className="h-4 w-4" />Chèn CTA</button>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
          <select aria-label="Chọn biểu mẫu" value={selectedFormId} onChange={(event) => setSelectedFormId(event.target.value)} className="min-w-48 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-900">
            <option value="">Chọn biểu mẫu từ module Biểu mẫu</option>
            {activeForms.map((form) => <option key={form.id} value={form.id}>{form.adminName} · {form.title}</option>)}
          </select>
          <button type="button" disabled={!selectedFormId} onClick={() => setPreviewFormId(selectedFormId)} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"><Eye className="h-4 w-4" />Xem</button>
          <button type="button" disabled={!selectedFormId} onClick={() => insertForm()} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white disabled:opacity-40 dark:bg-slate-600"><FileInput className="h-4 w-4" />Chèn Form</button>
        </div>
      </div>

      {previewForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="form-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewFormId(null); }}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><div><p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Xem trước · {previewForm.code}</p><h3 id="form-preview-title" className="mt-1 text-lg font-bold dark:text-white">{previewForm.title}</h3><p className="mt-1 text-xs text-slate-500">{previewForm.description}</p></div><button type="button" aria-label="Đóng xem form" onClick={() => setPreviewFormId(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4 p-5">
              {[...previewForm.fields].filter((field) => field.fieldType !== 'hidden').sort((a, b) => a.position - b.position).map((field) => <div key={field.id}><label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{field.label}{field.isRequired && <span className="ml-1 text-red-500">*</span>}</label>{field.fieldType === 'textarea' ? <textarea disabled rows={3} placeholder={field.placeholder} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800" /> : field.fieldType === 'select' ? <select disabled className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"><option>{field.placeholder || 'Chọn một giá trị'}</option></select> : <input disabled type={field.fieldType === 'email' ? 'email' : field.fieldType === 'phone' ? 'tel' : field.fieldType === 'file_upload' ? 'file' : 'text'} placeholder={field.placeholder} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800" />}{field.helpText && <p className="mt-1 text-[10px] text-slate-500">{field.helpText}</p>}</div>)}
              <button type="button" disabled className="w-full rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white">{previewForm.submitConfig.submitButtonText || 'Gửi thông tin'}</button>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-700"><button type="button" onClick={() => setPreviewFormId(null)} className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold dark:border-slate-600">Đóng</button><button type="button" onClick={() => { insertForm(previewForm.id); setPreviewFormId(null); }} className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white">Chèn biểu mẫu này</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
