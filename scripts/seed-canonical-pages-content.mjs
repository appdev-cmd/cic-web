import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const sql = postgres(process.env.POSTGRES_URL || process.env.DATABASE_URL);

function normalizeConfig(cfg) {
  if (!cfg) return {};
  if (typeof cfg === 'string') {
    try {
      const parsed = JSON.parse(cfg);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof cfg === 'object') {
    const keys = Object.keys(cfg);
    if (keys.length > 5 && keys.slice(0, 5).every((k, idx) => k === String(idx))) {
      try {
        const reconstructed = keys
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => cfg[k])
          .join('');
        const parsed = JSON.parse(reconstructed);
        return typeof parsed === 'object' && parsed !== null ? parsed : {};
      } catch {
        // ignore
      }
    }
    return cfg;
  }
  return {};
}

async function run() {
  console.log('--- Step 1: Repairing all existing corrupted string-indexed sections in DB ---');
  const allSections = await sql`SELECT id, revision_id, section_key, config FROM cic_content_page_sections`;
  let repairedCount = 0;
  for (const s of allSections) {
    const keys = Object.keys(s.config || {});
    if (keys.length > 5 && keys.slice(0, 5).every((k, idx) => k === String(idx))) {
      const fixedConfig = normalizeConfig(s.config);
      await sql`UPDATE cic_content_page_sections SET config = ${sql.json(fixedConfig)} WHERE id = ${s.id}`;
      repairedCount++;
      console.log(`Repaired section id=${s.id} key=${s.section_key}`);
    }
  }
  console.log(`Step 1 done. Repaired ${repairedCount} sections.`);

  console.log('\n--- Step 2: Seeding canonical pages content matching https://cic-web-sandy.vercel.app/ ---');

  // HOME VI SEED
  const homeStatsConfig = {
    items: [
      { id: 'home_stat_experience', value: 35, suffix: '+', label: 'Năm kinh nghiệm' },
      { id: 'home_stat_solutions', value: 300, suffix: '+', label: 'Giải pháp công nghệ' },
      { id: 'home_stat_projects', value: 5000, suffix: '+', label: 'Dự án thành công' },
      { id: 'home_stat_partners', value: 100, suffix: '+', label: 'Đối tác toàn cầu' },
    ],
  };

  const homeIntroConfig = {
    eyebrow: 'Về chúng tôi',
    title: 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
    paragraphs: [
      'CIC (tiền thân là Trung tâm Tin học - Bộ Xây dựng, thành lập năm 1990) là đơn vị hàng đầu cung cấp phần mềm, thiết bị và giải pháp số cho ngành xây dựng.',
      'Suốt hơn 35 năm, chúng tôi luôn đi đầu ứng dụng ICT, mang đến dịch vụ tư vấn chuyên sâu cho hàng nghìn doanh nghiệp, đối tác trong nước và quốc tế.',
    ],
    imageId: 'media_home_intro',
    videoUrl: 'https://www.youtube.com/watch?v=hdLFK_09-tU&t=448s',
    primaryCtaId: 'cta_about_cic',
    downloadMediaId: 'media_company_profile',
  };

  // ABOUT VI SEED
  const aboutHeroConfig = {
    badge: 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
    title: 'HƠN 35 NĂM NHỊP BƯỚC CÙNG CÔNG NGHỆ',
    subtitle: 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
    backgroundImageId: '/35nam_cic_1.JPG',
  };

  const aboutOverviewConfig = {
    title: 'TỔNG QUAN DOANH NGHIỆP',
    videoUrl: 'https://www.youtube.com/watch?v=hdLFK_09-tU&t=448s',
    paragraphs: [
      'Sau hơn 35 năm phát triển, CIC đã xây dựng được đội ngũ quản lý vững vàng cùng tập thể nhân viên có trình độ chuyên môn cao, sáng tạo và tận tâm; cung cấp sản phẩm phần mềm, thiết bị và dịch vụ công nghệ có tính ứng dụng cao cho ngành Xây dựng.',
      'CIC là đối tác tin cậy của hơn 5.000 khách hàng trong và ngoài nước, từ các cơ quan quản lý nhà nước, viện nghiên cứu, trường đại học đến các tập đoàn, doanh nghiệp xây dựng hàng đầu.',
    ],
  };

  const aboutTimelineConfig = {
    badge: 'Hành trình 35 năm',
    title: 'LỊCH SỬ PHÁT TRIỂN',
    description: 'Chặng đường vươn lên trở thành một trong những đơn vị tiên phong trong lĩnh vực công nghệ và tư vấn xây dựng tại Việt Nam.',
    milestones: [
      { id: 'legacy-about-timeline-1990', year: '1990', description: 'Ngày 27/11/1990, CIC chính thức ra đời, tiền thân là Trung tâm tin học, thuộc Bộ Xây dựng.' },
      { id: 'legacy-about-timeline-2000', year: '2000', description: 'Trở thành Công ty Tin học Xây dựng (CIC) thuộc Bộ Xây dựng.' },
      { id: 'legacy-about-timeline-2006', year: '2006', description: 'Được cổ phần hóa thành Công ty CP Tin học và Tư vấn Xây dựng.' },
      { id: 'legacy-about-timeline-2019', year: '2019', description: 'Trở thành Công ty CP Công nghệ & Tư vấn CIC (CIC) và thuộc VC Group — Tổ hợp gồm 10 công ty hàng đầu trong lĩnh vực xây dựng & các ngành kỹ thuật liên quan.' },
      { id: 'legacy-about-timeline-2025', year: '2025', description: 'Dấu mốc 35 năm phát triển của CIC, thay đổi nhận diện, mở rộng phát triển, trong đó có các giải pháp AI, Phát triển bền vững một cách mạnh mẽ hơn.' },
    ],
  };

  const aboutStrategyConfig = {
    title: 'ĐỊNH HƯỚNG CHIẾN LƯỢC',
    subtitle: 'Tầm nhìn kiến tạo giá trị công nghệ bền vững',
    imageId: '/35nam_cic_1.JPG',
    mission: 'Trở thành nhà cung cấp hàng đầu về các giải pháp ứng dụng công nghệ ICT và khoa học công nghệ khác cho các ngành kỹ thuật tại Việt Nam và các nước trong khu vực.',
    vision: 'Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ CNTT hiện đại, có tính ứng dụng cao để hỗ trợ công tác nghiên cứu, sản xuất, điều hành tại Việt Nam; không ngừng hội nhập thế giới.',
    coreValues: [
      { id: 'core-val-1', value: 'Cam kết về chất lượng' },
      { id: 'core-val-2', value: 'Tận tụy với khách hàng' },
      { id: 'core-val-3', value: 'Đổi mới không ngừng' },
      { id: 'core-val-4', value: 'Tinh thần tập thể' },
      { id: 'core-val-5', value: 'Khích lệ - hài hoà' },
    ],
  };

  const aboutOfferingsConfig = {
    title: 'SẢN PHẨM VÀ DỊCH VỤ CUNG CẤP',
    subtitle: 'Khẳng định năng lực qua các giải pháp công nghệ cốt lõi',
    referenceSource: { mode: 'manual' },
    items: [
      {
        title: 'Phát triển phần mềm xây dựng',
        desc: 'Phát triển các phần mềm chuyên ngành xây dựng, quản lý, quy hoạch làm nên thương hiệu CIC (KPW, Escon, RDW, VinaSAS…) và enjiCAD – phần mềm vẽ kỹ thuật chất lượng cao, giá cạnh tranh hơn nhiều so với CAD ngoại nhập.',
      },
      {
        title: 'Phân phối phần mềm nhập khẩu chính hãng',
        desc: 'Phân phối phần mềm bản quyền từ các hãng công nghệ hàng đầu thế giới như Microsoft, Autodesk, CSI, Cubicost, ANSYS, Bentley, DHI, Hexagon, DNV GL, Prokon, Risa…',
      },
      {
        title: 'Thiết bị công nghệ',
        desc: 'Phân phối các thiết bị công nghệ hàm lượng khoa học cao từ những hãng uy tín thế giới như Piletest, Tecknotrove, ZXLidars, A.P. van den Berg, AQ System, Sewer Robotics, Radiodetection, Pearpoint, DJI…',
      },
      {
        title: 'Tư vấn Xây dựng',
        desc: 'Tư vấn thiết kế, thẩm tra, giám sát, quản lý dự án công trình xây dựng, đảm bảo chất lượng và an toàn.',
      },
      {
        title: 'BIM & Digital Twins',
        desc: 'Đồng hành chuyển đổi số, triển khai BIM chuyên sâu, xây dựng bản sao số (Digital Twins) cho công trình.',
      },
      {
        title: 'Giải pháp Công nghệ thông minh',
        desc: 'Cung cấp và tư vấn ứng dụng các giải pháp công nghệ thông minh, AI, Big Data, IoT vào quản lý vận hành.',
      },
      {
        title: 'Giải pháp phát triển bền vững',
        desc: 'Tư vấn phát triển bền vững, Net Zero, EPD, ESG cho các doanh nghiệp xây dựng hướng tới tương lai xanh.',
      },
    ],
  };

  const aboutContactCtaConfig = {
    title: 'KẾT NỐI TRI THỨC, CẬP NHẬT CÔNG NGHỆ CÙNG CIC',
    description: 'Đăng ký nhận thông tin hội thảo, webinar và chương trình chuyên môn của CIC theo lĩnh vực bạn quan tâm. Cập nhật giải pháp mới và trao đổi trực tiếp cùng chuyên gia.',
    ctaLabel: 'ĐĂNG KÝ TƯ VẤN NGAY',
    ctaUrl: '/contact',
  };

  // ORGANIZATION VI SEED
  const orgHeroConfig = {
    badge: 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
    title: 'HƠN 35 NĂM NHỊP BƯỚC CÙNG CÔNG NGHỆ',
    subtitle: 'Cơ cấu tổ chức chuyên nghiệp, tinh gọn và hiệu quả',
    backgroundImageId: '/35nam_cic_1.JPG',
  };

  const orgConfig = {
    title: 'CƠ CẤU TỔ CHỨC',
    subtitle: 'Sơ đồ cơ cấu tổ chức chuyên nghiệp và hiệu quả',
    imageId: '/35nam_cic_1.JPG',
  };

  // CAPACITY & EXPERIENCE VI SEED
  const capHeroConfig = {
    badge: 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
    title: 'HƠN 35 NĂM NHỊP BƯỚC CÙNG CÔNG NGHỆ',
    subtitle: 'Năng lực & Kinh nghiệm triển khai thực tế của CIC',
    backgroundImageId: '/35nam_cic_1.JPG',
  };

  const capacityConfig = {
    title: 'TIỀM LỰC VỮNG VÀNG, VƯƠN TẦM QUỐC TẾ',
    description: 'Trải qua 35 năm hình thành và phát triển, CIC đã xây dựng được một đội ngũ nhân sự chất lượng cao, mạng lưới đối tác toàn cầu và danh mục khách hàng rộng khắp, khẳng định vị thế vững chắc trong lĩnh vực công nghệ và xây dựng.',
    metrics: [
      { id: 'cap-m-1', value: '150+', label: 'Nhân sự chất lượng cao' },
      { id: 'cap-m-2', value: '100+', label: 'Đối tác toàn cầu' },
      { id: 'cap-m-3', value: '5.000+', label: 'Dự án thành công' },
      { id: 'cap-m-4', value: '35+', label: 'Năm kinh nghiệm' },
    ],
  };

  const experienceConfig = {
    title: 'MẠNG LƯỚI ĐỐI TÁC CÔNG NGHỆ TIÊU BIỂU',
    subtitle: 'Từ Việt Nam, CIC kết nối với các hãng công nghệ hàng đầu trong mạng lưới hợp tác quốc tế.',
    items: [
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
  };

  // Helper to update sections across active revisions (both published and draft) for a page code
  async function updatePageSections(code, workspace, sectionMap) {
    const [page] = await sql`SELECT id, draft_revision_id, published_revision_id FROM cic_content_pages WHERE code = ${code} AND workspace = ${workspace}`;
    if (!page) {
      console.warn(`Page not found: ${code} (${workspace})`);
      return;
    }
    const revisionIds = Array.from(new Set([page.draft_revision_id, page.published_revision_id].filter(Boolean))).map(Number);
    console.log(`Updating page ${code} (${workspace}) revisions: [${revisionIds.join(', ')}]`);

    for (const revId of revisionIds) {
      for (const [sectionKey, config] of Object.entries(sectionMap)) {
        const [existing] = await sql`SELECT id FROM cic_content_page_sections WHERE revision_id = ${revId} AND section_key = ${sectionKey}`;
        if (existing) {
          await sql`UPDATE cic_content_page_sections SET config = ${sql.json(config)} WHERE id = ${existing.id}`;
          console.log(`  Updated section ${sectionKey} in rev ${revId}`);
        } else {
          console.log(`  Section ${sectionKey} not present in rev ${revId}, skipping`);
        }
      }
    }
  }

  await updatePageSections('home', 'vi', {
    'home.stats': homeStatsConfig,
    'home.intro': homeIntroConfig,
  });

  await updatePageSections('about', 'vi', {
    'about.hero': aboutHeroConfig,
    'about.overview': aboutOverviewConfig,
    'about.timeline': aboutTimelineConfig,
    'about.strategy': aboutStrategyConfig,
    'about.offerings': aboutOfferingsConfig,
    'about.contact_cta': aboutContactCtaConfig,
  });

  await updatePageSections('organization', 'vi', {
    'about.hero': orgHeroConfig,
    'about.organization': orgConfig,
  });

  await updatePageSections('capacity_experience', 'vi', {
    'about.hero': capHeroConfig,
    'about.capacity': capacityConfig,
    'about.experience': experienceConfig,
    'about.contact_cta': aboutContactCtaConfig,
  });

  console.log('\n--- Canonical seed completed successfully! ---');
  await sql.end();
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
