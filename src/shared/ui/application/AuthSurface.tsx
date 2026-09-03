import Image from 'next/image';
import type { ReactNode } from 'react';

interface AuthSurfaceProps { title: string; description: string; children: ReactNode; icon?: ReactNode; }

/** Shared, server-renderable shell for CMS authentication and access states. */
export function AuthSurface({ title, description, children, icon }: Readonly<AuthSurfaceProps>) {
  return (
    <main className="auth-surface">
      <section className="auth-surface__frame" aria-labelledby="auth-surface-title">
        <div className="auth-surface__brand">
          <div className="auth-surface__brand-main">
            <Image src="/cic-logo-full.png" alt="CIC Technology" width={180} height={101} className="auth-surface__logo" priority />
            <div className="auth-surface__brand-copy">
              <h2>Hệ thống quản trị<br />nội dung CIC</h2>
              <p>Quản lý nội dung, sản phẩm và thông tin vận hành website CIC.</p>
            </div>
          </div>
          <span className="auth-surface__watermark" aria-hidden="true">CIC</span>
          <p className="auth-surface__brand-note">© 2026 CIC Technology</p>
        </div>
        <div className="auth-surface__content">
          <div className="auth-surface__content-inner">
            {icon ? <div className="auth-surface__state-icon" aria-hidden="true">{icon}</div> : null}
            <div className="auth-surface__heading"><h1 id="auth-surface-title">{title}</h1><p>{description}</p></div>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
