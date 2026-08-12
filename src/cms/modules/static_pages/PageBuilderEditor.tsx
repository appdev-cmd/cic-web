import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, FileCode2, Image, Link2, Monitor, Save, Send, Smartphone, Tablet } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import { entityTypeLabels, pageBuilderEntityOptions, sectionDefinitions } from './pageBuilderData';
import { PageEntityPickerModal } from './PageEntityPickerModal';
import { findPageBuilderImage, PageMediaPickerModal } from './PageMediaPickerModal';
import { PageBuilderVisualCanvas } from './PageBuilderVisualCanvas';
import type { PageBuilderConfigValue, PageBuilderEntityType, PageBuilderPage, PageBuilderSection } from './pageBuilderTypes';

interface PageBuilderEditorProps {
  page: PageBuilderPage;
  onBack: () => void;
  onSaveDraft: (page: PageBuilderPage) => void;
  onPreview: (page: PageBuilderPage) => void;
  onPublish: (page: PageBuilderPage) => void;
}

const fieldLabels: Record<string, string> = {
  title: 'Tiêu đề', subtitle: 'Mô tả ngắn', description: 'Nội dung mô tả', badge: 'Nhãn', eyebrow: 'Nhãn giới thiệu',
  phone: 'Số điện thoại', email: 'Email', videoUrl: 'Video URL', mapUrl: 'Google Maps URL', imageId: 'Ảnh',
  backgroundImageId: 'Ảnh nền', primaryCtaId: 'CTA chính', secondaryCtaId: 'CTA phụ', ctaId: 'CTA', formId: 'Form',
  submitLabel: 'Nhãn nút gửi', successTitle: 'Tiêu đề thành công', successMessage: 'Nội dung thành công', lastUpdated: 'Ngày cập nhật',
  readingTime: 'Thời gian đọc', categoryTag: 'Nhãn danh mục', vision: 'Tầm nhìn', mission: 'Sứ mệnh', policyPageId: 'Trang chính sách',
  name: 'Tên', address: 'Địa chỉ', workingHours: 'Giờ làm việc', year: 'Năm', value: 'Giá trị', suffix: 'Hậu tố', label: 'Nhãn',
  text: 'Nội dung', downloadMediaId: 'Hồ sơ năng lực', mediaId: 'Media', targetId: 'Dữ liệu liên kết', slotKey: 'Vị trí cố định',
};

