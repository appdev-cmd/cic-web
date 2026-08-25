import React from 'react';
import {
  Package,
  FileText,
  Newspaper,
  Calendar,
  Briefcase,
  Users,
  Settings,
  Search,
  Inbox,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Tag,
  FolderTree,
  Mail,
  Sliders,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  LucideIcon,
  Image as ImageIcon,
  FormInput,
  Radio,
  FileCode,
  Building2,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';

import { demoCatalogDataSource } from '../data/demoCatalogDataSource';
import { demoEditorialContentDataSource } from '../data/demoEditorialContentDataSource';
import { demoCustomerInteractionDataSource } from '../data/demoCustomerInteractionDataSource';
import { demoContactsDataSource } from '../data/demoContactsDataSource';
import { demoGovernanceDataSource } from '../data/demoGovernanceDataSource';
import { getCmsStaticPagesData } from '../modules/static_pages/staticPagesData';
import { getCmsProjectsData } from '../modules/projects/projectsData';
import { getCmsEventsData } from '../modules/events/eventsData';
import { getDemoMediaModuleData } from '../data/demoMediaDataSource';
import { CmsLocale } from '../data/CmsDataSource';

export type SearchResultModule =
  | 'command'
  | 'products'
  | 'news'
  | 'customer_requests'
  | 'events'
  | 'projects'
  | 'static_pages'
  | 'services'
  | 'forms_cta'
  | 'media'
  | 'users_permissions';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  module: SearchResultModule;
  moduleLabel: string;
  category?: string;
  statusText?: string;
  statusColor?: 'emerald' | 'amber' | 'blue' | 'slate' | 'rose' | 'orange';
  path: string;
  actionType: 'navigate' | 'edit' | 'open_modal' | 'view';
  icon: LucideIcon;
  metadata?: {
    sku?: string;
    email?: string;
    phone?: string;
    company?: string;
    code?: string;
    slug?: string;
    date?: string;
    author?: string;
    location?: string;
    tags?: string[];
  };
  keywords: string[];
  requiredRole?: string[];
}

export interface GroupedSearchResults {
  module: SearchResultModule;
  label: string;
  icon: LucideIcon;
  totalCount: number;
  items: SearchResultItem[];
}

export interface RecentSearchItem {
  query: string;
  timestamp: number;
}

export interface RecentVisitedItem {
  id: string;
  title: string;
  moduleLabel: string;
  path: string;
  iconName: string;
  timestamp: number;
}

/**
 * Chuẩn hóa chuỗi tiếng Việt: Bỏ dấu, chuyển chữ thường, loại bỏ ký tự dư thừa
 */
export function normalizeVietnamese(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .trim();
}

/**
 * Kiểm tra xem chuỗi văn bản có khớp với từ khóa tìm kiếm (hỗ trợ có dấu và không dấu)
 */
export function matchesQuery(targetText: string | undefined | null, searchTokens: string[], rawNormalizedQuery: string): boolean {
  if (!targetText) return false;
  const normalizedTarget = normalizeVietnamese(targetText);
  const lowerTarget = targetText.toLowerCase();

  // Khớp nguyên cụm trước
  if (lowerTarget.includes(rawNormalizedQuery) || normalizedTarget.includes(rawNormalizedQuery)) {
    return true;
  }

  // Khớp toàn bộ các tokens (từ khóa con)
  return searchTokens.every(token => normalizedTarget.includes(token) || lowerTarget.includes(token));
}

/**
 * Highlight từ khóa tìm kiếm trong chuỗi văn bản
 */
