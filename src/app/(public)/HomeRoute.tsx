'use client';
import { useRouter } from 'next/navigation';
import { HomeView } from '@/web/components/HomeView';
import { getLegacyHomePageContent } from '@/shared/page-content/legacyPageContent';
import { resolvePageContent } from '@/shared/page-content/resolvePageContent';

const content = resolvePageContent({ pageType: 'home', version: undefined, legacyFallback: getLegacyHomePageContent() }).content;

export function HomeRoute() {
  const router = useRouter();
  const navigate = (view: string) => router.push(view === 'home' ? '/' : `/${view}`);
  const noop = () => undefined;
  return <HomeView content={content} setCurrentView={navigate} setActiveLink={noop} setActiveServiceId={(id) => id && router.push(`/services/${id}`)} setActiveProjectId={(id) => id && router.push(`/projects/${id}`)} setPreSelectedNewsCategory={() => router.push('/news')} setAboutSubTab={() => router.push('/about')} setActiveEventId={(id) => id && router.push(`/events/${id}`)} setIsRegisteringEvent={noop} />;
}
