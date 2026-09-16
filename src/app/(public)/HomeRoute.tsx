'use client';
import { useRouter } from 'next/navigation';
import { HomeView } from '@/web/components/HomeView';
import { getLegacyHomePageContent } from '@/shared/page-content/legacyPageContent';
import type { HomePageModel } from '@/shared/page-content/models';

interface HomeRouteProps {
  initialContent?: HomePageModel;
}

export function HomeRoute({ initialContent }: HomeRouteProps) {
  const router = useRouter();
  const navigate = (view: string) => router.push(view === 'home' ? '/' : `/${view}`);
  const noop = () => undefined;
  const content = initialContent ?? getLegacyHomePageContent();

  return (
    <HomeView
      content={content}
      setCurrentView={navigate}
      setActiveLink={noop}
      setActiveServiceId={(id) => id && router.push(`/services/${id}`)}
      setActiveProjectId={(id) => id && router.push(`/projects/${id}`)}
      setPreSelectedNewsCategory={() => router.push('/news')}
      setAboutSubTab={() => router.push('/about')}
      setActiveEventId={(id) => id && router.push(`/events/${id}`)}
      setIsRegisteringEvent={noop}
    />
  );
}
