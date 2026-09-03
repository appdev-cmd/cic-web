import Link from 'next/link';
import { ArrowLeft, ShieldX } from 'lucide-react';
import { AuthSurface } from '@/shared/ui/application';

export const metadata = { title: 'Không có quyền truy cập', robots: { index: false, follow: false } };
export default function CmsForbiddenPage() {
  return (
    <AuthSurface title="Bạn không có quyền truy cập" description="Tài khoản hiện tại chưa được cấp quyền mở khu vực này. Hãy quay lại trang quản trị hoặc liên hệ quản trị viên." icon={<ShieldX />}>
      <div className="auth-actions">
        <Link href="/cms" className="auth-primary-button"><ArrowLeft aria-hidden="true" />Về trang quản trị</Link>
        <Link href="/" className="auth-secondary-link">Về website CIC</Link>
      </div>
    </AuthSurface>
  );
}
