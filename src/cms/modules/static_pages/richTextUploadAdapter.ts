import type { Editor } from 'ckeditor5';

export const MEDIA_VIDEO_LIBRARY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.5 4A1.5 1.5 0 0 0 1 5.5v9A1.5 1.5 0 0 0 2.5 16h11a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 13.5 4h-11Zm0 1.5h11v6.38l-2.47-2.47a.75.75 0 0 0-1.06 0L7.5 11.88 5.78 10.16a.75.75 0 0 0-1.06 0L2.5 12.38V5.5Zm3 1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM16.2 6.4 19 4.75v10.5l-2.8-1.65V6.4Z"/></svg>';

export const YOUTUBE_EMBED_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18.3 5.7a2.3 2.3 0 0 0-1.6-1.6C15.3 3.7 10 3.7 10 3.7s-5.3 0-6.7.4A2.3 2.3 0 0 0 1.7 5.7C1.3 7.1 1.3 10 1.3 10s0 2.9.4 4.3a2.3 2.3 0 0 0 1.6 1.6c1.4.4 6.7.4 6.7.4s5.3 0 6.7-.4a2.3 2.3 0 0 0 1.6-1.6c.4-1.4.4-4.3.4-4.3s0-2.9-.4-4.3ZM8.2 12.6V7.4L12.8 10l-4.6 2.6Z"/></svg>';

export interface SourceEditingPluginLike {
  isSourceEditingMode: boolean;
  on: (
    event: string,
    cb: (_evt: unknown, _name: string, value: boolean) => void,
  ) => void;
}

interface CkFileLoader {
  file: Promise<File | null>;
}

/**
 * CKEditor 5 UploadAdapter -> POST /api/upload
 * Validates magic bytes, SVG sanitization, image dimensions, and 15MB limit on the backend.
 */
export class CustomUploadAdapter {
  private controller = new AbortController();

  constructor(
    private loader: CkFileLoader,
    private locale: 'vi' | 'en' = 'vi',
  ) {}

  async upload(): Promise<{ default: string }> {
    const file = await this.loader.file;
    if (!file) {
      throw new Error('Không tìm thấy tệp ảnh cần tải lên.');
    }
    const body = new FormData();
    body.append('upload', file);
    body.append('locale', this.locale);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body,
      credentials: 'same-origin',
      signal: this.controller.signal,
    });

    if (response.status === 413) {
      throw new Error('Dung lượng tệp vượt quá giới hạn cho phép của máy chủ (413 Payload Too Large).');
    }

    const payload = (await response.json().catch(() => null)) as {
      url?: string;
      default?: string;
      error?: { message?: string };
    } | null;

    if (!response.ok) {
      throw new Error(payload?.error?.message || `Tải ảnh thất bại (HTTP ${response.status}).`);
    }

    const url = payload?.url || payload?.default;
    if (!url) {
      throw new Error('API /api/upload không trả về đường dẫn ảnh.');
    }

    return { default: url };
  }

  abort(): void {
    this.controller.abort();
  }
}

export function createUploadAdapterPlugin(getLocale: () => 'vi' | 'en') {
  return function UploadAdapterPlugin(editor: Editor): void {
    const fileRepo = editor.plugins.get('FileRepository') as unknown as {
      createUploadAdapter: (loader: CkFileLoader) => CustomUploadAdapter;
    };
    fileRepo.createUploadAdapter = (loader: CkFileLoader) =>
      new CustomUploadAdapter(loader, getLocale());
  };
}
