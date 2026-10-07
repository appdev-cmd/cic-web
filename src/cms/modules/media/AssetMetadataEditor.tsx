import React, { useState, useRef } from 'react';
import { Globe, Sparkles, RotateCcw, CheckCircle2, Info } from 'lucide-react';

import type { MediaAsset, MediaFolder } from './types';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import { generateMediaMetadataAction } from '@/features/ai-operator/server/shared-actions';

const plainInputClassName = 'min-h-11 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-xs';
const inputClassName = `${plainInputClassName} focus:ring-2 focus:ring-orange-500 focus:outline-none`;

interface AssetMetadataEditorProps {
  asset: MediaAsset;
  folders: readonly MediaFolder[];
  onChange: (asset: MediaAsset) => void;
  onShowToast?: (msg: string) => void;
}

export function AssetMetadataEditor({ asset, folders, onChange, onShowToast }: AssetMetadataEditorProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasAiFilled, setHasAiFilled] = useState(false);
  const previousStateRef = useRef<MediaAsset | null>(null);

  const patch = (values: Partial<MediaAsset>) => onChange({ ...asset, ...values });

  const currentFolder = folders.find((f) => f.id === asset.folder_id)?.name;

  // 1-Click All-in-One AI Co-pilot
  const handleAutoFillAllWithAi = async () => {
    try {
      setIsAiLoading(true);
      previousStateRef.current = { ...asset };

      const result = await generateMediaMetadataAction({
        filename: asset.filename,
        currentTitle: asset.title,
        folderName: currentFolder,
        mediaType: asset.type,
        locale: 'vi',
      });

      patch({
        title: result.title,
        alt_text: result.alt_text,
        caption: result.caption,
        description: result.description || asset.description,
        tags: Array.from(new Set([...asset.tags, ...result.tags])),
      });

      setHasAiFilled(true);
      if (onShowToast) {
        onShowToast('✦ AI Co-pilot đã tự động điền Tiêu đề, Alt Text chuẩn SEO & Thẻ Tags!');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err instanceof Error ? err.message : 'Không thể chạy AI Co-pilot.');
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUndoAi = () => {
    if (previousStateRef.current) {
      onChange(previousStateRef.current);
      previousStateRef.current = null;
      setHasAiFilled(false);
      if (onShowToast) {
        onShowToast('Đã hoàn tác dữ liệu về trạng thái ban đầu.');
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Smart Trigger Bar Co-pilot */}
      <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent p-4 dark:border-orange-900/60 dark:from-orange-950/40 dark:via-amber-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Trợ lý AI Co-pilot cho Media
                </span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tự động chuẩn hóa Tiêu đề, viết Alt Text chuẩn SEO (WCAG 2.2) và tạo Thẻ Tags chỉ với 1 cú click.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasAiFilled && (
              <button
                type="button"
                onClick={handleUndoAi}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" /> Hoàn tác
              </button>
            )}

            <button
              type="button"
              onClick={handleAutoFillAllWithAi}
              disabled={isAiLoading}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:from-orange-500 hover:to-amber-500 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {isAiLoading ? 'AI đang phân tích...' : 'Tự động điền với AI (1-Click)'}
            </button>
          </div>
        </div>

        {hasAiFilled && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>AI đã tối ưu xong dữ liệu! Bạn có thể chỉnh sửa thêm bên dưới hoặc bấm <strong>Lưu Metadata</strong>.</span>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tiêu đề hiển thị (Asset Title) *
            </label>
            <AiMagicWand
              label="AI tạo tên chuẩn"
              title="Dùng AI dọn sạch tên file vô nghĩa thành tiêu đề tiếng Việt tự nhiên"
              onTrigger={async () => {
                const res = await generateMediaMetadataAction({
                  filename: asset.filename,
                  currentTitle: asset.title,
                  folderName: currentFolder,
                  mediaType: asset.type,
                });
                patch({ title: res.title });
              }}
            />
          </div>
          <input
            type="text"
            value={asset.title}
            onChange={(event) => patch({ title: event.target.value })}
            className={`${inputClassName} font-medium`}
            placeholder="Ví dụ: Hội thảo Chuyển đổi số & Giải pháp BIM Autodesk"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Mô tả ghi chú (Internal Description)
          </label>
          <textarea
            rows={2}
            value={asset.description || ''}
            onChange={(event) => patch({ description: event.target.value })}
            placeholder="Ghi chú thêm về bối cảnh chụp hoặc mục đích sử dụng..."
            className={inputClassName}
          />
        </div>
      </div>

      {/* WCAG Alt Text & Caption Section */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Văn bản thay thế cho Trình đọc màn hình & SEO (Alt Text)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">WCAG 2.2 AA Standard</span>
            <AiMagicWand
              label="AI viết Alt Text"
              title="Dùng AI viết mô tả nội dung hình ảnh chuẩn SEO & tiếp cận"
              onTrigger={async () => {
                const res = await generateMediaMetadataAction({
                  filename: asset.filename,
                  currentTitle: asset.title,
                  folderName: currentFolder,
                  mediaType: asset.type,
                });
                patch({ alt_text: res.alt_text });
              }}
            />
          </div>
        </div>

        <input
          type="text"
          value={asset.alt_text}
          onChange={(event) => patch({ alt_text: event.target.value })}
          placeholder="Mô tả súc tích nội dung hình ảnh (Ví dụ: Chuyên gia CIC thuyết trình về phần mềm BIM)"
          className={inputClassName}
        />

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Chú thích hiển thị (Caption)
          </label>
          <input
            type="text"
            value={asset.caption || ''}
            onChange={(event) => patch({ caption: event.target.value })}
            placeholder="Dòng chữ chú thích hiển thị dưới chân ảnh khi chèn vào bài viết..."
            className={inputClassName}
          />
        </div>
      </div>

      {/* Copyright & Folder */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Tác giả / Nguồn ảnh (Credit)
          </label>
          <input
            type="text"
            value={asset.credit_author || ''}
            onChange={(event) => patch({ credit_author: event.target.value })}
            placeholder="Ví dụ: Phòng Marketing CIC / Shutterstock"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Bản quyền & License
          </label>
          <select
            value={asset.license_type || 'internal'}
            onChange={(event) => patch({ license_type: event.target.value as MediaAsset['license_type'] })}
            className={inputClassName}
          >
            <option value="internal">Sở hữu nội bộ (Internal Corporate)</option>
            <option value="purchased">Bản quyền mua (Stock License)</option>
            <option value="cc_by">Creative Commons (CC-BY)</option>
            <option value="editorial">Dùng riêng cho báo chí (Editorial Only)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Ngày hết hạn bản quyền
          </label>
          <input
            type="date"
            value={asset.license_expiry?.slice(0, 10) || ''}
            onChange={(event) => patch({ license_expiry: event.target.value || undefined })}
            className={plainInputClassName}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Thư mục phân loại
          </label>
          <select
            value={asset.folder_id}
            onChange={(event) =>
              patch({
                folder_id: event.target.value,
                folder_name: folders.find((folder) => folder.id === event.target.value)?.name || 'Chưa phân loại',
              })
            }
            className={plainInputClassName}
          >
            <option value="">Chưa phân loại</option>
            {folders
              .filter((folder) => folder.id !== 'f_all')
              .map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Thẻ tìm kiếm (Tags - phân cách bằng dấu phẩy)
          </label>
          <AiMagicWand
            label="AI gợi ý tags"
            onTrigger={async () => {
              const res = await generateMediaMetadataAction({
                filename: asset.filename,
                currentTitle: asset.title,
                folderName: currentFolder,
                mediaType: asset.type,
              });
              patch({ tags: Array.from(new Set([...asset.tags, ...res.tags])) });
            }}
          />
        </div>
        <input
          type="text"
          value={asset.tags.join(', ')}
          onChange={(event) =>
            patch({
              tags: event.target.value
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean),
            })
          }
          placeholder="Ví dụ: bim, autodesk, hoi-thao, phan-mem"
          className={plainInputClassName}
        />
      </div>
    </div>
  );
}
