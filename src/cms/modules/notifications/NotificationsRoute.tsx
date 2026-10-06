import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getCurrentCmsPrincipal } from '@/server/auth/guards';
import { getCmsNotifications } from '@/server/notifications/service';
import { NotificationsManager } from './NotificationsManager';
import { cookies } from 'next/headers';

export async function NotificationsRoute() {
  await requireCmsPageAccess();
  const principal = await getCurrentCmsPrincipal();

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('cms_workspace_locale')?.value;
  const workspaceLocale = (localeCookie === 'en' ? 'en' : 'vi') as 'vi' | 'en';

  const initialData = await getCmsNotifications(principal, { limit: 100 });

  return (
    <NotificationsManager
      initialData={initialData}
      workspaceLocale={workspaceLocale}
    />
  );
}
