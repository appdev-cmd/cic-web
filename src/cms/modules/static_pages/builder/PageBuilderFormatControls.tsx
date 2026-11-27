import React, { useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Eraser, Italic, Palette, Type, Underline } from 'lucide-react';
import type { CanvasFormatState, FormatCommandInput } from './canvasTextFormatter';

interface PageBuilderFormatControlsProps {
  formatState: CanvasFormatState;
  onApplyFormat: (command: FormatCommandInput) => void;
}

const FONT_SIZE_OPTIONS = [
  { value: '', label: 'Cỡ mặc định' },
  { value: '14', label: '14 px' },
  { value: '16', label: '16 px' },
  { value: '18', label: '18 px' },
  { value: '20', label: '20 px' },
  { value: '24', label: '24 px' },
  { value: '28', label: '28 px' },
  { value: '32', label: '32 px' },
  { value: '36', label: '36 px' },
  { value: '42', label: '42 px' },
  { value: '48', label: '48 px' },
  { value: '56', label: '56 px' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: '', label: 'Độ đậm' },
  { value: '400', label: 'Thường (400)' },
  { value: '500', label: 'Vừa (500)' },
  { value: '600', label: 'Hơi đậm (600)' },
  { value: '700', label: 'Đậm (700)' },
  { value: '800', label: 'Rất đậm (800)' },
  { value: '900', label: 'Đậm đặc (900)' },
];

const BRAND_SWATCHES = [
  { color: '#ea580c', label: 'Cam CIC (#ea580c)' },
  { color: '#0f172a', label: 'Xanh than đậm (#0f172a)' },
  { color: '#1d4ed8', label: 'Xanh kỹ thuật (#1d4ed8)' },
  { color: '#059669', label: 'Xanh bền vững (#059669)' },
  { color: '#ffffff', label: 'Trắng (#ffffff)' },
  { color: '#cbd5e1', label: 'Xám sáng (#cbd5e1)' },
];

export const PageBuilderFormatControls: React.FC<PageBuilderFormatControlsProps> = ({
  formatState,
  onApplyFormat,
}) => {
  const [colorTarget, setColorTarget] = useState<'static' | 'hover'>('static');
  const disabled = !formatState.canFormat;

  const keepSelection = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const applyColor = (hex: string) => {
    if (disabled) return;
    if (colorTarget === 'hover') {
      onApplyFormat({ hoverColor: hex });
    } else {
      onApplyFormat({ color: hex });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {!formatState.canFormat && (
        <span className="hidden 2xl:inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Type className="h-3 w-3 text-orange-500" />
          Nhấp vào tiêu đề/mô tả để format chữ
        </span>
      )}

      {/* B / I / U */}
      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => onApplyFormat({ bold: !formatState.bold })}
          title="In đậm (Bold)"
          className={`rounded-md p-1.5 transition ${
            formatState.bold
              ? 'bg-orange-600 text-white'
              : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700'
          } disabled:cursor-not-allowed disabled:opacity-35`}
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => onApplyFormat({ italic: !formatState.italic })}
          title="In nghiêng (Italic)"
          className={`rounded-md p-1.5 transition ${
            formatState.italic
              ? 'bg-orange-600 text-white'
              : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700'
          } disabled:cursor-not-allowed disabled:opacity-35`}
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => onApplyFormat({ underline: !formatState.underline })}
          title="Gạch chân (Underline)"
          className={`rounded-md p-1.5 transition ${
            formatState.underline
              ? 'bg-orange-600 text-white'
              : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700'
          } disabled:cursor-not-allowed disabled:opacity-35`}
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Font Size & Weight */}
      <select
        disabled={disabled}
        value={FONT_SIZE_OPTIONS.some((o) => o.value === formatState.fontSize) ? formatState.fontSize : ''}
        onChange={(e) => onApplyFormat({ fontSize: e.target.value ? Number(e.target.value) : null })}
        title="Cỡ chữ (px)"
        className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {FONT_SIZE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        disabled={disabled}
        value={FONT_WEIGHT_OPTIONS.some((o) => o.value === formatState.fontWeight) ? formatState.fontWeight : ''}
        onChange={(e) => onApplyFormat({ fontWeight: e.target.value || null })}
        title="Độ đậm chữ"
        className="hidden xl:block h-7 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {FONT_WEIGHT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Color Swatches + Static/Hover Toggle */}
      <div className="hidden md:flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5 dark:border-slate-700 dark:bg-slate-800">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => setColorTarget((curr) => (curr === 'static' ? 'hover' : 'static'))}
          title="Chuyển đổi giữa chỉnh Màu chữ tĩnh và Màu khi rê chuột (Hover)"
          className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase transition ${
            colorTarget === 'hover'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-slate-600 shadow-2xs dark:bg-slate-900 dark:text-slate-300'
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {colorTarget === 'hover' ? 'Màu Hover' : 'Màu chữ'}
        </button>

        {BRAND_SWATCHES.map((swatch) => (
          <button
            key={swatch.color}
            type="button"
            disabled={disabled}
            onMouseDown={keepSelection}
            onClick={() => applyColor(swatch.color)}
            title={`${colorTarget === 'hover' ? 'Màu Hover' : 'Màu chữ'}: ${swatch.label}`}
            className="h-4 w-4 rounded-full border border-slate-300 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-600"
            style={{ backgroundColor: swatch.color }}
          />
        ))}

        <label
          title="Chọn mã màu tùy chỉnh"
          className={`relative flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 ${
            disabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer hover:border-orange-400'
          }`}
        >
          <Palette className="h-3 w-3 text-slate-600 dark:text-slate-300" />
          <input
            type="color"
            disabled={disabled}
            value={colorTarget === 'hover' ? formatState.hoverColor : formatState.color}
            onChange={(e) => applyColor(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      {/* Alignment & Clear */}
      <div className="hidden lg:flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
        {([
          ['left', AlignLeft, 'Căn trái'],
          ['center', AlignCenter, 'Căn giữa'],
          ['right', AlignRight, 'Căn phải'],
        ] as const).map(([align, Icon, label]) => (
          <button
            key={align}
            type="button"
            disabled={disabled}
            onMouseDown={keepSelection}
            onClick={() => onApplyFormat({ textAlign: formatState.textAlign === align ? '' : align })}
            title={label}
            className={`rounded-md p-1.5 transition ${
              formatState.textAlign === align
                ? 'bg-orange-600 text-white'
                : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
            } disabled:cursor-not-allowed disabled:opacity-35`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => onApplyFormat({ clearFormat: true })}
          title="Xóa toàn bộ định dạng chữ tùy chỉnh"
          className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-35 dark:text-rose-400 dark:hover:bg-rose-950/40"
        >
          <Eraser className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
