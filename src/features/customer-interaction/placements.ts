import type { UsageLocation } from '@/cms/modules/customer_interaction/shared/types';

export const CTA_PLACEMENTS: Record<string, Record<string, UsageLocation[]>> = {
  cta_explore_products: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Hero Carousel)', pagePath: '/', placementKey: 'home.hero.primary' },
      { pageId: 'ecosystem', pageTitle: 'Hệ sinh thái số (Trang chủ)', pagePath: '/#ecosystem', placementKey: 'home.ecosystem.cta' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Hero Carousel)', pagePath: '/en', placementKey: 'home.hero.primary' },
      { pageId: 'ecosystem_en', pageTitle: 'Digital Ecosystem (Home)', pagePath: '/en#ecosystem', placementKey: 'home.ecosystem.cta' },
    ],
  },
  cta_about_cic: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Hero Carousel)', pagePath: '/', placementKey: 'home.hero.secondary' },
      { pageId: 'footer', pageTitle: 'Chân trang (Toàn website)', pagePath: 'all', placementKey: 'footer.company_about' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Hero Carousel)', pagePath: '/en', placementKey: 'home.hero.secondary' },
      { pageId: 'footer_en', pageTitle: 'Footer (Global)', pagePath: 'all', placementKey: 'footer.company_about' },
    ],
  },
  cta_home_intro: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Khối giới thiệu hành trình)', pagePath: '/#about', placementKey: 'home.intro.primary' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Introduction Section)', pagePath: '/en#about', placementKey: 'home.intro.primary' },
    ],
  },
  cta_profile_download: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Hồ sơ năng lực)', pagePath: '/#about', placementKey: 'home.intro.profile' },
      { pageId: 'about', pageTitle: 'Trang Giới thiệu (Hồ sơ năng lực)', pagePath: '/about', placementKey: 'about.contact_cta' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Company Profile)', pagePath: '/en#about', placementKey: 'home.intro.profile' },
      { pageId: 'about_en', pageTitle: 'About (Company Profile)', pagePath: '/en/about', placementKey: 'about.contact_cta' },
    ],
  },
  cta_contact: {
    vi: [
      { pageId: 'header', pageTitle: 'Header (Góc trên toàn trang)', pagePath: 'all', placementKey: 'header.consultation_cta' },
      { pageId: 'floating_bar', pageTitle: 'Thanh công cụ nổi (Toàn website)', pagePath: 'all', placementKey: 'floating.consultation' },
      { pageId: 'chatbot', pageTitle: 'Trợ lý ảo AI (Đăng ký tư vấn)', pagePath: 'all', placementKey: 'chatbot.consultation' },
      { pageId: 'news_list', pageTitle: 'Danh sách Tin tức (Banner tư vấn)', pagePath: '/news', placementKey: 'news.list_cta' },
      { pageId: 'events_list', pageTitle: 'Danh sách Sự kiện (Banner tư vấn)', pagePath: '/events', placementKey: 'events.list_cta' },
    ],
    en: [
      { pageId: 'header_en', pageTitle: 'Global Header (Top Right)', pagePath: 'all', placementKey: 'header.consultation_cta' },
      { pageId: 'floating_bar_en', pageTitle: 'Floating Toolbar (Global)', pagePath: 'all', placementKey: 'floating.consultation' },
      { pageId: 'news_list_en', pageTitle: 'News Catalog (Consultation Banner)', pagePath: '/en/news', placementKey: 'news.list_cta' },
      { pageId: 'events_list_en', pageTitle: 'Events Catalog (Consultation Banner)', pagePath: '/en/events', placementKey: 'events.list_cta' },
    ],
  },
  cta_view_all_products: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Khối giải pháp nổi bật)', pagePath: '/', placementKey: 'home.solutions.all' },
      { pageId: 'ecosystem', pageTitle: 'Trang chủ (Hệ sinh thái số)', pagePath: '/#ecosystem', placementKey: 'home.ecosystem.catalog' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Featured Solutions)', pagePath: '/en', placementKey: 'home.solutions.all' },
      { pageId: 'ecosystem_en', pageTitle: 'Home (Digital Ecosystem)', pagePath: '/en#ecosystem', placementKey: 'home.ecosystem.catalog' },
    ],
  },
  cta_view_all_news: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Khối Tin tức & Công nghệ)', pagePath: '/', placementKey: 'home.news.all' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (News & Insights)', pagePath: '/en', placementKey: 'home.news.all' },
    ],
  },
  cta_view_all_events: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Khối Sự kiện & Hội thảo)', pagePath: '/', placementKey: 'home.events.all' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Events & Seminars)', pagePath: '/en', placementKey: 'home.events.all' },
    ],
  },
  cta_view_all_projects: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Khối Dự án tiêu biểu)', pagePath: '/', placementKey: 'home.projects.all' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Featured Projects)', pagePath: '/en', placementKey: 'home.projects.all' },
    ],
  },
  cta_lienhe_trangchu: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Khối Liên hệ chân trang)', pagePath: '/#contact', placementKey: 'home.contact_section' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Contact Section)', pagePath: '/en#contact', placementKey: 'home.contact_section' },
    ],
  },
  cta_tuvan_dichvu: {
    vi: [
      { pageId: 'services', pageTitle: 'Danh mục Dịch vụ', pagePath: '/services', placementKey: 'services.catalog.cta' },
      { pageId: 'service_detail', pageTitle: 'Chi tiết dịch vụ BIM & Đào tạo', pagePath: '/services/[slug]', placementKey: 'services.detail.cta' },
    ],
    en: [
      { pageId: 'services_en', pageTitle: 'Services Catalog', pagePath: '/en/services', placementKey: 'services.catalog.cta' },
      { pageId: 'service_detail_en', pageTitle: 'Service Detail (BIM & Training)', pagePath: '/en/services/[slug]', placementKey: 'services.detail.cta' },
    ],
  },
  cta_baogia_sanpham: {
    vi: [
      { pageId: 'products_list', pageTitle: 'Danh mục sản phẩm (Nút báo giá)', pagePath: '/products', placementKey: 'products.card.quote' },
      { pageId: 'product_detail', pageTitle: 'Chi tiết sản phẩm (Modal báo giá)', pagePath: '/products/[slug]', placementKey: 'product.detail.quote' },
    ],
    en: [
      { pageId: 'products_list_en', pageTitle: 'Products Catalog (Quote Button)', pagePath: '/en/products', placementKey: 'products.card.quote' },
      { pageId: 'product_detail_en', pageTitle: 'Product Detail (Quote Modal)', pagePath: '/en/products/[slug]', placementKey: 'product.detail.quote' },
    ],
  },
  cta_mua_sanpham: {
    vi: [
      { pageId: 'product_detail', pageTitle: 'Chi tiết sản phẩm (Đăng ký mua)', pagePath: '/products/[slug]', placementKey: 'product.detail.buy' },
    ],
    en: [
      { pageId: 'product_detail_en', pageTitle: 'Product Detail (Buy License)', pagePath: '/en/products/[slug]', placementKey: 'product.detail.buy' },
    ],
  },
  cta_taive_dungthu: {
    vi: [
      { pageId: 'product_detail', pageTitle: 'Chi tiết sản phẩm (Tải dùng thử)', pagePath: '/products/[slug]', placementKey: 'product.detail.download' },
    ],
    en: [
      { pageId: 'product_detail_en', pageTitle: 'Product Detail (Download Trial)', pagePath: '/en/products/[slug]', placementKey: 'product.detail.download' },
    ],
  },
  cta_dangky_sukien: {
    vi: [
      { pageId: 'events', pageTitle: 'Danh sách Sự kiện & Hội thảo', pagePath: '/events', placementKey: 'events.card.register' },
      { pageId: 'event_detail', pageTitle: 'Chi tiết sự kiện (Đăng ký vé)', pagePath: '/events/[slug]', placementKey: 'events.detail.register' },
    ],
    en: [
      { pageId: 'events_en', pageTitle: 'Events & Seminars', pagePath: '/en/events', placementKey: 'events.card.register' },
      { pageId: 'event_detail_en', pageTitle: 'Event Detail (Pass Register)', pagePath: '/en/events/[slug]', placementKey: 'events.detail.register' },
    ],
  },
  cta_tuvan_tintuc: {
    vi: [
      { pageId: 'news_detail', pageTitle: 'Chi tiết bài viết Tin tức (Khối tư vấn)', pagePath: '/news/[slug]', placementKey: 'news.detail.consultation' },
    ],
    en: [
      { pageId: 'news_detail_en', pageTitle: 'News Article Detail (Consultation Block)', pagePath: '/en/news/[slug]', placementKey: 'news.detail.consultation' },
    ],
  },
  cta_tuvan_duan: {
    vi: [
      { pageId: 'projects_detail', pageTitle: 'Chi tiết Dự án (Sidebar tư vấn)', pagePath: '/projects/[slug]', placementKey: 'projects.detail.consultation' },
    ],
    en: [
      { pageId: 'projects_detail_en', pageTitle: 'Project Detail (Sidebar Consultation)', pagePath: '/en/projects/[slug]', placementKey: 'projects.detail.consultation' },
    ],
  },
  cta_lienhe_chinhthuc: {
    vi: [
      { pageId: 'about', pageTitle: 'Trang Giới thiệu (Khối liên hệ)', pagePath: '/about', placementKey: 'about.contact_block' },
      { pageId: 'footer', pageTitle: 'Chân trang (Các chi nhánh)', pagePath: 'all', placementKey: 'footer.branches_contact' },
    ],
    en: [
      { pageId: 'about_en', pageTitle: 'About Page (Contact Section)', pagePath: '/en/about', placementKey: 'about.contact_block' },
      { pageId: 'footer_en', pageTitle: 'Footer (Branch Offices)', pagePath: 'all', placementKey: 'footer.branches_contact' },
    ],
  },
  cta_goi_hotline: {
    vi: [
      { pageId: 'floating_bar', pageTitle: 'Thanh công cụ nổi (Hotline 24/7)', pagePath: 'all', placementKey: 'floating.hotline' },
      { pageId: 'header', pageTitle: 'Header (Hotline góc trên)', pagePath: 'all', placementKey: 'header.hotline' },
      { pageId: 'footer', pageTitle: 'Footer (Hotline hỗ trợ)', pagePath: 'all', placementKey: 'footer.hotline' },
      { pageId: 'home', pageTitle: 'Trang chủ (Khối liên hệ Hotline)', pagePath: '/#contact', placementKey: 'home.contact.hotline' },
    ],
    en: [
      { pageId: 'floating_bar_en', pageTitle: 'Floating Toolbar (Hotline)', pagePath: 'all', placementKey: 'floating.hotline' },
      { pageId: 'header_en', pageTitle: 'Header (Support Hotline)', pagePath: 'all', placementKey: 'header.hotline' },
      { pageId: 'footer_en', pageTitle: 'Footer (Consultation Hotline)', pagePath: 'all', placementKey: 'footer.hotline' },
      { pageId: 'home_en', pageTitle: 'Home (Contact Hotline)', pagePath: '/en#contact', placementKey: 'home.contact.hotline' },
    ],
  },
  cta_gui_email: {
    vi: [
      { pageId: 'footer', pageTitle: 'Chân trang (Email thông tin)', pagePath: 'all', placementKey: 'footer.email' },
      { pageId: 'home', pageTitle: 'Trang chủ (Khối liên hệ Email)', pagePath: '/#contact', placementKey: 'home.contact.email' },
    ],
    en: [
      { pageId: 'footer_en', pageTitle: 'Footer (Email Address)', pagePath: 'all', placementKey: 'footer.email' },
      { pageId: 'home_en', pageTitle: 'Home (Contact Email)', pagePath: '/en#contact', placementKey: 'home.contact.email' },
    ],
  },
  cta_chat_zalo: {
    vi: [
      { pageId: 'floating_bar', pageTitle: 'Thanh công cụ nổi (Zalo Support)', pagePath: 'all', placementKey: 'floating.zalo' },
      { pageId: 'footer', pageTitle: 'Chân trang (Kênh Zalo OA)', pagePath: 'all', placementKey: 'footer.zalo' },
    ],
    en: [
      { pageId: 'floating_bar_en', pageTitle: 'Floating Toolbar (Zalo Support)', pagePath: 'all', placementKey: 'floating.zalo' },
      { pageId: 'footer_en', pageTitle: 'Footer (Zalo OA Channel)', pagePath: 'all', placementKey: 'footer.zalo' },
    ],
  },
  cta_social_facebook: {
    vi: [
      { pageId: 'floating_bar', pageTitle: 'Thanh công cụ nổi (Fanpage Facebook)', pagePath: 'all', placementKey: 'floating.facebook' },
      { pageId: 'footer', pageTitle: 'Chân trang (Mạng xã hội Facebook)', pagePath: 'all', placementKey: 'footer.facebook' },
    ],
    en: [
      { pageId: 'floating_bar_en', pageTitle: 'Floating Toolbar (Facebook Official)', pagePath: 'all', placementKey: 'floating.facebook' },
      { pageId: 'footer_en', pageTitle: 'Footer (Facebook Social)', pagePath: 'all', placementKey: 'footer.facebook' },
    ],
  },
  cta_social_linkedin: {
    vi: [
      { pageId: 'floating_bar', pageTitle: 'Thanh công cụ nổi (LinkedIn CIC)', pagePath: 'all', placementKey: 'floating.linkedin' },
      { pageId: 'footer', pageTitle: 'Chân trang (Mạng xã hội LinkedIn)', pagePath: 'all', placementKey: 'footer.linkedin' },
    ],
    en: [
      { pageId: 'floating_bar_en', pageTitle: 'Floating Toolbar (LinkedIn Official)', pagePath: 'all', placementKey: 'floating.linkedin' },
      { pageId: 'footer_en', pageTitle: 'Footer (LinkedIn Social)', pagePath: 'all', placementKey: 'footer.linkedin' },
    ],
  },
  cta_dangky_bantin: {
    vi: [
      { pageId: 'footer', pageTitle: 'Chân trang (Đăng ký nhận bản tin)', pagePath: 'all', placementKey: 'footer.newsletter' },
    ],
    en: [
      { pageId: 'footer_en', pageTitle: 'Footer (Newsletter Subscription)', pagePath: 'all', placementKey: 'footer.newsletter' },
    ],
  },
};

