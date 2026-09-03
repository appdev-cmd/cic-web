'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/server/supabase/server';

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1), returnTo: z.string().optional() });
const safeCmsReturnTo = (value: string | undefined) => value?.startsWith('/cms') && !value.startsWith('//') ? value : '/cms';
export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: formData.get('email'), password: formData.get('password'), returnTo: formData.get('returnTo') || undefined });
  if (!parsed.success) redirect('/cms/login?error=validation');
  const client = await createSupabaseServerClient();
  const { email, password, returnTo } = parsed.data;
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect('/cms/login?error=invalid');
  redirect(safeCmsReturnTo(returnTo));
}

export async function logoutAction() {
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signOut();
  if (error) redirect('/cms/login?error=logout');
  redirect('/cms/login');
}
