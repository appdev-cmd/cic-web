'use client';

import { LoaderCircle, LogIn } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function LoginSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="auth-primary-button" type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
      <span>{pending ? 'Đang xác thực…' : 'Đăng nhập'}</span>
    </button>
  );
}
