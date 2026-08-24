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

export function getLegacyHomePageContent(): HomePageModel {
  const { homeStats, projects } = getHomeData();
  return {
    stats: {
      items: adaptLegacyHomeStats(homeStats),
    },
    projects: { items: projects.map((project) => ({ ...project, entityId: `legacy-project-${project.id}` })) },
  };
}

export function getLegacyAboutCapacityContent(): AboutCapacityModel {
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

export function getLegacyAboutPageContent(): AboutPageModel {
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

export function getLegacyContactPageContent(): ContactPageModel {
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
