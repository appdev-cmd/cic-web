import type { Project } from '@shared/types';

export const projects: Project[] = [
  { 
    id: 1, 
    type: 'services', 
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80', 
    location: 'Hồ Chí Minh', 
    name: 'Tòa Siêu Nhà Cao Tầng Landmark 81 - BIM Management', 
    short: 'Landmark 81',
    service: 'Tư vấn thiết kế BIM 5D & CDE',
    client: 'Tập đoàn Vingroup · Bình Thạnh, TP. Hồ Chí Minh',
    category: 'Tư vấn BIM & CDE',
    description: 'Số hóa toàn diện dữ liệu thiết kế kết cấu, cơ điện (MEP), phát hiện và kiểm soát xung đột kỹ thuật, quản lý khối lượng vật tư chính xác hơn 98%.',
    tags: ['BIM 5D', 'Digital Twins', 'CDE'], 
    size: 'full' 
  },
  { 
    id: 2, 
    type: 'services', 
    img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80', 
    location: 'Quảng Trị - Thừa Thiên Huế', 
    name: 'Bản Sao Số Digital Twins Tuyến Cao Tốc Bắc - Nam', 
    short: 'Cao tốc Bắc - Nam',
    service: 'Digital Twins & Bản sao số GIS 3D',
    client: 'Bộ Giao thông Vận tải · Đoạn Cam Lộ - La Sơn',
    category: 'Hạ tầng & Digital Twins',
    description: 'Số hóa 3D 98km đường cao tốc kết hợp cảm biến IoT quan trắc tự động, phát hiện và đưa ra cảnh báo sớm nguy cơ sạt lở đất đá.',
    tags: ['Digital Twins', 'GIS 3D', 'IoT Sensor'], 
    size: 'small' 
  },
  { 
    id: 3, 
    type: 'equipment', 
    img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80', 
    location: 'Ninh Thuận', 
    name: 'Thẩm Định Sản Lượng Nhà Máy Điện Gió Mũi Dinh', 
    short: 'Điện gió Mũi Dinh',
    service: 'Đánh giá sản lượng điện gió chuẩn Bankable',
    client: 'Tập đoàn Điện lực Việt Nam (EVN) · Ninh Thuận',
    category: 'Năng lượng & Thẩm định',
    description: 'Mô phỏng trường gió 3D WindSim CFD, tối ưu hóa vị trí 16 trụ tua-bin giúp tăng 1.8% tổng sản lượng điện phát hàng năm.',
    tags: ['WindSim CFD', 'Bankable', 'Net Zero'], 
    size: 'small' 
  },
  {
    id: 4,
    type: 'software',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80',
    location: 'Hà Nội & Toàn quốc',
    name: 'Triển Khai Phần Mềm enjiCAD Cho Tập Đoàn Xây Dựng',
    short: 'enjiCAD Xây dựng',
    service: 'Chuyển đổi số & Bản quyền phần mềm CAD',
    client: 'Tập đoàn Xây dựng Đèo Cả · Hà Nội',
    category: 'Phần mềm Kỹ thuật',
    description: 'Cung cấp và chuyển giao 200+ bản quyền phần mềm enjiCAD, chuẩn hóa quy trình thiết kế bản vẽ thi công và tiết kiệm 80% chi phí bản quyền.',
    tags: ['enjiCAD', 'Bản quyền CAD', 'Tiết kiệm chi phí'],
    size: 'small'
  }
];
