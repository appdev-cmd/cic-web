import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { getServerEnv } from '@/server/config/env';

/** Refreshes the Supabase session cookie at the request boundary. */
export async function refreshSupabaseSession(request: NextRequest) {
  const env = getServerEnv();
  let response = NextResponse.next({ request });

  const client = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // Do not insert application work between client creation and getUser(): session refresh depends on it.
  await client.auth.getUser();
  return response;
}
