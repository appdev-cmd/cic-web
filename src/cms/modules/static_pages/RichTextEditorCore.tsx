'use client';

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
  ButtonView,
  IconMedia,
} from 'ckeditor5';
import type { Editor, FileLoader, PluginConstructor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { Check, ExternalLink, FileInput, Megaphone, Play, Video, X } from 'lucide-react';
import { getDemoCtaModuleData, getDemoFormModuleData } from '../../data/demoCustomerInteractionDataSource';
import type { CustomerInteractionEmbed } from '../../../shared/customerInteractionContract';

export type RichTextEmbedType = CustomerInteractionEmbed | 'video';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  minHeight?: string;
  allowedEmbeds?: RichTextEmbedType[];
}

export function toEmbedUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // 1. Check if user pasted full iframe tag
  const iframeMatch = trimmed.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
  if (iframeMatch?.[1]) {
    return iframeMatch[1];
  }

  // 2. YouTube (standard watch, short youtu.be, shorts, embed)
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch?.[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // 3. Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|video\/|album\/(?:\d+\/)?video\/|)(\d+)|player\.vimeo\.com\/video\/(\d+))/i);
  const vimeoId = vimeoMatch?.[1] || vimeoMatch?.[2];
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  // 4. Any direct web URL fallback
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

class UploadAdapter {
  private controller = new AbortController();

  constructor(private loader: FileLoader) {}

  async upload(): Promise<{ default: string }> {
    const file = await this.loader.file;
    if (!file) throw new Error('Không tìm thấy ảnh cần tải lên.');
    const body = new FormData();
    body.append('upload', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body,
      credentials: 'same-origin',
      signal: this.controller.signal,
    });
    const payload = await response.json().catch(() => null) as { url?: string; default?: string; error?: { message?: string } } | null;
    if (!response.ok) throw new Error(payload?.error?.message || `Tải ảnh thất bại (${response.status}).`);
    const url = payload?.url || payload?.default;
    if (!url) throw new Error('API /api/upload không trả về url của ảnh.');
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
type CmsReferenceAlignment = 'left' | 'center' | 'right' | 'full';

interface CmsReferenceAttributes extends Record<string, unknown> {
  referenceType: CmsReferenceType;
  referenceId: string;
  label: string;
  description: string;
  alignment: CmsReferenceAlignment;
}

const EMBED_SOURCE_REGEX = /^(https?:)?\/\//i;
const MEDIA_IFRAME_ATTRIBUTES = ['src', 'title', 'width', 'height', 'style', 'frameborder', 'allow', 'referrerpolicy', 'allowfullscreen'] as const;

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
        attributes: { src: EMBED_SOURCE_REGEX },
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
        const title = String(modelElement.getAttribute('title') || 'Video player');
        const style = String(modelElement.getAttribute('style') || '');
        const width = String(modelElement.getAttribute('width') || '');
        const height = String(modelElement.getAttribute('height') || '');
        const allow = String(modelElement.getAttribute('allow') || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        const wrapper = writer.createContainerElement('figure', { class: 'cms-rich-media-embed' });
        const iframeAttrs: Record<string, string> = {
          src,
          title,
          allow,
          referrerpolicy: String(modelElement.getAttribute('referrerpolicy') || 'strict-origin-when-cross-origin'),
          allowfullscreen: 'allowfullscreen',
          frameborder: String(modelElement.getAttribute('frameborder') || '0'),
          tabindex: '-1',
        };
        if (style) iframeAttrs.style = style;
        if (width) iframeAttrs.width = width;
        if (height) iframeAttrs.height = height;
        const iframe = writer.createRawElement('iframe', iframeAttrs);
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
      allowAttributes: ['referenceType', 'referenceId', 'label', 'description', 'alignment'],
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
        const alignment = (viewElement.getAttribute('data-reference-alignment') || (referenceType === 'cta' ? 'center' : 'full')) as CmsReferenceAlignment;

        return writer.createElement('cmsReference', { referenceType, referenceId, label, description, alignment });
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
        const alignment = String(modelElement.getAttribute('alignment') || (referenceType === 'cta' ? 'center' : 'full'));
        const container = writer.createContainerElement('div', {
          class: `cms-rich-reference cms-rich-${referenceType} cms-rich-align-${alignment}`,
          'data-cms-reference': referenceType,
          [`data-${referenceType}-id`]: referenceId,
          'data-reference-label': label,
          'data-reference-description': description,
          'data-reference-alignment': alignment,
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
        const alignment = String(modelElement.getAttribute('alignment') || (referenceType === 'cta' ? 'center' : 'full'));
        const visibleText = description ? `${label} · ${description}` : label;
        const container = writer.createContainerElement('div', {
          class: `cms-rich-reference cms-rich-${referenceType} cms-rich-align-${alignment}`,
          'data-cms-reference': referenceType,
          [`data-${referenceType}-id`]: referenceId,
          'data-reference-alignment': alignment,
        });
        writer.insert(writer.createPositionAt(container, 0), writer.createText(visibleText));

        return toWidget(container, writer, {
          label: `${referenceType === 'cta' ? 'CTA' : 'Biểu mẫu'}: ${label}`,
        });
      },
    });
  }
}

