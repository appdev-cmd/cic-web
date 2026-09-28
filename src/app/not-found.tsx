import type { Metadata } from 'next';
import { NotFoundView } from '@/web/components/NotFoundView';

export const metadata: Metadata = {
  title: {
    absolute: '404 - Không tìm thấy trang | CIC Technology',
  },
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ mới.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundView />;
}
