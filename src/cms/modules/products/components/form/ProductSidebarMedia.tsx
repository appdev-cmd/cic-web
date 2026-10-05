import React from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import { findPageBuilderImage } from '@/cms/modules/static_pages/PageMediaPickerModal';
import { inputClass, labelClass } from './productFormUtils';

export interface ProductSidebarMediaProps {
  image: string;
  setImage: (val: string) => void;
  icon: string;
  setIcon: (val: string) => void;
  gallery: string[];
  setGallery: React.Dispatch<React.SetStateAction<string[]>>;
  tagsText: string;
  setTagsText: (val: string) => void;
  onSelectMedia: (target: 'image' | 'icon' | 'gallery_add') => void;
  onAiTags: () => Promise<void> | void;
}

export const ProductSidebarMedia: React.FC<ProductSidebarMediaProps> = ({
  image,
  setImage,
  icon,
  setIcon,
  gallery,
  setGallery,
  tagsText,
  setTagsText,
  onSelectMedia,
  onAiTags,
}) => {
  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
        <ImageIcon className="h-5 w-5 text-orange-600" />
        Media
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Ảnh đại diện</label>
          {image && (
            <img
              src={findPageBuilderImage(image)?.thumbnail_url ?? findPageBuilderImage(image)?.url ?? image}
              alt=""
              className="mb-2 aspect-video w-full rounded-xl object-cover"
            />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSelectMedia('image')}
              className="flex-1 rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30 cursor-pointer"
            >
              Chọn hoặc tải ảnh
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage('')}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Ảnh Slide / Slider Gallery */}
        <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>
              Ảnh slide (Slider)
              {gallery.length > 0 && (
                <span className="ml-1.5 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                  {gallery.length} ảnh
                </span>
              )}
            </label>
          </div>
          <p className="mb-2 text-[11px] text-slate-500 dark:text-slate-400">
            Các hình ảnh hiển thị trình chiếu (slider) trên trang chi tiết sản phẩm.
          </p>

          {gallery.length > 0 && (
            <div className="mb-2.5 grid grid-cols-3 gap-2">
              {gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
                >
                  <img
                    src={findPageBuilderImage(imgUrl)?.thumbnail_url ?? findPageBuilderImage(imgUrl)?.url ?? imgUrl}
                    alt={`Slide ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="rounded-full bg-red-600 p-1 text-white hover:bg-red-700 cursor-pointer"
                      title="Xóa ảnh khỏi slide"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => onSelectMedia('gallery_add')}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-orange-300 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Thêm ảnh vào slide
          </button>
        </div>

        <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
          <label className={labelClass}>Icon sản phẩm</label>
          {icon && (
            <img
              src={findPageBuilderImage(icon)?.thumbnail_url ?? findPageBuilderImage(icon)?.url ?? icon}
              alt=""
              className="mb-2 h-16 w-16 rounded-xl object-contain"
            />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSelectMedia('icon')}
              className="flex-1 rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30 cursor-pointer"
            >
              Chọn hoặc tải icon
            </button>
            {icon && (
              <button
                type="button"
                onClick={() => setIcon('')}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>Tags</label>
            <AiMagicWand
              label="Gợi ý Tags"
              title="Tự động bóc tách từ khóa kỹ thuật"
              onTrigger={onAiTags}
            />
          </div>
          <textarea
            rows={3}
            className={inputClass}
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="VD: SAP2000, Phần mềm kết cấu, CSI Vietnam..."
          />
        </div>
      </div>
    </section>
  );
};
