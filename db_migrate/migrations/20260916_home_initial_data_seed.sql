-- Migration: 20260916_home_initial_data_seed.sql
-- Description: Seed initial default configuration for Home 10 sections (VI & EN)
--              and publish the initial canonical revision for Home (VI).

BEGIN;

SELECT pg_advisory_xact_lock(hashtextextended('cic:static-pages:home-initial-seed', 0));

-- 1. Populate full default configuration for Home VI (draft revision id = 1)
UPDATE cic_content_page_sections
SET config = '{
  "badge": "Leading Innovation since 1990",
  "slides": [
    {
      "title": "Đối tác công nghệ chiến lược",
      "subtitle": "Hơn 35 năm tiên phong thúc đẩy số hóa toàn diện.",
      "backgroundImageId": "/banner_hero/doi_tac_cong_nghe_chien_luoc.png",
      "mobileImageId": "/banner_hero/doi_tac_cong_nghe_chien_luoc.png",
      "primaryCtaId": "cta_explore_products",
      "secondaryCtaId": "cta_about_cic"
    },
    {
      "title": "Hệ sinh thái giải pháp số",
      "subtitle": "Ứng dụng AI, BIM và Digital Twins vào quy trình vận hành, giúp tối ưu hóa hiệu suất và tiết kiệm tài nguyên cho doanh nghiệp.",
      "backgroundImageId": "/banner_hero/He_sinh_thai_giai_phap_so.png",
      "mobileImageId": "/banner_hero/He_sinh_thai_giai_phap_so.png",
      "primaryCtaId": "cta_explore_products",
      "secondaryCtaId": "cta_about_cic"
    },
    {
      "title": "Dẫn đầu chuyển đổi số",
      "subtitle": "Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới mang lại những giải pháp đột phá cho tương lai hạ tầng Việt Nam.",
      "backgroundImageId": "/banner_hero/dan_dau_chuyen_doi_so.png",
      "mobileImageId": "/banner_hero/dan_dau_chuyen_doi_so.png",
      "primaryCtaId": "cta_explore_products",
      "secondaryCtaId": "cta_about_cic"
    },
    {
      "title": "Phần mềm bản quyền chính hãng",
      "subtitle": "Cung cấp hệ thống phần mềm bản quyền chính hãng, hỗ trợ kỹ thuật tận tâm, đảm bảo an toàn thông tin và tuân thủ pháp lý.",
      "backgroundImageId": "/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg",
      "mobileImageId": "/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg",
      "primaryCtaId": "cta_explore_products",
      "secondaryCtaId": "cta_about_cic"
    }
  ],
  "tickerItems": [
    "CIC đồng hành cùng chuyển đổi số ngành xây dựng",
    "Cập nhật các giải pháp BIM và Digital Twins mới nhất",
    "Hội thảo: Ứng dụng AI và Digital Twins trong vận hành hạ tầng số"
  ]
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.hero';

UPDATE cic_content_page_sections
SET config = '{
  "eyebrow": "Về chúng tôi",
  "title": "Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam",
  "paragraphs": [
    "CIC (tiền thân là Trung tâm Tin học - Bộ Xây dựng, thành lập năm 1990) là đơn vị hàng đầu cung cấp phần mềm, thiết bị và giải pháp số cho ngành xây dựng.",
    "Suốt hơn 35 năm, chúng tôi luôn đi đầu ứng dụng ICT, mang đến dịch vụ tư vấn chuyên sâu cho hàng nghìn doanh nghiệp, đối tác trong nước và quốc tế."
  ],
  "imageId": "media_home_intro",
  "videoUrl": "https://www.youtube.com/watch?v=hdLFK_09-tU&t=448s",
  "primaryCtaId": "cta_about_cic",
  "downloadMediaId": "media_company_profile"
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.intro';

UPDATE cic_content_page_sections
SET config = '{
  "items": [
    { "id": "home_stat_experience", "value": 35, "suffix": "+", "label": "Năm kinh nghiệm" },
    { "id": "home_stat_solutions", "value": 300, "suffix": "+", "label": "Giải pháp công nghệ" },
    { "id": "home_stat_projects", "value": 5000, "suffix": "+", "label": "Dự án thành công" },
    { "id": "home_stat_partners", "value": 100, "suffix": "+", "label": "Đối tác toàn cầu" }
  ]
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.stats';

