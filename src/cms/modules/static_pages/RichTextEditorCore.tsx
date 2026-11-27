'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Alignment,
  Autoformat,
  AutoImage,
  AutoMediaEmbed,
  BlockQuote,
  Bold,
  ButtonView,
  ClassicEditor,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
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
  type Editor,
  type EditorConfig,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { FileInput, Maximize2, Megaphone, Minimize2, X } from 'lucide-react';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { CustomerInteractionEmbed } from '../../../shared/customerInteractionContract';
import {
  resolveAllowedVideoEmbedSrc,
  upgradeBareVideoIframesToMediaFigures,
} from '@/shared/lib/rich-text-embeds';
import { CIC_CKEDITOR_HTML_SUPPORT } from './richTextGhs';
import {
  createUploadAdapterPlugin,
  MEDIA_VIDEO_LIBRARY_ICON,
  YOUTUBE_EMBED_ICON,
  type SourceEditingPluginLike,
} from './richTextUploadAdapter';
import { RichTextYoutubeModal } from './RichTextYoutubeModal';
import { PageMediaPickerModal } from './PageMediaPickerModal';

export type RichTextEmbedType = CustomerInteractionEmbed | 'video';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  allowedEmbeds?: RichTextEmbedType[];
  locale?: 'vi' | 'en';
}

