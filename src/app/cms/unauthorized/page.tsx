import Link from 'next/link';
import { LogIn, ShieldAlert } from 'lucide-react';
import { AuthSurface } from '@/shared/ui/application';

export const metadata = { title: 'Yêu cầu đăng nhập', robots: { index: false, follow: false } };
export default function CmsUnauthorizedPage() {
  return (
    <AuthSurface title="Phiên đăng nhập đã kết thúc" description="Để bảo vệ tài khoản, vui lòng đăng nhập lại trước khi tiếp tục làm việc." icon={<ShieldAlert />}>
      <div className="auth-actions">
        <Link href="/cms/login" className="auth-primary-button"><LogIn aria-hidden="true" />Đến trang đăng nhập</Link>
        <Link href="/" className="auth-secondary-link">Về website CIC</Link>
      </div>
    </AuthSurface>
  );
}