export function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim() || !text) return text;

  const normalizedQuery = normalizeVietnamese(query.trim());
  const words = normalizedQuery.split(/\s+/).filter(Boolean);

  if (words.length === 0) return text;

  // Tạo pattern regex tìm các từ
  // Để an toàn với tiếng Việt, chúng ta tách chuỗi theo vị trí
  const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${escapedWords})`, 'gi');

  // Thử match không dấu bằng cách scan chuỗi
  const normalizedText = normalizeVietnamese(text);
  const matchIndices: Array<{ start: number; end: number }> = [];

  for (const word of words) {
    let pos = 0;
    while ((pos = normalizedText.indexOf(word, pos)) !== -1) {
      matchIndices.push({ start: pos, end: pos + word.length });
      pos += Math.max(1, word.length);
    }
  }

  if (matchIndices.length === 0) {
    return text;
  }

  // Sắp xếp và gộp các khoảng trùng lặp
  matchIndices.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const cur of matchIndices) {
    if (merged.length === 0) {
      merged.push(cur);
    } else {
      const prev = merged[merged.length - 1];
      if (cur.start <= prev.end) {
        prev.end = Math.max(prev.end, cur.end);
      } else {
        merged.push(cur);
      }
    }
  }

  // Cắt và render các đoạn text
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  merged.forEach((interval, i) => {
    if (interval.start > lastIndex) {
      parts.push(text.substring(lastIndex, interval.start));
    }
    parts.push(
      <mark key={i} className="bg-amber-200 dark:bg-amber-500/30 text-amber-950 dark:text-amber-200 font-semibold px-0.5 rounded-xs">
        {text.substring(interval.start, interval.end)}
      </mark>
    );
    lastIndex = interval.end;
  });

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}

/**
 * Danh mục các chức năng / lệnh điều hướng nhanh trong hệ thống CMS
 */
export const CMS_COMMANDS: SearchResultItem[] = [
  {
    id: 'cmd_dashboard',
    title: 'Đi tới → Bảng điều khiển Tổng quan',
    subtitle: 'Xem thống kê lưu lượng, liên hệ mới, phê duyệt nội dung',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Điều hướng',
    path: '/cms/dashboard',
    actionType: 'navigate',
    icon: Layers,
    keywords: ['dashboard', 'tong quan', 'trang chu', 'thong ke', 'home', 'bao cao'],
  },
  {
    id: 'cmd_products',
    title: 'Đi tới → Quản lý Sản phẩm phần mềm & Thiết bị',
    subtitle: 'Danh sách sản phẩm, giá bán, phiên bản license, tải tài liệu',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Sản phẩm',
    path: '/cms/products',
    actionType: 'navigate',
    icon: Package,
    keywords: ['san pham', 'product', 'phan mem', 'thiet bi', 'license', 'etabs', 'sap2000', 'plaxis', 'stcad', 'enjicad', 'zwcad', 'catalog'],
  },
  {
    id: 'cmd_product_settings',
    title: 'Đi tới → Danh mục & Phân loại Sản phẩm',
    subtitle: 'Quản lý cây danh mục, nhóm sản phẩm, lĩnh vực ứng dụng',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Sản phẩm',
    path: '/cms/product-settings',
    actionType: 'navigate',
    icon: FolderTree,
    keywords: ['danh muc san pham', 'danh muc', 'loai san pham', 'ung dung', 'category', 'taxonomy', 'tree'],
  },
  {
    id: 'cmd_manufacturers',
    title: 'Đi tới → Hãng sản xuất & Đối tác công nghệ',
    subtitle: 'Quản lý thương hiệu CSI, Bentley, Seequent, ZWSOFT, Hexagon...',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Sản phẩm',
    path: '/cms/products/brands',
    actionType: 'navigate',
    icon: Building2,
    keywords: ['hang san xuat', 'nha san xuat', 'hang', 'doi tac', 'brand', 'manufacturer', 'csi', 'bentley', 'zwsoft', 'seequent', 'autodesk'],
  },
  {
    id: 'cmd_sales_staff',
    title: 'Đi tới → Phụ trách kinh doanh & Bán hàng',
    subtitle: 'Phân công chuyên viên kinh doanh theo sản phẩm & danh mục',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Sản phẩm',
    path: '/cms/sales-staff',
    actionType: 'navigate',
    icon: UserCheck,
    keywords: ['kinh doanh', 'sales', 'sales staff', 'phu trach', 'nhan vien ban hang', 'sale man'],
  },
  {
    id: 'cmd_news',
    title: 'Đi tới → Tin tức & Bài viết chuyên ngành',
    subtitle: 'Biên tập bài viết, chuyên mục, tin chuyển giao công nghệ',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Nội dung',
    path: '/cms/news',
    actionType: 'navigate',
    icon: Newspaper,
    keywords: ['tin tuc', 'bai viet', 'news', 'article', 'post', 'blog', 'chuyen de', 'bao chi'],
  },
  {
    id: 'cmd_events',
    title: 'Đi tới → Sự kiện, Hội thảo & Webinar',
    subtitle: 'Quản lý hội thảo kỹ thuật, lịch đào tạo, danh sách đăng ký',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Sự kiện',
    path: '/cms/events',
    actionType: 'navigate',
    icon: Calendar,
    keywords: ['su kien', 'hoi thao', 'webinar', 'event', 'workshop', 'dao tao', 'seminar', 'lich hoi thao'],
  },
  {
    id: 'cmd_projects',
    title: 'Đi tới → Dự án & Công trình tiêu biểu',
    subtitle: 'Hồ sơ năng lực dự án chuyển giao công nghệ, cầu đường, cao tầng',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Dự án',
    path: '/cms/projects',
    actionType: 'navigate',
    icon: Briefcase,
    keywords: ['du an', 'project', 'cong trinh', 'ho so nang luc', 'case study', 'khach hang'],
  },
  {
    id: 'cmd_services',
    title: 'Đi tới → Dịch vụ & Chuyển giao công nghệ',
    subtitle: 'Tư vấn BIM, đo đạc trắc địa, quan trắc công trình, tính toán kết cấu',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Dịch vụ',
    path: '/cms/services',
    actionType: 'navigate',
    icon: Sparkles,
    keywords: ['dich vu', 'service', 'chuyen giao cong nghe', 'tu van bim', 'quan trac', 'khao sat'],
  },
  {
    id: 'cmd_customer_requests',
    title: 'Đi tới → Yêu cầu khách hàng & Báo giá (Leads)',
    subtitle: 'Đăng ký tư vấn, yêu cầu báo giá phần mềm, dùng thử trial',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Khách hàng',
    path: '/cms/customer-requests',
    actionType: 'navigate',
    icon: Inbox,
    keywords: ['yeu cau khach hang', 'khach hang', 'lead', 'bao gia', 'dung thu', 'trial', 'form submit', 'customer request', 'lien he'],
  },
  {
    id: 'cmd_contacts',
    title: 'Đi tới → Hộp thư liên hệ & Phản hồi',
    subtitle: 'Tin nhắn gửi từ form liên hệ chân trang & hotline',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Khách hàng',
    path: '/cms/contact-requests',
    actionType: 'navigate',
    icon: Mail,
    keywords: ['hop thu', 'lien he', 'contact', 'tin nhan', 'phan hoi', 'message'],
  },
  {
    id: 'cmd_static_pages',
    title: 'Đi tới → Quản lý Trang tĩnh (Page Builder)',
    subtitle: 'Giới thiệu công ty, Cơ cấu tổ chức, Chính sách bảo mật, Điều khoản',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Nội dung',
    path: '/cms/static-pages',
    actionType: 'navigate',
    icon: FileText,
    keywords: ['trang tinh', 'page', 'gioi thieu', 'chinh sach', 'dieu khoan', 'static page', 'page builder'],
  },
  {
    id: 'cmd_media',
    title: 'Đi tới → Thư viện Media & Tệp tải về',
    subtitle: 'Quản lý kho ảnh, video giới thiệu, tài liệu brochure, PDF',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Tài nguyên',
    path: '/cms/media',
    actionType: 'navigate',
    icon: ImageIcon,
    keywords: ['media', 'thu vien anh', 'tai lieu', 'pdf', 'banner', 'video', 'download', 'asset'],
  },
  {
    id: 'cmd_forms',
    title: 'Đi tới → Biểu mẫu & Trường nhập liệu (Forms)',
    subtitle: 'Thiết kế form đăng ký nhận tin, form đăng ký báo giá',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Tương tác',
    path: '/cms/forms',
    actionType: 'navigate',
    icon: FormInput,
    keywords: ['bieu mau', 'form', 'form builder', 'field', 'dang ky'],
  },
  {
    id: 'cmd_cta',
    title: 'Đi tới → Lời kêu gọi hành động (CTA Blocks)',
    subtitle: 'Quản lý các nút bấm, popup conversion, banner kêu gọi',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Tương tác',
    path: '/cms/cta',
    actionType: 'navigate',
    icon: Radio,
    keywords: ['cta', 'call to action', 'nut bam', 'chuyen doi', 'conversion'],
  },
  {
    id: 'cmd_email_templates',
    title: 'Đi tới → Mẫu Email tự động (Email Templates)',
    subtitle: 'Cấu hình email gửi xác nhận báo giá, kích hoạt license, thông báo',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Cấu hình',
    path: '/cms/email-templates',
    actionType: 'navigate',
    icon: Mail,
    keywords: ['email', 'email template', 'mau email', 'gui thu', 'smtp'],
  },
  {
    id: 'cmd_menu',
    title: 'Đi tới → Điều hướng Menu & Chân trang (Navigation)',
    subtitle: 'Sắp xếp menu đầu trang, mega menu sản phẩm, menu footer',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Giao diện',
    path: '/cms/frontend-menus',
    actionType: 'navigate',
    icon: FolderTree,
    keywords: ['menu', 'dieu huong', 'navigation', 'header menu', 'footer menu', 'mega menu'],
  },
  {
    id: 'cmd_function_seo',
    title: 'Đi tới → SEO & URL',
    subtitle: 'Template SEO, canonical, redirect và sitemap',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Cấu hình',
    path: '/cms/function-seo',
    actionType: 'navigate',
    icon: Search,
    keywords: ['cau hinh seo', 'seo', 'meta', 'the meta', 'schema', 'sitemap', 'robots', 'google seo', 'opengraph'],
  },
  {
    id: 'cmd_users',
    title: 'Đi tới → Quản trị viên & Phân quyền User',
    subtitle: 'Quản lý tài khoản CMS, cấp quyền biên tập, phân chia phòng ban',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Hệ thống',
    path: '/cms/users',
    actionType: 'navigate',
    icon: Users,
    keywords: ['quan tri vien', 'nguoi dung', 'user', 'tai khoan', 'phan quyen', 'nhan su', 'admin'],
  },
  {
    id: 'cmd_permissions',
    title: 'Đi tới → Ma trận Phân quyền & Vai trò (Roles)',
    subtitle: 'Thiết lập quyền xem, sửa, xuất bản, xóa theo từng module',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Hệ thống',
    path: '/cms/permissions',
    actionType: 'navigate',
    icon: Shield,
    keywords: ['ma tran phan quyen', 'phan quyen', 'vai tro', 'role', 'permission', 'bao mat'],
  },
  {
    id: 'cmd_settings',
    title: 'Đi tới → Cấu hình chung hệ thống CMS',
    subtitle: 'Thông tin công ty, Hotline, Logo, Email liên hệ, Bản quyền',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Hệ thống',
    path: '/cms/settings',
    actionType: 'navigate',
    icon: Settings,
    keywords: ['cau hinh he thong', 'cai dat', 'setting', 'thong tin cong ty', 'hotline', 'logo', 'system'],
  },
  {
    id: 'cmd_activity_logs',
    title: 'Đi tới → Nhật ký hoạt động & Lịch sử thao tác',
    subtitle: 'Theo dõi ai đã tạo, chỉnh sửa hoặc xóa dữ liệu trên hệ thống',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Hệ thống',
    path: '/cms/activity-logs',
    actionType: 'navigate',
    icon: Clock,
    keywords: ['nhat ky hoat dong', 'audit log', 'lich su', 'activity log', 'nhat ky', 'tracking'],
  },
  {
    id: 'cmd_trash',
    title: 'Đi tới → Thùng rác & Phục hồi dữ liệu (Recycle Bin)',
    subtitle: 'Xem và khôi phục các bản ghi bài viết, sản phẩm, yêu cầu đã xóa',
    module: 'command',
    moduleLabel: 'Chức năng CMS',
    category: 'Hệ thống',
    path: '/cms/trash',
    actionType: 'navigate',
    icon: Inbox,
    keywords: ['thung rac', 'recycle bin', 'trash', 'phuc hoi', 'khoi phuc', 'da xoa'],
  },
];

/**
 * Thu thập toàn bộ dữ liệu trong CMS để phục vụ Global Search
 */
export function getAllSearchableRecords(locale: CmsLocale = 'vi'): SearchResultItem[] {
  const records: SearchResultItem[] = [];

  // 1. Chức năng CMS
  records.push(...CMS_COMMANDS);

  // 2. Sản phẩm (Products)
  const productData = demoCatalogDataSource.productsByLocale[locale]?.products || demoCatalogDataSource.productsByLocale.vi.products;
  if (productData) {
    productData.forEach((p) => {
      const brandName = p.brand_name || '';
      const categoryName = p.category_id || '';
      const statusMap: Record<string, { text: string; color: SearchResultItem['statusColor'] }> = {
        in_stock: { text: 'Đang hiển thị', color: 'emerald' },
        out_of_stock: { text: 'Hết hàng / Tạm dừng', color: 'rose' },
        pre_order: { text: 'Đặt trước', color: 'amber' },
        draft: { text: 'Bản nháp', color: 'slate' },
      };
      const st = statusMap[p.availability_signal || 'in_stock'] || { text: 'Đang hiển thị', color: 'emerald' };

      records.push({
        id: `prod_${p.id}`,
        title: p.title,
        subtitle: `${p.product_type || 'Phần mềm'} · ${brandName} · SKU: ${p.sku || p.id}`,
        module: 'products',
        moduleLabel: 'Sản phẩm',
        category: brandName || 'Phần mềm',
        statusText: st.text,
        statusColor: st.color,
        path: `/cms/products`,
        actionType: 'edit',
        icon: Package,
        metadata: {
          sku: p.sku || p.id,
          slug: p.alias || p.id,
          tags: p.application_areas,
        },
        keywords: [
          p.title,
          p.sku || '',
          p.alias || '',
          brandName,
          p.origin || '',
          p.tagline || '',
          p.short_description || '',
          p.product_type || '',
          ...(p.application_areas || []),
        ],
      });
    });
  }

  // 3. Tin tức & Bài viết (News & Articles)
  const newsData = demoEditorialContentDataSource.newsByLocale[locale]?.articles || demoEditorialContentDataSource.newsByLocale.vi.articles;
  if (newsData) {
    newsData.forEach((art) => {
      const isPublished = art.published;
      records.push({
        id: `news_${art.id}`,
        title: art.title,
        subtitle: `Tác giả: ${art.author?.name || 'Ban Biên tập'} · Ngày: ${art.created_time || 'Mới nhất'} · Tag: ${art.tags?.join(', ') || ''}`,
        module: 'news',
        moduleLabel: 'Tin tức & Bài viết',
        category: 'Tin tức & Bài viết',
        statusText: isPublished ? 'Đã xuất bản' : 'Bản nháp',
        statusColor: isPublished ? 'emerald' : 'slate',
        path: `/cms/news`,
        actionType: 'edit',
        icon: Newspaper,
        metadata: {
          slug: art.alias || art.id,
          author: art.author?.name,
          date: art.created_time,
          tags: art.tags,
        },
        keywords: [
          art.title,
          art.summary || '',
          art.content || '',
          art.alias || '',
          art.author?.name || '',
          art.seo_title || '',
          art.seo_keyword || '',
          ...(art.tags || []),
        ],
      });
    });
  }

  // 4. Yêu cầu khách hàng (Customer Requests & Leads)
  const requestData = demoCustomerInteractionDataSource.customerRequestByLocale[locale]?.requests || demoCustomerInteractionDataSource.customerRequestByLocale.vi.requests;
  if (requestData) {
    requestData.forEach((req) => {
      const fullName = req.submissionValues.find(v => v.fieldKey === 'full_name')?.valueText || 'Khách hàng';
      const phone = req.submissionValues.find(v => v.fieldKey === 'phone')?.valueText || '';
      const email = req.submissionValues.find(v => v.fieldKey === 'email')?.valueText || '';
      const company = req.submissionValues.find(v => v.fieldKey === 'company')?.valueText || '';
      const message = req.submissionValues.find(v => v.fieldKey === 'message')?.valueText || '';
      const service = req.submissionValues.find(v => v.fieldKey === 'service_interest' || v.fieldKey === 'product')?.valueText || '';

      const statusMap: Record<string, { text: string; color: SearchResultItem['statusColor'] }> = {
        new: { text: 'Mới tiếp nhận', color: 'blue' },
        processing: { text: 'Đang xử lý', color: 'amber' },
        quoted: { text: 'Đã báo giá', color: 'orange' },
        completed: { text: 'Đã hoàn thành', color: 'emerald' },
        cancelled: { text: 'Đã hủy', color: 'slate' },
      };
      const st = statusMap[req.status || 'new'] || { text: 'Mới tiếp nhận', color: 'blue' };

      records.push({
        id: `req_${req.id}`,
        title: `${fullName} · ${company ? company + ' · ' : ''}${phone || email}`,
        subtitle: `Mã: #${req.id.toUpperCase()} · Nhu cầu: ${service || req.sourceConfig.pageTitle || message.slice(0, 60)}`,
        module: 'customer_requests',
        moduleLabel: 'Yêu cầu khách hàng',
        category: 'Leads & Báo giá',
        statusText: st.text,
        statusColor: st.color,
        path: `/cms/customer-requests`,
        actionType: 'open_modal',
        icon: Inbox,
        metadata: {
          code: `#${req.id.toUpperCase()}`,
          phone,
          email,
          company,
          date: req.sourceConfig.submittedAt ? new Date(req.sourceConfig.submittedAt).toLocaleDateString('vi-VN') : '',
        },
        keywords: [
          fullName,
          phone,
          email,
          company,
          req.id,
          `#${req.id}`,
          message,
          service,
          req.sourceConfig.pageTitle,
          req.sourceConfig.formName,
        ],
      });
    });
  }

  // 5. Sự kiện (Events)
  const eventsData = getCmsEventsData(locale).events;
  if (eventsData) {
    eventsData.forEach((ev) => {
      const isPub = ev.published || ev.editorial_status === 'published';
      records.push({
        id: `event_${ev.id}`,
        title: ev.title,
        subtitle: `Chủ đề: ${ev.chu_de || 'Hội thảo'} · Thời gian: ${ev.time_event || ev.specific_time || ''} · Địa điểm: ${ev.place || 'Hà Nội'}`,
        module: 'events',
        moduleLabel: 'Sự kiện & Hội thảo',
        category: ev.chu_de || 'Hội thảo & Đào tạo',
        statusText: isPub ? 'Đã xuất bản' : 'Bản nháp',
        statusColor: isPub ? 'emerald' : 'slate',
        path: `/cms/events`,
        actionType: 'edit',
        icon: Calendar,
        metadata: {
          date: ev.time_event || ev.specific_time,
          location: ev.place,
          tags: ev.tags,
        },
        keywords: [
          ev.title,
          ev.summary || '',
          ev.content || '',
          ev.place || '',
          ev.chu_de || '',
          ev.alias || '',
          ev.time_event || '',
          ev.specific_time || '',
          ...(ev.tags || []),
        ],
      });
    });
  }

  // 6. Dự án (Projects)
  const projectsData = getCmsProjectsData(locale).projects;
  if (projectsData) {
    projectsData.forEach((proj) => {
      records.push({
        id: `proj_${proj.id}`,
        title: proj.title,
        subtitle: `Chủ đầu tư: ${proj.customer_name || 'Khách hàng'} · Lĩnh vực: ${proj.sector || 'Xây dựng'} · ${proj.location || ''}`,
        module: 'projects',
        moduleLabel: 'Dự án tiêu biểu',
        category: proj.sector || 'Dự án',
        statusText: 'Đã xuất bản',
        statusColor: 'emerald',
        path: `/cms/projects`,
        actionType: 'edit',
        icon: Briefcase,
        metadata: {
          company: proj.customer_name,
          location: proj.location,
          tags: proj.technologies,
        },
        keywords: [
          proj.title,
          proj.customer_name || '',
          proj.sector || '',
          proj.solution || '',
          proj.location || '',
          ...(proj.technologies || []),
        ],
      });
    });
  }

  // 7. Trang tĩnh (Static Pages)
  const staticPagesData = getCmsStaticPagesData(locale).pages;
  if (staticPagesData) {
    staticPagesData.forEach((pg) => {
      const isPublished = pg.published?.status === 'published';
      records.push({
        id: `page_${pg.id}`,
        title: pg.name,
        subtitle: `Slug: /${pg.slug} · Mã: ${pg.code} · Loại: ${pg.pageType}`,
        module: 'static_pages',
        moduleLabel: 'Trang nội dung',
        category: pg.pageType || 'Trang tĩnh',
        statusText: isPublished ? 'Đã xuất bản' : 'Bản nháp',
        statusColor: isPublished ? 'emerald' : 'slate',
        path: `/cms/static-pages`,
        actionType: 'edit',
        icon: FileText,
        metadata: {
          slug: pg.slug,
          code: pg.code,
        },
        keywords: [
          pg.name,
          pg.slug,
          pg.code,
          pg.pageType || '',
          pg.templateKey || '',
        ],
      });
    });
  }

  // 8. Dịch vụ (Services)
  const servicesData = demoEditorialContentDataSource.servicesByLocale[locale]?.services || demoEditorialContentDataSource.servicesByLocale.vi.services;
  if (servicesData) {
    servicesData.forEach((srv) => {
      records.push({
        id: `srv_${srv.id}`,
        title: srv.title,
        subtitle: srv.summary || srv.slug,
        module: 'services',
        moduleLabel: 'Dịch vụ',
        category: 'Dịch vụ',
        statusText: srv.editorial_status === 'published' ? 'Đã xuất bản' : 'Bản nháp',
        statusColor: srv.editorial_status === 'published' ? 'emerald' : 'slate',
        path: `/cms/services`,
        actionType: 'edit',
        icon: Sparkles,
        metadata: { slug: srv.slug },
        keywords: [
          srv.title,
          srv.summary || '',
          srv.slug,
        ],
      });
    });
  }

  // 9. Biểu mẫu & CTA (Forms & CTA)
  const ctaData = demoCustomerInteractionDataSource.ctaByLocale[locale]?.ctas || [];
  ctaData.forEach((c) => {
    records.push({
      id: `cta_${c.id}`,
      title: c.adminName || c.displayText,
      subtitle: `Mã: ${c.code} · Hiển thị: "${c.displayText}" · Kiểu: ${c.styleVariant || 'primary'}`,
      module: 'forms_cta',
      moduleLabel: 'Biểu mẫu & CTA',
      category: 'CTA Block',
      statusText: c.status === 'active' ? 'Đang chạy' : 'Tạm dừng',
      statusColor: c.status === 'active' ? 'emerald' : 'slate',
      path: `/cms/cta`,
      actionType: 'navigate',
      icon: Radio,
      keywords: [c.adminName, c.displayText, c.code, c.description || '', 'cta', 'banner cta'],
    });
  });

  const formData = demoCustomerInteractionDataSource.formByLocale[locale]?.forms || [];
  formData.forEach((f) => {
    records.push({
      id: `form_${f.id}`,
      title: f.adminName || f.title,
      subtitle: `Mã: ${f.code} · Tiêu đề: ${f.title || ''}`,
      module: 'forms_cta',
      moduleLabel: 'Biểu mẫu & CTA',
      category: 'Biểu mẫu Web',
      statusText: f.status === 'active' ? 'Đang hoạt động' : 'Bản nháp',
      statusColor: f.status === 'active' ? 'emerald' : 'slate',
      path: `/cms/forms`,
      actionType: 'navigate',
      icon: FormInput,
      keywords: [f.adminName, f.title, f.code, f.description || '', 'form', 'bieu mau'],
    });
  });

  // 10. Media Library
  const mediaData = getDemoMediaModuleData(locale).assets;
  if (mediaData) {
    mediaData.slice(0, 30).forEach((m) => {
      records.push({
        id: `media_${m.id}`,
        title: m.title || m.filename,
        subtitle: `Tệp: ${m.filename} · Loại: ${m.type} · Dung lượng: ${m.file_size_kb || 0} KB`,
        module: 'media',
        moduleLabel: 'Media & File',
        category: m.type === 'document' ? 'Tài liệu PDF' : 'Hình ảnh & Video',
        statusText: 'Sẵn sàng',
        statusColor: 'emerald',
        path: `/cms/media`,
        actionType: 'navigate',
        icon: ImageIcon,
        metadata: {
          tags: m.tags,
        },
        keywords: [m.title, m.filename, m.alt_text || '', m.mime_type || '', ...(m.tags || [])],
      });
    });
  }

  // 11. Quản trị viên & Phân quyền (Users & Roles)
  const usersData = demoGovernanceDataSource.users.users;
  if (usersData) {
    usersData.forEach((u) => {
      records.push({
        id: `user_${u.id}`,
        title: `${u.full_name} (@${u.username})`,
        subtitle: `Email: ${u.email} · SĐT: ${u.phone} · Vai trò: ${u.primaryRoleId}`,
        module: 'users_permissions',
        moduleLabel: 'Quản trị viên & User',
        category: 'Tài khoản',
        statusText: u.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa',
        statusColor: u.status === 'active' ? 'emerald' : 'rose',
        path: `/cms/users`,
        actionType: 'navigate',
        icon: Users,
        metadata: {
          email: u.email,
          phone: u.phone,
        },
        keywords: [u.full_name, u.username, u.email, u.phone, u.primaryRoleId, u.summary || ''],
        requiredRole: ['admin', 'superadmin'],
      });
    });
  }

  return records;
}

