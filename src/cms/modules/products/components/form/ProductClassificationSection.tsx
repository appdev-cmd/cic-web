import React from 'react';
import { Package } from 'lucide-react';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import { SearchableMultiSelect, SearchableSelect } from '@/cms/components/SearchableSelect';
import type { MasterApplicationItem, MasterProductTypeItem } from '@/cms/modules/product_settings/types';
import type { CmsProductListItem } from '../../types';
import { inputClass, labelClass } from './productFormUtils';

export interface ProductClassificationSectionProps {
  alias: string;
  setAlias: (val: string) => void;
  setManualAlias: (val: boolean) => void;
  code: string;
  setCode: (val: string) => void;
  otherLanguages1: string;
  setOtherLanguages1: (val: string) => void;
  types: string;
  setTypes: (val: string) => void;
  applications: string[];
  setApplications: (val: string[]) => void;
  productsRelates: string[];
  setProductsRelates: (val: string[]) => void;
  productTypes: MasterProductTypeItem[];
  applicationOptions: MasterApplicationItem[];
  relatedProducts: CmsProductListItem[];
  currentProductId?: string;
  onAiSection2: () => Promise<void> | void;
}

export const ProductClassificationSection: React.FC<ProductClassificationSectionProps> = ({
  alias,
  setAlias,
  setManualAlias,
  code,
  setCode,
  otherLanguages1,
  setOtherLanguages1,
  types,
  setTypes,
  applications,
  setApplications,
  productsRelates,
  setProductsRelates,
  productTypes,
  applicationOptions,
  relatedProducts,
  currentProductId,
  onAiSection2,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 font-black dark:text-white">
          <Package className="h-5 w-5 text-orange-600" />
          2. Phân loại & Định danh kỹ thuật
        </div>
        <AiMagicWand
          label="Nhận diện kỹ thuật"
          title="Tự động nhận diện Mã SKU, URL Tiếng Anh, Loại phần mềm & Sản phẩm liên quan"
          onTrigger={onAiSection2}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="field-alias">Alias (Đường dẫn tĩnh)</label>
          <input
            id="field-alias"
            name="alias"
            className={inputClass}
            value={alias}
            onChange={(e) => {
              setManualAlias(true);
              setAlias(e.target.value);
            }}
          />
        </div>
        <div>
          <label className={labelClass}>Biệt danh / Mã sản phẩm</label>
          <input
            className={inputClass}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>URL ngôn ngữ khác (Tiếng Anh)</label>
          <input
            className={inputClass}
            value={otherLanguages1}
            onChange={(e) => setOtherLanguages1(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Loại sản phẩm</label>
          <SearchableSelect
            options={productTypes
              .filter((item) => item.status === 'active')
              .map((item) => ({ id: item.id, label: item.name }))}
            selectedId={types}
            onChange={setTypes}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Ứng dụng</label>
          <SearchableMultiSelect
            options={applicationOptions
              .filter((item) => item.status === 'active')
              .map((item) => ({ id: item.id, label: item.name }))}
            selectedIds={applications}
            onChange={setApplications}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Sản phẩm liên quan</label>
          <SearchableMultiSelect
            options={relatedProducts
              .filter((item) => item.id !== currentProductId)
              .map((item) => ({ id: item.id, label: item.name || item.title }))}
            selectedIds={productsRelates}
            onChange={setProductsRelates}
          />
        </div>
      </div>
    </section>
  );
};
