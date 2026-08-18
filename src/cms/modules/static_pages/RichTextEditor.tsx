import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  Plugin,
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
  Widget,
  toWidget,
} from 'ckeditor5';
import type { Editor, FileLoader, PluginConstructor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { FileInput, Megaphone, X } from 'lucide-react';
import { getDemoCtaModuleData, getDemoFormModuleData } from '../../data/demoCustomerInteractionDataSource';

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

type CmsReferenceType = 'cta' | 'form';

interface CmsReferenceAttributes extends Record<string, unknown> {
  referenceType: CmsReferenceType;
  referenceId: string;
  label: string;
  description: string;
}

const YOUTUBE_EMBED_SOURCE = /^https:\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)[A-Za-z0-9_-]+(?:\?[^\s"<>]*)?$/;
const MEDIA_IFRAME_ATTRIBUTES = ['src', 'title', 'width', 'height', 'frameborder', 'allow', 'referrerpolicy', 'allowfullscreen'] as const;

class CmsMediaEmbedPlugin extends Plugin {
  static get requires() {
    return [Widget] as const;
  }

  init() {
    const editor = this.editor;

    editor.model.schema.register('cmsMediaEmbed', {
      inheritAllFrom: '$blockObject',
      allowAttributes: [...MEDIA_IFRAME_ATTRIBUTES],
    });

    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'iframe',
        attributes: { src: YOUTUBE_EMBED_SOURCE },
      },
      model: (viewElement, { writer }) => {
        const attributes = Object.fromEntries(
          MEDIA_IFRAME_ATTRIBUTES.flatMap((name) => {
            const value = viewElement.getAttribute(name);
            return value === undefined ? [] : [[name, value]];
          }),
        );
        return writer.createElement('cmsMediaEmbed', attributes);
      },
      converterPriority: 'high',
    });

    editor.conversion.for('dataDowncast').elementToElement({
      model: 'cmsMediaEmbed',
      view: (modelElement, { writer }) => {
        const attributes = Object.fromEntries(
          MEDIA_IFRAME_ATTRIBUTES.flatMap((name) => {
            const value = modelElement.getAttribute(name);
            return value === undefined ? [] : [[name, String(value)]];
          }),
        );
        return writer.createContainerElement('iframe', attributes);
      },
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'cmsMediaEmbed',
      view: (modelElement, { writer }) => {
        const src = String(modelElement.getAttribute('src') || '');
        const title = String(modelElement.getAttribute('title') || 'YouTube video player');
        const allow = String(modelElement.getAttribute('allow') || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        const wrapper = writer.createContainerElement('figure', { class: 'cms-rich-media-embed' });
        const iframe = writer.createRawElement('iframe', {
          src,
          title,
          allow,
          referrerpolicy: String(modelElement.getAttribute('referrerpolicy') || 'strict-origin-when-cross-origin'),
          allowfullscreen: 'allowfullscreen',
          frameborder: String(modelElement.getAttribute('frameborder') || '0'),
          tabindex: '-1',
        });
        writer.insert(writer.createPositionAt(wrapper, 0), iframe);
        return toWidget(wrapper, writer, { label: `Video: ${title}` });
      },
    });
  }
}

class CmsReferencePlugin extends Plugin {
  static get requires() {
    return [Widget] as const;
  }

