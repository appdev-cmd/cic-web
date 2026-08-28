'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/server/supabase/server';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function loginAction(formData: FormData) {
  const input = loginSchema.parse({ email: formData.get('email'), password: formData.get('password') });
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signInWithPassword(input);
  if (error) redirect('/cms/login?error=invalid');
  redirect('/cms');
}

export async function logoutAction() {
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
  redirect('/cms/login');
}
