'use client';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { getCmsEvents } from '@/features/events/server/cms-queries';
import { EventsManager } from './EventsManager';

type Data = Awaited<ReturnType<typeof getCmsEvents>>;

export function EventsScreen({
  data,
  capabilities,
}: {
  data: Record<'vi' | 'en', Data>;
  capabilities: { create: boolean; edit: boolean; delete: boolean };
}) {
  const locale = useCmsWorkspaceLocale();
  const current = data[locale];
  const version = current.events.map((item) => `${item.id}:${item.updated_time ?? item.created_time}`).join('|');

  return (
    <EventsManager
      key={`${locale}:${version}`}
      workspaceLocale={locale}
      data={current}
      capabilities={capabilities}
    />
  );
}