UPDATE cic_content_page_sections
SET config = '{
  "title": "Thành tựu & Giải thưởng",
  "subtitle": "Minh chứng cho nỗ lực không ngừng nghỉ và uy tín 35 năm",
  "items": [
    { "name": "Huân chương Lao động hạng 3", "imageId": "https://www.cic.com.vn/images/banners/original/huan-chuong-lao-dong-hang-3_1582012829.jpg" },
    { "name": "Giải thưởng Sao Khuê 2014", "imageId": "https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2014_1582012560.jpg" },
    { "name": "Cúp CNTT năm 2003", "imageId": "https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378.jpg" },
    { "name": "Giải thưởng Sao Khuê 2015", "imageId": "https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2015_1582012665.jpg" },
    { "name": "Cúp CNTT năm 2004", "imageId": "https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378_1583307621.jpg" },
    { "name": "Giải thưởng VIFOTEC", "imageId": "https://www.cic.com.vn/images/banners/original/giai-thuong-vifotec_1582012769.jpg" },
    { "name": "Bằng khen Bộ Xây Dựng", "imageId": "https://www.cic.com.vn/images/banners/original/huan-chuong-lao-dong-hang-3_1582012829.jpg" },
    { "name": "Bằng khen Hiệp hội VINASA", "imageId": "https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2015_1582012665.jpg" }
  ]
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.awards';

UPDATE cic_content_page_sections
SET config = '{
  "title": "Hệ sinh thái Công nghệ CIC",
  "subtitle": "Phần mềm, thiết bị, AI, BIM, Digital Twins cùng năng lực tư vấn và đào tạo chuyên sâu trong một hệ sinh thái công nghệ thống nhất.",
  "items": [
    {
      "id": "ai-smart-tech",
      "title": "AI & Công nghệ thông minh",
      "description": "Ứng dụng AI, dữ liệu lớn, IoT và tự động hóa vào các bài toán kỹ thuật phức tạp, giúp tối ưu quy trình và hỗ trợ ra quyết định dựa trên dữ liệu thực tế.",
      "badge": "Advanced Technology",
      "imageId": "/banner_hero/dan_dau_chuyen_doi_so.png",
      "link": "/products",
      "view": "products",
      "activeLink": "Sản phẩm"
    },
    {
      "id": "bim-digital-twins",
      "title": "BIM & Digital Twins",
      "description": "Đào tạo, tạo lập và thẩm tra mô hình BIM, số hóa công trình từ thiết kế đến vận hành.",
      "badge": "BIM & Digital Twins",
      "imageId": "/banner_hero/He_sinh_thai_giai_phap_so.png",
      "link": "/services/tu-van-bim",
      "view": "services",
      "activeLink": "Dịch vụ",
      "serviceId": "tu-van-bim"
    },
    {
      "id": "licensed-software",
      "title": "Phần mềm kỹ thuật bản quyền",
      "description": "Hệ sinh thái CAD, BIM, kết cấu, hạ tầng và năng lượng do CIC phát triển và phân phối.",
      "badge": "Phần mềm",
      "imageId": "/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg",
      "link": "/products",
      "view": "products",
      "activeLink": "Sản phẩm"
    },
    {
      "id": "technology-equipment",
      "title": "Thiết bị công nghệ",
      "description": "Thiết bị khảo sát, kiểm định, đo đạc, UAV, LiDAR và GPR phục vụ ngành kỹ thuật.",
      "badge": "Thiết bị & IoT",
      "imageId": "/banner_hero/He_sinh_thai_giai_phap_so.png",
      "link": "/products",
      "view": "products",
      "activeLink": "Sản phẩm"
    },
    {
      "id": "net-zero",
      "title": "Net Zero và phát triển bền vững",
      "description": "Giải pháp kiểm kê phát thải, LCA, EPD, CBAM và xây dựng lộ trình Net Zero.",
      "badge": "Sustainability",
      "imageId": "/banner_hero/dan_dau_chuyen_doi_so.png",
      "link": "/services/tu-van-kiem-ke-khi-nha-kinh",
      "view": "services",
      "activeLink": "Dịch vụ",
      "serviceId": "tu-van-kiem-ke-khi-nha-kinh"
    },
    {
      "id": "consulting-training",
      "title": "Tư vấn & Đào tạo",
      "description": "Đồng hành chuyển đổi số, triển khai công nghệ AI, Net Zero và BIM chuyên sâu.",
      "badge": "Tư vấn chuyên sâu",
      "imageId": "/banner_hero/doi_tac_cong_nghe_chien_luoc.png",
      "link": "/services",
      "view": "services",
      "activeLink": "Dịch vụ",
      "serviceId": null
    }
  ]
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.ecosystem';

