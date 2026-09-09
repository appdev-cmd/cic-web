import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, X } from 'lucide-react';
import type { Product } from '@shared/types';
import { extractProductVideoUrl, normalizeProductHtml, normalizeProductMediaUrl } from '@/features/products/mappers';
import { ProductsView } from '../../../web/components/ProductsView';
import { PublicSitePreviewFooter, PublicSitePreviewHeader } from '../../components/PublicSitePreviewChrome';
import { ResponsiveWebsitePreviewFrame } from '../../components/ResponsiveWebsitePreviewFrame';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';
import type { ProductCategory, ProductItem } from './types';

interface Props { isOpen: boolean; product: ProductItem | null; categories: ProductCategory[]; brands?: { id: string; name: string }[]; applications?: MasterApplicationItem[]; productTypes?: MasterProductTypeItem[]; onClose: () => void }

export const ProductPreviewModal: React.FC<Props> = ({ isOpen, product, categories, brands = [], applications = [], productTypes = [], onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!isOpen || !product) return null;
  const categoryIds = product.category_ids?.length ? product.category_ids : product.category_id ? [product.category_id] : [];
  const category = categories.find((item) => categoryIds.includes(item.id))?.name || 'Sản phẩm CIC';
  const applicationNames = (product.application || product.application_areas || []).map((id) => applications.find((item) => item.id === id)?.name).filter(Boolean) as string[];
  const brand = brands.find((item) => item.id === (product.manufactory || product.brand_id))?.name || product.brand_name || '';
  const productType = productTypes.find((item) => item.id === (product.types || product.product_type))?.name || '';
  const documents = Array.from({ length: 6 }, (_, index) => { const position = index + 1; const name = String(product[`file_name${position}` as keyof ProductItem] || ''); const url = String(product[`link_download${position}` as keyof ProductItem] || product[`file_download${position}` as keyof ProductItem] || ''); return url ? { name: name || `Tài liệu ${position}`, url } : null; }).filter((item): item is { name: string; url: string } => item !== null);
  const numericId = Number.parseInt(String(product.id).replace(/\D/g, ''), 10) || 900000;
  const previewProduct: Product = {
    id: numericId, name: product.name || product.title || 'Sản phẩm', price: product.price || product.price_old || 'Liên hệ',
    description: product.summary || product.short_description || '', desc: product.description || product.content_html || '', field: category, brand,
    app: applicationNames.join(', ') || category, img: normalizeProductMediaUrl(product.image), productType,
    slides: (product.gallery?.length ? product.gallery : product.image ? [product.image] : []).map(normalizeProductMediaUrl),
    overviewHtml: normalizeProductHtml(product.description || product.content_html), featuresHtml: normalizeProductHtml(product.feature_details),
    videoUrl: extractProductVideoUrl(product.video || product.video_url), documents,
  };
  return <div className="fixed inset-0 z-[90] flex flex-col bg-slate-950/85" role="dialog" aria-modal="true" aria-label="Xem trước sản phẩm">
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-5 text-white"><div><p className="text-xs font-bold">Xem trước trên Website</p><p className="text-[10px] text-slate-400">/products/{product.alias}</p></div><div className="flex items-center gap-3"><div className="flex rounded-lg bg-slate-800 p-1">{([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([value, Icon]) => <button key={value} type="button" onClick={() => setDevice(value)} className={`rounded-md p-1.5 ${device === value ? 'bg-orange-600' : 'text-slate-400'}`} aria-label={`Xem ${value}`}><Icon className="size-4" /></button>)}</div><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-5" /></button></div></div>
    <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-800 p-5"><ResponsiveWebsitePreviewFrame device={device}><PublicSitePreviewHeader view="products" /><ProductsView previewProduct={previewProduct} /><PublicSitePreviewFooter /></ResponsiveWebsitePreviewFrame></div>
  </div>;
};
