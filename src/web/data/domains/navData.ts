import type { NavLink } from '@shared/types';

export const navLinks: NavLink[] = [
  { 
    name: 'Giới thiệu', 
    href: '/about',
    active: true,
    dropdown: [
      { name: 'Giới thiệu', href: '/about' },
      { name: 'Cơ cấu tổ chức', href: '/about?tab=structure' },
      { name: 'Năng lực và Kinh nghiệm', href: '/about?tab=experience' }
    ]
  },
  { 
    name: 'Sản phẩm', 
    href: '/products'
  },
  { 
    name: 'Dịch vụ', 
    href: '/services',
    dropdown: [
      { name: 'Tư vấn lập đơn giá, chỉ số giá', href: 'tu-van-lap-don-gia-chi-so-gia' },
      { name: 'Đánh giá sản lượng điện gió đạt chuẩn bankable', href: 'danh-gia-san-luong-dien-gio' },
      { name: 'Tư vấn BIM', href: 'tu-van-bim' },
      { name: 'Tư vấn xây dựng', href: 'tu-van-xay-dung' },
      { name: 'Tư vấn dự án', href: 'tu-van-du-an' },
      { name: 'Tư vấn giải pháp ngành thép', href: 'tu-van-giai-phap-nganh-thep' },
      { name: 'Web 360 tương tác thông minh', href: 'web-360-tuong-tac-thong-minh' },
      { name: 'Tư vấn Kiểm kê Khí nhà kính', href: 'tu-van-kiem-ke-khi-nha-kinh' }
    ]
  },
  { 
    name: 'Dự án', 
    href: '/projects'
  },
  { 
    name: 'Tin tức', 
    href: '/news',
    dropdown: [
      { name: 'Tin công ty', href: '/news?category=company' },
      { name: 'Tin chuyên ngành', href: '/news?category=specialty' },
      { name: 'Hợp tác quốc tế', href: '/news?category=international' },
      { name: 'Tin tuyển dụng', href: '/news?category=recruitment' },
      { name: 'Tin khuyến mại', href: '/news?category=promotion' },
      { name: 'Quan hệ cổ đông', href: '/news?category=shareholder' }
    ]
  },
  { 
    name: 'Sự kiện', 
    href: '/events'
  },
  { 
    name: 'Liên hệ', 
    href: '/contact'
  }
];
