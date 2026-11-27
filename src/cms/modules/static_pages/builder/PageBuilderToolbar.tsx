import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe,
  History,
  Link2,
  Monitor,
  MousePointerClick,
  Redo2,
  Save,
  Send,
  Smartphone,
  Tablet,
  Undo2,
} from 'lucide-react';
import { CmsButton } from '../../../components/ui/CmsButton';
import type { CmsLocale } from '../../../data/CmsDataSource';
import type { PageBuilderPage } from '../pageBuilderTypes';
import { sectionDefinitions } from '../pageBuilderRegistry';
import type { CanvasFormatState, FormatCommandInput } from './canvasTextFormatter';
import { PageBuilderFormatControls } from './PageBuilderFormatControls';
import type { DataDrawerTab } from './PageBuilderDataDrawer';

interface PageBuilderToolbarProps {
  page: PageBuilderPage;
  workspaceLocale: CmsLocale;
  hasAvailableCounterpartLocale?: boolean;
  onSwitchLocale?: (locale: CmsLocale) => void;
  selectedSectionId: string;
  onSelectSection: (sectionId: string) => void;
  onToggleSelectedSectionVisibility: (sectionId: string) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  canvasMode: 'edit' | 'preview';
  onCanvasModeChange: (mode: 'edit' | 'preview') => void;
  formatState: CanvasFormatState;
  onApplyFormat: (command: FormatCommandInput) => void;
  showSeoPanel: boolean;
  onToggleSeoPanel: () => void;
  showLinkToolbar: boolean;
  onToggleLinkToolbar: () => void;
  onOpenDataDrawer: (tab: DataDrawerTab) => void;
  showHistory: boolean;
  onToggleHistory: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedEdits: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSavingDraft: boolean;
  isPublishing: boolean;
  onBack: () => void;
  onSaveDraft: () => void;
  onOpenPreviewModal: () => void;
  onPublish: () => void;
}

