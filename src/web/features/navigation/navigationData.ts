import type { NavLink } from '@shared/types';
import { navLinks as headerNavigationFixture } from '../../data/mockData';

export type PublicNavigationView =
  | 'home'
  | 'products'
  | 'about'
  | 'services'
  | 'projects'
  | 'news'
  | 'events'
  | 'contact'
  | 'privacy'
  | 'terms';

export interface FooterNavigationItem {
  label: string;
  href: string;
  view: PublicNavigationView;
  activeLabel: string;
  reset?: boolean;
  preventDefault?: boolean;
  scrollToTop?: boolean;
}

export interface NavigationDataResult {
  headerLinks: NavLink[];
  footerPrimaryLinks: FooterNavigationItem[];
  footerSolutionLinks: FooterNavigationItem[];
  footerServiceLinks: FooterNavigationItem[];
}

const footerPrimaryLinks: FooterNavigationItem[] = [
  { label: 'Trang chủ', href: '#home', view: 'home', activeLabel: '', preventDefault: false, scrollToTop: false },
  { label: 'Giải pháp', href: '#solutions', view: 'products', activeLabel: 'Sản phẩm', reset: true },
  { label: 'Dịch vụ', href: '#services', view: 'services', activeLabel: 'Dịch vụ', reset: true },
  { label: 'Dự án', href: '#projects', view: 'projects', activeLabel: 'Dự án', reset: true },
  { label: 'Sự kiện', href: '#events', view: 'events', activeLabel: 'Sự kiện', reset: true },
  { label: 'Tin tức', href: '#news', view: 'news', activeLabel: 'Tin tức', reset: true },
  { label: 'Liên hệ', href: '#contact', view: 'contact', activeLabel: 'Liên hệ' },
];

const footerSolutionLinks: FooterNavigationItem[] = [
  'AI & Công nghệ thông minh',
  'BIM, Digital Twins & CDE',
  'Phần mềm kỹ thuật',
  'Thiết bị khoa học',
  'Net Zero & Bền vững',
].map((label) => ({ label, href: '#solutions', view: 'products', activeLabel: 'Sản phẩm' }));

const footerServiceLinks: FooterNavigationItem[] = [
  'Tư vấn chuyển đổi số',
  'Đào tạo & Chuyển giao',
  'Tư vấn phát triển bền vững',
  'Phát triển phần mềm',
].map((label) => ({ label, href: '#services', view: 'services', activeLabel: 'Dịch vụ' }));

/** React mock boundary; replace its fixture reads with published menu queries in Next.js. */
export const getNavigationData = (): NavigationDataResult => ({
  headerLinks: headerNavigationFixture,
  footerPrimaryLinks,
  footerSolutionLinks,
  footerServiceLinks,
});
