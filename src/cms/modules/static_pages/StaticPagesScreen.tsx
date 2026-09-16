'use client';

import React, { useMemo, useState, useTransition } from 'react';
import {
  CheckCircle2,
  Edit,
  Eye,
  FileText,
  Globe2,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { PageBuilderEditor } from './PageBuilderEditor';
import { PageBuilderPreviewModal } from './PageBuilderPreviewModal';
import { pageBuilderEntityOptions } from './pageBuilderData';
import { getDemoMediaPickerItems } from '../../data/demoMediaDataSource';
import type { CmsStaticPageListItem, SaveDraftInput, StaticPageFullDetail } from '@/features/static-pages/types';
import type { PageBuilderPage, PageBuilderEntityType, PageBuilderReference, PageBuilderEntityOption } from './pageBuilderTypes';
import {
  savePageDraftAction,
  publishPageAction,
  createLegalPageAction,
  getCmsPageDetailAction,
  getPageBuilderEntityOptionsAction,
} from '@/features/static-pages/server/actions';

interface StaticPagesScreenProps {
  pagesByLocale: Record<'vi' | 'en', CmsStaticPageListItem[]>;
  capabilities: {
    edit: boolean;
    publish: boolean;
    createLegal: boolean;
  };
}

const formatTime = (value: string | null) => {
  if (!value) return 'Chưa cập nhật';
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
};

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const shortSlug = (value: string) =>
  slugify(value).split('-').slice(0, 6).join('-').slice(0, 42).replace(/-$/, '');

const defaultEcosystemItems = [
  {
    id: 'ai-smart-tech',
    link: '/products',
    view: 'products',
    badge: 'Advanced Technology',
    title: 'AI & Công nghệ thông minh',
    imageId: '/banner_hero/dan_dau_chuyen_doi_so.png',
    activeLink: 'Sản phẩm',
    description: 'Ứng dụng AI, dữ liệu lớn, IoT và tự động hóa vào các bài toán kỹ thuật phức tạp, giúp tối ưu quy trình và hỗ trợ ra quyết định dựa trên dữ liệu thực tế.',
  },
  {
    id: 'bim-digital-twins',
    link: '/services/tu-van-bim',
    view: 'services',
    badge: 'BIM & Digital Twins',
    title: 'BIM & Digital Twins',
    imageId: '/banner_hero/He_sinh_thai_giai_phap_so.png',
    serviceId: 'tu-van-bim',
    activeLink: 'Dịch vụ',
    description: 'Đào tạo, tạo lập và thẩm tra mô hình BIM, số hóa công trình từ thiết kế đến vận hành.',
  },
  {
    id: 'licensed-software',
    link: '/products',
    view: 'products',
    badge: 'Phần mềm',
    title: 'Phần mềm kỹ thuật bản quyền',
    imageId: '/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg',
    activeLink: 'Sản phẩm',
    description: 'Hệ sinh thái CAD, BIM, kết cấu, hạ tầng và năng lượng do CIC phát triển và phân phối.',
  },
  {
    id: 'technology-equipment',
    link: '/products',
    view: 'products',
    badge: 'Thiết bị & IoT',
    title: 'Thiết bị công nghệ',
    imageId: '/banner_hero/He_sinh_thai_giai_phap_so.png',
    activeLink: 'Sản phẩm',
    description: 'Thiết bị khảo sát, kiểm định, đo đạc, UAV, LiDAR và GPR phục vụ ngành kỹ thuật.',
  },
  {
    id: 'net-zero',
    link: '/services/tu-van-kiem-ke-khi-nha-kinh',
    view: 'services',
    badge: 'Sustainability',
    title: 'Net Zero và phát triển bền vững',
    imageId: '/banner_hero/dan_dau_chuyen_doi_so.png',
    serviceId: 'tu-van-kiem-ke-khi-nha-kinh',
    activeLink: 'Dịch vụ',
    description: 'Giải pháp kiểm kê phát thải, LCA, EPD, CBAM và xây dựng lộ trình Net Zero.',
  },
  {
    id: 'consulting-training',
    link: '/services',
    view: 'services',
    badge: 'Tư vấn chuyên sâu',
    title: 'Tư vấn & Đào tạo',
    imageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png',
    serviceId: null,
    activeLink: 'Dịch vụ',
    description: 'Đồng hành chuyển đổi số, triển khai công nghệ AI, Net Zero và BIM chuyên sâu.',
  },
];

function enrichSectionConfig(sectionKey: string, rawConfig: Record<string, any> | null | undefined): Record<string, any> {
  const cfg = { ...(rawConfig || {}) };
  if (sectionKey === 'home.ecosystem' && (!cfg.items || !Array.isArray(cfg.items) || cfg.items.length === 0)) {
    cfg.items = defaultEcosystemItems;
  }
  if (sectionKey === 'about.hero') {
    if (!cfg.title) cfg.title = 'HƠN 35 NĂM NHỊP BƯỚC CÙNG CÔNG NGHỆ';
    if (!cfg.subtitle) cfg.subtitle = 'Tiên phong cung cấp giải pháp phần mềm kỹ thuật, thiết bị công nghệ và tư vấn chuyển đổi số toàn diện cho ngành Xây dựng Việt Nam.';
    if (!cfg.backgroundImageId) cfg.backgroundImageId = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80';
  }
  if (sectionKey === 'about.overview') {
    if (!cfg.title) cfg.title = 'Tổng quan doanh nghiệp';
    if (!cfg.paragraphs || !Array.isArray(cfg.paragraphs) || cfg.paragraphs.length === 0) {
      cfg.paragraphs = [
        'Công ty Cổ phần Công nghệ và Tư vấn CIC tiền thân là Trung tâm tin học thuộc Bộ Xây dựng thành lập vào ngày 27/11/1990, bắt đầu hoạt động với chức năng là cơ quan tham mưu tin học thuộc Bộ Xây dựng nhằm phục vụ yêu cầu ứng dụng và phát triển Công nghệ thông tin trong ngành.',
        'Hiện nay, chúng tôi là thành viên của VC Group, tổ hợp hàng đầu về tư vấn xây dựng, thiết bị và công nghệ tại Việt Nam.',
        'Sau hơn 35 năm phát triển, CIC đã xây dựng được đội ngũ quản lý vững vàng cùng tập thể nhân viên có trình độ chuyên môn cao, sáng tạo và tận tâm; cung cấp sản phẩm phần mềm, thiết bị và dịch vụ công nghệ có tính ứng dụng cao cho ngành Xây dựng.',
      ];
    }
    if (!cfg.videoUrl) cfg.videoUrl = 'https://www.youtube.com/embed/hdLFK_09-tU?start=448';
  }
  if (sectionKey === 'about.awards') {
    if (!cfg.title) cfg.title = 'Giải thưởng & Chứng nhận';
    if (cfg.syncWithHome === undefined) cfg.syncWithHome = true;
  }
  if (sectionKey === 'about.partners') {
    if (!cfg.title) cfg.title = 'Đối tác chiến lược';
    if (cfg.syncWithHome === undefined) cfg.syncWithHome = true;
  }
  if (sectionKey === 'about.capacity') {
    if (!cfg.title) cfg.title = 'Tiềm lực vững vàng, vươn tầm quốc tế';
    if (!cfg.description) cfg.description = 'Trải qua hành trình hơn 35 năm phát triển, CIC không ngừng khẳng định vị thế dẫn đầu trong việc cung cấp các giải pháp công nghệ tiên tiến.';
  }
  return cfg;
}

/** Maps StaticPageFullDetail from server to PageBuilderPage for PageBuilderEditor */
function toPageBuilderPage(detail: StaticPageFullDetail): PageBuilderPage {
  return {
    id: detail.id,
    code: detail.code,
    name: detail.name,
    slug: detail.slug,
    pageType: detail.pageType,
    templateKey: detail.templateKey,
    systemDefined: detail.systemDefined,
    draft: {
      version: detail.draft.versionNumber,
      status: detail.draft.state,
      updatedAt: detail.draft.createdAt,
      publishedAt: detail.draft.publishedAt ?? undefined,
      seo: {
        title: detail.draft.seoTitle,
        description: detail.draft.seoDescription,
      },
      sections: detail.draft.sections.map((s) => {
        const refMap = new Map<PageBuilderEntityType, string[]>();
        s.references?.forEach((r) => {
          const type = r.entityType as PageBuilderEntityType;
          const list = refMap.get(type) ?? [];
          list.push(r.entityId);
          refMap.set(type, list);
        });
        const defaultRefsBySection: Record<string, { entityType: PageBuilderEntityType; defaultIds: string[] }> = {
          'home.projects': { entityType: 'project', defaultIds: ['3', '4', '5'] },
          'home.events': { entityType: 'event', defaultIds: ['40', '11', '9', '13'] },
          'home.news': { entityType: 'news', defaultIds: ['1719', '1718', '1717', '1716'] },
        };
        const def = defaultRefsBySection[s.sectionKey];
        if (def && (!refMap.has(def.entityType) || refMap.get(def.entityType)!.length === 0)) {
          refMap.set(def.entityType, def.defaultIds);
        }
        const cfg = enrichSectionConfig(s.sectionKey, s.config as any);
        const refSources = (cfg._referenceSources || {}) as Record<string, any>;
        const references: PageBuilderReference[] = Array.from(refMap.entries()).map(([entityType, entityIds]) => {
          const isFeatured = cfg.referenceSource?.mode === 'auto_featured' || cfg.referenceSource?.mode === 'featured';
          const defaultSource = isFeatured ? cfg.referenceSource : { mode: 'featured', limit: entityIds.length };
          return {
            entityType,
            entityIds,
            source: refSources[entityType] ?? defaultSource,
          };
        });
        return {
          id: s.id,
          sectionKey: s.sectionKey,
          sectionType: s.sectionType,
          position: s.position,
          config: cfg as any,
          references: references.length > 0 ? references : undefined,
        };
      }),
    },
    published: detail.published
      ? {
          version: detail.published.versionNumber,
          status: detail.published.state,
          updatedAt: detail.published.createdAt,
          publishedAt: detail.published.publishedAt ?? undefined,
          seo: {
            title: detail.published.seoTitle,
            description: detail.published.seoDescription,
          },
          sections: detail.published.sections.map((s) => {
            const refMap = new Map<PageBuilderEntityType, string[]>();
            s.references?.forEach((r) => {
              const type = r.entityType as PageBuilderEntityType;
              const list = refMap.get(type) ?? [];
              list.push(r.entityId);
              refMap.set(type, list);
            });
            const defaultRefsBySection: Record<string, { entityType: PageBuilderEntityType; defaultIds: string[] }> = {
              'home.projects': { entityType: 'project', defaultIds: ['3', '4', '5'] },
              'home.events': { entityType: 'event', defaultIds: ['40', '11', '9', '13'] },
              'home.news': { entityType: 'news', defaultIds: ['1719', '1718', '1717', '1716'] },
            };
            const def = defaultRefsBySection[s.sectionKey];
            if (def && (!refMap.has(def.entityType) || refMap.get(def.entityType)!.length === 0)) {
              refMap.set(def.entityType, def.defaultIds);
            }
            const cfg = enrichSectionConfig(s.sectionKey, s.config as any);
            const refSources = (cfg._referenceSources || {}) as Record<string, any>;
            const references: PageBuilderReference[] = Array.from(refMap.entries()).map(([entityType, entityIds]) => {
              const isFeatured = cfg.referenceSource?.mode === 'auto_featured' || cfg.referenceSource?.mode === 'featured';
              const defaultSource = isFeatured ? cfg.referenceSource : { mode: 'featured', limit: entityIds.length };
              return {
                entityType,
                entityIds,
                source: refSources[entityType] ?? defaultSource,
              };
            });
            return {
              id: s.id,
              sectionKey: s.sectionKey,
              sectionType: s.sectionType,
              position: s.position,
              config: cfg as any,
              references: references.length > 0 ? references : undefined,
            };
          }),
        }
      : {
          version: 0,
          status: 'published',
          updatedAt: detail.updatedAt,
          seo: { title: detail.name, description: '' },
          sections: [],
        },
    history: detail.history?.map((h) => ({
      version: h.versionNumber,
      status: h.state as any,
      updatedAt: h.createdAt,
      publishedAt: h.publishedAt ?? undefined,
      seo: { title: '', description: '' },
      sections: [],
    })),
  };
}

/** Maps PageBuilderPage from editor back to SaveDraftInput for server action */
function toSaveDraftInput(page: PageBuilderPage): SaveDraftInput {
  return {
    seo: {
      title: page.draft.seo.title,
      description: page.draft.seo.description,
    },
    sections: page.draft.sections.map((sec, idx) => {
      const config = { ...sec.config } as Record<string, unknown>;
      if (sec.references && sec.references.length > 0) {
        const refSources: Record<string, any> = {};
        sec.references.forEach((ref) => {
          if (ref.source) refSources[ref.entityType] = ref.source;
        });
        if (Object.keys(refSources).length > 0) {
          config._referenceSources = refSources;
        }
      }
      return {
        sectionKey: sec.sectionKey,
        sectionType: sec.sectionType,
        position: sec.position || idx + 1,
        config,
        references: sec.references?.flatMap((ref) =>
          ref.entityIds.map((id, p) => ({
            entityType: ref.entityType,
            entityId: id,
            position: p + 1,
          }))
        ),
      };
    }),
  };
}

export function StaticPagesScreen({ pagesByLocale, capabilities }: StaticPagesScreenProps) {
  const workspaceLocale = useCmsWorkspaceLocale();
  const [pages, setPages] = useState<CmsStaticPageListItem[]>(() => pagesByLocale[workspaceLocale] ?? []);
  const [editingPage, setEditingPage] = useState<PageBuilderPage | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [previewPage, setPreviewPage] = useState<PageBuilderPage | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'has_draft' | 'published'>('all');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isPending, startTransition] = useTransition();
  const [entityOptions, setEntityOptions] = useState<PageBuilderEntityOption[]>(() => pageBuilderEntityOptions);

  // Load real entities from database
  React.useEffect(() => {
    getPageBuilderEntityOptionsAction(workspaceLocale).then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const existingIds = new Set(res.data.map((item) => item.id));
        const merged = [...res.data, ...pageBuilderEntityOptions.filter((item) => !existingIds.has(item.id))];
        setEntityOptions(merged);
      }
    }).catch((err) => {
      console.error('Failed to load DB entity options for page builder:', err);
    });
  }, [workspaceLocale]);

  // Keep pages in sync when workspace locale changes
  React.useEffect(() => {
    setPages(pagesByLocale[workspaceLocale] ?? []);
    setCurrentPage(1);
  }, [workspaceLocale, pagesByLocale]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const normalized = query.trim().toLowerCase();
      const matchesQuery =
        !normalized ||
        page.name.toLowerCase().includes(normalized) ||
        page.slug.toLowerCase().includes(normalized) ||
        page.code.toLowerCase().includes(normalized);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published'
          ? page.published.version > 0
          : page.draft.version > page.published.version);
      return matchesQuery && matchesStatus;
    });
  }, [pages, query, statusFilter]);

  const paginatedPages = useMemo(() => {
    return filteredPages.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredPages, currentPage, pageSize]);

  const suggestedSlug = useMemo(() => {
    const base = shortSlug(newPageName) || 'trang-noi-dung';
    if (!pages.some((page) => page.slug === `/${base}`)) return base;
    let suffix = 2;
    while (pages.some((page) => page.slug === `/${base}-${suffix}`)) suffix += 1;
    return `${base}-${suffix}`;
  }, [newPageName, pages]);

  const handleEdit = async (pageListItem: CmsStaticPageListItem) => {
    setIsLoadingDetail(true);
    try {
      const res = await getCmsPageDetailAction(Number(pageListItem.id));
      if (!res.success || !res.data) {
        showToast(res.error ?? 'Không thể tải dữ liệu trang.', 'error');
        return;
      }
      const editorPage = toPageBuilderPage(res.data as StaticPageFullDetail);
      setEditingPage(editorPage);
    } catch {
      showToast('Lỗi khi tải chi tiết trang.', 'error');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleSaveDraft = (nextPage: PageBuilderPage) => {
    startTransition(async () => {
      const input = toSaveDraftInput(nextPage);
      const res = await savePageDraftAction(Number(nextPage.id), input);
      if (!res.success || !res.data) {
        showToast(res.error ?? 'Lỗi lưu bản nháp.', 'error');
        return;
      }
      const newVersion = res.data.versionNumber;
      const updatedPage: PageBuilderPage = {
        ...nextPage,
        draft: {
          ...nextPage.draft,
          version: newVersion,
          status: 'draft',
          updatedAt: new Date().toISOString(),
        },
      };
      setEditingPage(updatedPage);
      setPages((current) =>
        current.map((p) =>
          p.id === nextPage.id
            ? {
                ...p,
                draft: {
                  ...p.draft,
                  version: newVersion,
                  updatedAt: new Date().toISOString(),
                },
              }
            : p
        )
      );
      showToast('Đã lưu bản nháp vào Database. Website công khai chưa thay đổi.');
    });
  };

  const handlePublish = (nextPage: PageBuilderPage) => {
    startTransition(async () => {
      // First save draft if modified, then publish
      const input = toSaveDraftInput(nextPage);
      const saveRes = await savePageDraftAction(Number(nextPage.id), input);
      if (!saveRes.success) {
        showToast(saveRes.error ?? 'Lỗi lưu trước khi xuất bản.', 'error');
        return;
      }

      const pubRes = await publishPageAction(Number(nextPage.id));
      if (!pubRes.success || !pubRes.data) {
        showToast(pubRes.error ?? 'Lỗi xuất bản trang.', 'error');
        return;
      }

      const newVersion = pubRes.data.versionNumber;
      const nowIso = new Date().toISOString();
      const updatedPage: PageBuilderPage = {
        ...nextPage,
        published: {
          ...JSON.parse(JSON.stringify(nextPage.draft)),
          version: newVersion,
          status: 'published',
          publishedAt: nowIso,
          updatedAt: nowIso,
        },
      };
      setEditingPage(updatedPage);
      setPages((current) =>
        current.map((p) =>
          p.id === nextPage.id
            ? {
                ...p,
                published: {
                  ...p.published,
                  version: newVersion,
                  publishedAt: nowIso,
                },
              }
            : p
        )
      );
      showToast(`Đã xuất bản thành công! Link công khai: https://cic.com.vn${nextPage.slug}`);
    });
  };

  const handleCreateLegal = () => {
    if (!capabilities.createLegal) {
      showToast('Bạn không có quyền tạo trang nội dung.', 'error');
      return;
    }
    const name = newPageName.trim();
    const slug = `/${suggestedSlug}`;
    if (!name) return;

    startTransition(async () => {
      const res = await createLegalPageAction({
        workspace: workspaceLocale,
        name,
        slug,
      });

      if (!res.success || !res.data) {
        showToast(res.error ?? 'Không thể tạo trang mới.', 'error');
        return;
      }

      setCreateOpen(false);
      setNewPageName('');
      showToast(`Đã tạo trang "${name}" (Draft). Bắt đầu biên tập nội dung.`);

      // Open editor for new page
      const detailRes = await getCmsPageDetailAction(Number(res.data.id));
      if (detailRes.success && detailRes.data) {
        const editorPage = toPageBuilderPage(detailRes.data as StaticPageFullDetail);
        setEditingPage(editorPage);
      }
    });
  };

  const mediaImages = useMemo(() => getDemoMediaPickerItems(workspaceLocale), [workspaceLocale]);

  // If in editor view
  if (editingPage) {
    return (
      <>
        {toast && <Toast message={toast.message} type={toast.type} />}
        <PageBuilderEditor
          key={`${editingPage.id}-${editingPage.draft.version}-${editingPage.published.version}`}
          workspaceLocale={workspaceLocale}
          page={editingPage}
          entityOptions={entityOptions}
          mediaImages={mediaImages}
          onBack={() => setEditingPage(null)}
          onSaveDraft={handleSaveDraft}
          onPreview={setPreviewPage}
          onPublish={handlePublish}
        />
        <PageBuilderPreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />
      </>
    );
  }

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {isLoadingDetail && <LoadingOverlay message="Đang tải dữ liệu trang từ Database..." />}

      <CmsPageHeader
        icon={<FileText />}
        title="Trang nội dung"
        description="Quản lý các trang thiết kế riêng và tạo trang mới theo mẫu nội dung chuẩn."
        meta={
          <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
            {pages.length} Page · {workspaceLocale.toUpperCase()}
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <CmsButton
              variant="secondary"
              leadingIcon={<RefreshCw className={isPending ? 'animate-spin' : ''} />}
              onClick={() => {
                showToast('Đã làm mới danh sách trang.');
              }}
            >
              Làm mới
            </CmsButton>
            {capabilities.createLegal && (
              <CmsButton leadingIcon={<Plus />} onClick={() => setCreateOpen(true)}>
                Tạo trang nội dung
              </CmsButton>
            )}
          </div>
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
          <div className="relative flex items-center md:col-span-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên, code hoặc đường dẫn..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 md:col-span-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="has_draft">Có thay đổi bản nháp</option>
            <option value="published">Đã xuất bản</option>
          </select>

          <div className="flex justify-end md:col-span-3">
            <button
              type="button"
              disabled={!query && statusFilter === 'all'}
              onClick={() => {
                setQuery('');
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className="flex h-9 w-24 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="hidden overflow-x-auto md:block">
          <table className="cms-data-table min-w-[920px] text-left w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500">
                <th className="p-3">Page</th>
                <th className="p-3">Code / đường dẫn</th>
                <th className="p-3">Section</th>
                <th className="p-3">Draft</th>
                <th className="p-3">Published</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPages.map((page) => (
                <PageRow
                  key={page.id}
                  page={page}
                  onPreview={() => {
                    // Preview requires loading full detail
                    handleEdit(page);
                  }}
                  onEdit={() => handleEdit(page)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
          {paginatedPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onPreview={() => handleEdit(page)}
              onEdit={() => handleEdit(page)}
            />
          ))}
        </div>

        {filteredPages.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            Không tìm thấy Page phù hợp.
          </div>
        )}

        <CmsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={filteredPages.length}
          itemLabel="Page"
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </section>

      <PageBuilderPreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />

      {createOpen && (
        <CreatePageModal
          name={newPageName}
          slug={suggestedSlug}
          isSubmitting={isPending}
          onNameChange={setNewPageName}
          onClose={() => setCreateOpen(false)}
          onCreate={handleCreateLegal}
        />
      )}
    </div>
  );
}

function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  const isError = type === 'error';
  return (
    <div
      className={`fixed bottom-6 right-6 z-[80] flex max-w-[calc(100vw-3rem)] items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold text-white shadow-2xl ${
        isError ? 'border-rose-700 bg-rose-900' : 'border-slate-700 bg-slate-900'
      }`}
    >
      {isError ? (
        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
      ) : (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      )}
      {message}
    </div>
  );
}

function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 backdrop-blur-xs">
      <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 px-6 py-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100">
        <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
        {message}
      </div>
    </div>
  );
}

