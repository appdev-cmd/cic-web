import 'server-only';
import { cache } from 'react';
import { getPostgresClient } from '@/server/db/postgres';
import { APPROVED_SETTINGS_MANIFEST } from '../domain/settingsManifest';
import type { CmsBranch, CmsSettingsData, PublicSystemSettings } from '../domain/model';

const SCOPE_DEFS = [
  { id: 'site_cic', locale: 'vi', name: 'CIC Tiếng Việt', domain: 'cic.com.vn' },
  { id: 'site_english', locale: 'en', name: 'CIC English', domain: 'cic.com.vn/en' },
  { id: 'site_enjicad', locale: 'enjicad', name: 'Enjicad', domain: 'enjicad.vn' },
] as const;
const labels: Record<string, string> = {
  // 1. Thương hiệu
  site_name: 'Tên website',
  main_title: 'Hậu tố tiêu đề trang',
  logo: 'Logo giao diện sáng',
  logo_white: 'Logo giao diện tối',
  favicon: 'Biểu tượng trang (Favicon)',

  // 2. SEO mặc định
  title: 'Tiêu đề trang mặc định (Meta Title)',
  meta_des: 'Mô tả trang mặc định (Meta Description)',
  meta_key: 'Từ khóa tìm kiếm (Meta Keywords)',
  og_image: 'Ảnh đại diện khi chia sẻ mạng xã hội',
  robots_txt: 'Cấu hình Robots.txt',

  // 3. Doanh nghiệp & liên hệ
  legal_name: 'Tên doanh nghiệp / Pháp nhân',
  tax_id: 'Mã số thuế (MST)',
  tel: 'Hotline chính',
  tel2: 'Hotline kỹ thuật / CSKH',
  admin_name: 'Người phụ trách quản trị',
  admin_email: 'Email nhận thông báo hệ thống',
  public_email: 'Email liên hệ công khai',
  domain: 'Địa chỉ tên miền chính',
  address: 'Địa chỉ trụ sở chính',

  // 4. Chân trang & mạng xã hội
  footer_bottom: 'Thông tin bản quyền chân trang',
  zalo_url: 'Đường dẫn Zalo OA',
  facebook: 'Trang Facebook Fanpage',
  linkedin_url: 'Trang LinkedIn doanh nghiệp',
  youtube: 'Kênh YouTube chính thức',
  twitter: 'Tài khoản Twitter / X',
  bct_badge_url: 'Chứng nhận Bộ Công Thương',

  // 5. Đo lường & tiếp thị
  google_analytics: 'Google Analytics 4 (GA4 ID)',
  gtm_id: 'Google Tag Manager (GTM ID)',
  google_ads_id: 'Google Ads Conversion ID',
  meta_pixel_id: 'Meta Pixel ID (Facebook Pixel)',
  teamview: 'Đường dẫn hỗ trợ từ xa',
};

const descriptions: Record<string, string> = {
  site_name: 'Tên hiển thị chính của website trên thanh tiêu đề và email gửi đi.',
  main_title: 'Phần tên thương hiệu được ghép ở cuối tiêu đề các trang con (ví dụ: | CIC Technology).',
  logo: 'Logo phiên bản màu chuẩn hiển thị trên nền sáng.',
  logo_white: 'Logo phiên bản sáng màu hiển thị trên nền tối (Dark mode).',
  favicon: 'Biểu tượng nhỏ hiển thị trên tab trình duyệt (.ico hoặc .png 32x32 / 48x48).',
  title: 'Tiêu đề mặc định khi các trang con chưa cấu hình tiêu đề riêng.',
  meta_des: 'Đoạn mô tả ngắn hiển thị trên kết quả tìm kiếm Google (khuyên dùng 150-160 ký tự).',
  meta_key: 'Các từ khóa tìm kiếm chính của website, phân tách bởi dấu phẩy.',
  og_image: 'Hình ảnh mặc định khi gửi link qua Zalo, Facebook, LinkedIn (chuẩn 1200x630px).',
  robots_txt: 'Tập tin điều hướng công cụ tìm kiếm thu thập dữ liệu (Robots.txt).',
  legal_name: 'Tên công ty đầy đủ theo Giấy phép Đăng ký Kinh doanh.',
  tax_id: 'Mã số thuế của doanh nghiệp hiển thị tại chân trang.',
  tel: 'Số hotline hiển thị ở đầu trang và nút gọi nhanh.',
  tel2: 'Số điện thoại hỗ trợ kỹ thuật hoặc tư vấn dịch vụ.',
  admin_name: 'Họ tên cán bộ phụ trách quản trị website.',
  admin_email: 'Email nhận thông báo khi có khách hàng gửi liên hệ hoặc đăng ký.',
  public_email: 'Email hiển thị công khai cho khách hàng liên hệ.',
  domain: 'Địa chỉ website chính thức (ví dụ: https://www.cic.com.vn).',
  address: 'Địa chỉ trụ sở doanh nghiệp hiển thị ở chân trang.',
  footer_bottom: 'Nội dung bản quyền ở chân trang website (hỗ trợ văn bản và định dạng).',
  zalo_url: 'Đường dẫn mở chat Zalo Official Account của công ty.',
  facebook: 'Đường dẫn tới trang Fanpage Facebook chính thức.',
  linkedin_url: 'Đường dẫn tới trang LinkedIn doanh nghiệp.',
  youtube: 'Đường dẫn tới kênh YouTube của công ty.',
  twitter: 'Đường dẫn tới tài khoản mạng xã hội Twitter / X.',
  bct_badge_url: 'Đường dẫn xác thực Đã Thông Báo / Đã Đăng Ký với Bộ Công Thương.',
  google_analytics: 'Mã theo dõi lượt truy cập Google Analytics 4 (định dạng G-XXXXXXXXXX).',
  gtm_id: 'Mã vùng chứa Google Tag Manager (định dạng GTM-XXXXXXX).',
  google_ads_id: 'Mã đo lường chuyển đổi Google Ads (định dạng AW-XXXXXXXXX).',
  meta_pixel_id: 'Mã đo lường chuyển đổi Facebook / Meta Pixel.',
  teamview: 'Đường dẫn tải hoặc kết nối hỗ trợ kỹ thuật trực tuyến.',
};
const mapBranch = (row: Record<string, unknown>): CmsBranch => ({ id: String(row.id), code: String(row.code ?? ''), name: String(row.name ?? ''), address: String(row.address ?? ''), phone: String(row.phone ?? ''), email: String(row.email ?? ''), fax: String(row.fax ?? ''), workingHours: String(row.working_hours ?? ''), mapEmbedUrl: String(row.map_embed_url ?? ''), mapSearchQuery: String(row.map_search_query ?? ''), isHeadOffice: Boolean(row.is_head_office), published: Boolean(row.published), ordering: Number(row.ordering ?? 0) });

