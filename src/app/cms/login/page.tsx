import { AlertCircle, LockKeyhole, Mail } from 'lucide-react';
import { AuthSurface } from '@/shared/ui/application';
import { loginAction } from './actions';
import { LoginSubmitButton } from './LoginSubmitButton';

export const metadata = { title: 'Đăng nhập CMS', robots: { index: false, follow: false } };
const messages: Record<string, string> = {
  invalid: 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra và thử lại.',
  validation: 'Vui lòng nhập email và mật khẩu hợp lệ.',
  expired: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.',
  logout: 'Không thể kết thúc phiên đăng nhập. Vui lòng thử lại.',
};
interface LoginSearchParams { error?: string; returnTo?: string; }

export default async function CmsLoginPage({ searchParams }: Readonly<{ searchParams: Promise<LoginSearchParams> }>) {
  const params = await searchParams;
  const errorMessage = params.error ? messages[params.error] : undefined;
  return (
    <AuthSurface title="Chào mừng trở lại" description="Đăng nhập bằng tài khoản được cấp để truy cập hệ thống quản trị.">
      <form action={loginAction} className="auth-form">
        {errorMessage ? <div role="alert" className="auth-alert"><AlertCircle aria-hidden="true" /><p>{errorMessage}</p></div> : null}
        <input type="hidden" name="returnTo" value={params.returnTo ?? '/cms'} />
        <label className="auth-field">
          <span>Email</span>
          <span className="auth-input-wrap"><Mail aria-hidden="true" /><input name="email" type="email" inputMode="email" autoComplete="username" placeholder="tenban@cic.com.vn" required autoFocus /></span>
        </label>
        <label className="auth-field">
          <span>Mật khẩu</span>
          <span className="auth-input-wrap"><LockKeyhole aria-hidden="true" /><input name="password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" required /></span>
        </label>
        <LoginSubmitButton />
        <p className="auth-help">Nếu bạn gặp vấn đề khi đăng nhập, vui lòng liên hệ quản trị viên hệ thống.</p>
      </form>
    </AuthSurface>
  );
}
