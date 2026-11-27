import React, { useEffect, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Palette,
  RotateCcw,
  Underline,
} from 'lucide-react';
import type { CanvasFormatState, FormatCommandInput } from './canvasTextFormatter';

interface PageBuilderFormatControlsProps {
  formatState: CanvasFormatState;
  onApplyFormat: (command: FormatCommandInput) => void;
}

const FONT_WEIGHT_OPTIONS = [
  { value: '', label: 'Độ đậm' },
  { value: '400', label: '400 Thường' },
  { value: '500', label: '500 Vừa' },
  { value: '600', label: '600 Hơi đậm' },
  { value: '700', label: '700 Đậm' },
  { value: '800', label: '800 Rất đậm' },
  { value: '900', label: '900 Đậm đặc' },
];

const BRAND_SWATCHES = [
  { color: '#ea580c', label: 'Cam CIC (#ea580c)' },
  { color: '#0f172a', label: 'Xanh than (#0f172a)' },
  { color: '#1d4ed8', label: 'Xanh kỹ thuật (#1d4ed8)' },
  { color: '#059669', label: 'Xanh bền vững (#059669)' },
  { color: '#ffffff', label: 'Trắng (#ffffff)' },
];

export const PageBuilderFormatControls: React.FC<PageBuilderFormatControlsProps> = ({
  formatState,
  onApplyFormat,
}) => {
  const [colorTarget, setColorTarget] = useState<'static' | 'hover'>('static');
  const [sizeInput, setSizeInput] = useState<string>(formatState.fontSize || '');
  const disabled = !formatState.canFormat;

  useEffect(() => {
    setSizeInput(formatState.fontSize || '');
  }, [formatState.fontSize]);

  const keepSelection = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const commitFontSize = (raw: string) => {
    if (disabled) return;
    const trimmed = raw.trim();
    if (!trimmed) {
      onApplyFormat({ fontSize: null });
      return;
    }
    const parsed = Math.max(10, Math.min(120, Math.round(Number(trimmed))));
    if (Number.isFinite(parsed)) {
      setSizeInput(String(parsed));
      onApplyFormat({ fontSize: parsed });
    }
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
    <div className="flex items-center gap-1">
      {/* B / I / U */}
      <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => onApplyFormat({ bold: !formatState.bold })}
          title="In đậm (Bold)"
          className={`rounded p-1 transition cursor-pointer ${
            formatState.bold
              ? 'bg-orange-600 text-white'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
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
          className={`rounded p-1 transition cursor-pointer ${
            formatState.italic
              ? 'bg-orange-600 text-white'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
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
          className={`rounded p-1 transition cursor-pointer ${
            formatState.underline
              ? 'bg-orange-600 text-white'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
          } disabled:cursor-not-allowed disabled:opacity-35`}
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Numeric Font Size (Cỡ [px]) like robot-web */}
      <div
        className={`flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] dark:border-slate-700 dark:bg-slate-900 ${
          disabled ? 'opacity-40' : ''
        }`}
        title="Cỡ chữ (px) — nhập số rồi nhấn Enter"
      >
        <span className="hidden 2xl:inline text-[10px] font-semibold text-slate-400">Cỡ</span>
        <input
          id="pb-font-size-px"
          name="pbFontSizePx"
          type="number"
          min={10}
          max={120}
          disabled={disabled}
          value={sizeInput}
          placeholder="--"
          onChange={(e) => setSizeInput(e.target.value)}
          onBlur={(e) => commitFontSize(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitFontSize((e.target as HTMLInputElement).value);
            }
          }}
          className="w-9 bg-transparent text-center text-[11px] font-bold text-slate-800 outline-none disabled:cursor-not-allowed dark:text-slate-100"
        />
        <span className="text-[10px] text-slate-400">px</span>
      </div>

      {/* Compact Font Weight */}
      <select
        id="pb-font-weight"
        name="pbFontWeight"
        aria-label="Độ đậm chữ"
        disabled={disabled}
        value={FONT_WEIGHT_OPTIONS.some((o) => o.value === formatState.fontWeight) ? formatState.fontWeight : ''}
        onChange={(e) => onApplyFormat({ fontWeight: e.target.value || null })}
        title="Độ đậm chữ"
        className="hidden xl:block h-7 rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] font-semibold text-slate-700 outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {FONT_WEIGHT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Color / Hover Swatches */}
      <div className="hidden md:flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => setColorTarget((curr) => (curr === 'static' ? 'hover' : 'static'))}
          title="Chuyển giữa chỉnh Màu chữ tĩnh và Màu khi rê chuột (Hover)"
          className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold transition cursor-pointer ${
            colorTarget === 'hover'
              ? 'bg-orange-600 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {colorTarget === 'hover' ? 'Hover' : 'Màu'}
        </button>

        {BRAND_SWATCHES.map((swatch) => (
          <button
            key={swatch.color}
            type="button"
            disabled={disabled}
            onMouseDown={keepSelection}
            onClick={() => applyColor(swatch.color)}
            title={`${colorTarget === 'hover' ? 'Màu Hover' : 'Màu chữ'}: ${swatch.label}`}
            className="h-3.5 w-3.5 rounded-full border border-slate-300 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-35 dark:border-slate-600 cursor-pointer"
            style={{ backgroundColor: swatch.color }}
          />
        ))}

        <label
          title="Chọn mã màu tùy chỉnh"
          className={`relative flex h-4 w-4 items-center justify-center rounded border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 ${
            disabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer hover:border-orange-400'
          }`}
        >
          <Palette className="h-2.5 w-2.5 text-slate-600 dark:text-slate-300" />
          <input
            id="pb-custom-color"
            name="pbCustomColor"
            type="color"
            disabled={disabled}
            value={colorTarget === 'hover' ? formatState.hoverColor : formatState.color}
            onChange={(e) => applyColor(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      {/* Alignment & Reset Format */}
      <div className="hidden lg:flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
        {(
          [
            ['left', AlignLeft, 'Căn trái'],
            ['center', AlignCenter, 'Căn giữa'],
            ['right', AlignRight, 'Căn phải'],
          ] as const
        ).map(([align, Icon, label]) => (
          <button
            key={align}
            type="button"
            disabled={disabled}
            onMouseDown={keepSelection}
            onClick={() => onApplyFormat({ textAlign: formatState.textAlign === align ? '' : align })}
            title={label}
            className={`rounded p-1 transition cursor-pointer ${
              formatState.textAlign === align
                ? 'bg-orange-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
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
          title="Xóa định dạng chữ tùy chỉnh (về mặc định)"
          className="rounded p-1 text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-35 dark:text-rose-400 dark:hover:bg-rose-950/40 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