export async function getCmsSystemSettingsData(): Promise<CmsSettingsData> {
  const sql = getPostgresClient(); const keys = APPROVED_SETTINGS_MANIFEST.map((item) => item.key);
  const [vi, en, enjicad, branches] = await Promise.all([
    sql`SELECT name,value,title FROM cic_config WHERE lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT name,value,title FROM cic_config_en WHERE lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT name,value,title FROM cic_config_enjicad WHERE lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT id,workspace,code,name,address,phone,email,fax,working_hours,map_embed_url,map_search_query,is_head_office,published,ordering FROM cic_branches ORDER BY workspace,ordering,id`,
  ]);
  const rowsByScope = { vi, en, enjicad } as const;
  return { workspaces: SCOPE_DEFS.map((scope) => { const values = new Map(rowsByScope[scope.locale].map((row) => [String(row.name).trim().toLowerCase(), row])); return { scope, settings: APPROVED_SETTINGS_MANIFEST.filter((item) => item.scopes.includes(scope.locale)).map((item) => ({ key: item.key, label: labels[item.key] ?? item.key, description: descriptions[item.key] ?? `Cấu hình ${labels[item.key] ?? item.key}.`, group: item.group, type: item.type, value: String(values.get(item.key)?.value ?? ''), publicReadable: item.publicReadable, maxLength: item.validation.maxLength })), branches: scope.locale === 'enjicad' ? [] : branches.filter((row) => row.workspace === scope.locale).map(mapBranch) }; }) };
}

const settingsCache: { vi?: { data: PublicSystemSettings; exp: number }; en?: { data: PublicSystemSettings; exp: number } } = {};

export function invalidatePublicSystemSettingsCache() {
  delete settingsCache.vi;
  delete settingsCache.en;
}

const queryPublicSystemSettings = async (locale: 'vi' | 'en'): Promise<PublicSystemSettings> => {
  const now = Date.now();
  const cached = settingsCache[locale];
  if (cached && cached.exp > now) {
    return cached.data;
  }
  const sql = getPostgresClient(); const table = locale === 'en' ? 'cic_config_en' : 'cic_config';
  const keys = APPROVED_SETTINGS_MANIFEST.filter((item) => item.publicReadable && item.scopes.includes(locale)).map((item) => item.key);
  const [values, branches] = await Promise.all([
    sql`SELECT name,value FROM ${sql(table)} WHERE published IS TRUE AND lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT id,workspace,code,name,address,phone,email,fax,working_hours,map_embed_url,map_search_query,is_head_office,published,ordering FROM cic_branches WHERE workspace=${locale} AND published IS TRUE ORDER BY ordering,id`,
  ]);
  const result: PublicSystemSettings = { values: Object.fromEntries(values.map((row) => [String(row.name).trim().toLowerCase(), String(row.value ?? '')])), branches: branches.map(mapBranch) };
  settingsCache[locale] = { data: result, exp: now + 60_000 };
  return result;
};

/** Request/render-scoped deduplication only; this does not persist data across requests. */
export const getPublicSystemSettings = cache(queryPublicSystemSettings);
