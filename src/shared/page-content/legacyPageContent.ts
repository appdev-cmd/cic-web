import { getHomeData } from '@web/features/home/homeData';
import type { AboutCapacityModel, AboutPageModel, ContactPageModel, HomePageModel, HomeStatModel } from './models';

interface LegacyHomeStat {
  val: number;
  suffix?: string;
  label: string;
}

export function adaptLegacyHomeStats(items: readonly LegacyHomeStat[]): readonly HomeStatModel[] {
  return items.map((item, index) => ({
    id: `legacy-home-stat-${index + 1}`,
    value: item.val,
    suffix: item.suffix,
    label: item.label,
  }));
}

export function getLegacyHomePageContent(locale: 'vi' | 'en' = 'vi'): HomePageModel {
  const isEn = locale === 'en';
  const {
    heroSlides,
    projects,
    newsItems,
    partners,
    marqueeTexts,
    upcomingHomeEvents,
    pastHomeEvents,
    homeStats,
    homeAwards,
    homeSolutionsList,
  } = getHomeData();

  if (isEn) {
    return {
      hero: {
        slides: heroSlides.map((s) => ({
          ...s,
          title: s.title || 'CIC Engineering & Technology Solutions',
          subtitle: 'Over 30 years empowering sustainable development across construction, transportation, architecture, and geotechnical engineering.',
        })),
        marqueeTexts: [
          'CIC — Official Certified Engineering Software Representative in Vietnam',
          'Pioneering Digital Transformation & BIM Solutions since 1990',
          'Comprehensive Technical Consulting & Professional Handover',
        ],
      },
      intro: {
        badge: 'About CIC',
        title: 'Over 35 Years Empowering Engineering Excellence in Vietnam',
        paragraphs: [
          'Established in 1990 under the Ministry of Construction, CIC is a pioneering force in the digital transformation of construction, architecture, and civil engineering.',
          'We deliver comprehensive solutions ranging from authentic engineering software licensing, BIM/GIS digital transformation advisory, specialized corporate training to bespoke software engineering.',
        ],
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        profilePdfUrl: '/cic_profile.pdf',
      },
      stats: {
        items: [
          { id: 'stat-en-1', value: 35, suffix: '+', label: 'Years Experience' },
          { id: 'stat-en-2', value: 5000, suffix: '+', label: 'Trusted Clients' },
          { id: 'stat-en-3', value: 100, suffix: '+', label: 'Specialized Solutions' },
          { id: 'stat-en-4', value: 50, suffix: '+', label: 'Tech Specialists' },
        ],
      },
      awards: {
        title: 'Accreditations & Industry Awards',
        subtitle: 'Recognized for technical excellence and persistent contributions to engineering digital transformation',
        items: homeAwards,
      },
      ecosystem: {
        title: 'CIC Technology Ecosystem',
        subtitle: 'Comprehensive solutions across the complete infrastructure lifecycle',
        items: homeSolutionsList.map((sol, idx) => ({
          id: `legacy-solution-en-${idx + 1}`,
          title: sol.title,
          desc: sol.desc,
          tag: 'Solution',
          link: '/en/products',
        })),
      },
      projects: {
        items: [],
      },
      events: {
        title: 'Featured Events & Webinars',
        upcomingEvents: upcomingHomeEvents.map((e, idx) => ({ id: `legacy-upcoming-en-${idx}`, ...e })),
        pastEvents: pastHomeEvents.map((e, idx) => ({ id: `legacy-past-en-${idx}`, ...e, isPast: true })),
      },
      news: {
        title: 'News, Insights & Industry Updates',
        items: newsItems.map((n, idx) => ({ id: `legacy-news-en-${idx}`, ...n })),
      },
      partners: {
        title: 'Global Strategic Partners',
        items: partners,
      },
      contactCta: {
        title: 'Ready to Engineer Your Digital Future?',
        description: 'Our certified engineering advisory team is ready to consult and deliver the most suitable solutions for your organization.',
        phone: '+84 24 3976 1381',
        email: 'info@cic.com.vn',
        workingHours: 'Mon - Fri: 08:00 - 17:30 (GMT+7)',
      },
    };
  }

  return {
    hero: {
      slides: heroSlides,
      marqueeTexts,
    },
    intro: {
      badge: 'Về chúng tôi',
      title: 'Hơn 35 năm đồng hành cùng kỹ thuật Việt Nam',
      paragraphs: [
        'Được thành lập từ năm 1990 trực thuộc Bộ Xây dựng, CIC tự hào là đơn vị tiên phong trong chuyển đổi số ngành xây dựng, kiến trúc và kỹ thuật công trình.',
        'Chúng tôi cung cấp giải pháp toàn diện từ phần mềm bản quyền chính hãng, tư vấn chuyển đổi số BIM/GIS, đào tạo chuyên sâu đến phát triển phần mềm may đo theo yêu cầu.',
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      profilePdfUrl: '/cic_profile.pdf',
    },
    stats: {
      items: adaptLegacyHomeStats(homeStats),
    },
    awards: {
      title: 'Thành tựu & Giải thưởng',
      subtitle: 'Minh chứng cho nỗ lực không ngừng nghỉ',
      items: homeAwards,
    },
    ecosystem: {
      title: 'Hệ sinh thái Công nghệ CIC',
      subtitle: 'Giải pháp toàn diện cho vòng đời công trình số',
      items: homeSolutionsList.map((sol, idx) => ({
        id: `legacy-solution-${idx + 1}`,
        title: sol.title,
        desc: sol.desc,
        tag: 'Giải pháp',
        link: '/products',
      })),
    },
    projects: {
      items: projects.map((project) => ({ ...project, entityId: `legacy-project-${project.id}` })),
    },
    events: {
      title: 'Sự kiện nổi bật',
      upcomingEvents: upcomingHomeEvents.map((e, idx) => ({ id: `legacy-upcoming-${idx}`, ...e })),
      pastEvents: pastHomeEvents.map((e, idx) => ({ id: `legacy-past-${idx}`, ...e, isPast: true })),
    },
    news: {
      title: 'Tin tức và Góc nhìn',
      items: newsItems.map((n, idx) => ({ id: `legacy-news-${idx}`, ...n })),
    },
    partners: {
      title: 'Đối tác chiến lược',
      items: partners,
    },
    contactCta: {
      title: 'Sẵn sàng kiến tạo Tương lai số',
      description: 'Đội ngũ chuyên gia CIC sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất với nhu cầu doanh nghiệp của bạn.',
      phone: '024 3976 1381',
      email: 'info@cic.com.vn',
      workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:30',
    },
  };
}

export function getLegacyAboutCapacityContent(locale: 'vi' | 'en' = 'vi'): AboutCapacityModel {
  if (locale === 'en') {
    return {
      description: 'Through over 35 years of growth and innovation, CIC has established a team of premier technical specialists, an extensive global partner network, and a distinguished client portfolio across Vietnam and the region.',
      metrics: [
        { id: 'legacy-about-capacity-metric-en-1', value: '150+', label: 'Certified Specialists' },
        { id: 'legacy-about-capacity-metric-en-2', value: '100+', label: 'Global Tech Partners' },
        { id: 'legacy-about-capacity-metric-en-3', value: '5,000+', label: 'Delivered Projects' },
        { id: 'legacy-about-capacity-metric-en-4', value: '35+', label: 'Years Experience' },
      ],
    };
  }
  return {
    description: 'Trải qua 35 năm hình thành và phát triển, CIC đã xây dựng được một đội ngũ nhân sự chất lượng cao, mạng lưới đối tác toàn cầu và danh mục khách hàng rộng khắp, khẳng định vị thế vững chắc trong lĩnh vực công nghệ và xây dựng.',
    metrics: [
      { id: 'legacy-about-capacity-metric-1', value: '150+', label: 'Nhân sự chất lượng cao' },
      { id: 'legacy-about-capacity-metric-2', value: '100+', label: 'Đối tác toàn cầu' },
      { id: 'legacy-about-capacity-metric-3', value: '5.000+', label: 'Dự án thành công' },
      { id: 'legacy-about-capacity-metric-4', value: '35+', label: 'Năm kinh nghiệm' },
    ],
  };
}

export function getLegacyAboutPageContent(locale: 'vi' | 'en' = 'vi'): AboutPageModel {
  if (locale === 'en') {
    return {
      timeline: {
        title: 'Historical Milestones',
        milestones: [
          { id: 'legacy-about-timeline-1990', year: '1990', description: 'On November 27, 1990, CIC was founded, originating as the Information Technology Center under the Ministry of Construction.' },
          { id: 'legacy-about-timeline-2000', year: '2000', description: 'Reformed as Construction Informatics Company (CIC) directly under the Ministry of Construction.' },
          { id: 'legacy-about-timeline-2006', year: '2006', description: 'Equitized as CIC Technology and Construction Consulting Joint Stock Company.' },
          { id: 'legacy-about-timeline-2019', year: '2019', description: 'Rebranded as CIC Technology & Consulting JSC, joining VC Group — a consortium of 10 leading construction and engineering companies.' },
          { id: 'legacy-about-timeline-2025', year: '2025', description: '35th anniversary landmark, expanding global partnerships, advanced AI engineering, and green sustainable tech solutions.' },
        ],
      },
      strategy: {
        title: 'Strategic Direction',
        subtitle: 'Pioneering sustainable technological values and engineering excellence',
        vision: 'Deliver advanced software, hardware, and IT services to empower design, research, fabrication, and governance in Vietnam and international integration.',
        mission: 'Become the premier provider of ICT application technologies and scientific innovations for engineering disciplines across Vietnam and regional markets.',
        coreValues: ['Commitment to Quality', 'Customer Dedication', 'Continuous Innovation', 'Teamwork Excellence', 'Harmony & Growth'].map((value, index) => ({ id: `legacy-about-core-value-en-${index + 1}`, value })),
      },
    };
  }
  return {
    timeline: {
      title: 'Lịch sử phát triển',
      milestones: [
        { id: 'legacy-about-timeline-1990', year: '1990', description: 'Ngày 27/11/1990, CIC chính thức ra đời, tiền thân là Trung tâm tin học, thuộc Bộ Xây dựng.' },
        { id: 'legacy-about-timeline-2000', year: '2000', description: 'Trở thành Công ty Tin học Xây dựng (CIC) thuộc Bộ Xây dựng.' },
        { id: 'legacy-about-timeline-2006', year: '2006', description: 'Được cổ phần hóa thành Công ty CP Tin học và Tư vấn Xây dựng.' },
        { id: 'legacy-about-timeline-2019', year: '2019', description: 'Trở thành Công ty CP Công nghệ & Tư vấn CIC (CIC) và thuộc VC Group — Tổ hợp gồm 10 công ty hàng đầu trong lĩnh vực xây dựng & các ngành kỹ thuật liên quan.' },
        { id: 'legacy-about-timeline-2025', year: '2025', description: 'Dấu mốc 35 năm phát triển của CIC, thay đổi nhận diện, mở rộng phát triển, trong đó có các giải pháp AI, Phát triển bền vững một cách mạnh mẽ hơn.' },
      ],
    },
    strategy: {
      title: 'Định hướng chiến lược',
      subtitle: 'Tầm nhìn kiến tạo giá trị công nghệ bền vững',
      vision: 'Cung cấp những sản phẩm phần mềm, thiết bị, dịch vụ CNTT hiện đại, có tính ứng dụng cao để hỗ trợ công tác nghiên cứu, sản xuất, điều hành tại Việt Nam; không ngừng hội nhập thế giới.',
      mission: 'Trở thành nhà cung cấp hàng đầu về các giải pháp ứng dụng công nghệ ICT và khoa học công nghệ khác cho các ngành kỹ thuật tại Việt Nam và các nước trong khu vực.',
      coreValues: ['Cam kết về chất lượng', 'Tận tụy với khách hàng', 'Đổi mới không ngừng', 'Tinh thần tập thể', 'Khích lệ - hài hoà'].map((value, index) => ({ id: `legacy-about-core-value-${index + 1}`, value })),
    },
  };
}

export function getLegacyContactPageContent(locale: 'vi' | 'en' = 'vi'): ContactPageModel {
  if (locale === 'en') {
    return {
      branches: {
        title: 'Office Locations & Map',
        branches: [
          { id: 'hn', name: 'Hanoi Headquarters', address: '4th Floor, VG Building, 235 Nguyen Trai, Thanh Xuan District, Hanoi, Vietnam', phone: '+84 24 3976 1381', email: 'info@cic.com.vn', workingHours: 'Mon - Fri: 08:00 - 17:00 (GMT+7)', mapUrl: 'https://maps.google.com/maps?q=T%C3%B2a+nh%C3%A0+VG+Building%2C+235+Nguy%E1%BB%85n+Tr%C3%A3i%2C+Thanh+Xu%C3%A2n%2C+H%C3%A0+N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed', searchQuery: 'VG Building, 235 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam' },
          { id: 'hcm', name: 'Ho Chi Minh City Branch', address: '36 Nguyen Huy Luong, Ward 14, Binh Thanh District, Ho Chi Minh City, Vietnam', phone: '+84 28 6289 9022', email: 'cichcm@cic.com.vn', workingHours: 'Mon - Fri: 08:00 - 17:00 (GMT+7)', mapUrl: 'https://maps.google.com/maps?q=36+Nguy%E1%BB%85n+Huy+L%C6%B0%E1%BB%A3ng%2C+Ph%C6%B0%E1%BB%9Dng+14%2C+B%C3%ACnh+Th%E1%BA%A1nh%2C+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed', searchQuery: '36 Nguyen Huy Luong, Ward 14, Binh Thanh, Ho Chi Minh City, Vietnam' },
        ],
      },
    };
  }
  return {
    branches: {
      title: 'Bản đồ & Chi nhánh',
      branches: [
        { id: 'hn', name: 'Trụ sở chính Hà Nội', address: 'Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, Quận Thanh Xuân, Thành phố Hà Nội, Việt Nam', phone: '024 3976 1381', email: 'info@cic.com.vn', workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:00', mapUrl: 'https://maps.google.com/maps?q=T%C3%B2a+nh%C3%A0+VG+Building%2C+235+Nguy%E1%BB%85n+Tr%C3%A3i%2C+Thanh+Xu%C3%A2n%2C+H%C3%A0+N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed', searchQuery: 'Tòa nhà VG Building, 235 Nguyễn Trãi, Thanh Xuân, Hà Nội, Việt Nam' },
        { id: 'hcm', name: 'Chi nhánh TP. Hồ Chí Minh', address: 'Số 36 Nguyễn Huy Lượng, Phường 14, Quận Bình Thạnh, TP. Hồ Chí Minh', phone: '088 645 2020 - 028 628 99022 - 028 628 99033', email: 'cichcm@cic.com.vn', workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:00', mapUrl: 'https://maps.google.com/maps?q=36+Nguy%E1%BB%85n+Huy+L%C6%B0%E1%BB%A3ng%2C+Ph%C6%B0%E1%BB%9Dng+14%2C+B%C3%ACnh+Th%E1%BA%A1nh%2C+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed', searchQuery: '36 Nguyễn Huy Lượng, Phường 14, Bình Thạnh, TP. Hồ Chí Minh, Việt Nam' },
      ],
    },
  };
}
