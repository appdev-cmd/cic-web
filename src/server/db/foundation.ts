import 'server-only';

import { cache } from 'react';
import { createSupabaseServerClient } from '@/server/supabase/server';

/** Returns a request-aware DB client without introducing a domain repository. */
export const getDatabaseClient = cache(async function getDatabaseClient() {
  return createSupabaseServerClient();
});