  init() {
    const editor = this.editor;

    editor.model.schema.register('cmsReference', {
      inheritAllFrom: '$blockObject',
      allowAttributes: ['referenceType', 'referenceId', 'label', 'description'],
    });

    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        attributes: { 'data-cms-reference': /^(cta|form)$/ },
      },
      model: (viewElement, { writer }) => {
        const referenceType = viewElement.getAttribute('data-cms-reference') as CmsReferenceType;
        const referenceId = viewElement.getAttribute(`data-${referenceType}-id`) || '';
        const label = viewElement.getAttribute('data-reference-label') || '';
        const description = viewElement.getAttribute('data-reference-description') || '';

        return writer.createElement('cmsReference', { referenceType, referenceId, label, description });
      },
      converterPriority: 'high',
    });

    editor.conversion.for('dataDowncast').elementToElement({
      model: 'cmsReference',
      view: (modelElement, { writer }) => {
        const referenceType = modelElement.getAttribute('referenceType') as CmsReferenceType;
        const referenceId = String(modelElement.getAttribute('referenceId') || '');
        const label = String(modelElement.getAttribute('label') || '');
        const description = String(modelElement.getAttribute('description') || '');
        const container = writer.createContainerElement('div', {
          class: `cms-rich-reference cms-rich-${referenceType}`,
          'data-cms-reference': referenceType,
          [`data-${referenceType}-id`]: referenceId,
          'data-reference-label': label,
          'data-reference-description': description,
        });
        writer.insert(writer.createPositionAt(container, 0), writer.createText(label));

        return container;
      },
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'cmsReference',
      view: (modelElement, { writer }) => {
        const referenceType = modelElement.getAttribute('referenceType') as CmsReferenceType;
        const referenceId = String(modelElement.getAttribute('referenceId') || '');
        const label = String(modelElement.getAttribute('label') || '');
        const description = String(modelElement.getAttribute('description') || '');
        const visibleText = description ? `${label} · ${description}` : label;
        const container = writer.createContainerElement('div', {
          class: `cms-rich-reference cms-rich-${referenceType}`,
          'data-cms-reference': referenceType,
          [`data-${referenceType}-id`]: referenceId,
        });
        writer.insert(writer.createPositionAt(container, 0), writer.createText(visibleText));

        return toWidget(container, writer, {
          label: `${referenceType === 'cta' ? 'CTA' : 'Biểu mẫu'}: ${label}`,
        });
      },
    });
  }
}

