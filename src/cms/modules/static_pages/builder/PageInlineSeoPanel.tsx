import React from 'react';
import { Check, Database, Globe, HelpCircle, Layers, MousePointerClick, Save, Sparkles, X } from 'lucide-react';
import { CmsButton } from '../../../components/ui/CmsButton';

export interface PageInlineSeoValues {
  title: string;
  description: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

interface PageInlineSeoPanelProps {
  pageName: string;
  slug: string;
  workspaceLocale: 'vi' | 'en';
  seo: PageInlineSeoValues;
  onChange: (patch: Partial<PageInlineSeoValues>) => void;
  onClose: () => void;
  onSaveSeoOnly?: () => Promise<void> | void;
  saving?: boolean;
  compact?: boolean;
}

export const PageInlineSeoPanel: React.FC<PageInlineSeoPanelProps> = ({
  pageName,
  slug,
  workspaceLocale,
  seo,
  onChange,
  onClose,
  onSaveSeoOnly,
  saving = false,
  compact = false,
}) => {
  const defaultTitle =
    workspaceLocale === 'en'
      ? `${pageName} | CIC Technology & Consultancy`
      : `${pageName} | CIC Technology — Đối tác công nghệ chiến lược`;
  const defaultDesc =
    workspaceLocale === 'en'
      ? `Explore ${pageName} from CIC Technology — pioneering engineering software, BIM, smart equipment, and digital transformation solutions in Vietnam.`
      : `Tìm hiểu ${pageName} tại CIC Technology — Tiên phong giải pháp phần mềm kỹ thuật bản quyền, thiết bị công nghệ, BIM và chuyển đổi số ngành Xây dựng.`;

  const displayTitle = seo.title.trim() || defaultTitle;
  const displayDesc = seo.description.trim() || defaultDesc;
  const publicPath = workspaceLocale === 'en' ? `/en${slug === '/' ? '' : slug}` : slug;
  const displayUrl = `https://www.cic.com.vn${publicPath === '/' ? '' : publicPath}`;

  const titleLen = seo.title.trim().length;
  const descLen = seo.description.trim().length;

  const titleBadgeTone =
    titleLen === 0
      ? 'text-slate-400'
      : titleLen >= 25 && titleLen <= 68
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-amber-600 dark:text-amber-400';

  const descBadgeTone =
    descLen === 0
      ? 'text-slate-400'
      : descLen >= 60 && descLen <= 160
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-amber-600 dark:text-amber-400';

  return (
    <div
      className={`${
        compact
          ? 'rounded-2xl border border-orange-200/80 bg-orange-50/30 p-4 dark:border-orange-900/40 dark:bg-slate-900/90'
          : 'border-b border-slate-200 bg-slate-50/95 px-4 py-3.5 shadow-inner dark:border-slate-800 dark:bg-slate-900/95'
      }`}
    >
      <div className="mx-auto max-w-7xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white shadow-2xs">
              <Globe className="h-3.5 w-3.5" />
            </span>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Cấu hình SEO Google & Xem trước SERP ({workspaceLocale.toUpperCase()})
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tối ưu tiêu đề (50–65 ký tự) và mô tả (120–155 ký tự) để tăng tỷ lệ nhấp trên Google.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onChange({
                  title: seo.title.trim() || defaultTitle,
                  description: seo.description.trim() || defaultDesc,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-orange-700 hover:bg-orange-50 dark:border-orange-800/60 dark:bg-slate-800 dark:text-orange-300 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Điền mẫu chuẩn
            </button>
            {onSaveSeoOnly && (
              <CmsButton
                size="sm"
                leadingIcon={<Save />}
                loading={saving}
                loadingText="Đang lưu..."
                onClick={onSaveSeoOnly}
              >
                Lưu SEO vào nháp
              </CmsButton>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              aria-label="Đóng bảng SEO"
            >
              {onSaveSeoOnly ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-emerald-600" />}
              <span>{onSaveSeoOnly ? 'Đóng' : 'Xong'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left: Inputs */}
          <div className="space-y-3 lg:col-span-7">
            <label className="block space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Tiêu đề trên Google (SEO Title)
                </span>
                <span className={`font-mono text-[11px] font-bold ${titleBadgeTone}`}>
                  {titleLen}/70 ký tự {titleLen > 70 ? '(Hơi dài)' : titleLen >= 25 ? '✓ Chuẩn' : ''}
                </span>
              </div>
              <input
                type="text"
                value={seo.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder={defaultTitle}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="block space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Mô tả tóm tắt (Meta Description)
                </span>
                <span className={`font-mono text-[11px] font-bold ${descBadgeTone}`}>
                  {descLen}/160 ký tự {descLen > 160 ? '(Sẽ bị cắt bớt)' : descLen >= 60 ? '✓ Tốt' : ''}
                </span>
              </div>
              <textarea
                rows={2}
                value={seo.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder={defaultDesc}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              />
            </label>
          </div>

          {/* Right: Live Google SERP Preview */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950 lg:col-span-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Xem trước kết quả tìm kiếm Google
                </span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Indexable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white">
                  CIC
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    CIC Technology
                  </p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{displayUrl}</p>
                </div>
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-[#1a0dab] hover:underline dark:text-blue-400">
                {displayTitle}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {displayDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageBuilderGuideCard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const steps = [
    {
      icon: Globe,
      title: '1. Chọn trang & Ngôn ngữ VI / EN',
      desc: 'Chuyển đổi nhanh giữa bản Tiếng Việt (Gốc) và Tiếng Anh ngay trên thanh công cụ Page Builder mà không cần thoát ra ngoài.',
    },
    {
      icon: MousePointerClick,
      title: '2. Nhấp sửa trực tiếp trên Giao diện',
      desc: 'Bấm vào chữ để gõ và định dạng màu sắc/cỡ chữ; bấm vào ảnh để mở Kho Media DB; bấm vào nút/link để gắn Hotline, Zalo hoặc trang đích.',
    },
    {
      icon: Database,
      title: '3. Quản lý Slide & Nguồn dữ liệu DB',
      desc: 'Mở ngăn "Slide & Nguồn DB" để thêm/sắp xếp Slide Banner, hoặc chọn Dự án, Sự kiện, Tin tức hiển thị Tự động (Nổi bật) hay Thủ công (#1, #2, #3).',
    },
    {
      icon: Layers,
      title: '4. Lưu nháp an toàn & Xuất bản',
      desc: 'Mọi thay đổi được lưu vào Bản nháp (Draft) tách biệt hoàn toàn với Website đang chạy. Kiểm tra SEO Google và bấm Xuất bản khi sẵn sàng.',
    },
  ];

  return (
    <section className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/70 via-white to-slate-50 p-4 shadow-2xs dark:border-orange-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-orange-600" />
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            Quy trình biên tập Page Builder chuẩn (4 bước)
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Ẩn hướng dẫn"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="rounded-xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