export function toEmbedUrl(input: string): string {
  return resolveAllowedVideoEmbedSrc(input) ?? '';
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

interface CmsCtaOption {
  id: string;
  code: string;
  adminName: string;
  displayText: string;
  description?: string;
  styleVariant?: string;
  status?: string;
}

interface CmsFormFieldOption {
  id: string;
  label: string;
  fieldType: string;
  placeholder?: string;
  isRequired?: boolean;
  position: number;
}

interface CmsFormOption {
  id: string;
  code: string;
  adminName: string;
  title: string;
  description?: string;
  status?: string;
  fields?: CmsFormFieldOption[];
  submitConfig?: {
    submitButtonText?: string;
  };
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
        const alignment = (viewElement.getAttribute('data-reference-alignment') ||
          (referenceType === 'cta' ? 'center' : 'full')) as CmsReferenceAlignment;

        return writer.createElement('cmsReference', {
          referenceType,
          referenceId,
          label,
          description,
          alignment,
        });
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
        const alignment = String(
          modelElement.getAttribute('alignment') || (referenceType === 'cta' ? 'center' : 'full'),
        );
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
        const alignment = String(
          modelElement.getAttribute('alignment') || (referenceType === 'cta' ? 'center' : 'full'),
        );
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

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onBlur,
  minHeight = '280px',
  maxHeight = '560px',
  placeholder = 'Nhập nội dung chi tiết tại đây…',
  allowedEmbeds = [],
  locale: propLocale,
}) => {
  const workspaceLocale = useCmsWorkspaceLocale();
  const effectiveLocale: 'vi' | 'en' = propLocale ?? workspaceLocale ?? 'vi';

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const localeRef = useRef<'vi' | 'en'>(effectiveLocale);
  localeRef.current = effectiveLocale;

  // Preserve initial HTML reference so <CKEditor> never resets cursor while user is typing
  const initialHtmlRef = useRef<string>(value || '');
  const lastEmittedHtmlRef = useRef<string>(value || '');
  const [externalSyncState, setExternalSyncState] = useState<{ html: string; version: number }>(() => ({
    html: value || '',
    version: 0,
  }));
  const lastAppliedSyncVersionRef = useRef<number>(0);
  const cleanupSourceListenerRef = useRef<(() => void) | null>(null);

  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);
  onChangeRef.current = onChange;
  onBlurRef.current = onBlur;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);

  const openMediaRef = useRef(() => setShowMediaLibrary(true));
  const openYoutubeRef = useRef(() => setShowYoutubeModal(true));

  // CTA / Form reference picker states
  const [activeCtas, setActiveCtas] = useState<CmsCtaOption[]>([]);
  const [activeForms, setActiveForms] = useState<CmsFormOption[]>([]);
  const [selectedCtaId, setSelectedCtaId] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [referencePicker, setReferencePicker] = useState<CmsReferenceType | null>(null);
  const [referenceAlignment, setReferenceAlignment] = useState<CmsReferenceAlignment>('center');

  const hasCtaEmbed = allowedEmbeds.includes('cta');
  const hasFormEmbed = allowedEmbeds.includes('form');

  // Lock body scroll & Escape handler when Fullscreen is active
  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showMediaLibrary && !showYoutubeModal && !referencePicker) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen, showMediaLibrary, showYoutubeModal, referencePicker]);

  // Cleanup source listeners on unmount
  useEffect(() => {
    return () => {
      cleanupSourceListenerRef.current?.();
      cleanupSourceListenerRef.current = null;
      editorRef.current = null;
    };
  }, []);

  // Load real CTAs & Forms from database API when allowedEmbeds enables them
  useEffect(() => {
    if (!hasCtaEmbed && !hasFormEmbed) return;
    let active = true;

    if (hasCtaEmbed) {
      fetch(`/api/cms/cta?workspace=${effectiveLocale}&status=active`, { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { ctas?: CmsCtaOption[] } | null) => {
          if (active && Array.isArray(data?.ctas)) {
            setActiveCtas(data.ctas);
          }
        })
        .catch(() => undefined);
    }

    if (hasFormEmbed) {
      fetch(`/api/cms/forms?workspace=${effectiveLocale}&status=active`, { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { forms?: CmsFormOption[] } | null) => {
          if (active && Array.isArray(data?.forms)) {
            setActiveForms(data.forms);
          }
        })
        .catch(() => undefined);
    }

    return () => {
      active = false;
    };
  }, [effectiveLocale, hasCtaEmbed, hasFormEmbed]);

  // Only push external `value` updates into CKEditor when `value` changes from outside (record switch, reset, AI translation)
  useEffect(() => {
    const normalized = value || '';
    if (normalized !== lastEmittedHtmlRef.current) {
      lastEmittedHtmlRef.current = normalized;
      setExternalSyncState((prev) => ({
        html: normalized,
        version: prev.version + 1,
      }));
    }
  }, [value]);

  useEffect(() => {
    if (externalSyncState.version === lastAppliedSyncVersionRef.current) return;
    lastAppliedSyncVersionRef.current = externalSyncState.version;
    const editor = editorRef.current;
    if (!editor) return;

    const sourceEditing = editor.plugins.has('SourceEditing')
      ? (editor.plugins.get('SourceEditing') as unknown as SourceEditingPluginLike)
      : null;

    if (sourceEditing?.isSourceEditingMode) {
      const textarea = wrapperRef.current?.querySelector<HTMLTextAreaElement>(
        '.ck-source-editing-area textarea',
      );
      if (textarea && textarea.value !== externalSyncState.html) {
        textarea.value = externalSyncState.html;
      }
      sourceEditing.isSourceEditingMode = false;
    }

    if (editor.getData() !== externalSyncState.html) {
      try {
        editor.setData(externalSyncState.html);
      } catch (err) {
        console.warn('CKEditor external setData warning:', err);
      }
    }
  }, [externalSyncState]);

  const emitHtmlChange = useCallback((nextHtml: string) => {
    lastEmittedHtmlRef.current = nextHtml;
    onChangeRef.current(nextHtml);
  }, []);

  const insertHtmlSnippet = useCallback(
    (htmlSnippet: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      const sourceEditing = editor.plugins.has('SourceEditing')
        ? (editor.plugins.get('SourceEditing') as unknown as SourceEditingPluginLike)
        : null;

      if (sourceEditing?.isSourceEditingMode) {
        const textarea = wrapperRef.current?.querySelector<HTMLTextAreaElement>(
          '.ck-source-editing-area textarea',
        );
        if (textarea) {
          const start = textarea.selectionStart ?? textarea.value.length;
          const end = textarea.selectionEnd ?? textarea.value.length;
          const nextVal =
            textarea.value.slice(0, start) +
            `\n${htmlSnippet}\n` +
            textarea.value.slice(end);
          textarea.value = nextVal;
          textarea.focus();
          emitHtmlChange(nextVal);
          return;
        }
      }

      const mediaEmbedMatch = htmlSnippet.match(
        /^\s*<figure\b[^>]*class="media[^"]*"[^>]*>\s*<div\b[^>]*data-oembed-url="([^"]+)"[\s\S]*<\/figure>\s*$/i,
      );
      if (mediaEmbedMatch?.[1] && editor.commands.get('mediaEmbed')) {
        try {
          editor.execute('mediaEmbed', mediaEmbedMatch[1]);
          editor.editing.view.focus();
          emitHtmlChange(editor.getData());
          return;
        } catch {
          // Fallback to direct view/model fragment insertion below
        }
      }

      try {
        const viewFragment = editor.data.processor.toView(htmlSnippet);
        const modelFragment = editor.data.toModel(viewFragment);
        editor.model.insertContent(modelFragment);
        editor.editing.view.focus();
        emitHtmlChange(editor.getData());
      } catch {
        const next = `${editor.getData()}\n${htmlSnippet}`;
        editor.setData(next);
        emitHtmlChange(next);
      }
    },
    [emitHtmlChange],
  );

  const config: EditorConfig = useMemo(() => {
    const UploadAdapterPlugin = createUploadAdapterPlugin(() => localeRef.current);

    function CicToolbarExtrasPlugin(editor: Editor): void {
      editor.ui.componentFactory.add('cicMediaLibrary', (locale) => {
        const button = new ButtonView(locale) as unknown as {
          set: (props: Record<string, unknown>) => void;
          on: (evt: string, cb: () => void) => void;
        };
        button.set({
          label: 'Chọn ảnh từ Thư viện Media',
          icon: MEDIA_VIDEO_LIBRARY_ICON,
          tooltip: true,
        });
        button.on('execute', () => {
          openMediaRef.current();
        });
        return button as unknown as ButtonView;
      });

      editor.ui.componentFactory.add('cicYoutubeEmbed', (locale) => {
        const button = new ButtonView(locale) as unknown as {
          set: (props: Record<string, unknown>) => void;
          on: (evt: string, cb: () => void) => void;
        };
        button.set({
          label: 'Nhúng Video YouTube / Vimeo (16:9)',
          icon: YOUTUBE_EMBED_ICON,
          tooltip: true,
        });
        button.on('execute', () => {
          openYoutubeRef.current();
        });
        return button as unknown as ButtonView;
      });
    }

    return {
      licenseKey: 'GPL',
      extraPlugins: [UploadAdapterPlugin, CicToolbarExtrasPlugin],
      plugins: [
        Essentials,
        Paragraph,
        Heading,
        Autoformat,
        Undo,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Code,
        RemoveFormat,
        FontFamily,
        FontSize,
        FontColor,
        FontBackgroundColor,
        Alignment,
        Indent,
        IndentBlock,
        BlockQuote,
        HorizontalLine,
        List,
        ListProperties,
        Link,
        PasteFromOffice,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        ImageInsert,
        ImageResize,
        LinkImage,
        AutoImage,
        Table,
        TableToolbar,
        TableCaption,
        TableProperties,
        TableCellProperties,
        TableColumnResize,
        MediaEmbed,
        AutoMediaEmbed,
        FindAndReplace,
        SourceEditing,
        GeneralHtmlSupport,
        CmsReferencePlugin,
      ],
      toolbar: {
        shouldNotGroupWhenFull: true,
        items: [
          'sourceEditing',
          '|',
          'undo',
          'redo',
          '|',
          'heading',
          'fontFamily',
          'fontSize',
          '|',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          'removeFormat',
          '|',
          'alignment',
          'bulletedList',
          'numberedList',
          'outdent',
          'indent',
          '|',
          'link',
          'uploadImage',
          'cicMediaLibrary',
          'cicYoutubeEmbed',
          'insertTable',
          'blockQuote',
          'horizontalLine',
          '|',
          'findAndReplace',
        ],
      },
      heading: {
        options: [
          { model: 'paragraph', title: 'Đoạn văn (Paragraph)', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Tiêu đề H1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Tiêu đề chính H2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Tiêu đề mục H3', class: 'ck-heading_heading3' },
          { model: 'heading4', view: 'h4', title: 'Tiêu đề phụ H4', class: 'ck-heading_heading4' },
        ],
      },
      fontFamily: { supportAllValues: true },
      fontSize: {
        options: [12, 14, 'default', 18, 22, 28, 32, 40],
        supportAllValues: true,
      },
      fontColor: {
        colors: [
          { color: 'rgb(15, 23, 42)', label: 'Đen Slate chuẩn CIC' },
          { color: 'rgb(234, 88, 12)', label: 'Cam thương hiệu CIC' },
          { color: 'rgb(71, 85, 105)', label: 'Xám kỹ thuật' },
          { color: 'rgb(2, 132, 199)', label: 'Xanh dương công nghệ' },
          { color: 'rgb(4, 120, 87)', label: 'Xanh lục đạt chuẩn' },
          { color: 'rgb(180, 83, 9)', label: 'Vàng cảnh báo' },
          { color: 'rgb(220, 38, 38)', label: 'Đỏ nhấn mạnh' },
        ],
      },
      fontBackgroundColor: {
        colors: [
          { color: 'rgb(255, 247, 237)', label: 'Nền Cam nhạt CIC' },
          { color: 'rgb(248, 250, 252)', label: 'Nền Xám sáng' },
          { color: 'rgb(240, 249, 255)', label: 'Nền Xanh dương nhạt' },
          { color: 'rgb(236, 253, 245)', label: 'Nền Xanh lục nhạt' },
          { color: 'rgb(255, 251, 235)', label: 'Nền Vàng nhạt' },
        ],
      },
      mediaEmbed: {
        previewsInData: true,
      },
      image: {
        upload: { types: ['jpeg', 'png', 'gif', 'webp'] },
        toolbar: [
          'imageTextAlternative',
          'toggleImageCaption',
          '|',
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side',
          '|',
          'resizeImage',
        ],
        resizeOptions: [
          { name: 'resizeImage:original', value: null, label: 'Kích thước gốc (100%)' },
          { name: 'resizeImage:75', value: '75', label: '75% khung' },
          { name: 'resizeImage:50', value: '50', label: '50% khung' },
        ],
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          '|',
          'toggleTableCaption',
          'tableProperties',
          'tableCellProperties',
        ],
      },
      link: { addTargetToExternalLinks: true, defaultProtocol: 'https://' },
      htmlSupport: CIC_CKEDITOR_HTML_SUPPORT,
      placeholder,
    };
  }, [placeholder]);

  const insertReference = (attributes: CmsReferenceAttributes) => {
    const editor = editorRef.current;
    if (!editor) return;
    try {
      editor.model.change((writer) => {
        const reference = writer.createElement('cmsReference', attributes);
        editor.model.insertObject(reference, null, null, { setSelection: 'after' });
      });
      emitHtmlChange(editor.getData());
      editor.editing.view.focus();
    } catch (err) {
      console.warn('Error inserting reference widget:', err);
    }
  };

  const previewCta = activeCtas.find((item) => String(item.id) === selectedCtaId) || null;
  const previewForm = activeForms.find((item) => String(item.id) === selectedFormId) || null;
  const alignmentLabel: Record<CmsReferenceAlignment, string> = {
    left: 'Trái',
    center: 'Giữa',
    right: 'Phải',
    full: 'Toàn chiều rộng',
  };
  const previewAlignmentClass =
    referenceAlignment === 'left'
      ? 'mr-auto'
      : referenceAlignment === 'right'
        ? 'ml-auto'
        : referenceAlignment === 'center'
          ? 'mx-auto'
          : 'w-full';

  const insertCta = () => {
    if (!previewCta) return;
    insertReference({
      referenceType: 'cta',
      referenceId: String(previewCta.code || previewCta.id),
      label: previewCta.displayText,
      description: previewCta.adminName,
      alignment: referenceAlignment,
    });
    setSelectedCtaId('');
    setReferencePicker(null);
  };

  const insertForm = () => {
    if (!previewForm) return;
    insertReference({
      referenceType: 'form',
      referenceId: String(previewForm.code || previewForm.id),
      label: previewForm.title,
      description: previewForm.adminName,
      alignment: referenceAlignment,
    });
    setSelectedFormId('');
    setReferencePicker(null);
  };

  const stats = useMemo(() => {
    const plain = (value || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = plain ? plain.split(/\s+/).length : 0;
    const chars = plain.length;
    const readMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readMinutes };
  }, [value]);

  const effectiveMinHeight = isFullscreen ? 'calc(100dvh - 190px)' : minHeight;
  const effectiveMaxHeight = isFullscreen ? 'calc(100dvh - 190px)' : maxHeight;

  const containerClass = isFullscreen
    ? 'cms-ckeditor fixed inset-3 z-[9000] flex flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900'
    : 'cms-ckeditor overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900';

  const editorElement = (
    <div
      ref={wrapperRef}
      className={containerClass}
      style={
        {
          '--cms-editor-min-height': effectiveMinHeight,
          '--cms-editor-max-height': effectiveMaxHeight,
        } as React.CSSProperties
      }
    >
      <div className="min-h-0 flex-1">
        <CKEditor
          editor={ClassicEditor}
          config={config}
          data={initialHtmlRef.current}
          onReady={(editor) => {
            editorRef.current = editor;

            const sourceEditing = editor.plugins.has('SourceEditing')
              ? (editor.plugins.get('SourceEditing') as unknown as SourceEditingPluginLike)
              : null;

            if (sourceEditing) {
              let timer: ReturnType<typeof setTimeout> | null = null;
              sourceEditing.on('change:isSourceEditingMode', (_evt, _name, isSourceMode) => {
                cleanupSourceListenerRef.current?.();
                cleanupSourceListenerRef.current = null;
                if (timer) {
                  clearTimeout(timer);
                  timer = null;
                }

                if (isSourceMode) {
                  requestAnimationFrame(() => {
                    const textarea = wrapperRef.current?.querySelector<HTMLTextAreaElement>(
                      '.ck-source-editing-area textarea',
                    );
                    if (!textarea) return;
                    const onSourceInput = () => {
                      if (timer) clearTimeout(timer);
                      timer = setTimeout(() => {
                        emitHtmlChange(textarea.value);
                      }, 120);
                    };
                    const onSourceBlur = () => {
                      if (timer) {
                        clearTimeout(timer);
                        timer = null;
                      }
                      emitHtmlChange(textarea.value);
                      onBlurRef.current?.(textarea.value);
                    };
                    textarea.addEventListener('input', onSourceInput);
                    textarea.addEventListener('blur', onSourceBlur);
                    cleanupSourceListenerRef.current = () => {
                      if (timer) clearTimeout(timer);
                      textarea.removeEventListener('input', onSourceInput);
                      textarea.removeEventListener('blur', onSourceBlur);
                    };
                  });
                } else {
                  const currentRaw = editor.getData();
                  const upgraded = upgradeBareVideoIframesToMediaFigures(currentRaw);
                  if (upgraded !== currentRaw) {
                    editor.setData(upgraded);
                    emitHtmlChange(upgraded);
                  } else {
                    emitHtmlChange(currentRaw);
                  }
                }
              });
            }
          }}
          onChange={(_, editor) => {
            try {
              emitHtmlChange(editor.getData());
            } catch (err) {
              console.warn('CKEditor getData warning:', err);
            }
          }}
          onBlur={(_, editor) => onBlurRef.current?.(editor.getData())}
          onError={(error, details) => {
            console.warn('CKEditor runtime error captured:', error, details);
          }}
          onAfterDestroy={() => {
            cleanupSourceListenerRef.current?.();
            cleanupSourceListenerRef.current = null;
            editorRef.current = null;
          }}
        />
      </div>

      {(hasCtaEmbed || hasFormEmbed) && (
        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
          {hasCtaEmbed && (
            <button
              type="button"
              onClick={() => {
                setSelectedCtaId((current) => current || String(activeCtas[0]?.id ?? ''));
                setReferenceAlignment('center');
                setReferencePicker('cta');
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-700 cursor-pointer"
            >
              <Megaphone className="h-3.5 w-3.5" />
              Chèn CTA
            </button>
          )}
          {hasFormEmbed && (
            <button
              type="button"
              onClick={() => {
                setSelectedFormId((current) => current || String(activeForms[0]?.id ?? ''));
                setReferenceAlignment('full');
                setReferencePicker('form');
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 cursor-pointer"
            >
              <FileInput className="h-3.5 w-3.5" />
              Chèn Biểu mẫu
            </button>
          )}
        </div>
      )}

      {/* Status & Fullscreen Bar (robot-web pattern) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <span>
            <strong className="text-slate-800 dark:text-slate-200">{stats.words}</strong> từ
          </span>
          <span>•</span>
          <span>
            <strong className="text-slate-800 dark:text-slate-200">{stats.chars}</strong> ký tự
          </span>
          <span>•</span>
          <span>~{stats.readMinutes} phút đọc</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-slate-400 sm:inline">
            Hỗ trợ Kho Media · Video 16:9 · Nút <strong className="text-slate-700 dark:text-slate-300">Source</strong> sửa trực tiếp HTML
          </span>
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ khung soạn thảo' : 'Mở rộng toàn màn hình'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Thu nhỏ</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Toàn màn hình</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showMediaLibrary &&
        typeof document !== 'undefined' &&
        createPortal(
          <PageMediaPickerModal
            locale={effectiveLocale}
            currentId=""
            returnValue="url"
            onClose={() => setShowMediaLibrary(false)}
            onConfirm={(mediaUrl) => {
              if (mediaUrl) {
                insertHtmlSnippet(
                  `<figure class="image"><img src="${mediaUrl}" alt="Hình ảnh minh họa CIC" loading="lazy" decoding="async" /></figure>`,
                );
              }
              setShowMediaLibrary(false);
            }}
          />,
          document.body,
        )}

      <RichTextYoutubeModal
        open={showYoutubeModal}
        onClose={() => setShowYoutubeModal(false)}
        onInsertHtml={insertHtmlSnippet}
      />

      {referencePicker &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reference-preview-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setReferencePicker(null);
            }}
          >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Chọn từ Cơ sở dữ liệu &amp; xem trước
                  </p>
                  <h3 id="reference-preview-title" className="mt-1 text-lg font-bold dark:text-white">
                    {referencePicker === 'cta' ? 'Chèn nút CTA' : 'Chèn Biểu mẫu'}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Đóng"
                  onClick={() => setReferencePicker(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-5 p-5">
                {referencePicker === 'cta' ? (
                  <select
                    aria-label="Chọn CTA để xem trước"
                    value={selectedCtaId}
                    onChange={(event) => setSelectedCtaId(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                  >
                    <option value="">Chọn CTA đang hoạt động</option>
                    {activeCtas.map((cta) => (
                      <option key={cta.id} value={String(cta.id)}>
                        {cta.adminName} · {cta.displayText}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    aria-label="Chọn biểu mẫu để xem trước"
                    value={selectedFormId}
                    onChange={(event) => setSelectedFormId(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                  >
                    <option value="">Chọn biểu mẫu đang hoạt động</option>
                    {activeForms.map((form) => (
                      <option key={form.id} value={String(form.id)}>
                        {form.adminName} · {form.title}
                      </option>
                    ))}
                  </select>
                )}

                <div>
                  <p className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-200">Căn chỉnh hiển thị</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(['left', 'center', 'right', 'full'] as CmsReferenceAlignment[]).map((alignment) => (
                      <button
                        key={alignment}
                        type="button"
                        onClick={() => setReferenceAlignment(alignment)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          referenceAlignment === alignment
                            ? 'border-orange-600 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300'
                            : 'border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {alignmentLabel[alignment]}
                      </button>
                    ))}
                  </div>
                </div>

                {referencePicker === 'cta' && previewCta && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-800">
                    <div className={`${previewAlignmentClass} ${referenceAlignment === 'full' ? '' : 'w-fit'} text-center`}>
                      <p className="mb-4 text-xs font-bold text-slate-500">{previewCta.adminName}</p>
                      <button
                        type="button"
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold ${
                          referenceAlignment === 'full' ? 'w-full' : ''
                        } ${
                          previewCta.styleVariant === 'outline'
                            ? 'border border-orange-600 text-orange-600'
                            : previewCta.styleVariant === 'secondary'
                              ? 'bg-slate-800 text-white'
                              : 'bg-orange-600 text-white'
                        }`}
                      >
                        <Megaphone className="h-4 w-4" />
                        {previewCta.displayText}
                      </button>
                      {previewCta.description && (
                        <p className="mt-4 text-xs text-slate-500">{previewCta.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {referencePicker === 'form' && previewForm && (
                  <div
                    className={`${previewAlignmentClass} ${
                      referenceAlignment === 'full' ? '' : 'max-w-md'
                    } space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800`}
                  >
                    <div>
                      <h4 className="font-bold dark:text-white">{previewForm.title}</h4>
                      {previewForm.description && (
                        <p className="mt-1 text-xs text-slate-500">{previewForm.description}</p>
                      )}
                    </div>
                    {[...(previewForm.fields ?? [])]
                      .filter((field) => field.fieldType !== 'hidden')
                      .sort((a, b) => a.position - b.position)
                      .map((field) => (
                        <div key={field.id}>
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                            {field.label}
                            {field.isRequired && <span className="ml-1 text-red-500">*</span>}
                          </label>
                          {field.fieldType === 'textarea' ? (
                            <textarea
                              disabled
                              rows={3}
                              placeholder={field.placeholder}
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                            />
                          ) : (
                            <input
                              disabled
                              type="text"
                              placeholder={field.placeholder}
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                            />
                          )}
                        </div>
                      ))}
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white"
                    >
                      {previewForm.submitConfig?.submitButtonText || 'Gửi thông tin'}
                    </button>
                  </div>
                )}

                {((referencePicker === 'cta' && !previewCta) || (referencePicker === 'form' && !previewForm)) && (
                  <p className="rounded-xl bg-slate-100 p-6 text-center text-sm text-slate-500 dark:bg-slate-800">
                    Chưa có mục khả dụng để xem trước.
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setReferencePicker(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold dark:border-slate-600"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={referencePicker === 'cta' ? !previewCta : !previewForm}
                  onClick={() => (referencePicker === 'cta' ? insertCta() : insertForm())}
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                >
                  {referencePicker === 'cta' ? 'Chèn CTA này' : 'Chèn biểu mẫu này'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );

  if (isFullscreen && typeof document !== 'undefined' && document.body) {
    return (
      <>
        <div
          className="flex items-center justify-center rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 p-6 text-xs font-semibold text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300"
          style={{ minHeight }}
        >
          Đang mở trình soạn thảo ở chế độ Toàn màn hình (Nhấn Esc hoặc Thu nhỏ để quay lại)…
        </div>
        {createPortal(
          <div className="fixed inset-0 z-[8999] bg-slate-950/60 backdrop-blur-xs">
            {editorElement}
          </div>,
          document.body,
        )}
      </>
    );
  }

  return editorElement;
};

export default RichTextEditor;
