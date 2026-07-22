/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HomeEvent {
  title: string;
  date: string;
  time?: string;
  loc?: string;
  attendees?: string;
}

export const upcomingHomeEvents: HomeEvent[] = [
  { 
    title: 'Hội thảo: Ứng dụng AI và Digital Twins trong vận hành hạ tầng số', 
    date: '25/06/2026', 
    time: '08:30 - 11:30', 
    loc: 'Khách sạn JW Marriott, Hà Nội' 
  },
  { 
    title: 'Khóa Đào Tạo: Quy Trình Phối Hợp BIM Cho Quản Lý Dự Án Xây Dựng', 
    date: '02/07/2026', 
    time: '09:00 - 16:30', 
    loc: 'Trung tâm Đào tạo CIC, TP.HCM' 
  }
];

export const pastHomeEvents: HomeEvent[] = [
  { 
    title: 'Bentley Innovation Day 2024', 
    date: '15/04/2024', 
    attendees: '500+ Khách mời' 
  },
  { 
    title: 'Hội thảo chuyên sâu Tekla Structures', 
    date: '28/03/2024', 
    attendees: '200+ Doanh nghiệp' 
  },
  { 
    title: 'Lễ ra mắt enjiCAD thế hệ mới', 
    date: '12/03/2024', 
    attendees: '300+ Kỹ sư' 
  }
];

export const homeStats = [
  { val: 35, suffix: '+', label: 'Năm kinh nghiệm' },
  { val: 300, suffix: '+', label: 'Giải pháp công nghệ' },
  { val: 5000, suffix: '+', label: 'Dự án thành công' },
  { val: 100, suffix: '+', label: 'Đối tác toàn cầu' }
];

export const homeAwards = [
  { 
    name: 'Huân chương Lao động hạng 3', 
    img: 'https://www.cic.com.vn/images/banners/original/huan-chuong-lao-dong-hang-3_1582012829.jpg' 
  },
  { 
    name: 'Giải thưởng Sao Khuê 2014', 
    img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2014_1582012560.jpg' 
  },
  { 
    name: 'Cúp CNTT năm 2003', 
    img: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378.jpg' 
  },
  { 
    name: 'Giải thưởng Sao Khuê 2015', 
    img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-sao-khue-2015_1582012665.jpg' 
  },
  { 
    name: 'Cúp CNTT năm 2004', 
    img: 'https://www.cic.com.vn/images/banners/original/cup-cntt-nam-2004_1582012378_1583307621.jpg' 
  },
  { 
    name: 'Giải thưởng VIFOTEC', 
    img: 'https://www.cic.com.vn/images/banners/original/giai-thuong-vifotec_1582012769.jpg' 
  }
];

export const homeSolutionsList = [
  { 
    title: 'Thiết bị & IoT', 
    desc: 'Hệ thống đo đạc trắc địa, sensor quan trắc địa kỹ thuật, cảm biến môi trường thông minh và thiết bị kiểm định chất lượng công trình.' 
  },
  { 
    title: 'Phần mềm Kỹ thuật', 
    desc: 'Cung cấp và chuyển giao hệ thống phần mềm chuyên sâu chính hãng cho phân tích kết cấu, cầu đường, thủy lợi và địa chất.' 
  },
  { 
    title: 'Đào tạo & Chuyển giao', 
    desc: 'Tổ chức các khóa đào tạo nâng cao năng lực cho đội ngũ kỹ sư, hỗ trợ kỹ thuật tận tâm và cấp chứng chỉ chuẩn quốc tế.' 
  }
];
