export type EventLocale = 'vi' | 'en';

export type EventStatus = 'upcoming' | 'ongoing' | 'past';

export interface EventItemViewModel {
  id: string;
  title: string;
  slug: string;
  chuDe: string;
  place: string;
  timeEvent: string;
  endTime: string;
  specificTime: string;
  linkDangky: string;
  summary: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
  isHot: boolean;
  showInHomepage: boolean;
  ordering: number;
  seoTitle: string;
  seoKeyword: string;
  seoDescription: string;
  tawkTo: string;
  status: EventStatus;
  isOpenRegistration: boolean;
  productsRelated: string[];
  newsRelated: string[];
  eventRelated: string[];
  createdTime?: string;
  updatedTime?: string;
}
