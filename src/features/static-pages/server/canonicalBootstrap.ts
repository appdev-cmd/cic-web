import 'server-only';
import { getPostgresClient, withTransaction } from '@/server/db/postgres';

interface SeedSectionDef {
  sectionKey: string;
  sectionType: string;
  position: number;
  config: Record<string, unknown>;
  references?: Array<{ entityType: string; entityId: number; position: number }>;
}

interface CanonicalPageSeedDef {
  workspace: 'vi' | 'en';
  code: string;
  name: string;
  slug: string;
  pageType: 'home' | 'about' | 'organization' | 'capacity_experience' | 'legal';
  templateKey: 'home' | 'about' | 'organization' | 'capacity_experience' | 'legal_standard';
  seoTitle: string;
  seoDescription: string;
  sections: SeedSectionDef[];
}

const REAL_AWARDS = [
  {
    name: 'Huân chương Lao động hạng Ba',
    img: 'https://www.cic.com.vn/images/banners/original/huan-chuong-lao-dong-hang-3_1582012829.jpg',
    imageId: 'https://www.cic.com.vn/images/banners/original/huan-chuong-lao-dong-hang-3_1582012829.jpg',
  },
  {
    name: 'Giải thưởng Sao Khuê 2014',
    img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2014_1582012560.jpg',
    imageId: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2014_1582012560.jpg',
  },
  {
    name: 'Cúp CNTT năm 2003',
    img: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378.jpg',
    imageId: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378.jpg',
  },
  {
    name: 'Giải thưởng Sao Khuê 2015',
    img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2015_1582012665.jpg',
    imageId: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2015_1582012665.jpg',
  },
  {
    name: 'Cúp CNTT năm 2004',
    img: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378_1583307621.jpg',
    imageId: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378_1583307621.jpg',
  },
  {
    name: 'Giải thưởng Sáng tạo KHCN Việt Nam VIFOTEC',
    img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-vifotec_1582012769.jpg',
    imageId: 'https://www.cic.com.vn/images/banners/original/giai-thuong-vifotec_1582012769.jpg',
  },
];

const REAL_PARTNERS = [
  { id: 'partner_autodesk', name: 'Autodesk', logo: 'https://www.cic.com.vn/images/banners/original/autodesk_1692843119.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/autodesk_1692843119.jpg', link: 'https://www.autodesk.com/' },
  { id: 'partner_bentley', name: 'Bentley Systems', logo: 'https://www.cic.com.vn/images/banners/original/bentley_1584073443.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/bentley_1584073443.jpg', link: 'https://www.bentley.com/' },
  { id: 'partner_graitec', name: 'Graitec', logo: 'https://www.cic.com.vn/images/banners/original/graitec_1584074977.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/graitec_1584074977.jpg', link: 'https://www.graitec.com/' },
  { id: 'partner_instantel', name: 'Instantel', logo: 'https://www.cic.com.vn/images/banners/original/instantel_1584075057.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/instantel_1584075057.jpg', link: 'https://www.instantel.com/' },
  { id: 'partner_lander', name: 'Lander', logo: 'https://www.cic.com.vn/images/banners/original/lander_1584075179.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/lander_1584075179.jpg', link: '/' },
  { id: 'partner_ptv', name: 'PTV Group', logo: 'https://www.cic.com.vn/images/banners/original/ptv-group_1584081558.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/ptv-group_1584081558.jpg', link: 'https://www.ptvgroup.com/' },
  { id: 'partner_rps', name: 'RPS', logo: 'https://www.cic.com.vn/images/banners/original/rps_1584081695.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/rps_1584081695.jpg', link: '/' },
  { id: 'partner_tecotec', name: 'Tecotec', logo: 'https://www.cic.com.vn/images/banners/original/tecotec_1584082139.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/tecotec_1584082139.jpg', link: '/' },
  { id: 'partner_breeze', name: 'Breeze', logo: 'https://www.cic.com.vn/images/banners/original/breeze_1584073488.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/breeze_1584073488.jpg', link: '/' },
  { id: 'partner_steel_builder', name: 'Steel Builder', logo: 'https://www.cic.com.vn/images/banners/original/steel-builder_1584081972.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/steel-builder_1584081972.jpg', link: '/' },
  { id: 'partner_vcgroup', name: 'VC Group', logo: 'https://www.cic.com.vn/images/banners/original/vc-group_1584082426.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/vc-group_1584082426.jpg', link: '/' },
  { id: 'partner_ndt', name: 'NDT System', logo: 'https://www.cic.com.vn/images/banners/original/ndt-system_1584081087.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/ndt-system_1584081087.jpg', link: '/' },
  { id: 'partner_enjicad', name: 'enjiCAD', logo: 'https://www.cic.com.vn/images/banners/original/enjicad_1584074316.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/enjicad_1584074316.jpg', link: '/products' },
  { id: 'partner_peb', name: 'PEB Steel', logo: 'https://www.cic.com.vn/images/banners/original/peb-steel_1584081269.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/peb-steel_1584081269.jpg', link: '/' },
  { id: 'partner_shimz', name: 'Shimizu', logo: 'https://www.cic.com.vn/images/banners/original/shimz_1584081817.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/shimz_1584081817.jpg', link: '/' },
  { id: 'partner_atlas', name: 'Atlas', logo: 'https://www.cic.com.vn/images/banners/original/atlas-_1584073344.jpg', imageId: 'https://www.cic.com.vn/images/banners/original/atlas-_1584073344.jpg', link: '/' },
];

