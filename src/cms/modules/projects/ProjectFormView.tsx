import React, { useMemo, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, Eye, FileText, Image, Images, Link2, Save, Search, Upload, X } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { SearchableMultiSelect } from '../../components/SearchableSelect';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import type { CmsProject, ProjectRelationOption } from './types';

interface Props {
  project: CmsProject | null;
  productOptions: ProjectRelationOption[];
  serviceOptions: ProjectRelationOption[];
  onSave: (project: CmsProject) => void;
  onPreview: (project: CmsProject) => void;
  onCancel: () => void;
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';
const splitLines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const ProjectFormView: React.FC<Props> = ({ project, productOptions, serviceOptions, onSave, onPreview, onCancel }) => {
  const initial = useMemo<CmsProject>(() => project ?? {
    id: `project_${Date.now()}`, title: '', alias: '', tagline: '', summary: '', content: '', sector: '', solution: '', technologies: [], customer_name: '', location: '', start_year: null, end_year: null, is_ongoing: false, image: '', products_related: [], services_related: [], is_featured: false, published: false, ordering: 0, seo_title: '', seo_keyword: '', seo_description: '', created_time: new Date().toISOString(), updated_time: new Date().toISOString(),
  }, [project]);
  const [form, setForm] = useState(initial);
  const [technologyInput, setTechnologyInput] = useState(initial.technologies.join('\n'));
  const [manualAlias, setManualAlias] = useState(Boolean(project));
  const [error, setError] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const set = <K extends keyof CmsProject>(key: K, value: CmsProject[K]) => setForm((current) => ({ ...current, [key]: value }));

  const submit = () => {
    if (!form.title.trim()) return setError('Vui lòng nhập tên dự án.');
    if (!form.alias.trim()) return setError('Vui lòng nhập đường dẫn dự án.');
    if (form.start_year && form.end_year && form.end_year < form.start_year) return setError('Năm kết thúc không được nhỏ hơn năm bắt đầu.');
    setError('');
    onSave({ ...form, title: form.title.trim(), alias: slugify(form.alias), technologies: splitLines(technologyInput), end_year: form.is_ongoing ? null : form.end_year, updated_time: new Date().toISOString() });
  };

  return <div className="space-y-6 pb-16">
    <CmsPageHeader icon={<BriefcaseBusiness />} title={project ? 'Chỉnh sửa dự án' : 'Thêm dự án'} description="Nội dung bài viết dùng Rich Text; các trường filter được quản lý độc lập." actions={<><CmsButton size="sm" variant="secondary" leadingIcon={<ArrowLeft />} onClick={onCancel}>Quay lại</CmsButton><CmsButton size="sm" variant="secondary" leadingIcon={<Eye />} onClick={() => onPreview({ ...form, technologies: splitLines(technologyInput) })}>Xem trước</CmsButton><CmsButton size="sm" variant="primary" leadingIcon={<Save />} onClick={submit}>Lưu dự án</CmsButton></>} />
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Section icon={<FileText />} title="Thông tin nội dung"><div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên dự án *" wide><input className={inputClass} value={form.title} onChange={(e) => { const title = e.target.value; setForm((current) => ({ ...current, title, alias: manualAlias ? current.alias : slugify(title) })); }} /></Field>
          <Field label="Đường dẫn *"><input className={inputClass} value={form.alias} onChange={(e) => { setManualAlias(true); set('alias', e.target.value); }} /></Field>
          <Field label="Câu giới thiệu"><input className={inputClass} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} /></Field>
          <Field label="Mô tả ngắn" wide><textarea rows={4} className={inputClass} value={form.summary} onChange={(e) => set('summary', e.target.value)} /></Field>
        </div></Section>
        <Section icon={<FileText />} title="Nội dung chi tiết"><RichTextEditor value={form.content} onChange={(value) => set('content', value)} minHeight="380px" /></Section>
        <Section icon={<Image />} title="Media"><div className="grid gap-4 md:grid-cols-2">
          <Field label="Ảnh đại diện" wide><ImagePickerField value={form.image} onChange={(image) => set('image', image)} onPickFromMedia={() => setMediaPickerOpen(true)} /></Field>
        </div></Section>
        <Section icon={<Link2 />} title="Nội dung liên quan"><div className="space-y-4"><div><span className={labelClass}>Sản phẩm liên quan</span><SearchableMultiSelect options={productOptions} selectedIds={form.products_related} onChange={(ids) => set('products_related', ids)} placeholder="Chọn sản phẩm liên quan..." /></div><div><span className={labelClass}>Dịch vụ liên quan</span><SearchableMultiSelect options={serviceOptions} selectedIds={form.services_related} onChange={(ids) => set('services_related', ids)} placeholder="Chọn dịch vụ liên quan..." /></div></div></Section>
      </div>
      <aside className="space-y-6">
        <Section icon={<Search />} title="Phân loại & factsheet"><div className="space-y-4">
          <Field label="Lĩnh vực"><input className={inputClass} value={form.sector} onChange={(e) => set('sector', e.target.value)} /></Field>
          <Field label="Dịch vụ / Giải pháp chính"><input className={inputClass} value={form.solution} onChange={(e) => set('solution', e.target.value)} /></Field>
          <Field label="Công nghệ áp dụng"><textarea rows={4} className={inputClass} value={technologyInput} onChange={(e) => setTechnologyInput(e.target.value)} placeholder="Mỗi dòng một công nghệ" /></Field>
          <Field label="Chủ đầu tư / Khách hàng"><input className={inputClass} value={form.customer_name} onChange={(e) => set('customer_name', e.target.value)} /></Field>
          <Field label="Địa điểm"><input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Năm bắt đầu"><input type="number" className={inputClass} value={form.start_year ?? ''} onChange={(e) => set('start_year', e.target.value ? Number(e.target.value) : null)} /></Field><Field label="Năm kết thúc"><input type="number" disabled={form.is_ongoing} className={inputClass} value={form.end_year ?? ''} onChange={(e) => set('end_year', e.target.value ? Number(e.target.value) : null)} /></Field></div>
          <Check label="Đang triển khai" checked={form.is_ongoing} onChange={(checked) => setForm((current) => ({ ...current, is_ongoing: checked, end_year: checked ? null : current.end_year }))} />
        </div></Section>
        <Section icon={<BriefcaseBusiness />} title="Hiển thị"><div className="space-y-4"><Field label="Thứ tự"><input type="number" min={0} className={inputClass} value={form.ordering} onChange={(e) => set('ordering', Math.max(0, Number(e.target.value) || 0))} /></Field><Check label="Dự án nổi bật" checked={form.is_featured} onChange={(value) => set('is_featured', value)} /></div></Section>
        <Section icon={<Search />} title="SEO"><div className="space-y-4"><Field label="SEO title"><input className={inputClass} value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} /></Field><Field label="SEO keyword"><input className={inputClass} value={form.seo_keyword} onChange={(e) => set('seo_keyword', e.target.value)} /></Field><Field label="SEO description"><textarea rows={4} className={inputClass} value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} /></Field></div></Section>
      </aside>
    </div>
    {mediaPickerOpen && <PageMediaPickerModal currentId={form.image} returnValue="url" onClose={() => setMediaPickerOpen(false)} onConfirm={(mediaUrl) => set('image', mediaUrl)} />}
  </div>;
};

