import 'server-only';

import { createSupabaseServerClient } from '@/server/supabase/server';

/** Returns a request-aware DB client without introducing a domain repository. */
export async function getDatabaseClient() {
  return createSupabaseServerClient();
}