const PRIVACY_HTML_VI = `
<h2><span class="legal-badge">01</span> Mục đích và phạm vi thu thập thông tin</h2>
<p>Việc thu thập dữ liệu chủ yếu trên website <a href="https://www.cic.com.vn" target="_blank" rel="noopener noreferrer">www.cic.com.vn</a> bao gồm: họ tên, email, điện thoại, đơn vị công tác và địa chỉ liên hệ... Đây là các thông tin cần thiết khi Quý khách hàng đăng ký tư vấn giải pháp, dùng thử phần mềm hoặc sử dụng dịch vụ để CIC liên hệ xác nhận và đảm bảo quyền lợi chính đáng của khách hàng.</p>
<p>Khách hàng có trách nhiệm tự bảo mật thông tin tài khoản và hộp thư điện tử cá nhân, đồng thời thông báo kịp thời cho Công ty Cổ phần Công nghệ và Tư vấn CIC về những hành vi sử dụng trái phép hoặc lạm dụng để có biện pháp xử lý phù hợp.</p>

<h2><span class="legal-badge">02</span> Phạm vi sử dụng thông tin</h2>
<p>Công ty Cổ phần Công nghệ và Tư vấn CIC sử dụng thông tin khách hàng cung cấp trong các phạm vi sau:</p>
<ul>
  <li>Cung cấp các dịch vụ, phần mềm kỹ thuật bản quyền và thiết bị công nghệ đến khách hàng;</li>
  <li>Thực hiện chuyển giao công nghệ, hỗ trợ kỹ thuật và đào tạo hướng dẫn sử dụng chuyên sâu;</li>
  <li>Gửi thông báo về các hội thảo chuyên ngành, sự kiện công nghệ, bản cập nhật phần mềm và chương trình ưu đãi;</li>
  <li>Ngăn ngừa các hoạt động giả mạo hoặc xâm phạm quyền lợi người dùng;</li>
  <li>Liên lạc và giải quyết khiếu nại với khách hàng trong những trường hợp đặc biệt;</li>
  <li>Tuyệt đối không sử dụng thông tin cá nhân ngoài mục đích xác nhận và liên hệ có liên quan đến hoạt động chuyên môn của CIC.</li>
</ul>
<p><em>Trong trường hợp có yêu cầu hợp pháp bằng văn bản từ cơ quan nhà nước có thẩm quyền, CIC có trách nhiệm phối hợp cung cấp thông tin theo đúng quy định của pháp luật Việt Nam.</em></p>

<h2><span class="legal-badge">03</span> Thời gian lưu trữ thông tin</h2>
<p>Dữ liệu cá nhân của khách hàng được lưu trữ an toàn trên hệ thống máy chủ bảo mật của CIC cho đến khi có yêu cầu hủy bỏ từ phía khách hàng hoặc theo quy định lưu trữ hồ sơ dịch vụ của doanh nghiệp. Trong mọi trường hợp còn lại, thông tin cá nhân luôn được bảo mật nghiêm ngặt.</p>

<h2><span class="legal-badge">04</span> Phương tiện tiếp cận và chỉnh sửa dữ liệu cá nhân</h2>
<p>Khách hàng có quyền kiểm tra, cập nhật, điều chỉnh hoặc yêu cầu CIC xóa bỏ thông tin cá nhân của mình bất kỳ lúc nào bằng cách gửi yêu cầu tới hộp thư chính thức <a href="mailto:info@cic.com.vn">info@cic.com.vn</a> hoặc liên hệ Hotline <a href="tel:02439761381">024 3976 1381</a>.</p>

<h2><span class="legal-badge">05</span> Cam kết bảo mật thông tin cá nhân khách hàng</h2>
<p>Thông tin cá nhân của khách hàng trên hệ thống <a href="https://www.cic.com.vn">www.cic.com.vn</a> được cam kết bảo mật tuyệt đối theo Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân và quy chế an toàn thông tin của CIC. Chúng tôi tuyệt đối không mua bán, chuyển giao hoặc tiết lộ thông tin cho bên thứ ba khi chưa có sự đồng ý của khách hàng.</p>
<div class="legal-notice-box">
  <p><strong>Lưu ý quan trọng:</strong> Quý khách hàng vui lòng cung cấp đầy đủ và chính xác thông tin liên hệ khi gửi yêu cầu tư vấn hoặc báo giá phần mềm/thiết bị để đội ngũ kỹ sư CIC hỗ trợ nhanh chóng và chính xác nhất.</p>
</div>
`.trim();

const PRIVACY_HTML_EN = `
<h2><span class="legal-badge">01</span> Purpose and Scope of Data Collection</h2>
<p>Personal data collected on <a href="https://www.cic.com.vn" target="_blank" rel="noopener noreferrer">www.cic.com.vn</a> primarily includes full name, corporate email, phone number, organization, and contact address when clients request technical consultation, software trials, or event registration with CIC Technology &amp; Consultancy JSC.</p>

<h2><span class="legal-badge">02</span> Scope of Information Use</h2>
<ul>
  <li>Delivering licensed engineering software, technological equipment, and consulting services;</li>
  <li>Providing technical onboarding, training, and maintenance support;</li>
  <li>Sending invitations to technical webinars, product updates, and official announcements;</li>
  <li>Preventing unauthorized access and resolving customer inquiries promptly.</li>
</ul>

<h2><span class="legal-badge">03</span> Data Retention Period</h2>
<p>Client records are securely stored within CIC's infrastructure until deletion is requested by the client or as required by applicable corporate and statutory retention obligations.</p>

<h2><span class="legal-badge">04</span> Accessing and Updating Your Information</h2>
<p>Clients may review, update, or request deletion of their personal data at any time by contacting <a href="mailto:info@cic.com.vn">info@cic.com.vn</a> or calling <a href="tel:+842439761381">+84 24 3976 1381</a>.</p>

<h2><span class="legal-badge">05</span> Data Protection Commitment</h2>
<p>CIC strictly protects personal data in accordance with Vietnam's Personal Data Protection Decree (Decree 13/2023/ND-CP) and never sells or discloses client data to third parties without prior consent.</p>
`.trim();

const TERMS_HTML_VI = `
<h2><span class="legal-badge">01</span> Quy định chung khi sử dụng website</h2>
<p>Khi truy cập và sử dụng dịch vụ trên website <a href="https://www.cic.com.vn" target="_blank" rel="noopener noreferrer">www.cic.com.vn</a>, Quý khách hàng mặc định đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Khách hàng cam kết sử dụng trang web cho các mục đích hợp pháp liên quan đến tìm hiểu sản phẩm phần mềm bản quyền, thiết bị công nghệ, dịch vụ tư vấn kỹ thuật và đào tạo của CIC.</p>
<p>Nghiêm cấm mọi hành vi can thiệp trái phép vào hệ thống máy chủ, phát tán mã độc, thu thập dữ liệu tự động trái phép hoặc đăng tải nội dung vi phạm pháp luật Việt Nam.</p>

<h2><span class="legal-badge">02</span> Sở hữu trí tuệ và Bản quyền nội dung</h2>
<p>Toàn bộ nội dung đăng tải trên website bao gồm bài viết chuyên môn, hồ sơ dự án, tài liệu kỹ thuật, hình ảnh, video giới thiệu phần mềm CAD/CAE/BIM và nhận diện thương hiệu thuộc quyền sở hữu trí tuệ của Công ty Cổ phần Công nghệ và Tư vấn CIC hoặc các hãng công nghệ đối tác cấp phép hợp pháp.</p>
<p>Mọi hành vi sao chép, trích dẫn hoặc phân phối lại vì mục đích thương mại khi chưa có văn bản chấp thuận của CIC đều bị nghiêm cấm.</p>

<h2><span class="legal-badge">03</span> Quy định về tài liệu tải xuống và Phần mềm dùng thử</h2>
<ul>
  <li>Tài liệu kỹ thuật, brochure và bộ cài đặt đánh giá (Trial/Demo) chỉ phục vụ mục đích nghiên cứu, học thuật và đánh giá kỹ thuật nội bộ;</li>
  <li>Tuyệt đối không bẻ khóa (crack), dịch ngược (reverse engineer) hoặc can thiệp trái phép vào mã nguồn phần mềm;</li>
  <li>Giữ nguyên thông tin bản quyền và nguồn gốc xuất xứ của CIC và hãng sản xuất khi trích dẫn tài liệu.</li>
</ul>

<h2><span class="legal-badge">04</span> Miễn trừ và Giới hạn trách nhiệm pháp lý</h2>
<p>CIC luôn nỗ lực cao nhất để đảm bảo tính chính xác và cập nhật của thông tin kỹ thuật trên website. Tuy nhiên, cấu hình và thông số phiên bản phần mềm/thiết bị có thể thay đổi theo lộ trình phát hành của hãng sản xuất mà không cần báo trước; vui lòng liên hệ trực tiếp chuyên gia CIC để nhận bản chào kỹ thuật chính thức mới nhất.</p>

<h2><span class="legal-badge">05</span> Cập nhật và Thay đổi điều khoản sử dụng</h2>
<p>CIC có quyền điều chỉnh, bổ sung các điều khoản sử dụng này nhằm phù hợp với quy định pháp luật hiện hành và hoạt động thực tiễn. Các thay đổi có hiệu lực ngay khi được đăng tải công khai trên website.</p>
`.trim();

