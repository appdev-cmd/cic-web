import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
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
  Loader2,
  Monitor,
  MousePointerClick,
  Redo2,
  Save,
  Send,
  Smartphone,
  Tablet,
  Undo2,
} from 'lucide-react';
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
  onSectionStructureAction: (sectionId: string, action: 'toggle' | 'up' | 'down') => void;
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
  onOpenDataDrawer: (tab?: DataDrawerTab) => void;
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
  onSectionStructureAction,
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
  onPublish,
}) => {
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  const selectedIndex = Math.max(
    0,
    page.draft.sections.findIndex((s) => s.id === selectedSectionId)
  );
  const selectedSection = page.draft.sections[selectedIndex] ?? page.draft.sections[0];
  const selectedDef = selectedSection ? sectionDefinitions[selectedSection.sectionKey] : undefined;
  const hasDraftDiff = hasUnsavedEdits || page.draft.version > page.published.version;
  const seoReady =
    Boolean(page.draft.seo.title?.trim()) && Boolean(page.draft.seo.description?.trim());
  const publicUrl =
    workspaceLocale === 'en' ? `/en${page.slug === '/' ? '' : page.slug}` : page.slug;
  const hasHeroSlides = page.draft.sections.some(
    (s) => s.sectionKey === 'home.hero' && Array.isArray(s.config.slides)
  );
  const hasDynamicSources = page.draft.sections.some((s) => {
    const def = sectionDefinitions[s.sectionKey];
    return def?.referenceLimit && Object.keys(def.referenceLimit).length > 0;
  });

  const canMoveUp =
    Boolean(selectedDef?.canMove) &&
    selectedIndex > 0 &&
    Boolean(sectionDefinitions[page.draft.sections[selectedIndex - 1]?.sectionKey ?? '']?.canMove);
  const canMoveDown =
    Boolean(selectedDef?.canMove) &&
    selectedIndex < page.draft.sections.length - 1 &&
    Boolean(sectionDefinitions[page.draft.sections[selectedIndex + 1]?.sectionKey ?? '']?.canMove);

  return (
    <header className="z-30 shrink-0 border-b border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* ROW 1: Compact Page Context, Section Jump + Show/Hide/Move, VI/EN, SEO, Mode, History, Live Link */}
      {!headerCollapsed && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-1.5 dark:border-slate-800/80">
          {/* Left */}
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              aria-label="Quay lại Danh sách trang"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Danh sách trang</span>
            </button>

            {/* Page Pill like robot-web */}
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-100/90 px-2.5 py-1 dark:bg-slate-800">
              <h1 className="max-w-[180px] truncate text-xs font-extrabold text-slate-900 sm:max-w-[240px] dark:text-white">
                {page.name}
              </h1>
              <code className="hidden sm:inline font-mono text-[11px] text-slate-500 dark:text-slate-400">
                ({publicUrl})
              </code>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold ${
                  hasUnsavedEdits
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : hasDraftDiff
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}
              >
                {hasUnsavedEdits
                  ? 'Chưa lưu'
                  : hasDraftDiff
                    ? `Nháp v${page.draft.version}`
                    : `Live v${page.published.version || 1}`}
              </span>
            </div>

            {/* Section Quick Jump + Visibility + Move */}
            {page.draft.sections.length > 0 && (
              <div className="hidden md:flex items-center gap-1">
                <select
                  id="pb-section-jump"
                  name="pbSectionJump"
                  value={selectedSection?.id ?? ''}
                  onChange={(e) => onSelectSection(e.target.value)}
                  aria-label="Nhảy nhanh tới khu vực"
                  className="h-7 max-w-[210px] rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  {page.draft.sections.map((sec) => {
                    const def = sectionDefinitions[sec.sectionKey];
                    const hiddenTag = sec.visible === false ? ' [Ẩn]' : '';
                    return (
                      <option key={sec.id} value={sec.id}>
                        {sec.position}. {def?.label ?? sec.sectionKey}
                        {hiddenTag}
                      </option>
                    );
                  })}
                </select>

                {selectedSection && selectedDef?.canHide && (
                  <button
                    type="button"
                    onClick={() => onSectionStructureAction(selectedSection.id, 'toggle')}
                    title={
                      selectedSection.visible === false
                        ? 'Khu vực đang ẩn — nhấn để hiện lại'
                        : 'Khu vực đang hiện — nhấn để tạm ẩn'
                    }
                    className={`inline-flex h-7 items-center gap-1 rounded-lg border px-2 text-[11px] font-bold transition cursor-pointer ${
                      selectedSection.visible === false
                        ? 'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    {selectedSection.visible === false ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        <span className="hidden xl:inline">Đang ẩn</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        <span className="hidden xl:inline">Đang hiện</span>
                      </>
                    )}
                  </button>
                )}

                {selectedSection && selectedDef?.canMove && (
                  <div className="hidden xl:flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      disabled={!canMoveUp}
                      onClick={() => onSectionStructureAction(selectedSection.id, 'up')}
                      title="Đưa khu vực này lên trên"
                      className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 cursor-pointer"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={!canMoveDown}
                      onClick={() => onSectionStructureAction(selectedSection.id, 'down')}
                      title="Đưa khu vực này xuống dưới"
                      className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 cursor-pointer"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: VI/EN + SEO Google + Edit/Guest Mode + History + Live Link */}
          <div className="flex flex-wrap items-center gap-1.5">
            {onSwitchLocale && (
              <div
                className="flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800"
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
                      className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold transition cursor-pointer ${
                        active
                          ? 'bg-orange-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {loc === 'vi' ? 'VI (Gốc)' : 'EN'}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={onToggleSeoPanel}
              className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition cursor-pointer ${
                showSeoPanel
                  ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-orange-600" />
              <span>SEO Google</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${seoReady ? 'bg-emerald-500' : 'bg-amber-400'}`}
              />
            </button>

            <button
              type="button"
              onClick={() => onCanvasModeChange(canvasMode === 'edit' ? 'preview' : 'edit')}
              className={`inline-flex h-7 items-center gap-1 rounded-lg border px-2.5 text-xs font-bold transition cursor-pointer ${
                canvasMode === 'preview'
                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                  : 'border-orange-200 bg-orange-50/70 text-orange-800 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300'
              }`}
              title="Chuyển đổi giữa chế độ Sửa trực tiếp và Xem như Khách"
            >
              {canvasMode === 'preview' ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Xem như Khách</span>
                </>
              ) : (
                <>
                  <MousePointerClick className="h-3.5 w-3.5 text-orange-600" />
                  <span className="hidden sm:inline">Chế độ Sửa trực tiếp</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleHistory}
              className={`inline-flex h-7 items-center gap-1 rounded-lg border px-2 text-xs font-bold transition cursor-pointer ${
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
              className="hidden sm:inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-600 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              title="Mở trang thật ở tab mới"
            >
              <span className="hidden 2xl:inline">Mở trang thật</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ROW 2: Single-Line Compact Format Bar, Viewport, Link/SĐT, Slide & Nguồn DB, Undo/Redo, Save & Publish */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-50/70 px-3 py-1 dark:bg-slate-950/50">
        {/* Left: Collapse + Viewport + Format Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setHeaderCollapsed((v) => !v)}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
            title={headerCollapsed ? 'Mở rộng thanh tiêu đề' : 'Thu gọn thanh tiêu đề'}
          >
            {headerCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{headerCollapsed ? page.name : 'Thu gọn'}</span>
          </button>

          <div className="flex h-7 items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
            {(
              [
                ['desktop', Monitor, 'PC'],
                ['tablet', Tablet, 'Tablet'],
                ['mobile', Smartphone, 'Mobile'],
              ] as const
            ).map(([val, Icon, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => onViewportChange(val)}
                title={`Khung nhìn ${label}`}
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold transition cursor-pointer ${
                  viewport === val
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden 2xl:inline">{label}</span>
              </button>
            ))}
          </div>

          {page.pageType === 'legal' ? (
            <span className="hidden md:inline-flex h-7 items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50/70 px-2.5 text-[11px] font-bold text-orange-800 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300">
              <FileText className="h-3.5 w-3.5" />
              Nhấp vào bài viết bên dưới để mở CKEditor 5 đầy đủ
            </span>
          ) : canvasMode === 'edit' ? (
            <PageBuilderFormatControls formatState={formatState} onApplyFormat={onApplyFormat} />
          ) : (
            <span className="hidden md:inline-flex h-7 items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              <Eye className="h-3.5 w-3.5" />
              Đang xem hiệu ứng thực tế như khách truy cập
            </span>
          )}
        </div>

        {/* Right: Link / SĐT, Slide & Nguồn DB, Undo/Redo, Save Draft, Publish */}
        <div className="flex items-center gap-1.5">
          {page.pageType !== 'legal' && (
            <button
              type="button"
              onClick={onToggleLinkToolbar}
              className={`inline-flex h-7 items-center gap-1 rounded-lg border px-2 text-xs font-bold transition cursor-pointer ${
                showLinkToolbar
                  ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
              title="Gắn Link, Số điện thoại, Zalo hoặc đổi Video"
            >
              <Link2 className="h-3.5 w-3.5 text-orange-600" />
              <span className="hidden sm:inline">Link / SĐT</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenDataDrawer()}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-2.5 text-xs font-extrabold text-orange-800 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300 cursor-pointer"
            title="Mở hộp thoại quản lý Slide Banner, Chọn nguồn Dự án / Sự kiện / Tin tức từ Database & Ẩn/Hiện khu vực"
          >
            <Database className="h-3.5 w-3.5 text-orange-600" />
            <span>{hasHeroSlides || hasDynamicSources ? 'Slide & Nguồn DB' : 'Dữ liệu & Bố cục'}</span>
          </button>

          <div className="flex h-7 items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 cursor-pointer"
              aria-label="Hoàn tác"
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 cursor-pointer"
              aria-label="Làm lại"
              title="Làm lại (Ctrl+Y)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            disabled={isSavingDraft || isPublishing}
            onClick={onSaveDraft}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
          >
            {isSavingDraft ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-600" />
            ) : (
              <Save className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            )}
            <span>Lưu nháp</span>
          </button>

          <button
            type="button"
            disabled={isSavingDraft || isPublishing}
            onClick={onPublish}
            className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-orange-600 px-3 text-xs font-extrabold text-white shadow-2xs hover:bg-orange-500 disabled:opacity-50 cursor-pointer"
          >
            {isPublishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Xuất bản</span>
          </button>
        </div>
      </div>
    </header>
  );
};
