import 'server-only';
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
  site_name: 'Tên Website / Portal',
  main_title: 'Đuôi tiêu đề trình duyệt',
  logo: 'Logo Chính (Light Mode)',
  logo_white: 'Logo Phụ (Dark Mode)',
  favicon: 'Biểu tượng Favicon',

  // 2. SEO mặc định
  title: 'Tiêu đề SEO mặc định (Meta Title)',
  meta_des: 'Mô tả SEO mặc định (Meta Description)',
  meta_key: 'Từ khóa SEO (Meta Keywords)',
  og_image: 'Ảnh chia sẻ mạng xã hội (OpenGraph / Social Share)',
  robots_txt: 'Cấu hình Robots.txt',

  // 3. Doanh nghiệp & liên hệ
  legal_name: 'Tên pháp nhân công ty',
  tax_id: 'Mã số thuế / MST',
  tel: 'Hotline chính',
  tel2: 'Hotline phụ / CSKH',
  admin_name: 'Người phụ trách hệ thống',
  admin_email: 'Email quản trị / thông báo',
  public_email: 'Email liên hệ công khai',
  domain: 'Tên miền chính (Domain URL)',
  address: 'Địa chỉ đăng ký doanh nghiệp',

  // 4. Footer & mạng xã hội
  footer_bottom: 'Bản quyền chân trang (Copyright)',
  zalo_url: 'Liên kết Zalo Official Account',
  facebook: 'Liên kết Facebook Fanpage',
  linkedin_url: 'Liên kết LinkedIn Company',
  youtube: 'Kênh YouTube chính thức',
  twitter: 'Tài khoản Twitter / X',
  bct_badge_url: 'Liên kết / Mã xác thực Bộ Công Thương',

  // 5. Đo lường & tiếp thị
  google_analytics: 'Google Analytics 4 (GA4 ID)',
  gtm_id: 'Google Tag Manager (GTM Container ID)',
  google_ads_id: 'Google Ads Conversion ID',
  meta_pixel_id: 'Meta / Facebook Pixel ID',
  teamview: 'Đường dẫn hỗ trợ từ xa (TeamViewer / UltraViewer)',
};

const descriptions: Record<string, string> = {
  site_name: 'Tên hiển thị chính trên thanh tiêu đề trình duyệt và email thông báo.',
  main_title: 'Phần tên thương hiệu được nối sau tiêu đề trang (ví dụ: | CIC).',
  logo: 'Ảnh Logo chính chuẩn Vector PNG/SVG hiển thị nền sáng.',
  logo_white: 'Ảnh Logo phiên bản hiển thị trên nền tối / Dark Theme.',
  favicon: 'Icon hiển thị trên tab trình duyệt (định dạng .ico hoặc .png chuẩn 32x32 / 48x48).',
  title: 'Tiêu đề SEO dự phòng khi trang con không thiết lập tiêu đề riêng.',
  meta_des: 'Mô tả tóm tắt nội dung website phục vụ kết quả tìm kiếm Google (khuyên dùng 150-160 ký tự).',
  meta_key: 'Các từ khóa chính của cổng thông tin, phân cách bởi dấu phẩy.',
  og_image: 'Ảnh đại diện mặc định hiển thị khi chia sẻ link lên Facebook, Zalo, LinkedIn (tỷ lệ 1200x630px).',
  robots_txt: 'Quy tắc hướng dẫn bot công cụ tìm kiếm cào dữ liệu (User-agent, Allow, Disallow, Sitemap).',
  legal_name: 'Tên công ty đầy đủ theo giấy phép đăng ký kinh doanh.',
  tax_id: 'Mã số thuế doanh nghiệp hiển thị tại chân trang và hồ sơ pháp lý.',
  tel: 'Số hotline hiển thị trên thanh header và nút gọi nhanh.',
  tel2: 'Số điện thoại hỗ trợ kỹ thuật hoặc tư vấn phụ.',
  admin_name: 'Thông tin nhân sự phụ trách hệ thống (nội bộ).',
  admin_email: 'Email nhận thông báo hệ thống và liên hệ từ form.',
  public_email: 'Email hiển thị công khai ở header, footer và trang liên hệ.',
  domain: 'URL chính thức của website (ví dụ: https://www.cic.com.vn).',
  address: 'Địa chỉ trụ sở chính hiển thị tại chân trang.',
  footer_bottom: 'Dòng thông báo bản quyền hiển thị tại đáy website.',
  zalo_url: 'Đường dẫn chat Zalo OA (ví dụ: https://zalo.me/...).',
  facebook: 'Đường dẫn trang Facebook chính thức của công ty.',
  linkedin_url: 'Đường dẫn trang LinkedIn doanh nghiệp.',
  youtube: 'Đường dẫn kênh YouTube chính thức.',
  twitter: 'Đường dẫn trang Twitter / X chính thức.',
  bct_badge_url: 'Đường dẫn chứng nhận Đã Thông Báo / Đã Đăng Ký với Bộ Công Thương.',
  google_analytics: 'Mã đo lường GA4 công khai (định dạng G-XXXXXXXXXX).',
  gtm_id: 'Mã container Google Tag Manager (định dạng GTM-XXXXXXX).',
  google_ads_id: 'Mã chuyển đổi Google Ads (định dạng AW-XXXXXXXXX).',
  meta_pixel_id: 'Mã định danh Pixel quảng cáo Meta / Facebook.',
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

export async function getPublicSystemSettings(locale: 'vi' | 'en' = 'vi'): Promise<PublicSystemSettings> {
  const sql = getPostgresClient(); const table = locale === 'en' ? 'cic_config_en' : 'cic_config';
  const keys = APPROVED_SETTINGS_MANIFEST.filter((item) => item.publicReadable && item.scopes.includes(locale)).map((item) => item.key);
  const [values, branches] = await Promise.all([
    sql`SELECT name,value FROM ${sql(table)} WHERE published IS TRUE AND lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT id,workspace,code,name,address,phone,email,fax,working_hours,map_embed_url,map_search_query,is_head_office,published,ordering FROM cic_branches WHERE workspace=${locale} AND published IS TRUE ORDER BY ordering,id`,
  ]);
  return { values: Object.fromEntries(values.map((row) => [String(row.name).trim().toLowerCase(), String(row.value ?? '')])), branches: branches.map(mapBranch) };
}
