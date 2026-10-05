import React from 'react';
import { Package, Sparkles } from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import { SearchableMultiSelect, SearchableSelect } from '@/cms/components/SearchableSelect';
import type { ProductBrand, ProductCategory } from '../../types';
import { inputClass, labelClass } from './productFormUtils';

export interface ProductBasicSectionProps {
  name: string;
  setName: (name: string) => void;
  manufactory: string;
  setManufactory: (manufactory: string) => void;
  categoryIds: string[];
  setCategoryIds: (ids: string[]) => void;
  brands: ProductBrand[];
  categories: ProductCategory[];
  isAnchorsReady: boolean;
  isAutoFilling: boolean;
  onSmartAutoFill: () => void;
}

export const ProductBasicSection: React.FC<ProductBasicSectionProps> = ({
  name,
  setName,
  manufactory,
  setManufactory,
  categoryIds,
  setCategoryIds,
  brands,
  categories,
  isAnchorsReady,
  isAutoFilling,
  onSmartAutoFill,
}) => {
  return (
    <>
      {/* Section 1: Thông tin cốt lõi (Anchors) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-black dark:text-white">
            <Package className="h-5 w-5 text-orange-600" />
            1. Thông tin cơ bản
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Thông tin bắt buộc (*)
          </span>
        </div>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          Nhập tên sản phẩm, hãng sản xuất và lĩnh vực chuyên ngành để làm căn cứ nhận diện.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="field-name">Tên sản phẩm *</label>
            <input
              id="field-name"
              name="name"
              className={inputClass}
              placeholder="VD: SAP2000, Kompas-3D, PTV Vissim..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div id="field-manufactory">
            <label className={labelClass}>Hãng sản xuất *</label>
            <SearchableSelect
              options={brands.map((b) => ({ id: b.id, label: b.name }))}
              selectedId={manufactory}
              onChange={setManufactory}
              placeholder="Chọn hãng sản xuất..."
            />
          </div>
          <div id="field-category_ids">
            <label className={labelClass}>Lĩnh vực chính *</label>
            <SearchableMultiSelect
              options={categories.map((c) => ({ id: c.id, label: c.name }))}
              selectedIds={categoryIds}
              onChange={setCategoryIds}
              placeholder="Chọn các lĩnh vực liên quan..."
            />
          </div>
        </div>
      </section>

      {/* Thanh hỗ trợ điền nhanh */}
      <div
        className={`rounded-2xl border p-4 transition-all duration-200 ${
          isAnchorsReady
            ? 'border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs'
            : 'border-slate-200/60 bg-slate-50/40 dark:border-slate-800/50 dark:bg-slate-900/30'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center gap-2">
              <Sparkles
                className={`w-4 h-4 ${
                  isAnchorsReady ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'
                }`}
              />
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {isAnchorsReady
                  ? 'Gợi ý tự động: Có thể hỗ trợ điền nhanh thông tin kỹ thuật, SEO và thẻ tags.'
                  : 'Hỗ trợ điền nhanh (Nhập Tên, Hãng và Lĩnh vực ở trên để kích hoạt)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAnchorsReady
                ? 'Chỉ bổ sung các trường còn trống, tuyệt đối không can thiệp vào bài viết hay hình ảnh của bạn.'
                : `Trạng thái: ${
                    [
                      Boolean(name.trim()) && 'Tên',
                      Boolean(manufactory) && 'Hãng',
                      categoryIds.length > 0 && 'Lĩnh vực',
                    ].filter(Boolean).length
                  }/3 trường bắt buộc.`}
            </p>
          </div>
          <CmsButton
            variant={isAnchorsReady ? 'primary' : 'secondary'}
            size="sm"
            disabled={!isAnchorsReady || isAutoFilling}
            loading={isAutoFilling}
            loadingText="Đang phân tích & điền..."
            onClick={onSmartAutoFill}
            leadingIcon={<Sparkles className="h-4 w-4" />}
          >
            Gợi ý điền nhanh
          </CmsButton>
        </div>
      </div>
    </>
  );
};