const readOnlyKeys = new Set(['slotKey', 'key', 'targetId', 'categoryKeys']);
const longTextKeys = new Set(['description', 'subtitle', 'text', 'vision', 'mission', 'address', 'workingHours']);

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function labelFor(key: string): string {
  return fieldLabels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function updateAtPath(config: Record<string, PageBuilderConfigValue>, path: Array<string | number>, value: PageBuilderConfigValue) {
  const next = deepClone(config);
  let cursor: PageBuilderConfigValue = next;
  path.slice(0, -1).forEach((part) => {
    cursor = (cursor as Record<string | number, PageBuilderConfigValue>)[part];
  });
  (cursor as Record<string | number, PageBuilderConfigValue>)[path[path.length - 1]] = value;
  return next;
}

const imageKeys = new Set(['imageId', 'backgroundImageId']);

function ConfigField({ fieldKey, value, path, onChange, onPickImage }: { fieldKey: string; value: PageBuilderConfigValue; path: Array<string | number>; onChange: (path: Array<string | number>, value: PageBuilderConfigValue) => void; onPickImage: (path: Array<string | number>, currentId: string) => void }) {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'string')) {
      return (
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</span>
          <textarea rows={Math.min(5, Math.max(2, value.length))} value={value.join('\n')} onChange={(event) => onChange(path, event.target.value.split('\n').filter(Boolean))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" />
          <span className="block text-[11px] text-slate-400">Mỗi dòng là một mục. Thứ tự dòng là thứ tự hiển thị.</span>
        </label>
      );
    }
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{labelFor(fieldKey)}</p>
        {value.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Mục {index + 1}</p>
            {typeof item === 'object' && item !== null ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(item).map(([key, child]) => <ConfigField key={key} fieldKey={key} value={child} path={[...path, index, key]} onChange={onChange} onPickImage={onPickImage} />)}
              </div>
            ) : <ConfigField fieldKey={`${fieldKey}_${index + 1}`} value={item} path={[...path, index]} onChange={onChange} onPickImage={onPickImage} />}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return <div className="grid gap-3 md:grid-cols-2">{Object.entries(value).map(([key, child]) => <ConfigField key={key} fieldKey={key} value={child} path={[...path, key]} onChange={onChange} onPickImage={onPickImage} />)}</div>;
  }

  if (imageKeys.has(fieldKey)) {
    const currentId = typeof value === 'string' ? value : '';
    const asset = findPageBuilderImage(currentId);
    return <div className="space-y-1.5"><span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"><Image className="h-3.5 w-3.5 text-slate-400" />{labelFor(fieldKey)}</span><button type="button" onClick={() => onPickImage(path, currentId)} className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800">{asset ? <><img src={asset.thumbnail_url ?? asset.url} alt="" className="aspect-[16/7] w-full object-cover" /><span className="block truncate px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">{asset.title}</span></> : <span className="flex min-h-28 flex-col items-center justify-center gap-2 p-4 text-xs font-semibold text-slate-500"><Image className="h-7 w-7" />Chọn ảnh từ Thư viện Media</span>}</button></div>;
  }

  const isReadOnly = readOnlyKeys.has(fieldKey);
  const commonClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${isReadOnly ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800' : 'border-slate-200 bg-white focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950'}`;
  return (
    <label className={`block space-y-1.5 ${longTextKeys.has(fieldKey) ? 'md:col-span-2' : ''}`}>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">{fieldKey.toLowerCase().includes('image') && <Image className="h-3.5 w-3.5 text-slate-400" />}{labelFor(fieldKey)}{isReadOnly && <span className="font-normal text-slate-400">(cố định)</span>}</span>
      {longTextKeys.has(fieldKey) ? (
        <textarea rows={3} disabled={isReadOnly} value={String(value ?? '')} onChange={(event) => onChange(path, event.target.value)} className={commonClass} />
      ) : (
        <input type={typeof value === 'number' ? 'number' : 'text'} disabled={isReadOnly} value={String(value ?? '')} onChange={(event) => onChange(path, typeof value === 'number' ? Number(event.target.value) : event.target.value)} className={commonClass} />
      )}
    </label>
  );
}

function validate(page: PageBuilderPage): Record<string, string[]> {
  const issues: Record<string, string[]> = {};
  if (!page.draft.seo.title.trim()) issues.seo = ['SEO title không được để trống.'];
  page.draft.sections.forEach((section) => {
    const sectionIssues: string[] = [];
    const title = section.config.title;
    if (typeof title === 'string' && !title.trim()) sectionIssues.push('Tiêu đề không được để trống.');
    if (section.sectionKey === 'home.hero') {
      const slides = section.config.slides;
      if (!Array.isArray(slides) || slides.length === 0) sectionIssues.push('Hero phải có ít nhất một slide.');
    }
    const limits = sectionDefinitions[section.sectionKey]?.referenceLimit;
    section.references?.forEach((reference) => {
      const limit = limits?.[reference.entityType];
      if (limit && reference.entityIds.length > limit) sectionIssues.push(`${entityTypeLabels[reference.entityType]} vượt giới hạn ${limit} mục.`);
      if (new Set(reference.entityIds).size !== reference.entityIds.length) sectionIssues.push(`${entityTypeLabels[reference.entityType]} có mục bị trùng.`);
      const unavailableCount = reference.entityIds.filter((id) => {
        const option = pageBuilderEntityOptions.find((item) => item.id === id && item.entityType === reference.entityType);
        return !option || (option.status ?? 'published') !== 'published';
      }).length;
      if (unavailableCount > 0) sectionIssues.push(`${unavailableCount} ${entityTypeLabels[reference.entityType].toLowerCase()} không còn khả dụng hoặc chưa publish.`);
    });
    if (sectionIssues.length > 0) issues[section.id] = sectionIssues;
  });
  return issues;
}

