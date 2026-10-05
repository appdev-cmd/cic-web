import React from 'react';
import { Search } from 'lucide-react';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import { inputClass, labelClass } from './productFormUtils';

export interface ProductSidebarSeoProps {
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoKeyword: string;
  setSeoKeyword: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  onAiSeo: () => Promise<void> | void;
  isTouched?: (fieldName: string) => boolean;
}

export const ProductSidebarSeo: React.FC<ProductSidebarSeoProps> = ({
  seoTitle,
  setSeoTitle,
  seoKeyword,
  setSeoKeyword,
  seoDescription,
  setSeoDescription,
  onAiSeo,
  isTouched,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black dark:text-white">
          <Search className="h-5 w-5 text-orange-600" />
          SEO
        </div>
        <AiMagicWand
          label="Tối ưu SEO"
          title="Tự động sinh bộ thẻ Title, Description, Keyword chuẩn Google"
          onTrigger={onAiSeo}
        />
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>SEO title</label>
          <input
            id="field-seo_title"
            className={`${inputClass} ${
              isTouched?.('seo_title') ? 'border-l-4 border-l-orange-500' : ''
            }`}
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>SEO keyword</label>
          <input
            className={inputClass}
            value={seoKeyword}
            onChange={(e) => setSeoKeyword(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>SEO description</label>
          <textarea
            id="field-seo_description"
            rows={4}
            className={`${inputClass} ${
              isTouched?.('seo_description') ? 'border-l-4 border-l-orange-500' : ''
            }`}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