/**
 * Thực hiện Global Search với logic lọc thông minh, highlight, phân nhóm và lọc theo quyền
 */
export function executeGlobalSearch(
  query: string,
  options: {
    locale?: CmsLocale;
    userRole?: string;
    maxResultsPerGroup?: number;
    moduleFilter?: SearchResultModule | 'all';
  } = {}
): {
  totalResults: number;
  groupedResults: GroupedSearchResults[];
  allFlatResults: SearchResultItem[];
} {
  const {
    locale = 'vi',
    userRole = 'superadmin',
    maxResultsPerGroup = 6,
    moduleFilter = 'all',
  } = options;

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      totalResults: 0,
      groupedResults: [],
      allFlatResults: [],
    };
  }

  const normalizedQuery = normalizeVietnamese(trimmedQuery);
  const searchTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const allRecords = getAllSearchableRecords(locale);

  // Lọc theo quyền và từ khóa
  const matchedRecords = allRecords.filter((record) => {
    // 1. Kiểm tra quyền
    if (record.requiredRole && record.requiredRole.length > 0) {
      if (!userRole || (!record.requiredRole.includes(userRole) && userRole !== 'superadmin' && userRole !== 'admin')) {
        return false;
      }
    }

    // 2. Lọc theo module nếu có
    if (moduleFilter !== 'all' && record.module !== moduleFilter) {
      return false;
    }

    // 3. Khớp từ khóa
    // Kiểm tra title, subtitle, category, keywords, metadata
    const searchableStrings = [
      record.title,
      record.subtitle,
      record.category,
      record.moduleLabel,
      record.metadata?.sku,
      record.metadata?.email,
      record.metadata?.phone,
      record.metadata?.company,
      record.metadata?.code,
      record.metadata?.slug,
      record.metadata?.author,
      record.metadata?.location,
      ...(record.metadata?.tags || []),
      ...(record.keywords || []),
    ].filter(Boolean) as string[];

    return searchableStrings.some((text) => matchesQuery(text, searchTokens, normalizedQuery));
  });

  // Thứ tự ưu tiên hiển thị nhóm
  const MODULE_ORDER: Array<{ module: SearchResultModule; label: string; icon: LucideIcon }> = [
    { module: 'command', label: 'Chức năng CMS', icon: Layers },
    { module: 'products', label: 'Sản phẩm', icon: Package },
    { module: 'news', label: 'Tin tức & Bài viết', icon: Newspaper },
    { module: 'customer_requests', label: 'Yêu cầu khách hàng & Leads', icon: Inbox },
    { module: 'events', label: 'Sự kiện & Hội thảo', icon: Calendar },
    { module: 'projects', label: 'Dự án tiêu biểu', icon: Briefcase },
    { module: 'static_pages', label: 'Trang nội dung', icon: FileText },
    { module: 'services', label: 'Dịch vụ', icon: Sparkles },
    { module: 'forms_cta', label: 'Biểu mẫu & CTA', icon: FormInput },
    { module: 'media', label: 'Thư viện Media', icon: ImageIcon },
    { module: 'users_permissions', label: 'Quản trị viên & Phân quyền', icon: Users },
  ];

  const groupedResults: GroupedSearchResults[] = [];

  MODULE_ORDER.forEach(({ module, label, icon }) => {
    const itemsInModule = matchedRecords.filter((item) => item.module === module);
    if (itemsInModule.length > 0) {
      groupedResults.push({
        module,
        label,
        icon,
        totalCount: itemsInModule.length,
        items: itemsInModule.slice(0, maxResultsPerGroup),
      });
    }
  });

  return {
    totalResults: matchedRecords.length,
    groupedResults,
    allFlatResults: matchedRecords,
  };
}

