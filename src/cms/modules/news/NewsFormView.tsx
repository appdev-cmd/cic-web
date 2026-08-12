import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Image as ImageIcon, Link2, Save, Search, Star } from 'lucide-react';
import { SearchableMultiSelect, SearchableSelect } from '../../components/SearchableSelect';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import type { NewsArticle, NewsCategory, RelatedProductItem } from './types';

interface NewsFormViewProps {
  articleToEdit: NewsArticle | null;
  categories: NewsCategory[];
  relatedArticles: NewsArticle[];
  relatedProducts: RelatedProductItem[];
  onSave: (data: Partial<NewsArticle>) => void;
  onCancel: () => void;
}

const slugify = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';

export const NewsFormView: React.FC<NewsFormViewProps> = ({ articleToEdit, categories, relatedArticles, relatedProducts, onSave, onCancel }) => {
  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [alias, setAlias] = useState(articleToEdit?.alias || '');
  const [manualAlias, setManualAlias] = useState(false);
  const [otherLanguages1, setOtherLanguages1] = useState(articleToEdit?.other_languages1 || '');
  const [categoryId, setCategoryId] = useState(articleToEdit?.category_id || categories[0]?.id || '');
  const [ordering, setOrdering] = useState(articleToEdit?.ordering || 1);
  const [image, setImage] = useState(articleToEdit?.image || '');
  const [tawkTo, setTawkTo] = useState(articleToEdit?.tawk_to || '');
  const [fileUpload, setFileUpload] = useState(articleToEdit?.file_upload || '');
  const [tagsText, setTagsText] = useState(Array.isArray(articleToEdit?.tags) ? articleToEdit.tags.join(', ') : articleToEdit?.tags || '');
  const [content, setContent] = useState(articleToEdit?.content || '');
  const [newsRelated, setNewsRelated] = useState<string[]>(articleToEdit?.news_related || []);
  const [productsRelated, setProductsRelated] = useState<string[]>(articleToEdit?.products_related || []);
  const [published, setPublished] = useState(articleToEdit?.published ?? false);
  const [isHot, setIsHot] = useState(articleToEdit?.is_hot ?? false);
  const [showInHomepage, setShowInHomepage] = useState(articleToEdit?.show_in_homepage ?? false);
  const [createdTime, setCreatedTime] = useState((articleToEdit?.created_time || new Date().toISOString()).slice(0, 16));
  const [summary, setSummary] = useState(articleToEdit?.summary || '');
  const [seoTitle, setSeoTitle] = useState(articleToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(articleToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(articleToEdit?.seo_description || '');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => { if (!manualAlias) setAlias(slugify(title)); }, [title, manualAlias]);

  const save = () => {
    if (!title.trim() || !categoryId) return alert('Vui lòng nhập tiêu đề và chọn danh mục.');
    onSave({
      title, alias: alias || slugify(title), other_languages1: otherLanguages1, category_id: categoryId,
      ordering: Number(ordering) || 1, image, tawk_to: tawkTo, file_upload: fileUpload,
      tags: tagsText.split(',').map((item) => item.trim()).filter(Boolean), content,
      news_related: newsRelated, products_related: productsRelated, published, is_hot: isHot,
      show_in_homepage: showInHomepage, created_time: createdTime, summary,
      seo_title: seoTitle, seo_keyword: seoKeyword, seo_description: seoDescription,
    });
  };

  return <div className="space-y-5 pb-16">
    <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-3"><button type="button" onClick={onCancel} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><ArrowLeft className="h-5 w-5" /></button><div><p className="text-xs font-bold text-orange-600">TIN TỨC</p><h1 className="font-black dark:text-white">{articleToEdit ? 'Chỉnh sửa tin tức' : 'Thêm tin tức'}</h1></div></div>
      <button type="button" onClick={save} className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white"><Save className="h-4 w-4" />Lưu</button>
    </header>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <main className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Thông tin bài viết</div>
          <div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><label className={labelClass}>Tiêu đề tin *</label><input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} /></div><div><label className={labelClass}>Alias</label><input className={inputClass} value={alias} onChange={(e) => { setManualAlias(true); setAlias(e.target.value); }} /></div><div><label className={labelClass}>URL ngôn ngữ khác</label><input className={inputClass} value={otherLanguages1} onChange={(e) => setOtherLanguages1(e.target.value)} /></div><div><label className={labelClass}>Danh mục *</label><SearchableSelect options={categories.map((item) => ({ id: item.id, label: item.name }))} selectedId={categoryId} onChange={setCategoryId} /></div><div><label className={labelClass}>Thứ tự</label><input type="number" className={inputClass} value={ordering} onChange={(e) => setOrdering(Number(e.target.value))} /></div><div className="md:col-span-2"><label className={labelClass}>Tóm tắt</label><textarea rows={4} className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} /></div></div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><label className={labelClass}>Nội dung</label><RichTextEditor value={content} onChange={setContent} minHeight="360px" /></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Link2 className="h-5 w-5 text-orange-600" />Nội dung liên quan</div><div className="space-y-4"><div><label className={labelClass}>Tin liên quan</label><SearchableMultiSelect options={relatedArticles.filter((item) => item.id !== articleToEdit?.id).map((item) => ({ id: item.id, label: item.title }))} selectedIds={newsRelated} onChange={setNewsRelated} /></div><div><label className={labelClass}>Sản phẩm liên quan</label><SearchableMultiSelect options={relatedProducts.map((item) => ({ id: item.id, label: item.name }))} selectedIds={productsRelated} onChange={setProductsRelated} /></div></div></section>
      </main>
      <aside className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><ImageIcon className="h-5 w-5 text-orange-600" />Media và tệp</div><div className="space-y-4"><div><label className={labelClass}>Hình ảnh</label>{image && findPageBuilderImage(image) && <img src={findPageBuilderImage(image)?.thumbnail_url ?? findPageBuilderImage(image)?.url} alt="" className="mb-2 aspect-video w-full rounded-xl object-cover" />}<button type="button" onClick={() => setMediaPickerOpen(true)} className="w-full rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600">Chọn ảnh từ thư viện Media</button></div><div><label className={labelClass}>File đính kèm</label><input className={inputClass} value={fileUpload} onChange={(e) => setFileUpload(e.target.value)} placeholder="Chọn file" /></div><div><label className={labelClass}>Tags</label><textarea rows={3} className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Phân cách bằng dấu phẩy" /></div></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Star className="h-5 w-5 text-orange-600" />Xuất bản</div><div className="space-y-3">{[['Đã xuất bản', published, setPublished], ['Tin nổi bật', isHot, setIsHot], ['Hiển thị trang chủ', showInHomepage, setShowInHomepage]].map(([label, checked, setter]) => <label key={String(label)} className="flex items-center justify-between text-sm font-semibold dark:text-slate-200"><span>{String(label)}</span><input type="checkbox" checked={Boolean(checked)} onChange={(e) => (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)} /></label>)}<div><label className={labelClass}>Thời gian xuất bản</label><input type="datetime-local" className={inputClass} value={createdTime} onChange={(e) => setCreatedTime(e.target.value)} /></div></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Search className="h-5 w-5 text-orange-600" />SEO</div><div className="space-y-4"><div><label className={labelClass}>SEO title</label><input className={inputClass} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div><div><label className={labelClass}>SEO keyword</label><input className={inputClass} value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} /></div><div><label className={labelClass}>SEO description</label><textarea rows={4} className={inputClass} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></div><div><label className={labelClass}>Tawk.to</label><textarea rows={3} className={inputClass} value={tawkTo} onChange={(e) => setTawkTo(e.target.value)} /></div></div></section>
      </aside>
    </div>
    {mediaPickerOpen && <PageMediaPickerModal currentId={image} onClose={() => setMediaPickerOpen(false)} onConfirm={setImage} />}
  </div>;
};