class CmsVideoToolbarPlugin extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('insertCmsVideo', (locale) => {
      const button = new ButtonView(locale);
      button.set({
        label: 'Chèn video (YouTube, Vimeo, iframe)',
        icon: IconMedia,
        tooltip: true,
      });
      button.on('execute', () => {
        editor.fire('cms:openVideoModal');
      });
      return button;
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
  MediaEmbed, SourceEditing, GeneralHtmlSupport, CmsReferencePlugin, CmsMediaEmbedPlugin, CmsVideoToolbarPlugin,
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, onBlur, minHeight = '280px', allowedEmbeds = [] }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const editorRef = useRef<Editor | null>(null);
  const lastDataRef = useRef<string>(value || '');
  const [editorData, setEditorData] = useState<string>(value || '');
  const [selectedCtaId, setSelectedCtaId] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [referencePicker, setReferencePicker] = useState<CmsReferenceType | null>(null);
  const [referenceAlignment, setReferenceAlignment] = useState<CmsReferenceAlignment>('center');

  // Video Embed states
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const [videoResizeType, setVideoResizeType] = useState<'responsive' | 'default' | '560x315' | '854x480' | '1280x720'>('responsive');
  const [videoAlignment, setVideoAlignment] = useState<'none' | 'left' | 'center' | 'right'>('none');
  const [videoError, setVideoError] = useState<string | null>(null);

  const previewEmbedUrl = useMemo(() => {
    if (!videoInputUrl.trim()) return '';
    return toEmbedUrl(videoInputUrl);
  }, [videoInputUrl]);

  const handleInsertVideo = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const trimmed = videoInputUrl.trim();
    if (!trimmed) {
      setVideoError('Vui lòng nhập đường dẫn URL hoặc mã nhúng video.');
      return;
    }
    const embedUrl = toEmbedUrl(trimmed);
    if (!embedUrl) {
      setVideoError('Không nhận diện được định dạng liên kết video hợp lệ.');
      return;
    }

    const alignStyle =
      videoAlignment === 'center'
        ? 'display:flex;justify-content:center;margin:16px auto;text-align:center;'
        : videoAlignment === 'right'
          ? 'display:flex;justify-content:flex-end;margin:16px 0 16px auto;text-align:right;'
          : videoAlignment === 'left'
            ? 'display:flex;justify-content:flex-start;margin:16px auto 16px 0;text-align:left;'
            : 'margin:16px 0;';

    let videoHtml = '';
    if (videoResizeType === 'responsive') {
      videoHtml = `<div class="cms-video-wrapper" style="${alignStyle}"><div style="position:relative;width:100%;max-width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;"><iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="allowfullscreen"></iframe></div></div>`;
    } else {
      let width = '640';
      let height = '360';
      if (videoResizeType === '560x315') { width = '560'; height = '315'; }
      else if (videoResizeType === '854x480') { width = '854'; height = '480'; }
      else if (videoResizeType === '1280x720') { width = '1280'; height = '720'; }

      videoHtml = `<div class="cms-video-wrapper" style="${alignStyle}"><iframe src="${embedUrl}" width="${width}" height="${height}" style="max-width:100%;border:0;border-radius:10px;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="allowfullscreen"></iframe></div>`;
    }

    try {
      const viewFragment = editor.data.processor.toView(videoHtml);
      const modelFragment = editor.data.toModel(viewFragment);
      editor.model.insertContent(modelFragment);
      const nextData = editor.getData();
      lastDataRef.current = nextData;
      onChange(nextData);
      editor.editing.view.focus();
    } catch (err) {
      console.warn('Error inserting video embed:', err);
    }

    setVideoModalOpen(false);
    setVideoInputUrl('');
    setVideoResizeType('responsive');
    setVideoAlignment('none');
    setVideoError(null);
  };

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

  const activeCtas = useMemo(
    () => getDemoCtaModuleData('vi').ctas.filter((item) => item.status === 'active' && item.governance.allowedPlacements.includes('rich_text')),
    [],
  );
  const activeForms = useMemo(
    () => getDemoFormModuleData('vi').forms.filter((item) => item.status === 'active' && item.governance.allowedPlacements.includes('rich_text')),
    [],
  );
  const previewCta = activeCtas.find((item) => item.id === selectedCtaId) || null;
  const previewForm = activeForms.find((item) => item.id === selectedFormId) || null;
  const alignmentLabel: Record<CmsReferenceAlignment, string> = { left: 'Trái', center: 'Giữa', right: 'Phải', full: 'Toàn chiều rộng' };
  const previewAlignmentClass = referenceAlignment === 'left' ? 'mr-auto' : referenceAlignment === 'right' ? 'ml-auto' : referenceAlignment === 'center' ? 'mx-auto' : 'w-full';

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
        'link', 'uploadImage', 'insertImage',
        ...(allowedEmbeds.includes('video') ? ['insertCmsVideo'] : []),
        'insertTable', 'blockQuote',
      ],
    },
    heading: {
      options: [
        { model: 'paragraph' as const, title: 'Đoạn văn', class: 'ck-heading_paragraph' },
        { model: 'heading1' as const, view: 'h1', title: 'Tiêu đề H1', class: 'ck-heading_heading1' },
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
        { name: /.*/, attributes: /.*/, classes: /.*/, styles: /.*/ },
      ],
    },
    placeholder: 'Nhập nội dung tại đây…',
  }), [allowedEmbeds]);

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
      alignment: referenceAlignment,
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
      alignment: referenceAlignment,
    });
    setSelectedFormId('');
    setReferencePicker(null);
  };

  if (!mounted) {
    return (
      <div className="cms-ckeditor flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900" style={{ minHeight }}>
        <p className="text-xs font-medium text-slate-400 animate-pulse">Đang nạp trình soạn thảo…</p>
      </div>
    );
  }

  return (
    <div className="cms-ckeditor overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900" style={{ '--cms-editor-min-height': minHeight } as React.CSSProperties}>
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={editorData}
        onReady={(editor) => {
          editorRef.current = editor;
          editor.on('cms:openVideoModal', () => {
            setVideoModalOpen(true);
            setVideoError(null);
          });
          const root = editor.editing.view.document.getRoot();
          if (root) {
            editor.editing.view.change((writer) => {
              writer.setStyle('min-height', minHeight, root);
              writer.setStyle('height', minHeight, root);
              writer.setStyle('max-height', minHeight, root);
              writer.setStyle('overflow-y', 'auto', root);
            });
          }
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
        onBlur={(_, editor) => onBlur?.(editor.getData())}
        onError={(error, details) => {
          console.warn('CKEditor runtime error captured:', error, details);
        }}
        onAfterDestroy={() => {
          editorRef.current = null;
        }}
      />

      {(allowedEmbeds.includes('cta') || allowedEmbeds.includes('form')) && (
        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
          {allowedEmbeds.includes('cta') && (
            <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
              <button
                type="button"
                onClick={() => {
                  setSelectedCtaId((current) => current || activeCtas[0]?.id || '');
                  setReferenceAlignment('center');
                  setReferencePicker('cta');
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-xs font-bold text-white hover:bg-orange-700 transition"
              >
                <Megaphone className="h-4 w-4" />
                Chèn CTA
              </button>
            </div>
          )}
          {allowedEmbeds.includes('form') && (
            <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
              <button
                type="button"
                onClick={() => {
                  setSelectedFormId((current) => current || activeForms[0]?.id || '');
                  setReferenceAlignment('full');
                  setReferencePicker('form');
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 transition"
              >
                <FileInput className="h-4 w-4" />
                Chèn Form
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Chèn Video / Đa phương tiện theo chuẩn tiếng Việt */}
      {videoModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-embed-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setVideoModalOpen(false);
          }}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="video-embed-title" className="text-base font-bold text-slate-900 dark:text-white">
                    Chèn Video / Đa phương tiện
                  </h3>
                  <p className="text-[11px] text-slate-500">Embed Media Content (Photo, Video, Audio or Rich Content)</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setVideoModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              {/* Instructions */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                Dán đường dẫn (hỗ trợ cả link rút gọn) từ bất kỳ nguồn nào như <strong className="text-slate-700 dark:text-slate-200">YouTube, Vimeo, TikTok, Bilibili, Facebook, Google Drive...</strong> hoặc dán trực tiếp toàn bộ thẻ <strong className="text-slate-700 dark:text-slate-200">&lt;iframe&gt;</strong>.
              </p>

              {/* URL Input */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                  URL <span className="font-normal text-slate-400">(Đường dẫn video hoặc mã nhúng):</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={videoInputUrl}
                    onChange={(e) => {
                      setVideoInputUrl(e.target.value);
                      if (videoError) setVideoError(null);
                    }}
                    placeholder="VD: https://www.youtube.com/watch?v=... hoặc <iframe src=...>"
                    className={`w-full rounded-xl border px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                      videoError
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700'
                    }`}
                    autoFocus
                  />
                  {videoInputUrl && (
                    <button
                      type="button"
                      onClick={() => setVideoInputUrl('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {videoError && <p className="mt-1 text-xs text-red-500">{videoError}</p>}
              </div>

              {/* Resize Type */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Kích thước <span className="font-normal text-slate-400">(Resize Type - chỉ áp dụng video):</span>
                </label>
                <select
                  value={videoResizeType}
                  onChange={(e) => setVideoResizeType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="responsive">Tự động co giãn (Responsive 16:9 - Khuyên dùng)</option>
                  <option value="default">Mặc định (Không đổi kích thước)</option>
                  <option value="560x315">Kích thước chuẩn (560 x 315 px)</option>
                  <option value="854x480">Kích thước lớn (854 x 480 px)</option>
                  <option value="1280x720">Kích thước Full HD (1280 x 720 px)</option>
                </select>
              </div>

              {/* Alignment */}
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Căn chỉnh <span className="font-normal text-slate-400">(Alignment):</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { id: 'none', label: 'Không căn (None)' },
                    { id: 'left', label: 'Trái (Left)' },
                    { id: 'center', label: 'Giữa (Center)' },
                    { id: 'right', label: 'Phải (Right)' },
                  ].map((align) => (
                    <label
                      key={align.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                        videoAlignment === align.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-500'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="video-alignment"
                        value={align.id}
                        checked={videoAlignment === align.id}
                        onChange={() => setVideoAlignment(align.id as any)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{align.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Xem trước:
                </label>
                {previewEmbedUrl ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-black dark:border-slate-800 aspect-video max-h-52 w-full">
                    <iframe
                      src={previewEmbedUrl}
                      title="Xem trước video"
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-7 text-center text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800/40">
                    <Play className="mb-2 h-7 w-7 text-slate-300 dark:text-slate-600" />
                    <span>Dán đường dẫn video vào ô trên để xem trước tại đây</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-900/60">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Hủy bỏ (Cancel)
              </button>
              <button
                type="button"
                disabled={!videoInputUrl.trim()}
                onClick={handleInsertVideo}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40"
              >
                <Check className="h-4 w-4" />
                Xác nhận chèn (OK)
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {referencePicker && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="reference-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setReferencePicker(null); }}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><div><p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Chọn và xem trước</p><h3 id="reference-preview-title" className="mt-1 text-lg font-bold dark:text-white">{referencePicker === 'cta' ? 'CTA' : 'Biểu mẫu'}</h3></div><button type="button" aria-label="Đóng" onClick={() => setReferencePicker(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button></div>
            <div className="space-y-5 p-5">
              {referencePicker === 'cta' ? <select aria-label="Chọn CTA để xem trước" value={selectedCtaId} onChange={(event) => setSelectedCtaId(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"><option value="">Chọn CTA từ module CTA</option>{activeCtas.map((cta) => <option key={cta.id} value={cta.id}>{cta.adminName} · {cta.displayText}</option>)}</select> : <select aria-label="Chọn biểu mẫu để xem trước" value={selectedFormId} onChange={(event) => setSelectedFormId(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"><option value="">Chọn biểu mẫu từ module Biểu mẫu</option>{activeForms.map((form) => <option key={form.id} value={form.id}>{form.adminName} · {form.title}</option>)}</select>}
              <div><p className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-200">Căn chỉnh hiển thị</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(['left', 'center', 'right', 'full'] as CmsReferenceAlignment[]).map((alignment) => <button key={alignment} type="button" onClick={() => setReferenceAlignment(alignment)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${referenceAlignment === alignment ? 'border-orange-600 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300' : 'border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300'}`}>{alignmentLabel[alignment]}</button>)}</div><p className="mt-2 text-[11px] text-slate-500">CTA mặc định căn giữa; biểu mẫu mặc định chiếm toàn bộ chiều rộng vùng nội dung.</p></div>
              {referencePicker === 'cta' && previewCta && <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-800"><div className={`${previewAlignmentClass} ${referenceAlignment === 'full' ? '' : 'w-fit'} text-center`}><p className="mb-4 text-xs font-bold text-slate-500">{previewCta.adminName}</p><button type="button" className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold ${referenceAlignment === 'full' ? 'w-full' : ''} ${previewCta.styleVariant === 'outline' ? 'border border-orange-600 text-orange-600' : previewCta.styleVariant === 'secondary' ? 'bg-slate-800 text-white' : previewCta.styleVariant === 'gradient' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white' : 'bg-orange-600 text-white'}`}><Megaphone className="h-4 w-4" />{previewCta.displayText}</button><p className="mt-4 text-xs text-slate-500">{previewCta.description}</p></div></div>}
              {referencePicker === 'form' && previewForm && <div className={`${previewAlignmentClass} ${referenceAlignment === 'full' ? '' : 'max-w-md'} space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800`}><div><h4 className="font-bold dark:text-white">{previewForm.title}</h4><p className="mt-1 text-xs text-slate-500">{previewForm.description}</p></div>{[...previewForm.fields].filter((field) => field.fieldType !== 'hidden').sort((a, b) => a.position - b.position).map((field) => <div key={field.id}><label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{field.label}{field.isRequired && <span className="ml-1 text-red-500">*</span>}</label>{field.fieldType === 'textarea' ? <textarea disabled rows={3} placeholder={field.placeholder} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" /> : <input disabled type="text" placeholder={field.placeholder} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" />}</div>)}<button type="button" disabled className="w-full rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white">{previewForm.submitConfig.submitButtonText || 'Gửi thông tin'}</button></div>}
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

export default RichTextEditor;
