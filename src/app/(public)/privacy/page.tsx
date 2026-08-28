import type { Metadata } from 'next';
import { PrivacyRoute } from './PrivacyRoute';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | CIC Technology',
  description: 'Chính sách thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân tại CIC Technology.',
};

export default function PrivacyPage() {
  return <PrivacyRoute />;
}
