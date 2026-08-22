import React, { useEffect, useState } from 'react';
import { ArrowLeft, Eye, FileText, Image as ImageIcon, Link2, Package, Save, Search, Send, Star, FileDown, ShieldCheck, Tag } from 'lucide-react';
import { ContentQualityPanel } from '../../components/ContentQualityPanel';
import { SearchableMultiSelect, SearchableSelect } from '../../components/SearchableSelect';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import { ProductFileInput } from './ProductFileInput';
import type { ProductBrand, ProductCategory, ProductItem, ProductOwnerOption } from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';

interface ProductsFormViewProps {
  product: ProductItem | null;
  categories: ProductCategory[];
  brands: ProductBrand[];
  applications: MasterApplicationItem[];
  productTypes: MasterProductTypeItem[];
  relatedProducts: ProductItem[];
  owners: ProductOwnerOption[];
  onSave: (productData: Partial<ProductItem>, actionType: 'draft' | 'publish') => void;
  onCancel: () => void;
  onOpenPreview: (productData: ProductItem) => void;
}

interface LegacyDownload { name: string; file: string; link: string }
const slugify = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';

export const ProductsFormView: React.FC<ProductsFormViewProps> = ({ product, categories, brands, applications: applicationOptions, productTypes, relatedProducts, onSave, onCancel, onOpenPreview }) => {
  const [name, setName] = useState(product?.name || product?.title || '');
  const [alias, setAlias] = useState(product?.alias || '');
  const [manualAlias, setManualAlias] = useState(false);
  const [code, setCode] = useState(product?.code || product?.sku || '');
  const [otherLanguages1, setOtherLanguages1] = useState(product?.other_languages1 || '');
  const [image, setImage] = useState(product?.image || '');
  const [icon, setIcon] = useState(product?.icon || '');
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.category_ids || (product?.category_id ? [product.category_id] : []));
  const [manufactory, setManufactory] = useState(product?.manufactory || product?.brand_id || '');
  const [applications, setApplications] = useState<string[]>(product?.application || []);
  const [types, setTypes] = useState(product?.types || product?.product_type || '');
  const [productsRelates, setProductsRelates] = useState<string[]>(product?.products_relates || []);
  const [summary, setSummary] = useState(product?.summary || product?.short_description || '');
  const [description, setDescription] = useState(product?.description || product?.content_html || '');
  const [featureDetails, setFeatureDetails] = useState(product?.feature_details || '');
  const [video, setVideo] = useState(product?.video || product?.video_url || '');
  const [tawkTo, setTawkTo] = useState(product?.tawk_to || '');
  const [tagsText, setTagsText] = useState((product?.tags || []).join(', '));
  const [priceOld, setPriceOld] = useState(product?.price_old || product?.price || '');
  const [isHot, setIsHot] = useState(product?.is_hot ?? false);
  const [teamview, setTeamview] = useState(product?.teamview ?? false);
  const [ordering, setOrdering] = useState(product?.ordering || 1);
  const [landingPage, setLandingPage] = useState(product?.landing_page || '');
  const [seoTitle, setSeoTitle] = useState(product?.seo_title || product?.meta_title || '');
  const [seoKeyword, setSeoKeyword] = useState(product?.seo_keyword || product?.meta_keywords || '');
  const [seoDescription, setSeoDescription] = useState(product?.seo_description || product?.meta_description || '');
  const [fileCatalogue, setFileCatalogue] = useState(product?.file_catalogue || '');
  const [filePrice, setFilePrice] = useState(product?.file_price || '');
  const [linkCatalogue, setLinkCatalogue] = useState(product?.link_catalogue || '');
  const [fileDriverName, setFileDriverName] = useState(product?.file_driver_name || '');
  const [fileDriver, setFileDriver] = useState(product?.file_driver || '');
  const [linkDriver, setLinkDriver] = useState(product?.link_driver || '');
  const [downloads, setDownloads] = useState<LegacyDownload[]>(Array.from({ length: 6 }, (_, index) => ({ name: product?.[`file_name${index + 1}` as keyof ProductItem] as string || '', file: product?.[`file_download${index + 1}` as keyof ProductItem] as string || '', link: product?.[`link_download${index + 1}` as keyof ProductItem] as string || '' })));
  const [mediaTarget, setMediaTarget] = useState<'image' | 'icon' | null>(null);

  useEffect(() => { if (!manualAlias) setAlias(slugify(name)); }, [name, manualAlias]);
  const ids = (text: string) => text.split(',').map((item) => item.trim()).filter(Boolean);
  const payload = (): Partial<ProductItem> => {
    const base: Partial<ProductItem> = {
      name, alias: alias || slugify(name), code, other_languages1: otherLanguages1, image, icon,
      category_ids: categoryIds, category_id: categoryIds.join(','), manufactory,
      application: applications, types, products_relates: productsRelates, summary,
      description, feature_details: featureDetails, video, tawk_to: tawkTo, tags: ids(tagsText),
      price_old: priceOld, price: priceOld, is_hot: isHot, teamview, ordering: Number(ordering) || 1,
      landing_page: landingPage, seo_title: seoTitle, seo_keyword: seoKeyword, seo_description: seoDescription,
      file_catalogue: fileCatalogue, file_price: filePrice, link_catalogue: linkCatalogue,
      file_driver_name: fileDriverName, file_driver: fileDriver, link_driver: linkDriver,
    };
    downloads.forEach((item, index) => { Object.assign(base, { [`file_name${index + 1}`]: item.name, [`file_download${index + 1}`]: item.file, [`link_download${index + 1}`]: item.link }); });
    return base;
  };
  const save = (action: 'draft' | 'publish') => { if (!name.trim() || categoryIds.length === 0) return alert('Vui lòng nhập tên và chọn ít nhất một lĩnh vực.'); onSave(payload(), action); };
  const updateDownload = (index: number, field: keyof LegacyDownload, value: string) => setDownloads((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));

  return <div className="space-y-5 pb-16">
    <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95"><div className="flex items-center gap-3"><button type="button" onClick={onCancel} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><ArrowLeft className="h-5 w-5" /></button><div><p className="text-xs font-bold text-orange-600">SẢN PHẨM</p><h1 className="font-black dark:text-white">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h1></div></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onOpenPreview({ ...(product || {}), ...payload() } as ProductItem)} className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-900"><Eye className="h-4 w-4" />Xem trước</button><button type="button" onClick={() => save('draft')} className="flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-white dark:bg-slate-700"><Save className="h-4 w-4" />Lưu nháp</button><button type="button" onClick={() => save('publish')} className="flex items-center gap-2 rounded-xl bg-orange-600 px-3.5 py-2.5 text-xs font-bold text-white"><Send className="h-4 w-4" />Xuất bản</button></div></header>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(310px,1fr)]"><main className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Package className="h-5 w-5 text-orange-600" />Thông tin sản phẩm</div><div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><label className={labelClass}>Tên sản phẩm *</label><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></div><div><label className={labelClass}>Alias</label><input className={inputClass} value={alias} onChange={(e) => { setManualAlias(true); setAlias(e.target.value); }} /></div><div><label className={labelClass}>Biệt danh</label><input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} /></div><div><label className={labelClass}>URL ngôn ngữ khác</label><input className={inputClass} value={otherLanguages1} onChange={(e) => setOtherLanguages1(e.target.value)} /></div><div><label className={labelClass}>Hãng sản xuất</label><SearchableSelect options={brands.map((item) => ({ id: item.id, label: item.name }))} selectedId={manufactory} onChange={setManufactory} /></div><div><label className={labelClass}>Loại sản phẩm</label><SearchableSelect options={productTypes.filter((item) => item.status === 'active').map((item) => ({ id: item.id, label: item.name }))} selectedId={types} onChange={setTypes} /></div><div className="md:col-span-2"><label className={labelClass}>Lĩnh vực *</label><SearchableMultiSelect options={categories.map((item) => ({ id: item.id, label: item.name }))} selectedIds={categoryIds} onChange={setCategoryIds} /></div><div className="md:col-span-2"><label className={labelClass}>Ứng dụng</label><SearchableMultiSelect options={applicationOptions.filter((item) => item.status === 'active').map((item) => ({ id: item.id, label: item.name }))} selectedIds={applications} onChange={setApplications} /></div><div className="md:col-span-2"><label className={labelClass}>Sản phẩm liên quan</label><SearchableMultiSelect options={relatedProducts.filter((item) => item.id !== product?.id).map((item) => ({ id: item.id, label: item.name || item.title }))} selectedIds={productsRelates} onChange={setProductsRelates} /></div><div className="md:col-span-2"><label className={labelClass}>Tóm tắt</label><textarea rows={4} className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Tổng quan</div><RichTextEditor value={description} onChange={setDescription} minHeight="320px" /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Chi tiết tính năng</div><RichTextEditor value={featureDetails} onChange={setFeatureDetails} minHeight="300px" /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Video</div><RichTextEditor value={video} onChange={setVideo} minHeight="260px" /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
          <Link2 className="h-5 w-5 text-orange-600" />
          Tệp sản phẩm & Tài liệu đính kèm
        </div>
        <div className="space-y-6">
          {/* File báo giá (Catalog / Price) */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
              <FileDown className="w-4 h-4" />
              File báo giá & Catalogue
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className={labelClass}>Tên file báo giá / tiêu đề</label>
                <input 
                  className={inputClass} 
                  value={fileCatalogue} 
                  onChange={(e) => setFileCatalogue(e.target.value)} 
                  placeholder="VD: Báo giá AutoCAD 2026..." 
                />
              </div>
              <div>
                <ProductFileInput
                  label="Chọn tệp báo giá"
                  value={filePrice}
                  onChange={setFilePrice}
                  onAutoFillName={(autoName) => {
                    if (!fileCatalogue) setFileCatalogue(autoName);
                  }}
                  placeholder="Chọn file báo giá từ máy..."
                />
              </div>
              <div>
                <label className={labelClass}>Link báo giá (URL trực tuyến)</label>
                <input 
                  className={inputClass} 
                  value={linkCatalogue} 
                  onChange={(e) => setLinkCatalogue(e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
            </div>
          </div>

          {/* File khóa cứng (Driver / Dongle) */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              File Driver & Khóa cứng (Dongle)
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className={labelClass}>Tên file khóa cứng / driver</label>
                <input 
                  className={inputClass} 
                  value={fileDriverName} 
                  onChange={(e) => setFileDriverName(e.target.value)} 
                  placeholder="VD: Driver Sentinel HASP..." 
                />
              </div>
              <div>
                <ProductFileInput
                  label="Chọn tệp Driver / Khóa cứng"
                  value={fileDriver}
                  onChange={setFileDriver}
                  onAutoFillName={(autoName) => {
                    if (!fileDriverName) setFileDriverName(autoName);
                  }}
                  placeholder="Chọn file driver từ máy..."
                />
              </div>
              <div>
                <label className={labelClass}>Link khóa cứng (URL trực tuyến)</label>
                <input 
                  className={inputClass} 
                  value={linkDriver} 
                  onChange={(e) => setLinkDriver(e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
            </div>
          </div>

          {/* Các tệp tải về 1 - 6 */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Danh sách tệp tải về bổ sung (Tối đa 6 tệp)
            </div>
            {downloads.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-slate-200 p-3.5 md:grid-cols-3 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-2xs">
                <div>
                  <label className={labelClass}>Ghi chú / Tên tệp {index + 1}</label>
                  <input 
                    className={inputClass} 
                    value={item.name} 
                    onChange={(e) => updateDownload(index, 'name', e.target.value)} 
                    placeholder={`Tên tài liệu / phần mềm ${index + 1}...`}
                  />
                </div>
                <div>
                  <ProductFileInput
                    label={`Chọn tệp đính kèm ${index + 1}`}
                    value={item.file}
                    onChange={(val) => updateDownload(index, 'file', val)}
                    onAutoFillName={(autoName) => {
                      if (!item.name) updateDownload(index, 'name', autoName);
                    }}
                    placeholder={`Chọn tệp ${index + 1} từ máy...`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Link tải trực tuyến {index + 1}</label>
                  <input 
                    className={inputClass} 
                    value={item.link} 
                    onChange={(e) => updateDownload(index, 'link', e.target.value)} 
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main><aside className="space-y-5">
      <ContentQualityPanel checks={[{ label: 'Có tên sản phẩm', passed: Boolean(name.trim()) }, { label: 'Có ít nhất một lĩnh vực', passed: categoryIds.length > 0 }, { label: 'Có hãng sản xuất', passed: Boolean(manufactory) }, { label: 'Có tóm tắt', passed: Boolean(summary.trim()) }, { label: 'Có nội dung tổng quan', passed: description.replace(/<[^>]+>/g, '').trim().length > 30 }, { label: 'Có ảnh sản phẩm', passed: Boolean(image) }, { label: 'Có cấu hình SEO', passed: Boolean(seoTitle.trim() && seoDescription.trim()) }]} />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><ImageIcon className="h-5 w-5 text-orange-600" />Media</div><div className="space-y-4"><div><label className={labelClass}>Ảnh sản phẩm</label>{image && findPageBuilderImage(image) && <img src={findPageBuilderImage(image)?.thumbnail_url ?? findPageBuilderImage(image)?.url} alt="" className="mb-2 aspect-video w-full rounded-xl object-cover" />}<button type="button" onClick={() => setMediaTarget('image')} className="w-full rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600">Chọn hoặc tải ảnh sản phẩm</button></div><div><label className={labelClass}>Icon</label>{icon && findPageBuilderImage(icon) && <img src={findPageBuilderImage(icon)?.thumbnail_url ?? findPageBuilderImage(icon)?.url} alt="" className="mb-2 h-20 w-20 rounded-xl object-cover" />}<button type="button" onClick={() => setMediaTarget('icon')} className="w-full rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600">Chọn hoặc tải icon</button></div><div><label className={labelClass}>Tags</label><textarea rows={3} className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Star className="h-5 w-5 text-orange-600" />Hiển thị</div><div className="space-y-4"><div><label className={labelClass}>Giá</label><input className={inputClass} value={priceOld} onChange={(e) => setPriceOld(e.target.value)} /></div><label className="flex items-center justify-between text-sm font-semibold dark:text-slate-200"><span>Sản phẩm tiêu biểu</span><input type="checkbox" checked={isHot} onChange={(e) => setIsHot(e.target.checked)} /></label><label className="flex items-center justify-between text-sm font-semibold dark:text-slate-200"><span>Link TeamViewer</span><input type="checkbox" checked={teamview} onChange={(e) => setTeamview(e.target.checked)} /></label><div><label className={labelClass}>Thứ tự</label><input type="number" className={inputClass} value={ordering} onChange={(e) => setOrdering(Number(e.target.value))} /></div><div><label className={labelClass}>Landing page</label><input className={inputClass} value={landingPage} onChange={(e) => setLandingPage(e.target.value)} /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Search className="h-5 w-5 text-orange-600" />SEO</div><div className="space-y-4"><div><label className={labelClass}>SEO title</label><input className={inputClass} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div><div><label className={labelClass}>SEO keyword</label><input className={inputClass} value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} /></div><div><label className={labelClass}>SEO description</label><textarea rows={4} className={inputClass} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></div><div><label className={labelClass}>Tawk.to</label><textarea rows={3} className={inputClass} value={tawkTo} onChange={(e) => setTawkTo(e.target.value)} /></div></div></section>
    </aside></div>
    {mediaTarget && <PageMediaPickerModal currentId={mediaTarget === 'image' ? image : icon} onClose={() => setMediaTarget(null)} onConfirm={(mediaId) => mediaTarget === 'image' ? setImage(mediaId) : setIcon(mediaId)} />}
  </div>;
};
