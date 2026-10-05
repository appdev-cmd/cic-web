import React from 'react';
import { Star } from 'lucide-react';
import { FEATURED_CONTENT_LIMITS } from '@/cms/modules/featuredContentPolicy';
import { inputClass, labelClass } from './productFormUtils';

export interface ProductSidebarSettingsProps {
  priceOld: string;
  setPriceOld: (val: string) => void;
  isHot: boolean;
  setIsHot: (val: boolean) => void;
  ordering: number;
  setOrdering: (val: number) => void;
  featuredCount: number;
  isTouched?: (fieldName: string) => boolean;
}

export const ProductSidebarSettings: React.FC<ProductSidebarSettingsProps> = ({
  priceOld,
  setPriceOld,
  isHot,
  setIsHot,
  ordering,
  setOrdering,
  featuredCount,
  isTouched,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
        <Star className="h-5 w-5 text-orange-600" />
        Hiển thị
      </div>
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass}>Giá bán</label>
            {priceOld.trim() !== 'Liên hệ' && (
              <button
                type="button"
                onClick={() => setPriceOld('Liên hệ')}
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline dark:text-orange-400 cursor-pointer"
              >
                Đặt lại &quot;Liên hệ&quot;
              </button>
            )}
          </div>
          <input
            id="field-price"
            className={`${inputClass} ${
              isTouched?.('price') ? 'border-l-4 border-l-orange-500' : ''
            }`}
            placeholder="VD: Liên hệ (mặc định), 15.000.000 VNĐ, Báo giá theo license..."
            value={priceOld}
            onChange={(e) => setPriceOld(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Mặc định là <span className="font-semibold text-slate-700 dark:text-slate-300">Liên hệ</span>. Nếu có mức giá cụ thể, bạn có thể chỉnh sửa tại đây.
          </p>
        </div>
        <label className="flex items-start justify-between gap-4 text-sm font-semibold dark:text-slate-200 cursor-pointer">
          <span>
            Sản phẩm nổi bật{' '}
            <span className="font-normal text-slate-400">
              ({featuredCount + Number(isHot)}/{FEATURED_CONTENT_LIMITS.product})
            </span>
            <span className="mt-0.5 block text-[11px] font-normal text-slate-500">
              Dự phòng cho section Sản phẩm trong tương lai; không dùng cho Hệ sinh thái Công nghệ CIC.
            </span>
          </span>
          <input
            type="checkbox"
            checked={isHot}
            disabled={!isHot && featuredCount >= FEATURED_CONTENT_LIMITS.product}
            onChange={(e) => setIsHot(e.target.checked)}
            className="h-4 w-4 rounded text-orange-600 cursor-pointer"
          />
        </label>
        <div>
          <label className={labelClass}>Thứ tự</label>
          <input
            type="number"
            className={inputClass}
            value={ordering}
            onChange={(e) => setOrdering(Number(e.target.value))}
          />
        </div>
      </div>
    </section>
  );
};
