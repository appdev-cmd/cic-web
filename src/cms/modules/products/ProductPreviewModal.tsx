import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import type { Product } from '@shared/types';
import { ProductsView } from '../../../web/components/ProductsView';
import { PublicSitePreviewFooter, PublicSitePreviewHeader } from '../../components/PublicSitePreviewChrome';
import { ResponsiveWebsitePreviewFrame } from '../../components/ResponsiveWebsitePreviewFrame';
import type { ProductCategory, ProductItem } from './types';

interface Props { isOpen: boolean; product: ProductItem | null; categories: ProductCategory[]; onClose: () => void }

export const ProductPreviewModal: React.FC<Props> = ({ isOpen, product, categories, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!isOpen || !product) return null;
  const category = categories.find((item) => item.id === product.category_id)?.name || 'Sản phẩm CIC';
  const numericId = Number.parseInt(product.id.replace(/\D/g, ''), 10) || 900000;
  const previewProduct: Product = {
    id: numericId,
    name: product.title,
    price: product.price,
    description: product.short_description,
    desc: product.tagline || product.short_description,
    field: product.application_areas?.[0] || category,
    brand: product.brand_name,
    app: product.application_areas?.join(', ') || category,
    img: product.image,
    productType: product.product_type,
    slides: product.gallery?.length ? product.gallery : product.image ? [product.image] : [],
    overviewHtml: product.content_html,
    featuresHtml: product.highlights?.length ? `<ul>${product.highlights.map((item) => `<li>${item}</li>`).join('')}</ul>` : undefined,
    videoUrl: product.video_url,
    documents: product.documents?.map((item) => ({ name: item.title, size: item.file_size, url: item.file_url })),
  };
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950/85" role="dialog" aria-modal="true" aria-label="Xem trước sản phẩm">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-5 text-white">
        <div><p className="text-xs font-bold">Xem trước trên Website</p><p className="text-[10px] text-slate-400">/san-pham/{product.alias}</p></div>
        <div className="flex items-center gap-3"><div className="flex rounded-lg bg-slate-800 p-1">{([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([value, Icon]) => <button key={value} type="button" onClick={() => setDevice(value)} className={`rounded-md p-1.5 ${device === value ? 'bg-orange-600' : 'text-slate-400'}`} aria-label={`Xem ${value}`}><Icon className="size-4" /></button>)}</div><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-5" /></button></div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-800 p-5">
        <ResponsiveWebsitePreviewFrame device={device}>
          <PublicSitePreviewHeader view="products" />
          <ProductsView previewProduct={previewProduct} />
          <PublicSitePreviewFooter />
        </ResponsiveWebsitePreviewFrame>
      </div>
    </div>
  );
};
