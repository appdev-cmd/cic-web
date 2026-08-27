import type { ContactPageModel } from '../page-content/models';

interface PublicBranchConfiguration {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  fax?: string;
  workingHours: string;
  mapEmbedUrl?: string;
  mapSearchQuery?: string;
  published: boolean;
  ordering: number;
}

/** Public projection of system.company.branches returned by the configuration API. */
const demoPublicBranches: PublicBranchConfiguration[] = [
  {
    id: 'branch_hanoi', code: 'ha-noi', name: 'Trụ sở chính Hà Nội',
    address: 'Số 37 Lê Đại Hành, Phường Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội',
    phone: '024 3976 1381', email: 'info@cic.com.vn', workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:00',
    mapSearchQuery: 'CIC Technology 37 Lê Đại Hành Hà Nội', published: true, ordering: 0,
  },
  {
    id: 'branch_hcm', code: 'ho-chi-minh', name: 'Chi nhánh TP. Hồ Chí Minh',
    address: 'TP. Hồ Chí Minh', phone: '088 645 2020, 028 628 99022', email: 'cichcm@cic.com.vn',
    workingHours: 'Thứ 2 - Thứ 6: 08:00 - 17:00', mapSearchQuery: 'CIC Technology Hồ Chí Minh',
    published: true, ordering: 1,
  },
];

export function getPublicContactContentFromConfiguration(locale: 'vi' | 'en' = 'vi'): ContactPageModel {
  return {
    branches: {
      title: locale === 'vi' ? 'Bản đồ & Chi nhánh' : 'Locations & Offices',
      branches: demoPublicBranches
        .filter((branch) => branch.published)
        .sort((left, right) => left.ordering - right.ordering)
        .map((branch) => {
          const searchQuery = branch.mapSearchQuery || branch.address;
          return {
            id: branch.id,
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            email: branch.email,
            fax: branch.fax,
            workingHours: branch.workingHours,
            mapUrl: branch.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`,
            searchQuery,
          };
        }),
    },
  };
}