const editorPlugins: PluginConstructor<Editor>[] = [
  Essentials, Paragraph, Heading, Autoformat, Undo,
  Bold, Italic, Underline, Strikethrough, RemoveFormat,
  FontFamily, FontSize, FontColor, FontBackgroundColor,
  Alignment, Indent, IndentBlock, BlockQuote,
  List, ListProperties, Link, PasteFromOffice,
  Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, ImageInsert, ImageResize, LinkImage, AutoImage,
  Table, TableToolbar, TableCaption, TableProperties, TableCellProperties, TableColumnResize,
  MediaEmbed, SourceEditing, GeneralHtmlSupport, CmsReferencePlugin, CmsMediaEmbedPlugin,
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, minHeight = '280px' }) => {
  const editorRef = useRef<Editor | null>(null);
  const lastDataRef = useRef<string>(value || '');
  const [editorData, setEditorData] = useState<string>(value || '');
  const [selectedCtaId, setSelectedCtaId] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [referencePicker, setReferencePicker] = useState<CmsReferenceType | null>(null);

  // Synchronize when the external value changes and differs from the last emitted editor data
  useEffect(() => {
    if (value !== lastDataRef.current) {
      lastDataRef.current = value || '';
      setEditorData(value || '');
      if (editorRef.current && editorRef.current.getData() !== (value || '')) {
        try {
          editorRef.current.setData(value || '');
        } catch (err) {
          console.warn('CKEditor external setData warning:', err);
        }
      }
    }
  }, [value]);

  const activeCtas = useMemo(() => getDemoCtaModuleData('vi').ctas.filter((item) => item.status === 'active'), []);
  const activeForms = useMemo(() => getDemoFormModuleData('vi').forms.filter((item) => item.status === 'active'), []);
  const previewCta = activeCtas.find((item) => item.id === selectedCtaId) || null;
  const previewForm = activeForms.find((item) => item.id === selectedFormId) || null;

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

  const insertReference = (attributes: CmsReferenceAttributes) => {
    const editor = editorRef.current;
    if (!editor) return;
    try {
      editor.model.change((writer) => {
        const reference = writer.createElement('cmsReference', attributes);
        editor.model.insertObject(reference, null, null, { setSelection: 'after' });
      });
      const nextData = editor.getData();
      lastDataRef.current = nextData;
      onChange(nextData);
      editor.editing.view.focus();
    } catch (err) {
      console.warn('Error inserting reference widget:', err);
    }
  };

  const insertCta = () => {
    const cta = activeCtas.find((item) => item.id === selectedCtaId);
    if (!cta) return;
    insertReference({
      referenceType: 'cta',
      referenceId: cta.id,
      label: cta.displayText,
      description: cta.adminName,
    });
    setSelectedCtaId('');
    setReferencePicker(null);
  };

  const insertForm = (formId = selectedFormId) => {
    const form = activeForms.find((item) => item.id === formId);
    if (!form) return;
    insertReference({
      referenceType: 'form',
      referenceId: form.id,
      label: form.title,
      description: form.adminName,
    });
    setSelectedFormId('');
    setReferencePicker(null);
  };

  return (
    <div className="cms-ckeditor overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900" style={{ '--cms-editor-min-height': minHeight } as React.CSSProperties}>
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={editorData}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(_, editor) => {
          try {
            const data = editor.getData();
            lastDataRef.current = data;
            onChange(data);
          } catch (err) {
            console.warn('CKEditor getData warning:', err);
          }
        }}
        onError={(error, details) => {
          console.warn('CKEditor runtime error captured:', error, details);
        }}
        onAfterDestroy={() => {
          editorRef.current = null;
        }}
      />

      <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
          <button type="button" onClick={() => { setSelectedCtaId((current) => current || activeCtas[0]?.id || ''); setReferencePicker('cta'); }} className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-xs font-bold text-white"><Megaphone className="h-4 w-4" />Chèn CTA</button>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
          <button type="button" onClick={() => { setSelectedFormId((current) => current || activeForms[0]?.id || ''); setReferencePicker('form'); }} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white dark:bg-slate-600"><FileInput className="h-4 w-4" />Chèn Form</button>
        </div>
      </div>

      {referencePicker && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="reference-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setReferencePicker(null); }}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><div><p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Chọn và xem trước</p><h3 id="reference-preview-title" className="mt-1 text-lg font-bold dark:text-white">{referencePicker === 'cta' ? 'CTA' : 'Biểu mẫu'}</h3></div><button type="button" aria-label="Đóng" onClick={() => setReferencePicker(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button></div>
            <div className="space-y-5 p-5">
              {referencePicker === 'cta' ? <select aria-label="Chọn CTA để xem trước" value={selectedCtaId} onChange={(event) => setSelectedCtaId(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"><option value="">Chọn CTA từ module CTA</option>{activeCtas.map((cta) => <option key={cta.id} value={cta.id}>{cta.adminName} · {cta.displayText}</option>)}</select> : <select aria-label="Chọn biểu mẫu để xem trước" value={selectedFormId} onChange={(event) => setSelectedFormId(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"><option value="">Chọn biểu mẫu từ module Biểu mẫu</option>{activeForms.map((form) => <option key={form.id} value={form.id}>{form.adminName} · {form.title}</option>)}</select>}
              {referencePicker === 'cta' && previewCta && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800"><p className="mb-4 text-xs font-bold text-slate-500">{previewCta.adminName}</p><button type="button" className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold ${previewCta.styleVariant === 'outline' ? 'border border-orange-600 text-orange-600' : previewCta.styleVariant === 'secondary' ? 'bg-slate-800 text-white' : previewCta.styleVariant === 'gradient' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white' : 'bg-orange-600 text-white'}`}><Megaphone className="h-4 w-4" />{previewCta.displayText}</button><p className="mt-4 text-xs text-slate-500">{previewCta.description}</p></div>}
              {referencePicker === 'form' && previewForm && <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800"><div><h4 className="font-bold dark:text-white">{previewForm.title}</h4><p className="mt-1 text-xs text-slate-500">{previewForm.description}</p></div>{[...previewForm.fields].filter((field) => field.fieldType !== 'hidden').sort((a, b) => a.position - b.position).map((field) => <div key={field.id}><label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{field.label}{field.isRequired && <span className="ml-1 text-red-500">*</span>}</label>{field.fieldType === 'textarea' ? <textarea disabled rows={3} placeholder={field.placeholder} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" /> : <input disabled type="text" placeholder={field.placeholder} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" />}</div>)}<button type="button" disabled className="w-full rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white">{previewForm.submitConfig.submitButtonText || 'Gửi thông tin'}</button></div>}
              {((referencePicker === 'cta' && !previewCta) || (referencePicker === 'form' && !previewForm)) && <p className="rounded-xl bg-slate-100 p-6 text-center text-sm text-slate-500 dark:bg-slate-800">Chưa có mục khả dụng để xem trước.</p>}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-700"><button type="button" onClick={() => setReferencePicker(null)} className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold dark:border-slate-600">Đóng</button><button type="button" disabled={referencePicker === 'cta' ? !previewCta : !previewForm} onClick={() => referencePicker === 'cta' ? insertCta() : insertForm()} className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40">{referencePicker === 'cta' ? 'Chèn CTA này' : 'Chèn biểu mẫu này'}</button></div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};