// ---------------- LOCAL STORAGE RECENT SEARCHES & VISITED ----------------

const RECENT_SEARCH_STORAGE_KEY = 'cic_cms_recent_searches_v2';
const RECENT_VISITED_STORAGE_KEY = 'cic_cms_recent_visited_v2';

export function getRecentSearches(): RecentSearchItem[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): void {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return;
  try {
    const current = getRecentSearches().filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());
    const updated = [{ query: trimmed, timestamp: Date.now() }, ...current].slice(0, 8);
    localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function removeRecentSearch(query: string): void {
  try {
    const updated = getRecentSearches().filter((item) => item.query !== query);
    localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearAllRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getRecentVisitedItems(): RecentVisitedItem[] {
  try {
    const raw = localStorage.getItem(RECENT_VISITED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export function saveRecentVisitedItem(item: { id: string; title: string; moduleLabel: string; path: string; iconName?: string }): void {
  try {
    const current = getRecentVisitedItems().filter((v) => v.path !== item.path && v.id !== item.id);
    const updated = [
      {
        id: item.id,
        title: item.title,
        moduleLabel: item.moduleLabel,
        path: item.path,
        iconName: item.iconName || 'FileText',
        timestamp: Date.now(),
      },
      ...current,
    ].slice(0, 6);
    localStorage.setItem(RECENT_VISITED_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