export const FORM_PLACEMENTS: Record<string, Record<string, UsageLocation[]>> = {
  form_home_consultation: {
    vi: [
      { pageId: 'header', pageTitle: 'Header (Modal Đăng ký tư vấn)', pagePath: 'all', placementKey: 'header.consultation_cta' },
      { pageId: 'floating_bar', pageTitle: 'Thanh công cụ nổi (Modal tư vấn)', pagePath: 'all', placementKey: 'floating.consultation' },
      { pageId: 'chatbot', pageTitle: 'AI Chatbot (Modal tư vấn)', pagePath: 'all', placementKey: 'chatbot.consultation' },
      { pageId: 'news_list', pageTitle: 'Danh sách Tin tức (Banner tư vấn)', pagePath: '/news', placementKey: 'news.list_cta' },
      { pageId: 'events_list', pageTitle: 'Danh sách Sự kiện (Banner tư vấn)', pagePath: '/events', placementKey: 'events.list_cta' },
    ],
    en: [
      { pageId: 'header_en', pageTitle: 'Global Header (Consultation Modal)', pagePath: 'all', placementKey: 'header.consultation_cta' },
      { pageId: 'floating_bar_en', pageTitle: 'Floating Toolbar (Modal)', pagePath: 'all', placementKey: 'floating.consultation' },
      { pageId: 'news_list_en', pageTitle: 'News Catalog (Consultation Banner)', pagePath: '/en/news', placementKey: 'news.list_cta' },
      { pageId: 'events_list_en', pageTitle: 'Events Catalog (Consultation Banner)', pagePath: '/en/events', placementKey: 'events.list_cta' },
    ],
  },
  form_home_contact: {
    vi: [
      { pageId: 'home', pageTitle: 'Trang chủ (Khối Liên hệ #contact)', pagePath: '/#contact', placementKey: 'home.contact_section' },
    ],
    en: [
      { pageId: 'home_en', pageTitle: 'Home (Contact Section #contact)', pagePath: '/en#contact', placementKey: 'home.contact_section' },
    ],
  },
  form_contact_request: {
    vi: [
      { pageId: 'contact', pageTitle: 'Trang Liên hệ Trực tuyến', pagePath: '/contact', placementKey: 'contact.page_form' },
    ],
    en: [
      { pageId: 'contact_en', pageTitle: 'Online Contact Page', pagePath: '/en/contact', placementKey: 'contact.page_form' },
    ],
  },
  form_baogia_sanpham: {
    vi: [
      { pageId: 'products_detail', pageTitle: 'Chi tiết sản phẩm (Modal báo giá)', pagePath: '/products/[slug]', placementKey: 'product.quote_modal' },
      { pageId: 'products_list', pageTitle: 'Danh mục sản phẩm (Nút báo giá)', pagePath: '/products', placementKey: 'products.card.quote' },
    ],
    en: [
      { pageId: 'products_detail_en', pageTitle: 'Product Detail (Quote Modal)', pagePath: '/en/products/[slug]', placementKey: 'product.quote_modal' },
      { pageId: 'products_list_en', pageTitle: 'Products Catalog (Quote Button)', pagePath: '/en/products', placementKey: 'products.card.quote' },
    ],
  },
  form_dangky_mua: {
    vi: [
      { pageId: 'products_detail', pageTitle: 'Chi tiết sản phẩm (Modal mua bản quyền)', pagePath: '/products/[slug]', placementKey: 'product.buy_modal' },
    ],
    en: [
      { pageId: 'products_detail_en', pageTitle: 'Product Detail (Purchase Modal)', pagePath: '/en/products/[slug]', placementKey: 'product.buy_modal' },
    ],
  },
  form_taive_dungthu: {
    vi: [
      { pageId: 'products_detail', pageTitle: 'Chi tiết sản phẩm (Modal tải dùng thử)', pagePath: '/products/[slug]', placementKey: 'product.trial_modal' },
    ],
    en: [
      { pageId: 'products_detail_en', pageTitle: 'Product Detail (Download Modal)', pagePath: '/en/products/[slug]', placementKey: 'product.trial_modal' },
    ],
  },
  form_tuvan_dichvu: {
    vi: [
      { pageId: 'services', pageTitle: 'Trang Dịch vụ (Modal tư vấn BIM)', pagePath: '/services', placementKey: 'services.page_form' },
      { pageId: 'services_detail', pageTitle: 'Chi tiết dịch vụ (Tư vấn chuyên sâu)', pagePath: '/services/[slug]', placementKey: 'services.detail_form' },
    ],
    en: [
      { pageId: 'services_en', pageTitle: 'Services Page (BIM Consulting)', pagePath: '/en/services', placementKey: 'services.page_form' },
      { pageId: 'services_detail_en', pageTitle: 'Service Detail (In-depth Consulting)', pagePath: '/en/services/[slug]', placementKey: 'services.detail_form' },
    ],
  },
  form_dangky_sukien: {
    vi: [
      { pageId: 'events_detail', pageTitle: 'Chi tiết Sự kiện (Form đăng ký vé)', pagePath: '/events/[slug]', placementKey: 'event.register_form' },
    ],
    en: [
      { pageId: 'events_detail_en', pageTitle: 'Event Detail (Pass Registration)', pagePath: '/en/events/[slug]', placementKey: 'event.register_form' },
    ],
  },
  form_tuvan_tintuc: {
    vi: [
      { pageId: 'news_detail', pageTitle: 'Chi tiết bài viết Tin tức (Khối tư vấn)', pagePath: '/news/[slug]', placementKey: 'news.consultation_form' },
    ],
    en: [
      { pageId: 'news_detail_en', pageTitle: 'News Article Detail (Consultation Block)', pagePath: '/en/news/[slug]', placementKey: 'news.consultation_form' },
    ],
  },
};

export function getCtaPlacements(code: string, workspace: string = 'vi'): UsageLocation[] {
  const ctaMap = CTA_PLACEMENTS[code];
  if (!ctaMap) return [];
  return ctaMap[workspace] || ctaMap['vi'] || [];
}

export function getFormPlacements(code: string, workspace: string = 'vi'): UsageLocation[] {
  const formMap = FORM_PLACEMENTS[code];
  if (!formMap) return [];
  return formMap[workspace] || formMap['vi'] || [];
}