export const PageBuilderEditor: React.FC<PageBuilderEditorProps> = ({ page, onBack, onSaveDraft, onPreview, onPublish }) => {
  const [workingPage, setWorkingPage] = useState(() => deepClone(page));
  const [selectedSectionId, setSelectedSectionId] = useState(page.draft.sections[0]?.id ?? '');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [picker, setPicker] = useState<{ sectionId: string; entityType: PageBuilderEntityType; selectedIds: string[]; limit: number } | null>(null);
  const [mediaPicker, setMediaPicker] = useState<{ sectionId: string; path: Array<string | number>; currentId: string } | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const issues = useMemo(() => validate(workingPage), [workingPage]);
  const issueCount = Object.values(issues).reduce((total, values) => total + values.length, 0);

  const updateSectionConfig = (sectionId: string, path: Array<string | number>, value: PageBuilderConfigValue) => {
    setWorkingPage((current) => ({ ...current, draft: { ...current.draft, sections: current.draft.sections.map((section) => section.id === sectionId ? { ...section, config: updateAtPath(section.config, path, value) } : section) } }));
  };

  const updateReference = (sectionId: string, entityType: PageBuilderEntityType, ids: string[]) => {
    setWorkingPage((current) => ({ ...current, draft: { ...current.draft, sections: current.draft.sections.map((section) => section.id === sectionId ? { ...section, references: (section.references ?? []).map((reference) => reference.entityType === entityType ? { ...reference, entityIds: ids } : reference) } : section) } }));
  };

  const runValidAction = (action: (value: PageBuilderPage) => void) => {
    setShowValidation(true);
    if (issueCount === 0) action(workingPage);
  };

  return (
    <div className="space-y-5">
      <div className="cms-sticky-action rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onBack} className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300" aria-label="Quay lại"><ArrowLeft className="h-5 w-5" /></button>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-700">Draft v{workingPage.draft.version}</span><span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">Published v{workingPage.published.version}</span></div><h1 className="mt-1 truncate text-xl font-bold text-slate-950 dark:text-white">{workingPage.name}</h1><p className="text-xs text-slate-500">{workingPage.slug} · {workingPage.draft.sections.length} Section cố định</p></div>
          </div>
          <div className="flex flex-wrap gap-2"><CmsButton variant="secondary" leadingIcon={<Save />} onClick={() => runValidAction(onSaveDraft)}>Save Draft</CmsButton><CmsButton variant="secondary" leadingIcon={<Eye />} onClick={() => runValidAction(onPreview)}>Preview</CmsButton><CmsButton leadingIcon={<Send />} onClick={() => runValidAction(onPublish)}>Publish</CmsButton></div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200"><div className="flex gap-2"><FileCode2 className="mt-0.5 h-4 w-4 shrink-0" /><p>Section và layout được định nghĩa trong code. Bạn chỉ có thể chỉnh các trường nội dung và dữ liệu liên kết được hiển thị bên dưới.</p></div></div>

      {showValidation && issueCount > 0 && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><div className="flex items-center gap-2 font-bold"><AlertCircle className="h-4 w-4" />Có {issueCount} lỗi cần sửa trước khi tiếp tục.</div></div>}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">SEO</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2"><label className="space-y-1.5"><span className="text-xs font-semibold text-slate-700 dark:text-slate-300">SEO title</span><input value={workingPage.draft.seo.title} onChange={(event) => setWorkingPage({ ...workingPage, draft: { ...workingPage.draft, seo: { ...workingPage.draft.seo, title: event.target.value } } })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="space-y-1.5"><span className="text-xs font-semibold text-slate-700 dark:text-slate-300">SEO description</span><input value={workingPage.draft.seo.description} onChange={(event) => setWorkingPage({ ...workingPage, draft: { ...workingPage.draft, seo: { ...workingPage.draft.seo, description: event.target.value } } })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" /></label></div>
        {showValidation && issues.seo?.map((issue) => <p key={issue} className="mt-2 text-xs font-semibold text-red-600">{issue}</p>)}
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-slate-100 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
            <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Giao diện Draft trực tiếp</h2><p className="text-xs text-slate-500">Click vào Section trên giao diện để chỉnh nội dung.</p></div>
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              {([['desktop', Monitor, 'Desktop'], ['tablet', Tablet, 'Tablet'], ['mobile', Smartphone, 'Mobile']] as const).map(([value, Icon, label]) => <button key={value} type="button" title={label} aria-label={label} onClick={() => setViewport(value)} className={`rounded-md p-2 ${viewport === value ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Icon className="h-4 w-4" /></button>)}
            </div>
          </div>
          <div className="max-h-[calc(100vh-190px)] overflow-auto rounded-xl bg-slate-300/60 p-3 dark:bg-slate-900">
            <PageBuilderVisualCanvas page={workingPage} sections={workingPage.draft.sections} selectedId={selectedSectionId} issueIds={new Set(Object.keys(issues))} viewport={viewport} onSelect={setSelectedSectionId} />
          </div>
        </section>

        {(() => {
          const section = workingPage.draft.sections.find((item) => item.id === selectedSectionId) ?? workingPage.draft.sections[0];
          if (!section) return null;
          const definition = sectionDefinitions[section.sectionKey] ?? { label: section.sectionKey, description: '' };
          return <aside className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-bold text-orange-700">{section.position}</span><div className="min-w-0"><h2 className="text-sm font-bold text-slate-950 dark:text-white">{definition.label}</h2><p className="mt-0.5 text-xs text-slate-500">{definition.description}</p><span className="mt-2 inline-block rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-500 dark:bg-slate-800">{section.sectionType} · cố định</span></div></div>
            </div>
            <div className="space-y-5 p-4">
              <div className="grid gap-4">{Object.entries(section.config).map(([key, value]) => <ConfigField key={key} fieldKey={key} value={value} path={[key]} onChange={(path, nextValue) => updateSectionConfig(section.id, path, nextValue)} onPickImage={(path, currentId) => setMediaPicker({ sectionId: section.id, path, currentId })} />)}</div>
              {section.references?.map((reference) => {
                const limit = definition.referenceLimit?.[reference.entityType] ?? 20;
                return <div key={reference.entityType} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-slate-900 dark:text-white">{entityTypeLabels[reference.entityType]} đã chọn</p><p className="text-xs text-slate-500">{reference.entityIds.length}/{limit} mục · đúng thứ tự hiển thị</p></div><CmsButton size="sm" variant="secondary" leadingIcon={<Link2 />} onClick={() => setPicker({ sectionId: section.id, entityType: reference.entityType, selectedIds: reference.entityIds, limit })}>Chọn</CmsButton></div><div className="mt-3 space-y-1.5">{reference.entityIds.map((id, index) => <div key={id} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{index + 1}. {pageBuilderEntityOptions.find((item) => item.id === id)?.label ?? id}</div>)}</div></div>;
              })}
              {showValidation && issues[section.id]?.map((issue) => <p key={issue} className="flex items-center gap-1.5 text-xs font-semibold text-red-600"><AlertCircle className="h-3.5 w-3.5" />{issue}</p>)}
            </div>
          </aside>;
        })()}
      </div>

      {picker && <PageEntityPickerModal isOpen entityType={picker.entityType} selectedIds={picker.selectedIds} limit={picker.limit} onClose={() => setPicker(null)} onConfirm={(ids) => updateReference(picker.sectionId, picker.entityType, ids)} />}
      {mediaPicker && <PageMediaPickerModal currentId={mediaPicker.currentId} onClose={() => setMediaPicker(null)} onConfirm={(mediaId) => updateSectionConfig(mediaPicker.sectionId, mediaPicker.path, mediaId)} />}
    </div>
  );
};
