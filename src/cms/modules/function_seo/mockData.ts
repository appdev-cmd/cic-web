import type { CmsLocale } from '../../data/CmsDataSource';
import type { FunctionSeoRecord } from './types';

const vi: FunctionSeoRecord[] = [
  {
    id: 'seo_products_home', routeKey: 'products_index', path: '/san-pham', module: 'products', view: 'home', label: 'Sản phẩm',
    intent: 'Khám phá toàn bộ danh mục sản phẩm và giải pháp CIC', title: 'Sản phẩm phần mềm và giải pháp công nghệ | CIC',
    keywords: 'phần mềm xây dựng, sản phẩm CIC, phần mềm bản quyền', description: 'Khám phá danh mục phần mềm xây dựng, thiết bị và giải pháp công nghệ do CIC cung cấp.',
    canonicalPath: '/san-pham', indexable: true, updatedAt: '2026-08-12T08:00:00.000Z',
    categoryPath: '/cms/product-settings', categoryPattern: '/san-pham/{danh-muc}', categoryOwner: 'Thiết lập sản phẩm → Lĩnh vực', categoryStatus: 'available',
    detailPath: '/cms/products', detailPattern: '/san-pham/{san-pham}', detailOwner: 'Sản phẩm → Form chi tiết', detailStatus: 'available',
  },
  {
    id: 'seo_news_home', routeKey: 'news_index', path: '/tin-tuc', module: 'news', view: 'home', label: 'Tin tức',
    intent: 'Tin tức doanh nghiệp và kiến thức ngành', title: 'Tin tức và góc nhìn công nghệ | CIC', keywords: 'tin tức CIC, công nghệ xây dựng, BIM',
    description: 'Tin tức CIC, xu hướng công nghệ, BIM và chuyển đổi số trong ngành xây dựng.', canonicalPath: '/tin-tuc', indexable: true, updatedAt: '2026-08-12T08:00:00.000Z',
    categoryPath: '', categoryPattern: '/tin-tuc/{danh-muc}', categoryOwner: 'Danh mục Tin tức chưa có màn quản lý SEO riêng', categoryStatus: 'missing',
    detailPath: '/cms/news', detailPattern: '/tin-tuc/{bai-viet}', detailOwner: 'Tin tức → Form bài viết', detailStatus: 'available',
  },
  {
    id: 'seo_events_home', routeKey: 'events_index', path: '/su-kien', module: 'event', view: 'home', label: 'Sự kiện',
    intent: 'Tìm hội thảo, webinar và chương trình đào tạo', title: 'Sự kiện và hội thảo công nghệ | CIC', keywords: 'sự kiện CIC, hội thảo BIM, webinar',
    description: 'Danh sách sự kiện, hội thảo và webinar chuyên ngành do CIC tổ chức hoặc đồng hành.', canonicalPath: '/su-kien', indexable: true, updatedAt: '2026-08-12T08:00:00.000Z',
    categoryPath: '', categoryPattern: '/su-kien/{danh-muc}', categoryOwner: 'Danh mục Sự kiện chưa có màn quản lý SEO riêng', categoryStatus: 'missing',
    detailPath: '/cms/events', detailPattern: '/su-kien/{su-kien}', detailOwner: 'Sự kiện → Form chi tiết', detailStatus: 'available',
  },
  {
    id: 'seo_services_home', routeKey: 'services_index', path: '/dich-vu', module: 'services', view: 'home', label: 'Dịch vụ',
    intent: 'Khám phá năng lực tư vấn và triển khai dịch vụ', title: 'Dịch vụ tư vấn và chuyển đổi số | CIC', keywords: 'dịch vụ CIC, tư vấn BIM, chuyển đổi số',
    description: 'Các dịch vụ tư vấn BIM, chuyển đổi số, đào tạo và hỗ trợ kỹ thuật của CIC.', canonicalPath: '/dich-vu', indexable: true, updatedAt: '2026-08-12T08:00:00.000Z',
    categoryPath: '', categoryPattern: '/dich-vu/{nhom-dich-vu}', categoryOwner: 'Nhóm Dịch vụ chưa có màn quản lý SEO riêng', categoryStatus: 'missing',
    detailPath: '/cms/services', detailPattern: '/dich-vu/{dich-vu}', detailOwner: 'Dịch vụ → Form chi tiết', detailStatus: 'available',
  },
  {
    id: 'seo_projects_home', routeKey: 'projects_index', path: '/du-an', module: 'projects', view: 'home', label: 'Dự án',
    intent: 'Tham khảo dự án và kinh nghiệm triển khai', title: 'Dự án tiêu biểu | CIC', keywords: 'dự án CIC, dự án BIM, chuyển đổi số',
    description: 'Các dự án tiêu biểu thể hiện năng lực tư vấn và triển khai công nghệ của CIC.', canonicalPath: '/du-an', indexable: true, updatedAt: '2026-08-12T08:00:00.000Z',
    categoryPath: '', categoryPattern: '/du-an/{danh-muc}', categoryOwner: 'Module Dự án chưa triển khai trong CMS mới', categoryStatus: 'missing',
    detailPath: '', detailPattern: '/du-an/{du-an}', detailOwner: 'Module Dự án chưa triển khai trong CMS mới', detailStatus: 'missing',
  },
];

const en = vi.map((item) => ({
  ...item,
  id: `${item.id}_en`,
  path: `/en${item.path}`,
  canonicalPath: `/en${item.canonicalPath}`,
  title: `${item.label} | CIC`,
  keywords: '',
  description: `English SEO metadata for ${item.label.toLowerCase()}.`,
}));

export const functionSeoByLocale: Record<CmsLocale, FunctionSeoRecord[]> = { vi, en };
