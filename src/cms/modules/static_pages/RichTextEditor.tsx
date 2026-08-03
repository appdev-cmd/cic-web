import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  Type,
  Quote,
  Table,
  Check,
  RotateCcw,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = '280px',
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const editorRef = useRef<HTMLDivElement>(null);

  // Helper to execute command or wrap selected text / insert html snippet
  const insertFormatting = (tagStart: string, tagEnd: string = '', defaultText: string = '') => {
    if (activeTab === 'code' || activeTab === 'visual') {
      const textarea = document.getElementById('raw-html-textarea') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const selected = textarea.value.substring(start, end) || defaultText;
        const replacement = `${tagStart}${selected}${tagEnd}`;
        const newValue =
          textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        onChange(newValue);
      } else {
        // Fallback or append
        onChange(`${value}\n${tagStart}${defaultText}${tagEnd}`);
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
    if (url) {
      insertFormatting(`<a href="${url}" target="_blank" class="text-orange-600 underline">`, '</a>', 'Liên kết');
    }
  };

  const insertImage = () => {
    const url = prompt('Nhập đường dẫn ảnh (Image URL):', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800');
    if (url) {
      const alt = prompt('Nhập mô tả ảnh (Alt text):', 'Ảnh minh họa');
      insertFormatting(`<img src="${url}" alt="${alt || 'image'}" class="my-4 rounded-xl max-w-full shadow-md" />\n`);
    }
  };

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs transition-all focus-within:border-orange-500 dark:focus-within:border-orange-500">
      {/* Toolbar Header */}
      <div className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap items-center justify-between gap-2">
        {/* Formatting Buttons */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            type="button"
            onClick={() => insertFormatting('<strong>', '</strong>', 'Văn bản in đậm')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="In đậm (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<em>', '</em>', 'Văn bản in nghiêng')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="In nghiêng (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<u>', '</u>', 'Văn bản gạch chân')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Gạch chân (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<s>', '</s>', 'Văn bản gạch ngang')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Gạch ngang (Strikethrough)"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => insertFormatting('<h2>', '</h2>', 'Tiêu đề lớn (H2)')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Tiêu đề H2"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<h3>', '</h3>', 'Tiêu đề vừa (H3)')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Tiêu đề H3"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<h4>', '</h4>', 'Tiêu đề nhỏ (H4)')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Tiêu đề H4"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n  <li>Mục thứ 2</li>\n</ul>', 'Mục danh sách')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Danh sách không thứ tự (Unordered List)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n  <li>Bước thứ 2</li>\n</ol>', 'Bước 1')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Danh sách có thứ tự (Ordered List)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<blockquote class="border-l-4 border-orange-500 pl-4 py-1 italic text-slate-600 dark:text-slate-300">\n', '\n</blockquote>', 'Trích dẫn đoạn văn...')}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Khối trích dẫn (Blockquote)"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={insertLink}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Chèn liên kết (Link)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 transition-colors"
            title="Chèn hình ảnh (Image)"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Soạn thảo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mã HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước</span>
          </button>
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="p-3">
        {activeTab === 'preview' ? (
          <div
            className="prose dark:prose-invert max-w-none p-3 min-h-[280px] bg-slate-50/50 dark:bg-slate-950/50 rounded-lg text-sm text-slate-800 dark:text-slate-200 overflow-y-auto leading-relaxed border border-dashed border-slate-200 dark:border-slate-800"
            dangerouslySetInnerHTML={{ __html: value || '<p className="text-slate-400 italic">Chưa có nội dung để xem trước...</p>' }}
          />
        ) : (
          <textarea
            id="raw-html-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            placeholder="Nhập nội dung bài viết/trang tĩnh tại đây... Bạn có thể gõ định dạng HTML hoặc sử dụng các công cụ định dạng phía trên."
            className="w-full p-3 font-mono text-xs sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-y leading-relaxed"
          />
        )}
      </div>

      {/* Editor Footer Status Bar */}
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Đã gõ: {value.length} ký tự ({value.trim().split(/\s+/).filter(Boolean).length} từ)</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium flex items-center gap-1">
          <Check className="w-3 h-3" />
          Trình soạn thảo HTML đã sẵn sàng
        </span>
      </div>
    </div>
  );
};