const TERMS_HTML_EN = `
<h2><span class="legal-badge">01</span> General Website Usage Terms</h2>
<p>By accessing <a href="https://www.cic.com.vn" target="_blank" rel="noopener noreferrer">www.cic.com.vn</a>, users agree to abide by these Terms of Use and use the website strictly for lawful inquiries regarding CIC's engineering software, equipment, BIM/Digital Twin consulting, and training services.</p>

<h2><span class="legal-badge">02</span> Intellectual Property Rights</h2>
<p>All technical articles, product documentation, project case studies, graphics, and brand assets published on this website are the intellectual property of CIC Technology &amp; Consultancy JSC and its authorized global technology partners.</p>

<h2><span class="legal-badge">03</span> Technical Brochures &amp; Evaluation Software</h2>
<ul>
  <li>Downloaded brochures, technical guides, and trial packages are provided strictly for evaluation and non-commercial research;</li>
  <li>Reverse engineering, unauthorized redistribution, or license circumvention is strictly prohibited;</li>
  <li>Original copyright notices and partner attributions must remain intact.</li>
</ul>

<h2><span class="legal-badge">04</span> Limitation of Liability</h2>
<p>While CIC strives to keep all technical specifications accurate and up to date, software versions and hardware parameters may evolve per manufacturer releases. Please contact CIC specialists for formal technical proposals.</p>

<h2><span class="legal-badge">05</span> Amendments</h2>
<p>CIC reserves the right to update these Terms of Use in compliance with applicable laws. Updates take effect immediately upon publication on the website.</p>
`.trim();

let bootstrapPromise: Promise<void> | null = null;

/**
 * Ensures the 6 canonical system pages exist for both 'vi' and 'en' in `cic_content_pages`.
 * Strictly idempotent & non-destructive: ONLY inserts missing (workspace, code) pages
 * and NEVER overwrites existing pages or user edits.
 */
