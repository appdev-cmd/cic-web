'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ConsultationModal } from '@/web/components/ConsultationModal';
import { Footer } from '@/web/components/Footer';
import { Header } from '@/web/components/Header';

export function WebsiteShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const navigate = (href: string) => router.push(href);
  const headerVariant = pathname === '/' ? 'overlay' : 'solid';

  return (
    <div className="public-shell min-h-screen bg-white text-slate-900">
      <Header variant={headerVariant} pathname={pathname} onNavigate={navigate} onOpenConsultation={() => setIsConsultationOpen(true)} />
      <main className="public-shell-content" data-header-variant={headerVariant}>{children}</main>
      <Footer onNavigate={navigate} />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </div>
  );
}