const ImagePickerField: React.FC<{ value: string; onChange: (value: string) => void; onPickFromMedia: () => void }> = ({ value, onChange, onPickFromMedia }) => {
  const [fileError, setFileError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setFileError('Vui lòng chọn đúng định dạng ảnh.');
    if (file.size > 10 * 1024 * 1024) return setFileError('Ảnh không được vượt quá 10 MB.');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        setFileError('');
      }
    };
    reader.onerror = () => setFileError('Không thể đọc tệp ảnh. Vui lòng chọn lại.');
    reader.readAsDataURL(file);
  };

  return <div className="space-y-2">
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
      {value ? <div className="relative"><img src={value} alt="Xem trước ảnh đại diện dự án" className="aspect-[16/7] w-full object-cover" /><button type="button" onClick={() => onChange('')} className="absolute right-2 top-2 rounded-lg bg-slate-950/75 p-1.5 text-white transition hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500" aria-label="Bỏ ảnh đã chọn"><X className="size-4" /></button></div> : <div className="flex min-h-32 flex-col items-center justify-center gap-2 px-4 py-6 text-xs text-slate-500"><Image className="size-7" /><span>Chưa chọn ảnh đại diện</span><span className="text-[11px] text-slate-400">JPG, PNG, GIF hoặc WebP · tối đa 10 MB</span></div>}
      <div className="grid border-t border-slate-200 sm:grid-cols-2 dark:border-slate-700">
        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-orange-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-700 focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-orange-300"><Upload className="size-4" />{value ? 'Tải ảnh khác từ máy' : 'Tải ảnh từ máy'}<input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" /></label>
        <button type="button" onClick={onPickFromMedia} className="flex min-h-11 items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-500 dark:hover:bg-orange-950/20"><Images className="size-4" />Chọn từ Thư viện Media</button>
      </div>
    </div>
    {fileError && <p className="text-xs font-semibold text-red-600" role="alert">{fileError}</p>}
  </div>;
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"><h2 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white"><span className="text-orange-600 [&>svg]:size-4">{icon}</span>{title}</h2>{children}</section>;
const Field: React.FC<{ label: string; wide?: boolean; children: React.ReactNode }> = ({ label, wide, children }) => <label className={wide ? 'block md:col-span-2' : 'block'}><span className={labelClass}>{label}</span>{children}</label>;
const Check: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-orange-600" />{label}</label>;