function typeLabel(templateKey: string) {
  return templateKey === 'legal_standard' ? 'Mẫu nội dung chuẩn' : 'Thiết kế riêng';
}

function PageRow({
  page,
  onPreview,
  onEdit,
}: {
  page: CmsStaticPageListItem;
  onPreview: () => void;
  onEdit: () => void;
}) {
  const changed = page.draft.version > page.published.version;
  return (
    <tr className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
      <td className="p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
            <Globe2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{page.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{typeLabel(page.templateKey)}</p>
          </div>
        </div>
      </td>
      <td className="p-3">
        <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{page.code}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{page.slug}</p>
      </td>
      <td className="p-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {page.sectionCount} cố định
      </td>
      <td className="p-3">
        <span
          className={`rounded-md px-2 py-1 text-xs font-bold ${
            changed
              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          v{page.draft.version}
          {changed ? ' · Chưa publish' : ''}
        </span>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          {formatTime(page.draft.updatedAt)}
        </p>
      </td>
      <td className="p-3">
        {page.published.version > 0 ? (
          <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            v{page.published.version} · Published
          </span>
        ) : (
          <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Chưa xuất bản
          </span>
        )}
      </td>
      <td className="p-3">
        <div className="flex justify-end gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer"
            title="Chỉnh sửa & Xem trước"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function PageCard({
  page,
  onPreview,
  onEdit,
}: {
  page: CmsStaticPageListItem;
  onPreview: () => void;
  onEdit: () => void;
}) {
  return (
    <article className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
            <Globe2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">{page.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{typeLabel(page.templateKey)}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg bg-orange-50 dark:bg-orange-950/50 p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 cursor-pointer"
            aria-label={`Chỉnh sửa ${page.name}`}
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
        <p className="break-all font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
          {page.slug}
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {page.sectionCount} section cố định · Draft v{page.draft.version}
          {page.published.version > 0 ? ` · Published v${page.published.version}` : ' · Chưa xuất bản'}
        </p>
      </div>
    </article>
  );
}

function CreatePageModal({
  name,
  slug,
  isSubmitting,
  onNameChange,
  onClose,
  onCreate,
}: {
  name: string;
  slug: string;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Tạo trang nội dung"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Tạo trang nội dung</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Dùng cùng thiết kế chuẩn với Chính sách bảo mật và Điều khoản sử dụng.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tên trang *</span>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 text-sm outline-none focus:border-orange-500"
              placeholder="Ví dụ: Quy chế hoạt động"
            />
          </label>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Đường dẫn tự động
            </p>
            <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">
              /{slug}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Nếu đã tồn tại, hệ thống tự thêm hậu tố ngắn như -2, -3.
            </p>
          </div>

          <div className="break-all rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 p-3 text-xs text-orange-800 dark:text-orange-300">
            <span className="font-bold">Link sau khi xuất bản:</span> https://cic.com.vn/{slug}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <CmsButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </CmsButton>
          <CmsButton onClick={onCreate} disabled={!name.trim() || isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo Draft'}
          </CmsButton>
        </div>
      </div>
    </div>
  );
}