export async function ensureCanonicalSystemPagesSeeded(): Promise<void> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const sql = getPostgresClient();
      const [{ cnt }] = await sql`
        SELECT count(*)::int AS cnt
        FROM cic_content_pages
        WHERE system_defined = true
      `;
      if (Number(cnt) >= 12) {
        return;
      }

      // Query real featured IDs from PostgreSQL so Home references point to live DB records
      const [projRows, eventViRows, eventEnRows, newsViRows, newsEnRows] = await Promise.all([
        sql`SELECT id FROM cic_projects WHERE published = true ORDER BY is_featured DESC, ordering ASC, id ASC LIMIT 3`.catch(() => []),
        sql`SELECT id FROM cic_event WHERE published = true ORDER BY is_hot DESC, show_in_homepage DESC, coalesce(time_event, created_time) DESC LIMIT 4`.catch(() => []),
        sql`SELECT id FROM cic_event_en WHERE published = true ORDER BY is_hot DESC, show_in_homepage DESC, coalesce(time_event, created_time) DESC LIMIT 4`.catch(() => []),
        sql`SELECT id, title FROM cic_news WHERE published = true ORDER BY is_hot DESC, show_in_homepage DESC, coalesce(start_time, created_time) DESC LIMIT 4`.catch(() => []),
        sql`SELECT id, title FROM cic_news_en WHERE published = true ORDER BY is_hot DESC, show_in_homepage DESC, coalesce(start_time, created_time) DESC LIMIT 4`.catch(() => []),
      ]);

      const projectRefs = projRows.map((r, i) => ({ entityType: 'project', entityId: Number(r.id), position: i + 1 }));
      const eventViRefs = eventViRows.map((r, i) => ({ entityType: 'event', entityId: Number(r.id), position: i + 1 }));
      const eventEnRefs = (eventEnRows.length > 0 ? eventEnRows : eventViRows).map((r, i) => ({ entityType: 'event', entityId: Number(r.id), position: i + 1 }));
      const newsViRefs = newsViRows.map((r, i) => ({ entityType: 'news', entityId: Number(r.id), position: i + 1 }));
      const newsEnRefs = (newsEnRows.length > 0 ? newsEnRows : newsViRows).map((r, i) => ({ entityType: 'news', entityId: Number(r.id), position: i + 1 }));

      const tickerVi = newsViRows.map((r) => String(r.title ?? '').trim()).filter(Boolean);
      const tickerEn = newsEnRows.map((r) => String(r.title ?? '').trim()).filter(Boolean);

      const buildDefinitions = (locale: 'vi' | 'en'): CanonicalPageSeedDef[] => {
        const isEn = locale === 'en';
        const evRefs = isEn ? eventEnRefs : eventViRefs;
        const nwRefs = isEn ? newsEnRefs : newsViRefs;

        const aboutHeroCommon = {
          badge: isEn ? 'About Us' : 'Về chúng tôi',
          title: isEn ? 'OVER 35 YEARS OF ADVANCING WITH TECHNOLOGY' : 'HƠN 35 NĂM NHỊP BƯỚC CÙNG CÔNG NGHỆ',
          subtitle: isEn
            ? 'Pioneering engineering software solutions, technological equipment, and comprehensive digital transformation consulting for Vietnam construction industry.'
            : 'Tiên phong cung cấp giải pháp phần mềm kỹ thuật, thiết bị công nghệ và tư vấn chuyển đổi số toàn diện cho ngành Xây dựng Việt Nam.',
          backgroundImageId: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
        };

        const aboutContactCtaCommon = {
          title: isEn ? 'Company Capability Profile' : 'Hồ sơ năng lực (Profile)',
          ctaLabel: isEn ? 'View CIC Profile (PDF)' : 'Hồ sơ năng lực (Profile)',
          ctaUrl: 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf',
        };

        return [
          {
            workspace: locale,
            code: 'home',
            name: isEn ? 'Home' : 'Trang chủ',
            slug: isEn ? '/en' : '/',
            pageType: 'home',
            templateKey: 'home',
            seoTitle: isEn
              ? 'CIC Technology — Strategic Technology Partner'
              : 'CIC Technology — Đối tác công nghệ chiến lược',
            seoDescription: isEn
              ? 'Genuine engineering software, smart equipment, BIM/Digital Twins consulting, and sustainable technology solutions by CIC Technology.'
              : 'Tiên phong cung cấp phần mềm kỹ thuật bản quyền, thiết bị công nghệ, tư vấn BIM, chuyển đổi số và phát triển bền vững cho ngành Xây dựng Việt Nam.',
            sections: [
              {
                sectionKey: 'home.hero',
                sectionType: 'hero_carousel',
                position: 1,
                config: {
                  badge: 'Leading Innovation since 1990',
                  slides: isEn
                    ? [
                        {
                          title: 'Strategic Technology Partner',
                          subtitle: 'Over 35 years pioneering comprehensive digital transformation across construction and infrastructure.',
                          backgroundImageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png',
                          mobileImageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                        {
                          title: 'Digital Solutions Ecosystem',
                          subtitle: 'Applying AI, BIM, and Digital Twins to optimize engineering performance and operational efficiency.',
                          backgroundImageId: '/banner_hero/He_sinh_thai_giai_phap_so.png',
                          mobileImageId: '/banner_hero/He_sinh_thai_giai_phap_so.png',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                        {
                          title: 'Leading Digital Transformation',
                          subtitle: 'Partnering with world-leading technology corporations to deliver breakthrough infrastructure solutions.',
                          backgroundImageId: '/banner_hero/dan_dau_chuyen_doi_so.png',
                          mobileImageId: '/banner_hero/dan_dau_chuyen_doi_so.png',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                        {
                          title: 'Genuine Licensed Software',
                          subtitle: 'Delivering authentic engineering software licenses, dedicated technical support, and full compliance.',
                          backgroundImageId: '/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg',
                          mobileImageId: '/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                      ]
                    : [
                        {
                          title: 'Đối tác công nghệ chiến lược',
                          subtitle: 'Hơn 35 năm tiên phong thúc đẩy số hóa toàn diện.',
                          backgroundImageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png',
                          mobileImageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                        {
                          title: 'Hệ sinh thái giải pháp số',
                          subtitle: 'Ứng dụng AI, BIM và Digital Twins vào quy trình vận hành, giúp tối ưu hóa hiệu suất và tiết kiệm tài nguyên cho doanh nghiệp.',
                          backgroundImageId: '/banner_hero/He_sinh_thai_giai_phap_so.png',
                          mobileImageId: '/banner_hero/He_sinh_thai_giai_phap_so.png',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                        {
                          title: 'Dẫn đầu chuyển đổi số',
                          subtitle: 'Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới mang lại những giải pháp đột phá cho tương lai hạ tầng Việt Nam.',
                          backgroundImageId: '/banner_hero/dan_dau_chuyen_doi_so.png',
                          mobileImageId: '/banner_hero/dan_dau_chuyen_doi_so.png',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                        {
                          title: 'Phần mềm bản quyền chính hãng',
                          subtitle: 'Cung cấp hệ thống phần mềm bản quyền chính hãng, hỗ trợ kỹ thuật tận tâm, đảm bảo an toàn thông tin và tuân thủ pháp lý.',
                          backgroundImageId: '/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg',
                          mobileImageId: '/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg',
                          primaryCtaId: 'cta_explore_products',
                          secondaryCtaId: 'cta_about_cic',
                        },
                      ],
                  tickerItems:
                    (isEn ? tickerEn : tickerVi).length > 0
                      ? isEn
                        ? tickerEn
                        : tickerVi
                      : [
                          'CIC Technology đồng hành cùng Bentley Systems thúc đẩy hạ tầng số tại Việt Nam',
                          'Nền tảng kiểm kê khí nhà kính và quản lý Net Zero thông minh chuẩn bị ra mắt',
                        ],
                },
              },
              {
                sectionKey: 'home.intro',
                sectionType: 'company_intro',
                position: 2,
                config: {
                  badge: isEn ? 'About CIC' : 'Về chúng tôi',
                  title: isEn
                    ? 'Over 35 Years Partnering with Vietnam Engineering'
                    : 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
                  paragraphs: isEn
                    ? [
                        'Founded in 1990 under the Ministry of Construction, CIC Technology & Consultancy JSC is a pioneering leader in engineering software transfer and technical consulting in Vietnam.',
                        'For over 35 years, we have spearheaded ICT adoption, delivering specialized consulting and technology solutions to thousands of domestic and international organizations.',
                      ]
                    : [
                        'Thành lập từ năm 1990 trực thuộc Bộ Xây dựng, Công ty Cổ phần Công nghệ và Tư vấn CIC tự hào là đơn vị tiên phong trong lĩnh vực chuyển giao công nghệ phần mềm và tư vấn kỹ thuật tại Việt Nam.',
                        'Suốt hơn 35 năm, chúng tôi luôn đi đầu ứng dụng ICT, mang đến dịch vụ tư vấn chuyên sâu cho hàng nghìn doanh nghiệp, đối tác trong nước và quốc tế.',
                      ],
                  videoUrl: 'https://www.youtube.com/watch?v=hdLFK_09-tU&t=448s',
                  profilePdfUrl: 'https://www.cic.com.vn/flipbooks/index.html?pdf=CICProfile2024Final.pdf',
                  primaryCtaId: 'cta_about_cic',
                  primaryCtaLabel: isEn ? 'Explore CIC Journey' : 'Khám phá hành trình CIC',
                  primaryCtaUrl: isEn ? '/en/about' : '/gioi-thieu',
                },
              },
              {
                sectionKey: 'home.stats',
                sectionType: 'statistics',
                position: 3,
                config: {
                  items: isEn
                    ? [
                        { id: 'home_stat_experience', value: 35, suffix: '+', label: 'Years Experience' },
                        { id: 'home_stat_solutions', value: 300, suffix: '+', label: 'Tech Solutions' },
                        { id: 'home_stat_projects', value: 5000, suffix: '+', label: 'Delivered Projects' },
                        { id: 'home_stat_partners', value: 100, suffix: '+', label: 'Global Partners' },
                      ]
                    : [
                        { id: 'home_stat_experience', value: 35, suffix: '+', label: 'Năm kinh nghiệm' },
                        { id: 'home_stat_solutions', value: 300, suffix: '+', label: 'Giải pháp công nghệ' },
                        { id: 'home_stat_projects', value: 5000, suffix: '+', label: 'Dự án thành công' },
                        { id: 'home_stat_partners', value: 100, suffix: '+', label: 'Đối tác toàn cầu' },
                      ],
                },
              },
              {
                sectionKey: 'home.awards',
                sectionType: 'award_slider',
                position: 4,
                config: {
                  title: isEn ? 'Accreditations & Industry Awards' : 'Thành tựu & Giải thưởng',
                  subtitle: isEn
                    ? 'Recognized for persistent excellence in construction technology'
                    : 'Minh chứng cho nỗ lực không ngừng nghỉ',
                  items: REAL_AWARDS,
                },
              },
              {
                sectionKey: 'home.ecosystem',
                sectionType: 'technology_ecosystem',
                position: 5,
                config: {
                  title: isEn ? 'CIC Technology Ecosystem' : 'Hệ sinh thái Công nghệ CIC',
                  subtitle: isEn
                    ? 'Software, smart equipment, AI, BIM, Digital Twins, and specialized consulting in one unified ecosystem.'
                    : 'Phần mềm, thiết bị, AI, BIM, Digital Twins cùng năng lực tư vấn và đào tạo chuyên sâu trong một hệ sinh thái công nghệ thống nhất.',
                  items: isEn
                    ? [
                        { id: 'ai-smart-tech', title: 'AI & Smart Technology', description: 'Applying AI, Big Data, IoT, and automation to complex engineering challenges.', badge: 'Advanced Technology', imageId: '/banner_hero/dan_dau_chuyen_doi_so.png', link: '/en/products', view: 'products', activeLink: 'Sản phẩm' },
                        { id: 'bim-digital-twins', title: 'BIM & Digital Twins', description: 'BIM training, modeling, auditing, and full lifecycle asset digitalization.', badge: 'BIM & Digital Twins', imageId: '/banner_hero/He_sinh_thai_giai_phap_so.png', link: '/en/services', view: 'services', activeLink: 'Dịch vụ', serviceId: 'tu-van-bim' },
                        { id: 'licensed-software', title: 'Genuine Engineering Software', description: 'CAD, BIM, structural, infrastructure, and energy software developed and distributed by CIC.', badge: 'Software', imageId: '/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg', link: '/en/products', view: 'products', activeLink: 'Sản phẩm' },
                        { id: 'technology-equipment', title: 'Technological Equipment', description: 'Surveying, inspection, UAV, LiDAR, and GPR testing equipment for engineering sectors.', badge: 'Equipment & IoT', imageId: '/banner_hero/He_sinh_thai_giai_phap_so.png', link: '/en/products', view: 'products', activeLink: 'Sản phẩm' },
                        { id: 'net-zero', title: 'Net Zero & Sustainability', description: 'GHG inventory, LCA, EPD, CBAM compliance, and Net Zero roadmap consulting.', badge: 'Sustainability', imageId: '/banner_hero/dan_dau_chuyen_doi_so.png', link: '/en/services', view: 'services', activeLink: 'Dịch vụ', serviceId: 'tu-van-kiem-ke-khi-nha-kinh' },
                        { id: 'consulting-training', title: 'Consulting & Training', description: 'In-depth digital transformation, AI, Net Zero, and corporate BIM training programs.', badge: 'Consulting', imageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png', link: '/en/services', view: 'services', activeLink: 'Dịch vụ' },
                      ]
                    : [
                        { id: 'ai-smart-tech', title: 'AI & Công nghệ thông minh', description: 'Ứng dụng AI, dữ liệu lớn, IoT và tự động hóa vào các bài toán kỹ thuật phức tạp, giúp tối ưu quy trình và hỗ trợ ra quyết định dựa trên dữ liệu thực tế.', badge: 'Advanced Technology', imageId: '/banner_hero/dan_dau_chuyen_doi_so.png', link: '/products', view: 'products', activeLink: 'Sản phẩm' },
                        { id: 'bim-digital-twins', title: 'BIM & Digital Twins', description: 'Đào tạo, tạo lập và thẩm tra mô hình BIM, số hóa công trình từ thiết kế đến vận hành.', badge: 'BIM & Digital Twins', imageId: '/banner_hero/He_sinh_thai_giai_phap_so.png', link: '/services', view: 'services', activeLink: 'Dịch vụ', serviceId: 'tu-van-bim' },
                        { id: 'licensed-software', title: 'Phần mềm kỹ thuật bản quyền', description: 'Hệ sinh thái CAD, BIM, kết cấu, hạ tầng và năng lượng do CIC phát triển và phân phối.', badge: 'Phần mềm', imageId: '/banner_hero/Phan_mem_ban_quyen_chinh_hang.jpg', link: '/products', view: 'products', activeLink: 'Sản phẩm' },
                        { id: 'technology-equipment', title: 'Thiết bị công nghệ', description: 'Thiết bị khảo sát, kiểm định, đo đạc, UAV, LiDAR và GPR phục vụ ngành kỹ thuật.', badge: 'Thiết bị & IoT', imageId: '/banner_hero/He_sinh_thai_giai_phap_so.png', link: '/products', view: 'products', activeLink: 'Sản phẩm' },
                        { id: 'net-zero', title: 'Net Zero và phát triển bền vững', description: 'Giải pháp kiểm kê phát thải, LCA, EPD, CBAM và xây dựng lộ trình Net Zero.', badge: 'Sustainability', imageId: '/banner_hero/dan_dau_chuyen_doi_so.png', link: '/services', view: 'services', activeLink: 'Dịch vụ', serviceId: 'tu-van-kiem-ke-khi-nha-kinh' },
                        { id: 'consulting-training', title: 'Tư vấn & Đào tạo', description: 'Đồng hành chuyển đổi số, triển khai công nghệ AI, Net Zero và BIM chuyên sâu.', badge: 'Tư vấn chuyên sâu', imageId: '/banner_hero/doi_tac_cong_nghe_chien_luoc.png', link: '/services', view: 'services', activeLink: 'Dịch vụ' },
                      ],
                },
              },
              {
                sectionKey: 'home.projects',
                sectionType: 'project_highlight',
                position: 6,
                config: {
                  title: isEn ? 'Featured Projects' : 'Dự án tiêu biểu',
                  subtitle: isEn
                    ? 'Delivering comprehensive digital engineering solutions across landmark projects'
                    : 'Kiến tạo hệ sinh thái giải pháp công nghệ kỹ thuật số toàn diện',
                  ctaLabel: isEn ? 'View All Projects' : 'Xem tất cả dự án',
                  ctaUrl: isEn ? '/en/projects' : '/projects',
                  _referenceSources: { project: { mode: 'featured', limit: 3 } },
                },
                references: projectRefs,
              },
              {
                sectionKey: 'home.events',
                sectionType: 'event_highlight',
                position: 7,
                config: {
                  title: isEn ? 'Featured Events & Webinars' : 'Sự kiện nổi bật',
                  subtitle: isEn
                    ? 'Connect with industry experts and explore emerging engineering technologies'
                    : 'Kết nối chuyên gia và cập nhật xu hướng công nghệ mới nhất',
                  ctaLabel: isEn ? 'Explore Events' : 'Xem sự kiện',
                  ctaUrl: isEn ? '/en/events' : '/events',
                  _referenceSources: { event: { mode: 'featured', limit: 4 } },
                },
                references: evRefs,
              },
              {
                sectionKey: 'home.news',
                sectionType: 'news_highlight',
                position: 8,
                config: {
                  title: isEn ? 'News & Insights' : 'Tin tức và Góc nhìn',
                  subtitle: isEn
                    ? 'Latest updates on engineering technology and digital transformation'
                    : 'Cập nhật xu hướng công nghệ và chuyển đổi số mới nhất',
                  ctaLabel: isEn ? 'Read All News' : 'Xem tất cả tin tức',
                  ctaUrl: isEn ? '/en/news' : '/news',
                  _referenceSources: { news: { mode: 'featured', limit: 4 } },
                },
                references: nwRefs,
              },
              {
                sectionKey: 'home.partners',
                sectionType: 'partner_marquee',
                position: 9,
                config: {
                  title: isEn ? 'Global Strategic Partners' : 'Đối tác chiến lược',
                  subtitle: isEn
                    ? 'Collaborating with world-leading technology corporations'
                    : 'Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới',
                  items: REAL_PARTNERS,
                },
              },
              {
                sectionKey: 'home.contact_cta',
                sectionType: 'contact_cta_form',
                position: 10,
                config: {
                  title: isEn ? 'Ready to Engineer the Digital Future' : 'Sẵn sàng kiến tạo Tương lai số',
                  description: isEn
                    ? 'Our team of engineering specialists is ready to listen and deliver tailored technology solutions for your enterprise.'
                    : 'Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và cung cấp những giải pháp công nghệ tối ưu nhất cho doanh nghiệp của bạn.',
                  phone: isEn ? '+84 24 3976 1381' : '024 3976 1381',
                  email: 'info@cic.com.vn',
                  formId: 'form_home_consultation',
                  submitLabel: isEn ? 'Request Consultation' : 'Gửi thông tin ngay',
                },
              },
            ],
          },
          {
            workspace: locale,
            code: 'about',
            name: isEn ? 'About Us' : 'Giới thiệu',
            slug: isEn ? '/about' : '/gioi-thieu',
            pageType: 'about',
            templateKey: 'about',
            seoTitle: isEn
              ? 'About CIC Technology | Strategic Technology Partner'
              : 'Về CIC Technology | Đối tác công nghệ chiến lược',
            seoDescription: isEn
              ? 'Discover over 35 years of history, vision, mission, and technological milestones at CIC Technology.'
              : 'Tìm hiểu lịch sử hơn 35 năm hình thành, tầm nhìn sứ mệnh, giá trị cốt lõi và thành tựu của Công ty CP Công nghệ và Tư vấn CIC.',
            sections: [
              { sectionKey: 'about.hero', sectionType: 'hero_banner', position: 1, config: aboutHeroCommon },
              {
                sectionKey: 'about.overview',
                sectionType: 'company_overview',
                position: 2,
                config: {
                  title: isEn ? 'Corporate Overview' : 'Tổng quan doanh nghiệp',
                  videoUrl: 'https://www.youtube.com/watch?v=hdLFK_09-tU?start=448',
                  paragraphs: isEn
                    ? [
                        'CIC Technology and Consulting Joint Stock Company, formerly the Informatics Center under the Ministry of Construction, was established on November 27, 1990 as the informatics advisory body serving IT development across the construction sector.',
                        'Today, we are a proud member of VC Group, a premier consortium in construction consulting, equipment, and technology in Vietnam.',
                        'After more than 35 years of development, CIC has built an experienced leadership team and dedicated specialists delivering high-impact software, equipment, and consulting services.',
                      ]
                    : [
                        'Công ty Cổ phần Công nghệ và Tư vấn CIC tiền thân là Trung tâm tin học thuộc Bộ Xây dựng thành lập vào ngày 27/11/1990, bắt đầu hoạt động với chức năng là cơ quan tham mưu tin học thuộc Bộ Xây dựng nhằm phục vụ yêu cầu ứng dụng và phát triển Công nghệ thông tin trong ngành.',
                        'Hiện nay, chúng tôi là thành viên của VC Group, tổ hợp hàng đầu về tư vấn xây dựng, thiết bị và công nghệ tại Việt Nam.',
                        'Sau hơn 35 năm phát triển, CIC đã xây dựng được đội ngũ quản lý vững vàng cùng tập thể nhân viên có trình độ chuyên môn cao, sáng tạo và tận tâm; cung cấp sản phẩm phần mềm, thiết bị và dịch vụ công nghệ có tính ứng dụng cao cho ngành Xây dựng.',
                      ],
                },
              },
              {
                sectionKey: 'about.timeline',
                sectionType: 'timeline',
                position: 3,
                config: {
                  badge: isEn ? '35-Year Journey' : 'Hành trình 35 năm',
                  title: isEn ? '35-Year Journey' : 'Lịch sử phát triển',
                  description: isEn
                    ? 'The journey of rising to become a pioneer in construction technology and consulting in Vietnam.'
                    : 'Chặng đường vươn lên trở thành một trong những đơn vị tiên phong trong lĩnh vực công nghệ và tư vấn xây dựng tại Việt Nam.',
                  milestones: isEn
                    ? [
                        { id: 'ms-1990', year: '1990', description: 'Founded on November 27, 1990 as the Informatics Center under the Ministry of Construction.' },
                        { id: 'ms-2000', year: '2000', description: 'Reformed into Construction Informatics Company (CIC) under the Ministry of Construction.' },
                        { id: 'ms-2006', year: '2006', description: 'Equitized into CIC Technology and Construction Consulting Joint Stock Company.' },
                        { id: 'ms-2019', year: '2019', description: 'Rebranded as CIC Technology & Consulting JSC and joined VC Group.' },
                        { id: 'ms-2025', year: '2025', description: '35th anniversary milestone, expanding AI, BIM, Digital Twins, and Net Zero sustainability solutions.' },
                      ]
                    : [
                        { id: 'ms-1990', year: '1990', description: 'Ngày 27/11/1990, CIC chính thức ra đời, tiền thân là Trung tâm tin học, thuộc Bộ Xây dựng.' },
                        { id: 'ms-2000', year: '2000', description: 'Trở thành Công ty Tin học Xây dựng (CIC) thuộc Bộ Xây dựng.' },
                        { id: 'ms-2006', year: '2006', description: 'Được cổ phần hóa thành Công ty CP Tin học và Tư vấn Xây dựng.' },
                        { id: 'ms-2019', year: '2019', description: 'Trở thành Công ty CP Công nghệ & Tư vấn CIC (CIC) và thuộc VC Group — Tổ hợp gồm 10 công ty hàng đầu trong lĩnh vực xây dựng & các ngành kỹ thuật liên quan.' },
                        { id: 'ms-2025', year: '2025', description: 'Dấu mốc 35 năm phát triển của CIC, thay đổi nhận diện, mở rộng phát triển mạnh mẽ các giải pháp AI và Phát triển bền vững.' },
                      ],
                },
              },
              {
                sectionKey: 'about.strategy',
                sectionType: 'strategy_values',
                position: 4,
                config: {
                  title: isEn ? 'Strategic Direction' : 'Định hướng chiến lược',
                  subtitle: isEn ? 'Pioneering sustainable technological values' : 'Tầm nhìn kiến tạo giá trị công nghệ bền vững',
                  imageId: '/35nam_cic_1.JPG',
                  vision: isEn
                    ? 'Deliver modern, high-impact software, equipment, and IT services supporting research, production, and governance in Vietnam while integrating globally.'
                    : 'Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ CNTT hiện đại, có tính ứng dụng cao để hỗ trợ công tác nghiên cứu, sản xuất, điều hành tại Việt Nam; không ngừng hội nhập thế giới.',
                  mission: isEn
                    ? 'Become the leading provider of ICT applications and scientific technology solutions for engineering disciplines in Vietnam and the region.'
                    : 'Trở thành nhà cung cấp hàng đầu về các giải pháp ứng dụng công nghệ ICT và khoa học công nghệ khác cho các ngành kỹ thuật tại Việt Nam và các nước trong khu vực.',
                  coreValues: (isEn
                    ? ['Commitment to Quality', 'Customer Dedication', 'Continuous Innovation', 'Teamwork Spirit', 'Harmony & Growth']
                    : ['Cam kết về chất lượng', 'Tận tụy với khách hàng', 'Đổi mới không ngừng', 'Tinh thần tập thể', 'Khích lệ - hài hoà']
                  ).map((value, idx) => ({ id: `core-val-${idx + 1}`, value })),
                },
              },
              {
                sectionKey: 'about.offerings',
                sectionType: 'offerings_grid',
                position: 5,
                config: {
                  title: isEn ? 'PRODUCTS & SERVICES' : 'SẢN PHẨM VÀ DỊCH VỤ CUNG CẤP',
                  subtitle: isEn ? 'Core engineering capabilities and technology solutions' : 'Khẳng định năng lực qua các giải pháp công nghệ cốt lõi',
                  items: isEn
                    ? [
                        { title: 'Construction Software Development', desc: 'Developing specialized structural, planning, and cost software (KPW, Escon, RDW, VinaSAS…) and enjiCAD.' },
                        { title: 'Official Global Software Distribution', desc: 'Authorized partner for Autodesk, Bentley, CSI, Cubicost, ANSYS, DHI, Hexagon, Prokon, Risa…' },
                        { title: 'High-Tech Engineering Equipment', desc: 'Distributing precision testing and surveying systems from Piletest, Instantel, Radiodetection, DJI…' },
                        { title: 'Construction Consulting', desc: 'Design consulting, structural verification, supervision, and construction project management.' },
                        { title: 'BIM & Digital Twins', desc: 'Comprehensive BIM roadmap consulting, CDE deployment, and Digital Twin modeling.' },
                        { title: 'Smart Technology Solutions', desc: 'AI, Big Data, and IoT solutions for smart infrastructure and facility management.' },
                        { title: 'Sustainable Development & Net Zero', desc: 'GHG inventory, LCA, EPD, CBAM, and ESG consulting towards green construction.' },
                      ]
                    : [
                        { title: 'Phát triển phần mềm xây dựng', desc: 'Phát triển các phần mềm chuyên ngành xây dựng, quản lý, quy hoạch làm nên thương hiệu CIC (KPW, Escon, RDW, VinaSAS…) và enjiCAD – phần mềm vẽ kỹ thuật chất lượng cao, giá cạnh tranh hơn nhiều so với CAD ngoại nhập.' },
                        { title: 'Phân phối phần mềm nhập khẩu chính hãng', desc: 'Phân phối phần mềm bản quyền từ các hãng công nghệ hàng đầu thế giới như Microsoft, Autodesk, CSI, Cubicost, ANSYS, Bentley, DHI, Hexagon, DNV GL, Prokon, Risa…' },
                        { title: 'Thiết bị công nghệ', desc: 'Phân phối các thiết bị công nghệ hàm lượng khoa học cao từ những hãng uy tín thế giới như Piletest, Tecknotrove, ZXLidars, A.P. van den Berg, AQ System, Sewer Robotics, Radiodetection, Pearpoint, DJI…' },
                        { title: 'Tư vấn Xây dựng', desc: 'Tư vấn thiết kế, thẩm tra, giám sát, quản lý dự án công trình xây dựng, đảm bảo chất lượng và an toàn.' },
                        { title: 'BIM & Digital Twins', desc: 'Đồng hành chuyển đổi số, triển khai BIM chuyên sâu, xây dựng bản sao số (Digital Twins) cho công trình.' },
                        { title: 'Giải pháp Công nghệ thông minh', desc: 'Cung cấp và tư vấn ứng dụng các giải pháp công nghệ thông minh, AI, Big Data, IoT vào quản lý vận hành.' },
                        { title: 'Giải pháp phát triển bền vững', desc: 'Tư vấn phát triển bền vững, Net Zero, EPD, ESG cho các doanh nghiệp xây dựng hướng tới tương lai xanh.' },
                      ],
                },
              },
              {
                sectionKey: 'about.awards',
                sectionType: 'awards',
                position: 6,
                config: {
                  syncWithHome: true,
                  title: isEn ? 'Accreditations & Awards' : 'Thành tựu & Giải thưởng',
                  subtitle: isEn ? 'Testament to over 35 years of dedication' : 'Minh chứng cho nỗ lực không ngừng nghỉ',
                  description: isEn
                    ? 'Over 35 years of development, CIC has been honored with the Third-Class Labor Medal, Prime Minister Certificates of Merit, Sao Khue Awards, and VIFOTEC Innovation Awards.'
                    : 'Hơn 35 năm phát triển, CIC vinh dự nhận nhiều bằng khen, cúp và giải thưởng uy tín từ các cơ quan Nhà nước và hiệp hội chuyên ngành – tiêu biểu như Huân chương Lao động hạng Ba, Bằng khen của Thủ tướng Chính phủ, cùng các giải thưởng Sao Khuê, Sao Vàng Đất Việt và Vifotec.',
                  items: REAL_AWARDS,
                },
              },
              {
                sectionKey: 'about.partners',
                sectionType: 'partners',
                position: 7,
                config: {
                  syncWithHome: true,
                  title: isEn ? 'Strategic Partners & Valued Clients' : 'Đối tác chiến lược & Khách hàng tiêu biểu',
                  subtitle: isEn ? 'Collaborating with global technology leaders' : 'Hợp tác cùng các tập đoàn công nghệ hàng đầu thế giới',
                  description: isEn
                    ? 'CIC is a trusted partner of more than 1,000 enterprises across Vietnam and an authorized representative of world-renowned engineering software and equipment brands.'
                    : 'Với mạng lưới khách hàng rộng khắp trên cả nước, CIC hiện là đối tác tin cậy của hơn 1.000 khách hàng tại Việt Nam và là đối tác chính thức của nhiều hãng công nghệ hàng đầu thế giới.',
                  galleryImages: [
                    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80',
                  ],
                  items: REAL_PARTNERS,
                },
              },
              { sectionKey: 'about.contact_cta', sectionType: 'cta_banner', position: 8, config: aboutContactCtaCommon },
            ],
          },
          {
            workspace: locale,
            code: 'organization',
            name: isEn ? 'Organization Structure' : 'Cơ cấu tổ chức',
            slug: isEn ? '/about/organization' : '/gioi-thieu/co-cau-to-chuc',
            pageType: 'organization',
            templateKey: 'organization',
            seoTitle: isEn ? 'Organization Structure | CIC Technology' : 'Cơ cấu tổ chức | CIC Technology',
            seoDescription: isEn
              ? 'Board of Directors, executive management, and specialized centers at CIC Technology.'
              : 'Sơ đồ cơ cấu tổ chức, Ban lãnh đạo và các trung tâm chuyên môn của Công ty CP Công nghệ và Tư vấn CIC.',
            sections: [
              {
                sectionKey: 'about.hero',
                sectionType: 'hero_banner',
                position: 1,
                config: {
                  ...aboutHeroCommon,
                  badge: isEn ? 'Organization Structure' : 'Cơ cấu tổ chức',
                },
              },
              {
                sectionKey: 'about.organization',
                sectionType: 'organization_chart',
                position: 2,
                config: {
                  title: isEn ? 'Organization Structure' : 'Cơ cấu tổ chức',
                  subtitle: isEn
                    ? 'Professional and streamlined organizational chart'
                    : 'Sơ đồ cơ cấu tổ chức chuyên nghiệp và hiệu quả',
                },
              },
            ],
          },
          {
            workspace: locale,
            code: 'capacity_experience',
            name: isEn ? 'Capacity & Experience' : 'Năng lực & Kinh nghiệm',
            slug: isEn ? '/about/capacity-experience' : '/gioi-thieu/nang-luc-kinh-nghiem',
            pageType: 'capacity_experience',
            templateKey: 'capacity_experience',
            seoTitle: isEn ? 'Capacity & Experience | CIC Technology' : 'Năng lực & Kinh nghiệm | CIC Technology',
            seoDescription: isEn
              ? 'Technical specialists, global partner network, and project track record of CIC Technology.'
              : 'Hồ sơ năng lực, mạng lưới đối tác quốc tế và kinh nghiệm triển khai dự án của CIC Technology.',
            sections: [
              {
                sectionKey: 'about.hero',
                sectionType: 'hero_banner',
                position: 1,
                config: {
                  ...aboutHeroCommon,
                  badge: isEn ? 'Capacity & Experience' : 'Năng lực & Kinh nghiệm',
                },
              },
              {
                sectionKey: 'about.capacity',
                sectionType: 'capacity_metrics',
                position: 2,
                config: {
                  title: isEn ? 'Solid Capability, Global Reach' : 'Tiềm lực vững vàng, vươn tầm quốc tế',
                  description: isEn
                    ? 'Through over 35 years of growth, CIC has built a high-caliber engineering workforce, a global partner network, and over 5,000 delivered projects.'
                    : 'Trải qua 35 năm hình thành và phát triển, CIC đã xây dựng được một đội ngũ nhân sự chất lượng cao, mạng lưới đối tác toàn cầu và danh mục khách hàng rộng khắp, khẳng định vị thế vững chắc trong lĩnh vực công nghệ và xây dựng.',
                  metrics: isEn
                    ? [
                        { id: 'cap-1', value: '150+', label: 'Certified Specialists' },
                        { id: 'cap-2', value: '100+', label: 'Global Tech Partners' },
                        { id: 'cap-3', value: '5,000+', label: 'Delivered Projects' },
                        { id: 'cap-4', value: '35+', label: 'Years Experience' },
                      ]
                    : [
                        { id: 'cap-1', value: '150+', label: 'Nhân sự chất lượng cao' },
                        { id: 'cap-2', value: '100+', label: 'Đối tác toàn cầu' },
                        { id: 'cap-3', value: '5.000+', label: 'Dự án thành công' },
                        { id: 'cap-4', value: '35+', label: 'Năm kinh nghiệm' },
                      ],
                },
              },
              {
                sectionKey: 'about.experience',
                sectionType: 'experience_pillars',
                position: 3,
                config: {
                  title: isEn ? 'Core Competencies & Experience' : 'Năng lực & Kinh nghiệm',
                  partnerMapTitle: isEn ? 'GLOBAL TECHNOLOGY PARTNER NETWORK' : 'MẠNG LƯỚI ĐỐI TÁC CÔNG NGHỆ TIÊU BIỂU',
                  partnerMapSubtitle: isEn
                    ? 'From Vietnam, CIC connects directly with leading engineering technology providers worldwide.'
                    : 'Từ Việt Nam, CIC kết nối với các hãng công nghệ hàng đầu trong mạng lưới hợp tác quốc tế.',
                  items: isEn
                    ? [
                        {
                          title: 'High-Caliber Engineering Workforce',
                          description: 'Continuous training and development of certified engineers ready to master next-generation technologies.',
                          imageId: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
                        },
                        {
                          title: 'Strategic Global Partnerships',
                          description: 'Authorized partner in Vietnam for more than 100 world-renowned software and hardware manufacturers.',
                          imageId: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80',
                        },
                        {
                          title: 'Pioneering Technology Adoption',
                          description: 'Comprehensive portfolio spanning BIM, Digital Twins, AI, IoT, and green sustainable engineering.',
                          imageId: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
                        },
                      ]
                    : [
                        {
                          title: 'Phát triển nguồn nhân lực chất lượng cao',
                          description: 'Chú trọng đào tạo, phát triển nguồn nhân sự chất lượng cao, thu hút nhân sự trẻ, chất lượng, nhiệt huyết và sẵn sàng học hỏi, tiếp cận công nghệ mới.',
                          imageId: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
                        },
                        {
                          title: 'Đối tác chiến lược với các hãng công nghệ danh tiếng',
                          description: 'Hợp tác sâu rộng với hơn 100 hãng công nghệ, sản xuất phần mềm, thiết bị danh tiếng trên thế giới. Là partner chính thức tại Việt Nam.',
                          imageId: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80',
                        },
                        {
                          title: 'Cập nhật xu hướng công nghệ hàng đầu',
                          description: 'Đa dạng sản phẩm, dịch vụ về các giải pháp phần mềm, khoa học công nghệ hàng đầu trong các ngành kỹ thuật.',
                          imageId: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
                        },
                      ],
                },
              },
              { sectionKey: 'about.contact_cta', sectionType: 'cta_banner', position: 4, config: aboutContactCtaCommon },
            ],
          },
          {
            workspace: locale,
            code: 'privacy_policy',
            name: isEn ? 'Privacy Policy' : 'Chính sách bảo mật',
            slug: isEn ? '/privacy-policy' : '/chinh-sach-bao-mat',
            pageType: 'legal',
            templateKey: 'legal_standard',
            seoTitle: isEn ? 'Privacy Policy | CIC Technology' : 'Chính sách bảo mật | CIC Technology',
            seoDescription: isEn
              ? 'Personal data collection, usage, retention, and security commitments at CIC Technology.'
              : 'Chính sách chi tiết về mục đích, phạm vi thu thập, lưu trữ và cam kết bảo mật thông tin khách hàng tại Công ty Cổ phần Công nghệ và Tư vấn CIC.',
            sections: [
              {
                sectionKey: 'legal.header',
                sectionType: 'rich_text_header',
                position: 1,
                config: {
                  richTextHtml: isEn
                    ? '<h1>Privacy Policy</h1><p>Detailed policy regarding personal data collection, processing, retention, and security commitments at CIC Technology &amp; Consultancy JSC.</p>'
                    : '<h1>Chính Sách Bảo Mật</h1><p>Chính sách chi tiết về mục đích, phạm vi thu thập, lưu trữ và cam kết bảo mật thông tin khách hàng tại Công ty Cổ phần Công nghệ và Tư vấn CIC.</p>',
                },
              },
              {
                sectionKey: 'legal.content',
                sectionType: 'rich_text',
                position: 2,
                config: {
                  richTextHtml: isEn ? PRIVACY_HTML_EN : PRIVACY_HTML_VI,
                },
              },
            ],
          },
          {
            workspace: locale,
            code: 'terms_of_use',
            name: isEn ? 'Terms of Use' : 'Điều khoản sử dụng',
            slug: isEn ? '/terms-of-use' : '/dieu-khoan-su-dung',
            pageType: 'legal',
            templateKey: 'legal_standard',
            seoTitle: isEn ? 'Terms of Use | CIC Technology' : 'Điều khoản sử dụng | CIC Technology',
            seoDescription: isEn
              ? 'General terms, intellectual property rights, and software evaluation guidelines at CIC Technology.'
              : 'Quy định chung về quyền hạn, trách nhiệm, sở hữu trí tuệ và việc truy cập tài nguyên số tại website của Công ty Cổ phần Công nghệ và Tư vấn CIC.',
            sections: [
              {
                sectionKey: 'legal.header',
                sectionType: 'rich_text_header',
                position: 1,
                config: {
                  richTextHtml: isEn
                    ? '<h1>Terms of Use</h1><p>General regulations governing website access, intellectual property rights, and technical resource usage at CIC Technology &amp; Consultancy JSC.</p>'
                    : '<h1>Điều Khoản Sử Dụng</h1><p>Quy định chung về quyền hạn, trách nhiệm, sở hữu trí tuệ và việc truy cập tài nguyên số tại website của Công ty Cổ phần Công nghệ và Tư vấn CIC.</p>',
                },
              },
              {
                sectionKey: 'legal.content',
                sectionType: 'rich_text',
                position: 2,
                config: {
                  richTextHtml: isEn ? TERMS_HTML_EN : TERMS_HTML_VI,
                },
              },
            ],
          },
        ];
      };

      const allDefs = [...buildDefinitions('vi'), ...buildDefinitions('en')];

      await withTransaction(async (tx) => {
        for (const def of allDefs) {
          const [existing] = await tx`
            SELECT id FROM cic_content_pages
            WHERE workspace = ${def.workspace} AND code = ${def.code}
            LIMIT 1
          `;
          if (existing) continue;

          const [insertedPage] = await tx`
            INSERT INTO cic_content_pages (
              workspace, code, name, slug, page_type, template_key, system_defined
            ) VALUES (
              ${def.workspace}, ${def.code}, ${def.name}, ${def.slug}, ${def.pageType}, ${def.templateKey}, true
            ) RETURNING id
          `;
          const pageId = Number(insertedPage.id);

          // Create v1 published revision and point both published_revision_id & draft_revision_id to v1.
          // When edited later, savePageDraftRecord sees state='published' and creates v2 ('draft') automatically.
          const [pubRev] = await tx`
            INSERT INTO cic_content_page_revisions (
              page_id, version_number, state, seo_title, seo_description, published_at
            ) VALUES (
              ${pageId}, 1, 'published', ${def.seoTitle}, ${def.seoDescription}, now()
            ) RETURNING id
          `;
          const revId = Number(pubRev.id);

          for (const sec of def.sections) {
            const [secRow] = await tx`
              INSERT INTO cic_content_page_sections (
                revision_id, section_key, section_type, position, config
              ) VALUES (
                ${revId}, ${sec.sectionKey}, ${sec.sectionType}, ${sec.position}, ${tx.json(sec.config as never)}
              ) RETURNING id
            `;
            if (sec.references && sec.references.length > 0) {
              for (const ref of sec.references) {
                await tx`
                  INSERT INTO cic_content_page_section_references (
                    section_id, entity_type, entity_id, position
                  ) VALUES (
                    ${secRow.id}, ${ref.entityType}, ${ref.entityId}, ${ref.position}
                  )
                `;
              }
            }
          }

          await tx`
            UPDATE cic_content_pages
            SET draft_revision_id = ${revId},
                published_revision_id = ${revId},
                updated_at = now()
            WHERE id = ${pageId}
          `;
        }
      });
    } catch (err) {
      console.error('[canonicalBootstrap] Failed to bootstrap canonical static pages:', err);
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}
