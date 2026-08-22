import { getHomeData } from '@web/features/home/homeData';
import type { AboutCapacityModel, HomePageModel, HomeStatModel } from './models';

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
  const { homeStats } = getHomeData();
  return {
    stats: {
      items: adaptLegacyHomeStats(homeStats),
    },
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
