import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Eye, FileText, Image as ImageIcon, Link2, Save, Search, Send, Star } from 'lucide-react';
import { ContentQualityPanel } from '../../components/ContentQualityPanel';
import { SearchableMultiSelect } from '../../components/SearchableSelect';
import type { CmsMediaPickerItem } from '../../data/MediaPickerDataSource';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import type { NewsArticle } from '../news/types';
import type { EventItem, RelatedProductItem } from './types';
import { FEATURED_CONTENT_LIMITS } from '../featuredContentPolicy';

interface EventsFormViewProps {
  eventToEdit: EventItem | null;
  relatedEvents: EventItem[];
  relatedArticles: NewsArticle[];
  relatedProducts: RelatedProductItem[];
  mediaImages: CmsMediaPickerItem[];
  featuredCount: number;
  onSave: (data: Partial<EventItem>) => void;
  onOpenPreview: (data: EventItem) => void;
  onCancel: () => void;
}

const slugify = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';

export const EventsFormView: React.FC<EventsFormViewProps> = ({ eventToEdit, relatedEvents, relatedArticles, relatedProducts, mediaImages, featuredCount, onSave, onOpenPreview, onCancel }) => {
  const [title, setTitle] = useState(eventToEdit?.title || '');
  const [chuDe, setChuDe] = useState(eventToEdit?.chu_de || '');
  const [alias, setAlias] = useState(eventToEdit?.alias || '');
  const [manualAlias, setManualAlias] = useState(false);
  const [place, setPlace] = useState(eventToEdit?.place || '');
  const [timeEvent, setTimeEvent] = useState((eventToEdit?.time_event || new Date().toISOString()).slice(0, 16));
  const [endTime, setEndTime] = useState((eventToEdit?.end_time || '').slice(0, 16));
  const [specificTime, setSpecificTime] = useState(eventToEdit?.specific_time || '');
  const [linkDangky, setLinkDangky] = useState(eventToEdit?.link_dangky || '');
  const [tawkTo, setTawkTo] = useState(eventToEdit?.tawk_to || '');
  const [ordering, setOrdering] = useState(eventToEdit?.ordering || 1);
  const [image, setImage] = useState(eventToEdit?.image || '');
  const [content, setContent] = useState(eventToEdit?.content || '');
  const [eventRelated, setEventRelated] = useState<string[]>(eventToEdit?.event_related || []);
  const [newsRelated, setNewsRelated] = useState<string[]>(eventToEdit?.news_related || []);
  const [productsRelated, setProductsRelated] = useState<string[]>(eventToEdit?.products_related || []);
  const [tagsText, setTagsText] = useState(Array.isArray(eventToEdit?.tags) ? eventToEdit.tags.join(', ') : eventToEdit?.tags || '');
  const published = eventToEdit?.published ?? false;
  const [isHot, setIsHot] = useState(eventToEdit?.is_hot ?? false);
  const [showInHome, setShowInHome] = useState(eventToEdit?.show_in_home ?? false);
  const [createdTime, setCreatedTime] = useState((eventToEdit?.created_time || new Date().toISOString()).slice(0, 16));
  const [summary, setSummary] = useState(eventToEdit?.summary || '');
  const [seoTitle, setSeoTitle] = useState(eventToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(eventToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(eventToEdit?.seo_description || '');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => { if (!manualAlias) setAlias(slugify(title)); }, [title, manualAlias]);

  const payload = (nextPublished = published): Partial<EventItem> => ({
    title, chu_de: chuDe, alias: alias || slugify(title), place, time_event: timeEvent, end_time: endTime,
    specific_time: specificTime, link_dangky: linkDangky, tawk_to: tawkTo,
    ordering: Number(ordering) || 1, image, content, event_related: eventRelated,
    news_related: newsRelated, products_related: productsRelated,
    tags: tagsText.split(',').map((item) => item.trim()).filter(Boolean), published: nextPublished,
    is_hot: isHot, show_in_home: isHot || showInHome, created_time: createdTime, summary,
    seo_title: seoTitle, seo_keyword: seoKeyword, seo_description: seoDescription,
  });

  const save = (nextPublished: boolean) => {
    if (!title.trim() || !timeEvent || !endTime || !content.trim()) return alert('Vui lòng nhập tiêu đề, thời gian bắt đầu, thời gian kết thúc và nội dung sự kiện.');
    if (new Date(endTime).getTime() <= new Date(timeEvent).getTime()) return alert('Thời gian kết thúc phải sau thời gian bắt đầu.');
    if (isHot && !eventToEdit?.is_hot && featuredCount >= FEATURED_CONTENT_LIMITS.event) return alert(`Chỉ được chọn ${FEATURED_CONTENT_LIMITS.event} sự kiện nổi bật. Hãy bỏ chọn sự kiện hiện tại trước.`);
    onSave(payload(nextPublished));
  };

  return <div className="space-y-5 pb-16">
    <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95"><div className="flex items-center gap-3"><button type="button" onClick={onCancel} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"><ArrowLeft className="h-5 w-5" /></button><div><p className="text-xs font-bold text-orange-600">SỰ KIỆN</p><h1 className="font-black dark:text-white">{eventToEdit ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}</h1></div></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onOpenPreview({ ...(eventToEdit || {}), ...payload() } as EventItem)} className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-900"><Eye className="h-4 w-4" />Xem trước</button><button type="button" onClick={() => save(false)} className="flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-white dark:bg-slate-700"><Save className="h-4 w-4" />Lưu nháp</button><button type="button" onClick={() => save(true)} className="flex items-center gap-2 rounded-xl bg-orange-600 px-3.5 py-2.5 text-xs font-bold text-white"><Send className="h-4 w-4" />Xuất bản</button></div></header>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"><main className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Calendar className="h-5 w-5 text-orange-600" />Thông tin sự kiện</div><div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><label className={labelClass}>Tiêu đề sự kiện *</label><input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} /></div><div><label className={labelClass}>Chủ đề</label><input className={inputClass} value={chuDe} onChange={(e) => setChuDe(e.target.value)} /></div><div><label className={labelClass}>Alias</label><input className={inputClass} value={alias} onChange={(e) => { setManualAlias(true); setAlias(e.target.value); }} /></div><div className="md:col-span-2"><label className={labelClass}>Địa điểm</label><input className={inputClass} value={place} onChange={(e) => setPlace(e.target.value)} /></div><div><label className={labelClass}>Thời gian bắt đầu *</label><input type="datetime-local" className={inputClass} value={timeEvent} onChange={(e) => setTimeEvent(e.target.value)} /></div><div><label className={labelClass}>Thời gian kết thúc *</label><input type="datetime-local" min={timeEvent} className={inputClass} value={endTime} onChange={(e) => setEndTime(e.target.value)} /></div><div><label className={labelClass}>Thời gian cụ thể</label><input className={inputClass} value={specificTime} onChange={(e) => setSpecificTime(e.target.value)} /></div><div><label className={labelClass}>Link đăng ký</label><input className={inputClass} value={linkDangky} onChange={(e) => setLinkDangky(e.target.value)} /></div><div className="md:col-span-2"><label className={labelClass}>Tóm tắt</label><textarea rows={4} className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Nội dung</div><RichTextEditor value={content} onChange={setContent} minHeight="340px" allowedEmbeds={['cta', 'form']} /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Link2 className="h-5 w-5 text-orange-600" />Nội dung liên quan</div><div className="space-y-4"><div><label className={labelClass}>Sự kiện liên quan</label><SearchableMultiSelect options={relatedEvents.filter((item) => item.id !== eventToEdit?.id).map((item) => ({ id: item.id, label: item.title }))} selectedIds={eventRelated} onChange={setEventRelated} /></div><div><label className={labelClass}>Tin tức liên quan</label><SearchableMultiSelect options={relatedArticles.map((item) => ({ id: item.id, label: item.title }))} selectedIds={newsRelated} onChange={setNewsRelated} /></div><div><label className={labelClass}>Sản phẩm liên quan</label><SearchableMultiSelect options={relatedProducts.map((item) => ({ id: item.id, label: item.name }))} selectedIds={productsRelated} onChange={setProductsRelated} /></div></div></section>
    </main><aside className="space-y-5">
      <ContentQualityPanel checks={[{ label: 'Có tiêu đề sự kiện', passed: Boolean(title.trim()) }, { label: 'Có thời gian bắt đầu', passed: Boolean(timeEvent) }, { label: 'Có thời gian kết thúc hợp lệ', passed: Boolean(endTime) && new Date(endTime).getTime() > new Date(timeEvent).getTime() }, { label: 'Có địa điểm', passed: Boolean(place.trim()) }, { label: 'Có tóm tắt', passed: Boolean(summary.trim()) }, { label: 'Có nội dung sự kiện', passed: content.replace(/<[^>]+>/g, '').trim().length > 30 }, { label: 'Có hình ảnh', passed: Boolean(image) }]} />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><ImageIcon className="h-5 w-5 text-orange-600" />Media</div><div className="space-y-4"><div><label className={labelClass}>Hình ảnh</label>{image && findPageBuilderImage(image, mediaImages) && <img src={findPageBuilderImage(image, mediaImages)?.thumbnail_url ?? findPageBuilderImage(image, mediaImages)?.url} alt="" className="mb-2 aspect-video w-full rounded-xl object-cover" />}<button type="button" onClick={() => setMediaPickerOpen(true)} className="w-full rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600">Chọn hoặc tải ảnh</button></div><div><label className={labelClass}>Tags</label><textarea rows={3} className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Phân cách bằng dấu phẩy" /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Star className="h-5 w-5 text-orange-600" />Hiển thị</div><div className="space-y-3"><label className="flex items-start justify-between gap-4 text-sm font-semibold dark:text-slate-200"><span>Sự kiện nổi bật <span className="font-normal text-slate-400">({featuredCount + Number(isHot)}/{FEATURED_CONTENT_LIMITS.event})</span><span className="mt-0.5 block text-[11px] font-normal text-slate-500">Sự kiện chính được section Trang chủ lấy tự động.</span></span><input type="checkbox" checked={isHot} disabled={!isHot && featuredCount >= FEATURED_CONTENT_LIMITS.event} onChange={(e) => setIsHot(e.target.checked)} /></label><label className="flex items-center justify-between text-sm font-semibold dark:text-slate-200"><span>Sự kiện lớn ở trang chủ</span><input type="checkbox" checked={showInHome} onChange={(e) => setShowInHome(e.target.checked)} /></label><div><label className={labelClass}>Thời gian tạo</label><input type="datetime-local" disabled className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800`} value={createdTime} /></div><div><label className={labelClass}>Thứ tự</label><input type="number" className={inputClass} value={ordering} onChange={(e) => setOrdering(Number(e.target.value))} /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Search className="h-5 w-5 text-orange-600" />SEO</div><div className="space-y-4"><div><label className={labelClass}>SEO title</label><input className={inputClass} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div><div><label className={labelClass}>SEO keyword</label><input className={inputClass} value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} /></div><div><label className={labelClass}>SEO description</label><textarea rows={4} className={inputClass} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></div><div><label className={labelClass}>Tawk.to</label><textarea rows={3} className={inputClass} value={tawkTo} onChange={(e) => setTawkTo(e.target.value)} /></div></div></section>
    </aside></div>
    {mediaPickerOpen && <PageMediaPickerModal currentId={image} images={mediaImages} onClose={() => setMediaPickerOpen(false)} onConfirm={setImage} />}
  </div>;
};