export const PageBuilderToolbar: React.FC<PageBuilderToolbarProps> = ({
  page,
  workspaceLocale,
  hasAvailableCounterpartLocale = false,
  onSwitchLocale,
  selectedSectionId,
  onSelectSection,
  onToggleSelectedSectionVisibility,
  viewport,
  onViewportChange,
  canvasMode,
  onCanvasModeChange,
  formatState,
  onApplyFormat,
  showSeoPanel,
  onToggleSeoPanel,
  showLinkToolbar,
  onToggleLinkToolbar,
  onOpenDataDrawer,
  showHistory,
  onToggleHistory,
  canUndo,
  canRedo,
  hasUnsavedEdits,
  onUndo,
  onRedo,
  isSavingDraft,
  isPublishing,
  onBack,
  onSaveDraft,
  onOpenPreviewModal,
  onPublish,
}) => {
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  const selectedSection =
    page.draft.sections.find((s) => s.id === selectedSectionId) ?? page.draft.sections[0];
  const selectedDef = selectedSection ? sectionDefinitions[selectedSection.sectionKey] : undefined;
  const hasDraftDiff = hasUnsavedEdits || page.draft.version > page.published.version;
  const seoReady =
    Boolean(page.draft.seo.title?.trim()) && Boolean(page.draft.seo.description?.trim());
  const publicUrl =
    workspaceLocale === 'en'
      ? `/en${page.slug === '/' ? '' : page.slug}`
      : page.slug;
  const hasHeroSlides = page.draft.sections.some(
    (s) => s.sectionKey === 'home.hero' && Array.isArray(s.config.slides)
  );
  const hasDynamicSources = page.draft.sections.some((s) => {
    const def = sectionDefinitions[s.sectionKey];
    return def?.referenceLimit && Object.keys(def.referenceLimit).length > 0;
  });

  return (
    <header className="z-30 shrink-0 border-b border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* TIER 1: Page Context, Section Quick Jump, Language VI/EN, SEO, Mode & History */}
      {!headerCollapsed && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3.5 py-2 dark:border-slate-800/80">
          {/* Left: Back + Page Identity + Quick Section Jump */}
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              aria-label="Quay lại Danh sách trang"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Danh sách trang</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="max-w-[200px] truncate text-sm font-extrabold text-slate-950 sm:max-w-[280px] dark:text-white">
                  {page.name}
                </h1>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                    hasUnsavedEdits
                      ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300'
                      : hasDraftDiff
                        ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300'
                        : page.published.version > 0
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {hasUnsavedEdits
                    ? 'Chưa lưu nháp'
                    : hasDraftDiff
                      ? `Nháp v${page.draft.version} · Chưa publish`
                      : page.published.version > 0
                        ? `Đã xuất bản v${page.published.version}`
                        : 'Bản nháp mới'}
                </span>
              </div>
              <p className="truncate font-mono text-[11px] text-slate-400">{publicUrl}</p>
            </div>

            {page.draft.sections.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-2.5 dark:border-slate-800">
                <select
                  value={selectedSection?.id ?? ''}
                  onChange={(e) => onSelectSection(e.target.value)}
                  aria-label="Nhảy nhanh tới khu vực"
                  className="max-w-[230px] rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  {page.draft.sections.map((sec) => {
                    const def = sectionDefinitions[sec.sectionKey];
                    const hiddenTag = sec.visible === false ? ' (Đang ẩn)' : '';
                    return (
                      <option key={sec.id} value={sec.id}>
                        Khu vực {sec.position}: {def?.label ?? sec.sectionKey}
                        {hiddenTag}
                      </option>
                    );
                  })}
                </select>

                {selectedSection && selectedDef?.canHide && (
                  <button
                    type="button"
                    onClick={() => onToggleSelectedSectionVisibility(selectedSection.id)}
                    title={
                      selectedSection.visible === false
                        ? 'Khu vực này đang ẩn. Nhấn để hiển thị lại.'
                        : 'Nhấn để tạm ẩn khu vực này trên trang.'
                    }
                    className={`inline-flex items-center gap-1 rounded-xl border px-2 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                      selectedSection.visible === false
                        ? 'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    {selectedSection.visible === false ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Đang ẩn</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Đang hiện</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: VI/EN Switcher + SEO Google + Edit/Guest Mode + History + Live Link */}
          <div className="flex flex-wrap items-center gap-1.5">
            {onSwitchLocale && (
              <div
                className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800"
                title="Chuyển ngôn ngữ biên tập ngay trong Page Builder"
              >
                {(['vi', 'en'] as const).map((loc) => {
                  const active = workspaceLocale === loc;
                  const disabled = !active && !hasAvailableCounterpartLocale;
                  return (
                    <button
                      key={loc}
                      type="button"
                      disabled={disabled}
                      onClick={() => !active && onSwitchLocale(loc)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition cursor-pointer ${
                        active
                          ? 'bg-orange-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {loc === 'vi' ? '🇻🇳 VI (Gốc)' : '🇬🇧 EN'}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={onToggleSeoPanel}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                showSeoPanel
                  ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-orange-600" />
              <span>SEO Google</span>
              <span
                className={`h-2 w-2 rounded-full ${seoReady ? 'bg-emerald-500' : 'bg-amber-400'}`}
                title={seoReady ? 'Đã có đủ SEO Title & Description' : 'Nên bổ sung mô tả SEO'}
              />
            </button>

            <button
              type="button"
              onClick={() => onCanvasModeChange(canvasMode === 'edit' ? 'preview' : 'edit')}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                canvasMode === 'preview'
                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
              title="Chuyển đổi giữa chế độ Sửa trực tiếp và Xem như Khách truy cập"
            >
              {canvasMode === 'preview' ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Xem như Khách</span>
                </>
              ) : (
                <>
                  <MousePointerClick className="h-3.5 w-3.5 text-orange-600" />
                  <span className="hidden sm:inline">Sửa trực tiếp</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleHistory}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                showHistory
                  ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
              title="Lịch sử phiên bản & Khôi phục"
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Lịch sử</span>
            </button>

            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              title="Mở trang công khai ở tab mới"
            >
              <span className="hidden 2xl:inline">Trang thật</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* TIER 2: Compact Always-Pinned Formatting, Device, Link/DB Tools & Save/Publish */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2">
        {/* Left: Collapse Toggle + Viewport Switcher + Format Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setHeaderCollapsed((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            title={headerCollapsed ? 'Mở rộng thanh tiêu đề' : 'Thu gọn thanh tiêu đề để tăng diện tích soạn thảo'}
          >
            {headerCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{headerCollapsed ? page.name : 'Thu gọn'}</span>
          </button>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            {([
              ['desktop', Monitor, 'PC'],
              ['tablet', Tablet, 'Tablet'],
              ['mobile', Smartphone, 'Mobile'],
            ] as const).map(([val, Icon, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => onViewportChange(val)}
                title={`Khung nhìn ${label}`}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition cursor-pointer ${
                  viewport === val
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{label}</span>
              </button>
            ))}
          </div>

          {page.pageType === 'legal' ? (
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50/70 px-2.5 py-1 text-[11px] font-bold text-orange-800 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300">
              <FileText className="h-3.5 w-3.5" />
              Nhấp vào bài viết bên dưới để mở CKEditor 5 đầy đủ
            </span>
          ) : canvasMode === 'edit' ? (
            <PageBuilderFormatControls formatState={formatState} onApplyFormat={onApplyFormat} />
          ) : (
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              <Eye className="h-3.5 w-3.5" />
              Đang xem thử hiệu ứng chuyển động như khách truy cập
            </span>
          )}
        </div>

        {/* Right: Link/Phone, Slide & DB Drawer, Undo/Redo, Save Draft, Preview, Publish */}
        <div className="flex flex-wrap items-center gap-1.5">
          {page.pageType !== 'legal' && (
            <button
              type="button"
              onClick={onToggleLinkToolbar}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                showLinkToolbar
                  ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
              title="Gắn Link, Số điện thoại, Zalo hoặc đổi Video của khu vực đang chọn"
            >
              <Link2 className="h-3.5 w-3.5 text-orange-600" />
              <span className="hidden sm:inline">Link / SĐT</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onOpenDataDrawer(hasHeroSlides && selectedSection?.sectionKey === 'home.hero' ? 'slides' : hasDynamicSources && selectedDef?.referenceLimit ? 'sources' : 'section')
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/70 px-2.5 py-1.5 text-xs font-extrabold text-orange-800 hover:bg-orange-100 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300 cursor-pointer"
            title="Mở ngăn quản lý Slide Banner, Nguồn dữ liệu DB (Dự án, Tin tức, Sự kiện) và Cấu hình chi tiết"
          >
            <Database className="h-3.5 w-3.5 text-orange-600" />
            <span>{hasHeroSlides || hasDynamicSources ? 'Slide & Nguồn DB' : 'Cấu hình mục'}</span>
          </button>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Hoàn tác"
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Làm lại"
              title="Làm lại (Ctrl+Y)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <CmsButton
            size="sm"
            variant="secondary"
            leadingIcon={<Save />}
            loading={isSavingDraft}
            loadingText="Đang lưu..."
            disabled={isSavingDraft || isPublishing}
            onClick={onSaveDraft}
          >
            Lưu nháp
          </CmsButton>

          <CmsButton
            size="sm"
            variant="secondary"
            leadingIcon={<Eye />}
            disabled={isSavingDraft || isPublishing}
            onClick={onOpenPreviewModal}
          >
            <span className="hidden lg:inline">Xem trước</span>
          </CmsButton>

          <CmsButton
            size="sm"
            leadingIcon={<Send />}
            loading={isPublishing}
            loadingText="Đang xuất bản..."
            disabled={isSavingDraft || isPublishing}
            onClick={onPublish}
          >
            Xuất bản
          </CmsButton>
        </div>
      </div>
    </header>
  );
};
