'use server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/server/supabase/server';
import { invalidateAllAuthCaches } from '@/server/auth/guards';
import { checkRateLimit, getClientIp } from '@/server/auth/rate-limit';

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1), returnTo: z.string().optional() });
const safeCmsReturnTo = (value: string | undefined) => value?.startsWith('/cms') && !value.startsWith('//') ? value : '/cms';
export async function loginAction(formData: FormData) {
  const headersList = await headers();
  const ip = getClientIp(headersList);

  // Rate limit: 5 attempts per 60 seconds per IP
  const rateLimit = checkRateLimit(`login:${ip}`, { maxRequests: 5, windowSeconds: 60 });
  if (!rateLimit.success) {
    redirect('/cms/login?error=rate_limited');
  }

  const parsed = loginSchema.safeParse({ email: formData.get('email'), password: formData.get('password'), returnTo: formData.get('returnTo') || undefined });
  if (!parsed.success) redirect('/cms/login?error=validation');
  const client = await createSupabaseServerClient();
  const { email, password, returnTo } = parsed.data;
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect(`/cms/login?error=${error.code === 'invalid_credentials' ? 'invalid' : 'unavailable'}`);
  redirect(safeCmsReturnTo(returnTo));
}

export async function logoutAction() {
  invalidateAllAuthCaches();
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signOut();
  if (error) redirect('/cms/login?error=logout');
  redirect('/cms/login');
}