UPDATE cic_content_page_sections
SET config = '{
  "title": "Dự án tiêu biểu",
  "subtitle": "Kiến tạo hệ sinh thái giải pháp công nghệ kỹ thuật số toàn diện",
  "referenceSource": { "mode": "auto_featured", "limit": 3 }
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.projects';

UPDATE cic_content_page_sections
SET config = '{
  "title": "Sự kiện nổi bật",
  "subtitle": "Kết nối chuyên gia và cập nhật công nghệ mới nhất",
  "referenceSource": { "mode": "auto_featured", "limit": 1 }
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.events';

UPDATE cic_content_page_sections
SET config = '{
  "title": "Tin tức và Góc nhìn",
  "subtitle": "Cập nhật xu hướng công nghệ và chuyển đổi số mới nhất",
  "referenceSource": { "mode": "auto_featured", "limit": 4 }
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.news';

UPDATE cic_content_page_sections
SET config = '{
  "title": "Đối tác chiến lược",
  "subtitle": "Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới",
  "items": [
    { "id": "partner_bentley", "name": "Bentley Systems", "imageId": "https://www.cic.com.vn/images/banners/original/bentley_1584073443.jpg", "link": "https://www.bentley.com/" },
    { "id": "partner_autodesk", "name": "Autodesk", "imageId": "https://www.cic.com.vn/images/banners/original/autodesk_1692843119.jpg", "link": "https://www.autodesk.com/" },
    { "id": "partner_instantel", "name": "Instantel", "imageId": "https://www.cic.com.vn/images/banners/original/instantel_1584075057.jpg", "link": "https://instantel.com/" },
    { "id": "partner_vcgroup", "name": "VC Group", "imageId": "https://www.cic.com.vn/images/banners/original/vc-group_1584082426.jpg", "link": "/" },
    { "id": "partner_plaxis", "name": "Plaxis", "imageId": "https://www.cic.com.vn/images/banners/original/plaxis_1584073809.jpg", "link": "https://www.bentley.com/software/plaxis/" },
    { "id": "partner_csi", "name": "CSI", "imageId": "https://www.cic.com.vn/images/banners/original/csi_1584074213.jpg", "link": "https://www.csiamerica.com/" }
  ]
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.partners';

UPDATE cic_content_page_sections
SET config = '{
  "title": "Sẵn sàng kiến tạo Tương lai số",
  "description": "Đội ngũ chuyên gia CIC sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất với doanh nghiệp của bạn.",
  "phone": "024 3976 1381",
  "email": "info@cic.com.vn",
  "formId": "form_home_consultation",
  "submitLabel": "Gửi thông tin ngay"
}'::jsonb
WHERE revision_id = 1 AND section_key = 'home.contact_cta';


-- 2. Update revision 1 SEO metadata and mark as published
UPDATE cic_content_page_revisions
SET
  state = 'published',
  seo_title = 'CIC Technology — Đối tác công nghệ chiến lược',
  seo_description = 'Hơn 35 năm tiên phong cung cấp giải pháp phần mềm kỹ thuật, thiết bị công nghệ, dịch vụ tư vấn BIM và chuyển đổi số cho ngành xây dựng tại Việt Nam.',
  published_at = now()
WHERE id = 1;

-- 3. Set published_revision_id on cic_content_pages for Home VI
UPDATE cic_content_pages
SET published_revision_id = 1
WHERE id = 1 AND published_revision_id IS NULL;

COMMIT;
