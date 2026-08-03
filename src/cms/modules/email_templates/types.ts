export interface EmailTemplate {
  id: string;
  name: string;
  types: string;
  products: string[];
  content: string;
  lienhe_kd?: string;
  lienhe_kt?: string;
  lienhe_kdmb?: string;
  lienhe_kdmn?: string;
  published: boolean;
  ordering: number;
  created_time: string;
  updated_time?: string;
}

export interface EmailTypeOption {
  value: string;
  label: string;
  badgeClass: string;
  badgeDarkClass: string;
}

export const EMAIL_TYPES: EmailTypeOption[] = [
  {
    value: 'contact_notification',
    label: 'Thông báo Hòm thư liên hệ',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeDarkClass: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  },
  {
    value: 'quote_registration',
    label: 'Đăng ký Báo giá sản phẩm',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    badgeDarkClass: 'dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
  },
  {
    value: 'event_registration',
    label: 'Đăng ký Hội thảo & Sự kiện',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeDarkClass: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  },
  {
    value: 'system_alert',
    label: 'Cảnh báo & Thông báo hệ thống',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeDarkClass: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
];

export const PRESET_PRODUCTS = [
  'CSI ETABS Ultimate v21',
  'CSI SAP2000 Advanced v25',
  'PLAXIS 3D Ultimate 2026',
  'Dự toán ESCON Professional',
  'EnjiCAD Network Enterprise',
  'GeoStudio GeoSlope 2026',
  'MIDAS Civil Bridge Design',
  'Bentley MicroStation Enterprise',
];
